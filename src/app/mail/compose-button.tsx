"use client";
import { Pencil } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import EmailEditor from "./email-editor";
import { api } from "~/trpc/react";
import useThreads from "~/hooks/use-thread";

const ComposeButton = () => {
  const [toValues, setToValues] = React.useState<
    { label: string; value: string }[]
  >([]);
  const [ccValues, setCcValues] = React.useState<
    { label: string; value: string }[]
  >([]);

  const [subject, setSubject] = React.useState<string>("");

  const sendEmail = api.account.sendEmail.useMutation();
  const { account } = useThreads();

  const handleSend = async (value: string) => {
    if (!account) return;

    sendEmail.mutate(
      {
        accountId: account.id,
        threadId: undefined,
        body: value,
        subject,
        from: {
          name: account?.name ?? "Me",
          address: account?.emailAddress ?? "me@example.com",
        },
        to: toValues.map((to) => ({ name: to.value, address: to.value })),
        cc: ccValues.map((cc) => ({ name: cc.value, address: cc.value })),
        replyTo: {
          name: account?.name ?? "Me",
          address: account?.emailAddress ?? "me@example.com",
        },
        inReplyTo: undefined,
      },
      {
        onSuccess: () => {
          toast.success("Email sent");
        },
        onError: (error) => {
          console.log(error);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Drawer>
      <DrawerTrigger>
        <Button>
          <Pencil className="mr-1 size-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Compose Email</DrawerTitle>
        </DrawerHeader>
        <EmailEditor
          toValues={toValues}
          setToValues={setToValues}
          ccValues={ccValues}
          setCcValues={setCcValues}
          subject={subject}
          setSubject={setSubject}
          handleSend={handleSend}
          to={toValues.map((to) => to.value)}
          defaultToolBarExpanded={true}
          isSending={sendEmail.isPending}
        />
      </DrawerContent>
    </Drawer>
  );
};

export default ComposeButton;
