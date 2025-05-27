"use client";
import { Bot } from "lucide-react";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { generateEmail } from "./actions";
import { readStreamableValue } from "ai/rsc";
import useThreads from "~/hooks/use-thread";
import { turndown } from "~/lib/turndown";

type Props = {
  isComposing: boolean;
  onGenerate: (token: string) => void;
  context: string;
};

const AiComposeButton = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const { threads, threadId, account } = useThreads();
  const thread = threads?.find((t) => t.id === threadId);

  const aiGenerate = async () => {
    let context = "";

    if (!props.isComposing) {
      for (const email of thread?.emails ?? []) {
        const content = `
       Subject:${email.subject}
       From:${email.from}
       Sent:${new Date(email.sentAt).toLocaleString()}
       Body:${turndown.turndown(email.body ?? email.bodySnippet ?? "")}
       `;
        context += content;
      }
    }
    context += `My name is ${account?.name} and my email is ${account?.emailAddress}`;
    console.log(context)

    const { output } = await generateEmail(context, prompt);

    for await (const token of readStreamableValue(output)) {
      if (token) {
        console.log(token);
        props.onGenerate(token);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Bot className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Smart Compose</DialogTitle>
          <DialogDescription>
            AI will help you compose your email.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt"
        />
        <div className="flex justify-end">
          <Button
            onClick={async () => {
              setPrompt("");
              setOpen(false);
              await aiGenerate();
            }}
          >
            Generate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AiComposeButton;
