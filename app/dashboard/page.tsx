import PdfUpload from "@/components/PdfUpload";
import GoToChats from "@/components/GoToChats";

import { WavyBackground } from "@/components/ui/wavy-background";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <WavyBackground className="max-w-4xl mx-auto">
        <p className="text-2xl md:text-4xl lg:text-5xl text-white font-bold inter-var text-center">
          Upload PDF's to get started
        </p>
        <p className="text-base md:text-lg my-4 text-white font-normal inter-var text-center">
          Leverage the power of AI in your learning journey
        </p>
        <div className="flex gap-3 items-center justify-center">
          <PdfUpload />
          <p className="font-bold text-lg">Or</p>
          <GoToChats />
        </div>
      </WavyBackground>
    </div>
  );
};

export default page;
