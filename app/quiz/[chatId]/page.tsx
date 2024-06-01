import Mcq from "@/components/Mcq";
import { BackgroundBeams } from "@/components/ui/background-beams";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getQuiz } from "@/lib/getQuiz";

type Props = {
  params: {
    chatId: number;
  };
};

type Question = {
  options: string[];
  question: string;
  correctAnswer: number;
};

const page = async ({ params: { chatId } }: Props) => {
  const data = await getQuiz(chatId);
  if (!data)
    return (
      <div className="flex h-screen justify-center items-center">
        Some Error occured while generating Please Refresh (cmd/cntrl + R)
      </div>
    );
  return (
    <div className="flex items-center justify-center h-screen">
      <Carousel className="w-full max-w-xl z-20">
        <CarouselContent>
          {data.map((data, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Mcq
                  question={data.question}
                  options={data.options}
                  correctAnswer={data.correctAnswer}
                  questionIndex={index}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <BackgroundBeams className="z-10" />
    </div>
  );
};

export default page;
