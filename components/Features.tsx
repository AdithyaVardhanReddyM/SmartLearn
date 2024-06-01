import Image from "next/image";
import { Tabs } from "./ui/tabs";

type Props = {};

const Features = (props: Props) => {
  const tabs = [
    {
      title: "AI Chat",
      value: "product",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple to-violet-900">
          <p>Interactive PDF Conversations: AI-Driven Answers</p>
          <ChatContent />
        </div>
      ),
    },
    {
      title: "AI Quiz",
      value: "services",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple to-violet-900">
          <p>Learn Smart: AI-Generated Quizzes from your PDFs</p>
          <QuizContent />
        </div>
      ),
    },
    {
      title: "AI FlowCharts",
      value: "playground",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple to-violet-900">
          <p>Smart Flowcharts: AI-Driven Visualization</p>
          <FlowContent />
        </div>
      ),
    },
    {
      title: "AI Summarise",
      value: "content",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple to-violet-900">
          <p>Smart Summaries: AI-Driven Efficiency</p>
          <SummaryContent />
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="h-screen relative flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-40 mt-10">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
};

export default Features;

const ChatContent = () => {
  return (
    <Image
      src="/chat.png"
      alt="dummy image"
      width="1000"
      height="1000"
      className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
    />
  );
};

const SummaryContent = () => {
  return (
    <Image
      src="/summary.png"
      alt="dummy image"
      width="1000"
      height="1000"
      className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
    />
  );
};

const FlowContent = () => {
  return (
    <Image
      src="/flowchart.png"
      alt="dummy image"
      width="1000"
      height="1000"
      className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
    />
  );
};

const QuizContent = () => {
  return (
    <Image
      src="/quiz.png"
      alt="dummy image"
      width="1000"
      height="1000"
      className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
    />
  );
};
