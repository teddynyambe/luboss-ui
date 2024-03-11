"use client";
import { useEffect, useState } from "react";
import HomeComponent from "./home";
import DeclarationComponent from "./declaration";
import DepositComponent from "./deposit";
import AppHeader from "../header/AppHeader";
import AppFooter from "../footer/footer";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LoanComponent from "./loan";
import UserManagerComponent from "./user_manager";

export default function Director() {
  const { data: session, status } = useSession();
  const [currentView, setCurrentView] = useState("Home");

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading// Redirect if not logged in
  }, [status]);

  if (session) {
    return (
      <>
        <AppHeader setCurrentView={setCurrentView} />
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
            {currentView === "Home" && <HomeComponent />}
            {currentView === "Declaration" && <DeclarationComponent />}
            {currentView === "Deposit" && <DepositComponent />}
            {currentView === "Loan" && <LoanComponent />}
            {currentView === "User" && <UserManagerComponent />}
          </div>
        </main>
        <AppFooter setCurrentView={setCurrentView} />
      </>
    );
  } else {
    return (
      <div style={{ height: "80vh" }} className="h-screen p-10 text-center">
        <Link className="font-bold" href="/login">
          Please Login
        </Link>
        .
      </div>
    );
  }
}
