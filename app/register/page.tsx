"use client";
import RegistrationForm from "@/components/forms/registration_form";
import { Member, SubmitError } from "@/components/interface/interfaces";
import AuthLayout from "@/components/layouts/auth/Layout";
import { HtmlContext } from "next/dist/server/future/route-modules/app-page/vendored/contexts/entrypoints";
import Link from "next/link";
import React, { useState } from "react";

const page = () => {
  return <RegistrationForm />;
};

export default page;
