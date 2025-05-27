"use client";
import { Pencil } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
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

const ComposeButton = () => {
  const [toValues, setToValues] = React.useState<
    { label: string; value: string }[]
  >([]);
  const [ccValues, setCcValues] = React.useState<
    { label: string; value: string }[]
  >([]);

  const [subject, setSubject] = React.useState<string>("");

  const handleSend = async (value: string) => {
    console.log("value", value);
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
          isSending={false}
        />
      </DrawerContent>
    </Drawer>
  );
};

export default ComposeButton;
