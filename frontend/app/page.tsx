"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const done = localStorage.getItem("relaxena:onboarding:done");
    router.replace(done ? "/dashboard" : "/onboarding");
  }, [router]);

  return null;
}
