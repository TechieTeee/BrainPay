import Image from "next/image";
import { Inter } from "next/font/google";
import ARComponent from "../components/ARComponent";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24 min-h-screen">
      {/* Background Info Section */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4 text-accent">
          Welcome to TapQuest!
        </h1>
        <p className="text-lg opacity-80 max-w-2xl mx-auto">
          Embark on an epic journey in the world of augmented reality. Explore
          and engage with exciting challenges sponsored by leading companies.
          Earn rewards and unlock exclusive content as you immerse yourself in
          the AR environment powered by TapQuest.
        </p>
      </section>

      {/* AR Component Section */}
      <section className="relative flex items-center mb-16">
        <ARComponent />
      </section>

      {/* Features Section */}
      <section className="grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-4">
        {/* Feature 1 */}
        <div className="group rounded-lg border border-transparent px-5 py-4">
          <h2 className="mb-3 text-2xl font-semibold text-accent">
            Interactive AR Challenges
          </h2>
          <p className="m-0 text-sm opacity-80">
            Engage with immersive augmented reality challenges and earn exciting
            rewards.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="group rounded-lg border border-transparent px-5 py-4">
          <h2 className="mb-3 text-2xl font-semibold text-accent">
            Sponsored by Leading Companies
          </h2>
          <p className="m-0 text-sm opacity-80">
            Our challenges are sponsored by top companies, offering you exclusive
            prizes.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="group rounded-lg border border-transparent px-5 py-4">
          <h2 className="mb-3 text-2xl font-semibold text-accent">
            Seamless AR Experience
          </h2>
          <p className="m-0 text-sm opacity-80">
            Enjoy a seamless augmented reality experience powered by TapQuest's
            cutting-edge technology.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="group rounded-lg border border-transparent px-5 py-4">
          <h2 className="mb-3 text-2xl font-semibold text-accent">
            Unlock Exclusive Content
          </h2>
          <p className="m-0 text-sm opacity-80">
            Earn rewards and unlock exclusive content as you progress in your
            TapQuest journey.
          </p>
        </div>
      </section>
    </main>
  );
}
