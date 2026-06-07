import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";

export default function BackButton({link = "/", text = "Back"}: {link: string, text: string}) {
  return (
    <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
      <Link
        href={link}
        className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <ChevronLeftIcon />
        {text}
      </Link>
    </div>
  );
}
