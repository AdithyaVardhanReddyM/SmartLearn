import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import MarkdownRenderer from "./MarkdownRenderer";

type Props = {
  text: string;
};

const Summary = ({ text }: Props) => {
  return (
    <div className="m-2 p-2 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle>AI Summary</CardTitle>
          <CardDescription>
            Summary of your PDF generated with AI (for now max 5 pages can be
            summarized)
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <MarkdownRenderer content={text} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Summary;
