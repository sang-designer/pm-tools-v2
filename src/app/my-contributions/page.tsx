"use client";

import { Suspense } from "react";
import { GlobalNav } from "@/components/global-nav";
import { MyContributions } from "@/components/contributions/my-contributions";

export default function MyContributionsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Contribute" />
      <main className="flex-1" role="main">
        <div className="mx-auto w-full max-w-[1500px] px-3 py-6 sm:px-10">
          <Suspense>
            <MyContributions />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
