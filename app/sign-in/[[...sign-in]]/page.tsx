import { SignIn } from "@clerk/nextjs";

type Props = {
  params: {
    chatId: number;
  };
};

export default function Page({ params: { chatId } }: Props) {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <SignIn />
    </div>
  );
}
