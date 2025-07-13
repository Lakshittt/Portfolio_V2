import React from "react";

export interface CommandOutput {
  command: string;
  output: React.ReactNode;
  timestamp: Date;
}
