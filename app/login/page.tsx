"use client";
import AuthLayout from "@/components/layouts/auth/Layout";
import Link from "next/link";
import React, { useState } from "react";
import { signIn } from "next-auth/react";

const Login = () => {
  // State for input fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Attempt to sign in
    const result = await signIn("credentials", {
      redirect: false, // Prevent NextAuth from redirecting automatically
      username,
      password,
    });

    if (result?.error) {
      // Handle errors here (e.g., show an error message)
      setMessage("Login failed");
    } else {
      // console.log("Testing...");
      // console.log(result);
      // Redirect or perform additional actions on successful login
      // For example, redirect to the home page:
      window.location.href = "/";
    }
  };
  return (
    <AuthLayout>
      <div>
        <h2 className="my-5 flex justify-center font-bold text-white">Login</h2>
        <div className="text-red-600">{message}</div>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******************"
            />
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Sign In
            </button>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              Forgot Password?
            </a>
          </div>
        </form>
        <p className="text-center text-white text-xs mb-5">
          Don’t have an account?{" "}
          <Link href="/register">
            <text className="text-blue-400 font-bold hover:text-blue-800">Register</text>
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
