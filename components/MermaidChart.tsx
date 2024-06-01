import { getMermaid } from "@/lib/getSummary";
import Mermaid from "../components/Mermaid";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const MermaidChart = async ({ chatId }: { chatId: number }) => {
  const code = await getMermaid(chatId);
  if (!code)
    return (
      <div className="flex h-screen justify-center items-center">
        Some Error occured while generating flow graphs, Please Refresh
      </div>
    );
  const convertedCode = code.replace(
    /```mermaid([\s\S]*?)```/g,
    (match, p1) => {
      return `${p1.trim()}`;
    }
  );
  const finalCode = convertedCode.replace(/\(/g, "'").replace(/\)/g, "'");
  console.log(finalCode);
  //   const finalCode = `
  // graph LR
  //     A[Dual Faster R-CNN Network] --> B{Cross-transformer Module}
  //     B --> C[Feature Fusion]
  //     C --> D[Final Prediction]
  //     E[Loss Function] --> A
  //     F[Pyramid Networks 'FPN'] --> A
  //     G[Focal Loss] --> A
  //     H[Position Coding] --> B

  //     subgraph "Cross-transformer Module"
  //         I[Multi-Head Co-attention 'MCA'] --> J[Feed Forward Network 'FFN']
  //         J --> K[Layer Normalization 'LN']
  //         K --> I
  //     end

  //     subgraph "Multi-Head Co-attention 'MCA'"
  //         L[Query 'Q'] --> N[Attention]
  //         M[Key 'K' & Value 'V'] --> N
  //         N --> O[Weighted Sum]
  //     end`;
  return (
    <div>
      <Card className="bg-black-100">
        <CardHeader>
          <CardTitle>
            <h1 className="mb-2">AI Flow Diagram</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Mermaid chart={finalCode} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MermaidChart;
