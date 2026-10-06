"use client";

import { useRouter } from "next/navigation";

interface loginbuttonprops {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({ children, mode = "redirect", asChild }: loginbuttonprops) => {

  const router = useRouter();

  const onClick = () => {
    router.push("/login")
  }

  if (mode == "modal") {
    return (
      <div>
        <p>Modal content</p>
      </div>
    )
  }

  return (
    <span className="cursor-pointer" onClick={onClick}>
      {children}
    </span>
  )
}
