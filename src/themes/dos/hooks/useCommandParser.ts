"use client";

import { useCallback } from "react";
import { PortfolioData } from "@/content/portfolio";
import { TerminalLine, parseCommand, CLEAR_SIGNAL } from "../commands";

export function useCommandParser(data: PortfolioData) {
  const execute = useCallback(
    (
      input: string
    ): { lines: TerminalLine[]; clear: boolean } => {
      const result = parseCommand(input, data);

      if (result === CLEAR_SIGNAL) {
        return { lines: [], clear: true };
      }

      return { lines: result, clear: false };
    },
    [data]
  );

  return { execute };
}
