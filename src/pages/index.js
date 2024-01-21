import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from "connectkit";
import { useEffect } from "react";
import Image from "next/image";
import ARComponent from "../components/ARComponentContent";
import Link from 'next/link';


const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.ALCHEMY_ID, // or infuraId
    walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID,

    // Required
    appName: "TapQuest",

    // Optional
    appDescription: "Reimagining Marketing and Micropaymments with Blockchain and AR",
    appUrl: "https://family.co", // your app's URL
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const Home = () => {
  useEffect(() => {
    // Ensure the script is added only once
    const script = document.createElement("script");
    script.src = "https://cdn.connect.family/wagmi.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup the script when the component unmounts
      document.head.removeChild(script);
    };
  }, []);

  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <main className="flex flex-col items-center justify-between p-24 min-h-screen relative">
          {/* ConnectKitButton - Top Right Corner */}
          <div className="absolute top-4 right-4">
            <ConnectKitButton />
          </div>

          {/* Background Info Section */}
          <section className="mb-16 text-center">
            <h1 className="text-9xl font-bold mb-4 text-accent font-nabla">
              Welcome to TapQuest!
            </h1>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              Embark on an epic journey in the world of augmented reality. Explore
              and engage with exciting challenges sponsored by leading companies.
              Earn rewards and unlock exclusive content as you immerse yourself in
              the AR environment powered by TapQuest.
            </p>
          </section>

          {/* Centered GIF */}
          <div className="mt-8 flex justify-center items-center">
            <iframe
              src="https://giphy.com/embed/rCmC12OWz9kTS"
              width="480"
              height="271"
              frameBorder="0"
              class="giphy-embed"
              allowFullScreen
            ></iframe>
            <p>
              <a href="https://giphy.com/gifs/disneypixar-disney-pixar-rCmC12OWz9kTS">
              </a>
            </p>
          </div>

          {/* AR Component Section */}
          <section className="relative flex items-center mb-16">
            <ARComponent />
          </section>

          {/* Features Section */}
          <section className="grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="group rounded-lg border border-transparent px-5 py-4">
              <h2 className="mb-3 text-2xl font-bold text-accent text-nabla">
                Interactive AR Challenges
              </h2>
              <p className="m-0 text-sm opacity-80">
                Engage with immersive augmented reality challenges and earn exciting
                rewards.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-lg border border-transparent px-5 py-4">
              <h2 className="mb-3 text-2xl font-bold text-accent text-nabla">
                Sponsored by Leading Companies
              </h2>
              <p className="m-0 text-sm opacity-80">
                Our challenges are sponsored by top companies, offering you exclusive
                prizes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-lg border border-transparent px-5 py-4">
              <h2 className="mb-3 text-2xl font-bold text-accent text-nabla">
                Seamless AR Experience
              </h2>
              <p className="m-0 text-sm opacity-80">
                Enjoy a seamless augmented reality experience powered by TapQuest's
                cutting-edge technology.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-lg border border-transparent px-5 py-4">
              <h2 className="mb-3 text-2xl font-bold text-accent text-nabla">
                Unlock Exclusive Content
              </h2>
              <p className="m-0 text-sm opacity-80">
                Earn rewards and unlock exclusive content as you progress in your
                TapQuest journey.
              </p>
            </div>
          </section>
{/* Buttons Section */}
<section className="flex justify-between mt-8">
{/* Button 1 */}
<Link href="/ARComponent">
    <button className="py-2 px-6 rounded-full text-black bg-yellow-500 border border-blue-500 font-bold">
      Embark on a TapQuest Adventure
    </button>
  </Link>

  {/* Button 2 */}
  <button className="py-2 px-6 rounded-full text-black bg-yellow-500 border border-green-500 font-bold">
    Explore Your TapQuest Earnings
  </button>
</section>




        </main>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default Home;
