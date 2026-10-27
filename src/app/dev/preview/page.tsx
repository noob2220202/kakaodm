import { Suspense } from "react";
import { notFound } from "next/navigation";
import PreviewClient from "./PreviewClient";

export default function PreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <Suspense>
      <PreviewClient />
    </Suspense>
  );
}
