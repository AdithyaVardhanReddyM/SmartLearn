import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Topbar from "@/components/topbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative bg-[#000319] flex justify-center items-center flex-col overflow-x-hidden mx-auto sm:px-10 px-5">
      <Topbar />
      <div className="max-w-7xl w-full">
        <Hero />
        <Features />
      </div>
    </div>
  );
}
