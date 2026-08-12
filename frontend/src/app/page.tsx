import Link from "next/link";
import SummaryCard from "./learn/page";

export default function Home() {
  return (
    <div>
      <Link href="/login">Sign in</Link>
      <Link href="/register">Sign Up</Link>
    </div>
  );
}
