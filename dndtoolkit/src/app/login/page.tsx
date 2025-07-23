'use client';

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="login-container">
      <h1 className="text-2xl font-bold mb-4">Greetings, Adventurer!</h1>

      <div className="flex flex-col items-center gap-3">
        <button
            onClick={() => signIn("google")}
            className="flex items-center justify-center w-full max-w-sm px-4 py-2 mb-3 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition"
        >
            <FcGoogle className="mr-3 text-xl" />
            <span className="text-sm font-medium text-gray-800">Sign in with Google</span>
        </button>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
            onClick={() => signIn("facebook")}
            className="flex items-center justify-center w-full max-w-sm px-4 py-2 bg-[#1877F2] text-white rounded-md hover:bg-[#155dbd] transition"
        >
            <FaFacebook className="mr-3 text-xl" />
            <span className="text-sm font-medium">Sign in with Facebook</span>
        </button>
      </div>
    </div>
  );
}

