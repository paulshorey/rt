"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient();

interface LayoutProps {
  children: ReactNode;
}

export default function QueryProvider({ children }: LayoutProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
