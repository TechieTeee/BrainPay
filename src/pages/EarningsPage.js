// EarningsPage.js
import React from 'react';

const EarningsPage = () => {
  const userEarnings = 100; // Amount of GHO earned by the user
  const challengesCompleted = 5; // Number of challenges completed
  const userGoals = [
    { name: 'GHO Referral Goal ', progress: 70 },
    { name: 'GHO Staking Goal', progress: 40 },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">TapQuest Earnings Summary</h1>

      {/* User Earnings */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Total Earnings: {userEarnings} GHO</h2>
        <p>Explore the opportunities and challenges to earn more GHO.</p>
      </div>

      {/* Challenges Completed */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Challenges Completed: {challengesCompleted}</h2>
        <p>View your completed challenges and discover new ones.</p>
      </div>

      {/* User Goals */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Goals</h2>
        <ul>
          {userGoals.map((goal, index) => (
            <li key={index} className="mb-4">
              <div className="flex items-center justify-between">
                <span className="font-bold">{goal.name}</span>
                <span className="text-gray-500">{goal.progress}% complete</span>
              </div>
              <div className="bg-gray-200 h-4 w-full rounded-full mt-2">
                <div
                  className="bg-green-500 h-full"
                  style={{ width: `${goal.progress}%` }} // Progress bar based on goal progress
                ></div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Background and Info */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Earning History and Future Opportunities</h2>
        <p>
          Gain insights into your earning history, set new goals, and explore future opportunities
          to earn more GHO. Upcoming, matching opportunities: Lens Lover Challenge and March Madness Mayhem
        </p>
      </div>

      {/* Table */}
      <div>
        <h3 className="text-xl font-bold mb-2">Recent Earning History Table</h3>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Amount (GHO)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">01-05-2024</td>
              <td className="border border-gray-300 p-2">Completed Christmas Challenge</td>
              <td className="border border-gray-300 p-2">10</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EarningsPage;
