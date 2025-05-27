"use client";
import React from "react";
import EmailEditor from "./email-editor";
import { api, RouterOutputs } from "~/trpc/react";
import useThreads from "~/hooks/use-thread";
import {  toast } from 'sonner'

const ReplyBox = () => {
  const { threadId, accountId } = useThreads();

  const { data: replyDetails } = api.account.getReplyDetails.useQuery({
    threadId: threadId ?? "",
    accountId,
  });

  if (!replyDetails) return null;
  return <Component replyDetails={replyDetails} />;
};

const Component = ({
  replyDetails,
}: {
  replyDetails: RouterOutputs["account"]["getReplyDetails"];
}) => {
  const { threadId, accountId } = useThreads();

  const [subject, setSubject] = React.useState(
    replyDetails.subject.startsWith("Re:")
      ? replyDetails.subject
      : `Re: ${replyDetails.subject}`,
  );
  const [toValues, setToValues] = React.useState<
    { label: string; value: string }[]
  >(
    replyDetails.to.map((to) => ({
      label: to.address ?? to.name,
      value: to.address,
    })) || [],
  );
  const [ccValues, setCcValues] = React.useState<
    { label: string; value: string }[]
  >(
    replyDetails.cc.map((cc) => ({
      label: cc.address ?? cc.name,
      value: cc.address,
    })) || [],
  );
  React.useEffect(() => {
    if (!replyDetails || !threadId) return;

    if (!replyDetails.subject.startsWith("Re:")) {
      setSubject(`Re: ${replyDetails.subject}`);
    } else {
      setSubject(replyDetails.subject);
    }
    setToValues(
      replyDetails.to.map((to) => ({
        label: to.address ?? to.name,
        value: to.address,
      })),
    );
    setCcValues(
      replyDetails.cc.map((cc) => ({
        label: cc.address ?? cc.name,
        value: cc.address,
      })),
    );
  }, [threadId, replyDetails]);

  const sendEmail = api.account.sendEmail.useMutation();
  const handleSend = async (value: string) => {
    if (!replyDetails) return;
    sendEmail.mutate(
      {
        accountId,
        threadId: threadId ?? undefined,
        body: value,
        subject,
        from: replyDetails.from,
        to: replyDetails.to.map((to) => ({
          name: to.name ?? to.address,
          address: to.address,
        })),
        cc: replyDetails.cc.map((cc) => ({
          name: cc.name ?? cc.address,
          address: cc.address,
        })),
        replyTo: replyDetails.from,
        inReplyTo: replyDetails.id,
      },
      {
        onSuccess: () => {
          toast.success("Email Sent");
        },
        onError: (error) => {
          toast.error("Error to sending Email");
        },
      },
    );

    console.log(value);
  };

  return (
    <EmailEditor
      toValues={toValues}
      setToValues={setToValues}
      ccValues={ccValues}
      setCcValues={setCcValues}
      subject={subject}
      setSubject={setSubject}
      to={replyDetails.to.map((to) => to.address)}
      isSending={sendEmail.isPending}
      handleSend={handleSend}
    />
  );
};

export default ReplyBox;
