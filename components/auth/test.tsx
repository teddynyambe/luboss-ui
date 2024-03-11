"use client";
import React from "react";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const MyTag = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return; // Avoid flashing content

  return (
    <div>
      {/* Protected content goes here */}
      {status === "authenticated" && <div>Welcome to the protected page! {session.user?.name}</div>}
      {status === "unauthenticated" && <Link href="/login">Login</Link>}
    </div>
  );
};

export default MyTag;
