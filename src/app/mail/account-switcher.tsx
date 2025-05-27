"use client";
import React from "react";
import { accountRouter } from "~/server/api/routers/account";
import { api } from "~/trpc/react";
import { useLocalStorage } from "usehooks-ts";
import { Select, SelectContent, SelectItem } from "~/components/ui/select";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { cn } from "~/lib/utils";
import { Plus } from "lucide-react";
import { getAurinkoAuthUrl } from "~/lib/aurinko";
type Props = {
  isCollapsed: boolean;
};
const AccountSwitcher = ({ isCollapsed }: Props) => {
  const { data } = api.account.getAccounts.useQuery();

  const [accountId, setAccountId] = useLocalStorage("accountId", "");

  if (!data) return null;

  return (
    <Select defaultValue={accountId} onValueChange={setAccountId}>
      <SelectTrigger
        className={cn(
          "flex w-full flex-1 items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden",
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          <span className={cn({ hidden: !isCollapsed })}>
            {data.find((account) => account.id === accountId)?.emailAddress[0]}
          </span>
          <span className={cn("ml-2", isCollapsed && "hidden")}>
            {data.find((account) => account.id === accountId)?.emailAddress}
          </span>
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {data.map((account) => {
          return (
            <SelectItem key={account.id} value={account.id}>
              <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                {/* {account.icon} */}
                {account.emailAddress}
              </div>
            </SelectItem>
          );
        })}
        <div
          onClick={async (e) => {
            const authUrl = await getAurinkoAuthUrl("Google");

            window.location.href = authUrl;
          }}
          className="relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-gray-50 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        >
          <Plus className="mr-1 size-4" />
          Add account
        </div>
      </SelectContent>
    </Select>
  );
};

export default AccountSwitcher;
