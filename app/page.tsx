import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import MyTag from "@/components/auth/test";
import AuthProvider from "./_app";
import AppHeader from "@/components/header/AppHeader";
import AppFooter from "../components/footer/footer";
import Declaration from "./declaration/page";
import Director from "@/components/pages/director";

export default function Home() {
  return (
    // <AuthProvider>
    <Director />
    // </AuthProvider>
  );
}
