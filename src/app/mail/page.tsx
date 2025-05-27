import { UserButton } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import React from "react";
import ThemeToggle from "~/components/theme-toggle";
import ComposeButton from "./compose-button";

//import Mail from "./mail";



const Mail = dynamic(
  () => {
    return import("./mail");
  },
  { ssr: false },
);

const MailDashBoard = () => {
  return (
    <>
      <div className="absolute bottom-4 left-4">
        <div className="item-center flex gap-2">
          <UserButton />
          <ThemeToggle />
          <ComposeButton />
          
        </div>
      </div>
      <Mail
        defaultLayout={[20, 32, 48]}
        defaultCollapsed={false}
        navCollapsedSize={4}
      />
    </>
  );
};

export default MailDashBoard;
