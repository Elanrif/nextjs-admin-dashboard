"use client";

import MainHeader from "@/layout/main-header";
import { FeaturesEntitySwitcher } from "./features-entity-switcher";

export default function FeaturesPage() {
  return (
    <div>
      <MainHeader />
      <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-50 sm:px-6 lg:px-10">
        <FeaturesEntitySwitcher />
      </main>
    </div>
  );
}
