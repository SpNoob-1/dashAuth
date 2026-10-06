"use client"

import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import { Lock } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-sky-100">
      <div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-md outline outline-black/5          dark:bg-gray-800 ">
        <span className="inline-flex shrink-0 rounded-full border border-red-300 bg-red-100 p-2 dark:border-red-300/10 dark:bg-red-400/10">
          <Lock size={50} />
        </span>
        <div className="flex flex-col gap-y-2">
          <p className="text-gray-700 dark:text-gray-400">
            <span className="font-bold text-gray-950 dark:text-white">Application autehntication</span>
          </p>

          <LoginButton >
            <Button variant={"login"} size={"lg"}>Login</Button>
          </LoginButton>
        </div>
      </div>
    </main>
  )
}
