import React from "react";
import Link from "next/link";

type Props = {
  chatId: number;
};

const QuizandSummary = ({ chatId }: Props) => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center text-sm">
      <div className="flex justify-center items-center">
        <Link
          href={`/quiz/${chatId}`}
          className="border-[2px] animate-shimmer border-dashed border-blue-900 rounded-lg p-1 mr-2 bg-[linear-gradient(110deg,#000103,45%,#1e2631,65%,#000103)] bg-[length:200%_100%] transition-colors"
        >
          <div>
            <p className="text-center">Quiz</p>
            <p className="text-gray-500 text-sm">
              AI generated Quiz (MCQ's) on your PDF!
            </p>
          </div>
        </Link>
        <Link
          href={`/summary/${chatId}`}
          className="border-[2px] animate-shimmer border-dashed border-blue-900 rounded-lg p-1 bg-[linear-gradient(110deg,#000103,45%,#1e2631,65%,#000103)] bg-[length:200%_100%] transition-colors"
        >
          <div>
            <h1 className="text-center">AI Insight</h1>
            <p className="text-gray-500 text-sm">
              AI generated Summary and Mindmaps!
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default QuizandSummary;
