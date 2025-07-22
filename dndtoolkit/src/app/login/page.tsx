'use client';

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="login-container">
      <h1>Login</h1>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
      <button onClick={() => signIn("facebook")}>Sign in with Facebook</button>
    </div>
  );
}
