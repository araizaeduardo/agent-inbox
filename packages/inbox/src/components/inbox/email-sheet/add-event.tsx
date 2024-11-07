import { AddEvent } from "../types";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToolCall } from "@langchain/core/messages/tool";

interface AddEventProps {
  event: AddEvent;
  threadId: string;
  handleSubmit: (values: Record<string, any>) => Promise<void>;
  handleIgnore: (threadId: string) => Promise<void>;
}

export function AddEventComponent({
  event,
  threadId,
  handleSubmit,
  handleIgnore,
}: AddEventProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const submit = async (
    e: React.FormEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setLoading(true);

    if (event.message_type === "tool") {
      const toolCall = event.tool_call || (event.metadata as ToolCall);
      const tool_call_id = toolCall.id;
      const toolCallName = toolCall.name;
      const toolMsg = {
        role: "tool",
        tool_call_id,
        name: toolCallName,
        content: response,
      };
      await handleSubmit({
        messages: [toolMsg],
      });
    } else {
      await handleSubmit({
        messages: [
          {
            role: "user",
            content: response,
          },
        ],
      });
    }

    setLoading(false);
    setResponse("");
  };

  const ignore = async () => {
    setLoading(true);
    await handleIgnore(threadId);
    setLoading(false);
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-2 items-start justify-start"
    >
      <p>{event.message}</p>
      <Textarea
        placeholder="Type your response here..."
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        disabled={loading}
      />
      <div className="flex gap-2">
        <Button disabled={loading} type="submit" onClick={submit}>
          Send
        </Button>
        <Button
          disabled={loading}
          type="button"
          variant="secondary"
          onClick={ignore}
        >
          Ignore
        </Button>
      </div>
    </form>
  );
}
