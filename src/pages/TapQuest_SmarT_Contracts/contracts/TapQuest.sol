// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/contracts/token/ERC20/IERC20.sol";

contract TapQuest is ChainlinkClient, VRFConsumerBaseV2, Pausable, AccessControl, OwnerIsCreator {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    address public ghoToken;
    uint256 public totalRewards;
    mapping(address => uint256) public userRewards;

    address public ghoOracle = 0xD110cac5d8682A3b045D5524a9903E031d70FCCd;
    address public bridgeLogic = 0x7248a8Aaab397846CF6AA2B2E63CcdbBd771Bb06;
    address public ghoSteward = 0x4bF0c2c74717a4e538cfe25DD389C21A139E0096;
    address public ccipOracle;

    bytes32 public keyHash;
    uint256 public fee;

    mapping(uint64 => bool) public allowlistedChains;

    IRouterClient private s_router;
    IERC20 private s_linkToken;

    constructor(address _ghoToken, address _router, address _link) {
        ghoToken = _ghoToken;
        s_router = IRouterClient(_router);
        s_linkToken = IERC20(_link);

        _setupRole(ADMIN_ROLE, msg.sender);
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Only admin can call this function");
        _;
    }

    modifier onlyAllowlistedChain(uint64 _destinationChainSelector) {
        require(allowlistedChains[_destinationChainSelector], "Destination chain not allowlisted");
        _;
    }

    function allowlistDestinationChain(uint64 _destinationChainSelector, bool allowed) external onlyOwner {
        allowlistedChains[_destinationChainSelector] = allowed;
    }

    function claimRewards() public {
        uint256 amount = userRewards[msg.sender];
        require(amount > 0, "No rewards to claim");
        userRewards[msg.sender] = 0;
        SafeERC20.safeTransfer(IERC20(ghoToken), msg.sender, amount);
    }

    function addRewards(uint256 amount) public onlyAdmin {
        totalRewards += amount;
        SafeERC20.safeTransferFrom(IERC20(ghoToken), msg.sender, address(this), amount);
    }

    function distributeRewards() public onlyAdmin {
        uint256 userCount = _getUserCount();
        uint256 rewardPerUser = totalRewards / userCount;
        for (address user in _getActiveUsers()) {
            userRewards[user] += rewardPerUser;
        }
        totalRewards = 0;
    }

    function getRandomBonus() public onlyAdmin {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK for VRF fee");
        bytes32 requestId = requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        uint256 bonusAmount = calculateBonus(randomness);
        distributeBonus(bonusAmount);
    }

    // CCIP Functions
    function transferTokensPayLINK(
        uint64 _destinationChainSelector,
        address _receiver,
        address _token,
        uint256 _amount
    )
        external
        onlyOwner
        onlyAllowlistedChain(_destinationChainSelector)
        returns (bytes32 messageId)
    {
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _token,
            _amount,
            address(s_linkToken)
        );

        uint256 fees = s_router.getFee(_destinationChainSelector, evm2AnyMessage);

        if (fees > s_linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);

        s_linkToken.approve(address(s_router), fees);
        IERC20(_token).approve(address(s_router), _amount);

        messageId = s_router.ccipSend(_destinationChainSelector, evm2AnyMessage);

        emit TokensTransferred(
            messageId,
            _destinationChainSelector,
            _receiver,
            _token,
            _amount,
            address(s_linkToken),
            fees
        );

        return messageId;
    }

    function transferTokensPayNative(
        uint64 _destinationChainSelector,
        address _receiver,
        address _token,
        uint256 _amount
    )
        external
        onlyOwner
        onlyAllowlistedChain(_destinationChainSelector)
        returns (bytes32 messageId)
    {
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _token,
            _amount,
            address(0)
        );

        uint256 fees = s_router.getFee(_destinationChainSelector, evm2AnyMessage);

        if (fees > address(this).balance)
            revert NotEnoughBalance(address(this).balance, fees);

        IERC20(_token).approve(address(s_router), _amount);

        messageId = s_router.ccipSend{value: fees}(_destinationChainSelector, evm2AnyMessage);

        emit TokensTransferred(
            messageId,
            _destinationChainSelector,
            _receiver,
            _token,
            _amount,
            address(0),
            fees
        );

        return messageId;
    }

    function _buildCCIPMessage(
        address _receiver,
        address _token,
        uint256 _amount,
        address _feeTokenAddress
    ) internal pure returns (Client.EVM2AnyMessage memory) {
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({
            token: _token,
            amount: _amount
        });

        return
            Client.EVM2AnyMessage({
                receiver: abi.encode(_receiver),
                data: "",
                tokenAmounts: tokenAmounts,
                extraArgs: Client._argsToBytes(
                    Client.EVMExtraArgsV1({gasLimit: 0})
                ),
                feeToken: _feeTokenAddress
            });
    }

    function withdraw(address _beneficiary) public onlyOwner {
        uint256 amount = address(this).balance;

        if (amount == 0) revert NothingToWithdraw();

        (bool sent, ) = _beneficiary.call{value: amount}("");

        if (!sent) revert FailedToWithdrawEth(msg.sender, _beneficiary, amount);
    }

    function withdrawToken(address _beneficiary, address _token) public onlyOwner {
        uint256 amount = IERC20(_token).balanceOf(address(this));

        if (amount == 0) revert NothingToWithdraw();

        IERC20(_token).transfer(_beneficiary, amount);
    }

    function _getUserCount() internal view virtual returns (uint256) {
        return 10; // Placeholder value for testing
    }

    function _getActiveUsers() internal view virtual returns (address[] memory) {
        address[] memory users = new address[](1);
        users[0] = msg.sender; // Placeholder value for testing
        return users;
    }
}
