import MermaidChart from "@/components/MermaidChart";

type Props = {
  params: {
    chatId: number;
  };
};

const page = async ({ params: { chatId } }: Props) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-2">
      <div className="w-5/6">
        <MermaidChart chatId={chatId} />
      </div>
    </div>
  );
};

export default page;
