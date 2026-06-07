import React from "react";

export default function SkeletonLoader({ type = "table" }: { type?: "table" | "card" | "form" }) {
  if (type === "card") {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e8e0d8] flex flex-col gap-4 animate-pulse">
        <div className="h-10 w-10 bg-[#f5e6d3] rounded-full"></div>
        <div className="h-6 w-1/2 bg-[#f5e6d3] rounded"></div>
        <div className="h-8 w-1/3 bg-[#f5e6d3] rounded"></div>
      </div>
    );
  }

  if (type === "form") {
    return (
      <div className="animate-pulse flex flex-col gap-6 max-w-4xl">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e8e0d8] flex flex-col gap-4">
          <div className="h-6 w-1/4 bg-[#f5e6d3] rounded"></div>
          <div className="h-10 w-full bg-[#f5e6d3] rounded"></div>
          <div className="h-6 w-1/4 bg-[#f5e6d3] rounded mt-4"></div>
          <div className="h-32 w-full bg-[#f5e6d3] rounded"></div>
        </div>
      </div>
    );
  }

  // Default: Table skeleton
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e8e0d8] overflow-hidden animate-pulse">
      <div className="px-6 py-4 border-b border-[#e8e0d8] bg-[#faf8f5] flex gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 w-1/5 bg-[#e8e0d8] rounded"></div>
        ))}
      </div>
      <div className="divide-y divide-[#e8e0d8]">
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="px-6 py-4 flex gap-4 items-center">
            <div className="h-10 w-10 bg-[#f5e6d3] rounded-md shrink-0"></div>
            <div className="h-4 w-1/5 bg-[#f5e6d3] rounded"></div>
            <div className="h-4 w-1/5 bg-[#f5e6d3] rounded"></div>
            <div className="h-4 w-1/5 bg-[#f5e6d3] rounded"></div>
            <div className="h-8 w-20 bg-[#e8e0d8] rounded ml-auto shrink-0"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
