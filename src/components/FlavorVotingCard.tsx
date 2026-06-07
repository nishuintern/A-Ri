"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const flavors = [
  { id: "espelette", label: "Piment d'Espelette & Sel de Guérande" },
  { id: "chevre", label: "Fromage de Chèvre & Miel" },
];

export default function FlavorVotingCard() {
  const [votes, setVotes] = useState<Record<string, number>>({
    espelette: 47,
    chevre: 53,
  });
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  useEffect(() => {
    const stored = localStorage.getItem("aeri-flavor-vote");
    if (stored) {
      setHasVoted(true);
      setSelectedId(stored);
    }
  }, []);

  const handleVote = (id: string) => {
    if (hasVoted) return;
    setVotes((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    setHasVoted(true);
    setSelectedId(id);
    localStorage.setItem("aeri-flavor-vote", id);
  };

  const totalVotes = votes.espelette + votes.chevre;
  const getPercent = (id: string) =>
    totalVotes > 0 ? Math.round((votes[id] / totalVotes) * 100) : 0;

  const winningId =
    votes.espelette >= votes.chevre ? "espelette" : "chevre";

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 md:py-28 px-6 relative overflow-hidden"
      style={{ background: "#F5E6D3" }}
    >
      {/* Blurred silhouette background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, #D4AF37 0%, #F4C2C2 40%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-xl mx-auto"
      >
        {/* Glass card */}
        <div
          className="rounded-3xl p-8 md:p-10 border border-white/40"
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Title */}
          <h2
            className="text-2xl md:text-3xl text-[#1C1C1C] text-center mb-3 leading-tight"
            style={{
              fontFamily: "var(--font-didot)",
            }}
          >
            Nous développons votre prochaine saveur préférée...
          </h2>

          <p
            className="text-sm md:text-base text-[#6E6E73] text-center mb-8"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Quelle création souhaitez-vous voir en premier ?
          </p>

          {/* Voting Options */}
          <div className="space-y-4">
            {flavors.map((flavor) => {
              const percent = getPercent(flavor.id);
              const isWinning = flavor.id === winningId;
              const isSelected = flavor.id === selectedId;

              return (
                <div key={flavor.id}>
                  <button
                    onClick={() => handleVote(flavor.id)}
                    disabled={hasVoted}
                    className={`w-full text-left rounded-xl px-5 py-4 border transition-all duration-300 relative overflow-hidden ${
                      hasVoted
                        ? "cursor-default border-white/30"
                        : "cursor-pointer border-white/40 hover:border-[#F4C2C2] hover:bg-[#F4C2C2]/20 active:scale-[0.98]"
                    } ${isSelected ? "border-[#D4AF37]/60" : ""}`}
                    style={{
                      background: hasVoted
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(255,255,255,0.3)",
                      fontFamily: "var(--font-montserrat), sans-serif",
                    }}
                  >
                    {/* Vote bar background */}
                    <AnimatePresence>
                      {hasVoted && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="absolute inset-y-0 left-0 rounded-xl"
                          style={{
                            background: isWinning
                              ? "rgba(212, 175, 55, 0.25)"
                              : "rgba(244, 194, 194, 0.3)",
                          }}
                        />
                      )}
                    </AnimatePresence>

                    <span className="relative z-10 flex items-center justify-between">
                      <span className="text-sm md:text-base text-[#1C1C1C] font-medium">
                        {flavor.label}
                      </span>
                      {hasVoted && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-sm font-semibold ml-3"
                          style={{
                            color: isWinning ? "#D4AF37" : "#6E6E73",
                          }}
                        >
                          {percent}%
                        </motion.span>
                      )}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Vote count */}
          {hasVoted && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center text-xs text-[#6E6E73] mt-6"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {totalVotes} votes — Merci pour votre participation !
            </motion.p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
