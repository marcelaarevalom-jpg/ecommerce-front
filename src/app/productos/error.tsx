"use client";
import { ErrorView } from "@/components/ErrorView";

export default function Error(props: React.ComponentProps<typeof ErrorView>) {
  return <ErrorView {...props} />;
}
