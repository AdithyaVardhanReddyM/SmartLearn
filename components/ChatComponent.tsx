"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Send } from "lucide-react";
import MessageList from "./MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);

  const {
    data,
    isLoading: isInitialLoading,
    refetch,
  } = useQuery<Message[]>({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/getMessages", {
        chatId,
      });
      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsCompleting(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [...messages, userMessage],
        chatId,
      }),
    });

    if (!response.body) {
      console.error("No response body");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullMessage = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk
        .split("\n")
        .filter((line) => line.startsWith("data: "))
        .map((line) => JSON.parse(line.replace("data: ", "")));

      for (const msg of lines) {
        if (msg.id === "complete") {
          setIsCompleting(false);
          return;
        }

        fullMessage += msg.content;
        setMessages((prev) => {
          const existingSystem = prev.find((m) => m.id === "streaming");
          if (existingSystem) {
            return prev.map((m) =>
              m.id === "streaming" ? { ...m, content: fullMessage } : m
            );
          } else {
            return [
              ...prev,
              {
                id: "streaming",
                role: "system",
                content: msg.content,
              },
            ];
          }
        });
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 inset-x-0 pl-1 h-fit flex items-center">
        <h3 className="text-2xl font-bold mx-2 my-1">Chat</h3>
        {(isInitialLoading || isCompleting) && (
          <Loader2 className="h-5 w-5 text-pink-500 animate-spin" />
        )}
      </div>

      <div className="overflow-auto h-[87.5%]" id="message-container">
        <MessageList messages={messages} isLoading={isCompleting} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask any question..."
            className="w-full bg-black-100"
            disabled={isCompleting}
          />
          <Button
            className="bg-[#30cbbe] ml-2"
            type="submit"
            disabled={isCompleting || !input.trim()}
          >
            {isCompleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
