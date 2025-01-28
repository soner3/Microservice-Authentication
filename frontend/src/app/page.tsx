export const metadata: Metadata = {
  title: "Website",
};

import SignIn from "@/components/SignIn";
import { Metadata } from "next";

export default function Home() {
  return (
    <div className="p-4">
      <SignIn />
    </div>
  );
}
