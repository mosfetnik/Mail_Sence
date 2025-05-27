import { Button } from "~/components/ui/button";
import LinkAccountButton from "./_components/link-account-button";

export default async function Home() {
  return (
    <div
      className="flex min-h-screen flex-col justify-between bg-gray-50 text-center"
      style={{
        backgroundImage: "url('34.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Top Section */}
      <div className="flex flex-col items-center bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 bg-clip-text pt-20 text-transparent dark:text-white">
        <h1 className="max-w-4xl text-2xl font-extrabold sm:text-5xl lg:text-6xl">
          Emails so smart, they might reply before you do!
        </h1>

        {/* Funny Paragraph */}
        <p className="mt-6 max-w-2xl text-lg font-medium text-gray-100 dark:text-gray-300 sm:text-xl lg:text-2xl">
          Say goodbye to inbox overwhelm! Mailsence uses AI magic to sort,
          reply, and organize your emails — so you can kick back and let the
          bots do the heavy lifting.
        </p>

        {/* Welcome Heading */}
        <h2 className="mt-4 text-3xl font-extrabold text-blue-600 dark:text-blue-400 sm:text-4xl lg:text-5xl">
          Try the MailSence
        </h2>

        <div className="mt-6">
          <LinkAccountButton />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 w-full bg-black p-5 text-center text-gray-400 shadow-lg dark:text-white">
        Made with 🤍 by Team
      </div>
    </div>
  );
}
