"use client"
import React from 'react'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
function ConvexClientProvider({children }: {children: ReactNode}) {
    const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

  return (
    <ConvexProvider client={convex}>{children}</ConvexProvider>
  )
}

export default ConvexClientProvider