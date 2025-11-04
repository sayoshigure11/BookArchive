"use client";
import { cn } from "@/lib/utils";
import { BookOpen, ScanBarcode, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export const Tab = () => {
  const router = useRouter();
  const pathName = usePathname();
  return (
    <div className="flex w-full items-center bg-white border-t border-slate-300">
      <div
        onClick={() => {
          if (pathName === "/") return;
          router.push("/");
        }}
        className="flex-1 flex flex-col items-center justify-center"
      >
        <BookOpen
          className={cn("w-8 h-8", pathName === "/" ? "text-orange-200" : "")}
        />
        <p className={cn("text-xs", pathName === "/" ? "text-orange-200" : "")}>
          本棚
        </p>
      </div>

      <div
        onClick={() => {
          if (pathName === "/search") return;
          router.push("/search");
        }}
        className="flex-1 flex flex-col items-center justify-center"
      >
        <Search
          className={cn(
            "w-8 h-8",
            pathName === "/search" ? "text-orange-200" : ""
          )}
        />
        <p
          className={cn(
            "text-xs",
            pathName === "/search" ? "text-orange-200" : ""
          )}
        >
          検索
        </p>
      </div>

      <div
        onClick={() => {
          if (pathName === "/scan") return;
          router.push("/scan");
        }}
        className="flex-1 flex flex-col items-center justify-center"
      >
        <ScanBarcode
          className={cn(
            "w-8 h-8",
            pathName === "/scan" ? "text-orange-200" : ""
          )}
        />
        <p
          className={cn(
            "text-xs",
            pathName === "/scan" ? "text-orange-200" : ""
          )}
        >
          スキャン
        </p>
      </div>
    </div>
  );
};
