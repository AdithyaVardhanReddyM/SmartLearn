"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";

type Props = {
  options: string[];
  question: string;
  correctAnswer: number;
  questionIndex: number;
};

const Mcq = ({ options, question, correctAnswer, questionIndex }: Props) => {
  const [selectedAnswers, setSelectedAnswers] = useState(new Array(8).fill(-1));

  const handleAnswerSelect = (optionIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleClearSelection = () => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = -1;
    setSelectedAnswers(newSelectedAnswers);
  };

  const correct = selectedAnswers.reduce((count, selectedAnswer, index) => {
    if (selectedAnswer === correctAnswer) {
      return true;
    }
    return false;
  }, true);

  return (
    <div className="p-1">
      <Card>
        <div className="pt-4 px-4">
          <h1>Q. {questionIndex + 1}/8</h1>
          <div className="flex justify-between items-center">
            {selectedAnswers[questionIndex] == -1 ? (
              <h1 className="text-gray-500">No option selected!</h1>
            ) : selectedAnswers[questionIndex] != correctAnswer ? (
              <h1 className="text-red-500">Wrong! Try Again.</h1>
            ) : (
              <h1 className="text-green-500">Correct!</h1>
            )}
            <Button
              variant={"secondary"}
              onClick={handleClearSelection}
              className="test-sm"
            >
              Clear Selection
            </Button>
          </div>
        </div>
        <CardHeader>
          <CardTitle>{question}</CardTitle>
          <CardDescription>Select an option.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-3 w-full z-10">
          {options.map((option, optionIndex) => (
            <Button
              key={optionIndex}
              className={cn(
                "w-full h-auto whitespace-normal flex justify-start transition-none",
                {
                  "bg-blue-500 hover:bg-blue-600":
                    selectedAnswers[questionIndex] == optionIndex,
                }
              )}
              onClick={() => handleAnswerSelect(optionIndex)}
            >
              <div className="text-left flex">
                <p className="text-slate-400 mr-1">{optionIndex + 1}.</p>{" "}
                {option}
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Mcq;
