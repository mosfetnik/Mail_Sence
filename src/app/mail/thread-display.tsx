import { Archive, ArchiveX, Clock, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import useThreads from "~/hooks/use-thread";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { format } from "date-fns";
import EmailDisplay from "./email-display";
import ReplyBox from "./reply-box";

const ThreadDisplay = () => {
  const { threadId, threads } = useThreads();
  const thread = threads?.find((t) => t.id === threadId);

  return (
    <div className="flex h-full flex-col">
      {/* buttons row */}
      <div className="item-center flex p-2">
        <div className="item-center flex gap-2">
          <Button variant={"ghost"} size="icon" disabled={!thread}>
            <Archive className="size-4" />
          </Button>
          <Button variant={"ghost"} size="icon" disabled={!thread}>
            <ArchiveX className="size-4" />
          </Button>
          <Button variant={"ghost"} size="icon" disabled={!thread}>
            <Trash2 className="size-4" />
          </Button>
          <Separator orientation="vertical" className="ml-2" />
          <Button variant={"ghost"} size="icon" disabled={!thread}>
            <Clock className="size-4" />
          </Button>
        </div>

        <div className="ml-auto flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                className="ml-2"
                variant={"ghost"}
                size="icon"
                disabled={!thread}
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as Unread</DropdownMenuItem>
              <DropdownMenuItem>Star thread</DropdownMenuItem>
              <DropdownMenuItem>Add label</DropdownMenuItem>
              <DropdownMenuItem>Mute thread</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator />
      {thread ? (
        <>
          <div className="flex flex-1 flex-col overflow-scroll">
            <div className="flex items-center p-1">
              <div className="item-center flex gap-4 text-sm">
                <Avatar>
                  {" "}
                  <AvatarImage alt="avatar" />
                  <AvatarFallback>
                    {thread?.emails[0]?.from?.name
                      ?.split(" ")
                      .map((chunk) => chunk[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="grid gap-1">
                  <div className="font-semibold">
                    {thread.emails[0]?.from?.name}
                  </div>
                  <div className="line-clamp-1 text-xs">
                    {thread.emails[0]?.subject}
                  </div>
                  <div className="line-clamp-1 text-xs">
                    <span className="font-medium">Reply-To:</span>{" "}
                    {thread.emails[0]?.from?.address}
                  </div>
                </div>
              </div>

              {thread.emails[0]?.sentAt && (
                <div className="ml-auto text-xs text-muted-foreground">
                  {format(new Date(thread.emails[0].sentAt), "PPpp")}
                </div>
              )}
            </div>

            <Separator />
            {/*  adjusting the width of email */}
            <div className="flex max-h-[calc(100vh-300px)] flex-col overflow-scroll">
              <div className="flex flex-col gap-4 p-6">
                {thread.emails.map((email) => {
                  return <EmailDisplay key={email.id} email={email} />;
                })}
              </div>
            </div>

            <div className="flex-1">
              <Separator className="mt-auto" />
              <ReplyBox />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="p8 text-center text-muted-foreground">
            No Message Selected
          </div>
        </>
      )}
    </div>
  );
};

export default ThreadDisplay;
