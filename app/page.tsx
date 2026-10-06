"use client"

import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-rose-100">
      <div className="space-y-6 text-center border shadow-sm rounded-md p-8 bg-white">
        <p className="text-4xl font-semibold  ">Application autehntication</p>
        <LoginButton>
          <Button variant={"secondary"} size={"lg"}>Login</Button>
        </LoginButton>
      </div>
    </main>
  )
}
