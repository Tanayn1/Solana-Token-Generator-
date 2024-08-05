
import Image from "next/image";
import Navbar from "./components/navbar";
import TokenCreationForm from "./components/tokenCreationForm";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <div className=" mx-24 mb-16 mobile:mx-0 mobile:text-center mobile:mt-16">
        <h1 className=' text-5xl font-semibold  bg-gradient-to-b from-violet-800 to-blue-500 bg-clip-text text-transparent'>Solana Token Creator</h1>
        <h1 className=" mt-4 text-zinc-400 ">The perfect no code tool to create Solana SPL tokens.
        Simple, user friendly, and fast.</h1>
      </div>
        <div className=" mobile:flex mobile:justify-center">
          <TokenCreationForm/>
        </div>
    </div>
  );
}
