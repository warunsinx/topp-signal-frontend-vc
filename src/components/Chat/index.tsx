import { useState } from "react";

import { Button, Input } from "@nextui-org/react";
import { useChatGroup } from "@/hooks/useChatGroup";
import { usePushProtocolStore } from "@/stores/pushProtocolStore";
import MessageSection from "./MessageSection";
import { SendHorizontal } from "lucide-react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { sendChat } = useChatGroup();
  const { historyMessages, isLoading: isLoadingStore } = usePushProtocolStore();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    console.log("submit");
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;
    try {
      await sendChat(message);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* chat history */}
      <div className="h-full flex flex-col justify-between">
        {/* flex-col-reverse */}
        <div className="overflow-y-scroll flex flex-col-reverse space-y-3 text-wrap">
          {isLoadingStore ? (
            <div className="flex justify-center items-center">
              <Button isLoading isIconOnly />
            </div>
          ) : (
            historyMessages.map((h, k) => {
              return (
                <div key={k} className="text-sm">
                  <MessageSection
                    name={h.ensName || h.address}
                    content={h.content}
                    avatar={h.avatar}
                  />
                  {/* <div>{new Date(h.timestamp).toLocaleString()}</div> */}
                </div>
              );
            })
          )}
        </div>
        {/* chat input */}
        <form onSubmit={onSubmit} className="flex space-x-1">
          <Input
            name="message"
            type="text"
            placeholder="Type your message..."
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && message.length > 0) {
                e.currentTarget.form?.requestSubmit();
              }
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            type="submit"
            disabled={message.length === 0 || isLoading}
            isIconOnly
            isLoading={isLoading}
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
