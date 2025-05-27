//api/aurinko/callback
import { waitUntil } from "@vercel/functions";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForAccessToken, getAccountDetails } from "~/lib/aurinko";
import { db } from "~/server/db";
import axios from "axios";

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: "Unaurthorized" }, { status: 401 });
  console.log(`userid is`, userId);

  const params = req.nextUrl.searchParams;
  const status = params.get("status");

  if (status != "success")
    return NextResponse.json(
      { message: "Faild to link account " },
      { status: 400 },
    );

  // get the code exchange for the access token
  const code = params.get("code");
  if (!code)
    return NextResponse.json({ message: "No Code Provided" }, { status: 400 });
  const token = await exchangeCodeForAccessToken(code);
  if (!token)
    return NextResponse.json({
      message: "Faild to exchange code for access token",
    });

  const accountDetails = await getAccountDetails(token.accessToken);
  // if the user already has an account than update else create a new one is called upsert
  await db.account.upsert({
    where: {
      id: token.accountId.toString(),
    },
    update: {
      accessToken: token.accessToken,
    },
    create: {
      id: token.accountId.toString(),
      userId,
      emailAddress: accountDetails.email,
      name: accountDetails.name,
      accessToken: token.accessToken,
    },
  });

  // hit the initial sync endpoint
  waitUntil(
    axios
      .post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, {
        accountId: token.accountId.toString(),
        userId,
      })
      .then((responce) => {
        console.log(`Response from initial sync`, responce.data);
      })
      .catch((error) => {
        console.error(`Error from initial sync`, error);
      }),
  );

  return NextResponse.redirect(new URL('/mail', req.url));
};
