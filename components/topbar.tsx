import Link from "next/link";
import { Button } from "./ui/button";

function Topbar() {
  return (
    <nav className="sticky top-0 z-30 flex w-full items-center justify-between px-5 py-3 bg-transparent">
      <div className="h-12 w-[145px] justify-center flex items-center ">
        <Link href="/home" className="flex items-center">
          <p className="font-extrabold text-2xl flex">
            Smart <span className="text-purple"> Learn</span>
          </p>
        </Link>
      </div>
      <div className="flex items-center gap-1">
        <Link href={"/dashboard"}>
          <Button className="bg-transparent border-[1px] border-purple text-purple hover:bg-purple hover:text-black-100">
            Sign In
          </Button>
        </Link>
      </div>
    </nav>
  );
}

export default Topbar;
