import type { ReactNode } from "react";
import DemoSidebar from "./demo-sidebar";

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="ai-app-shell min-h-screen w-full px-3 py-4 text-white sm:px-5 sm:py-5 lg:px-6 lg:py-6">
      <div className="grid w-full grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(300px,360px)_minmax(0,1fr)] lg:gap-6">
        <DemoSidebar />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
