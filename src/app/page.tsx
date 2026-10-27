import { prisma } from "@/lib/prisma";
import ProfilePicker from "@/components/ProfilePicker";

export const dynamic = "force-dynamic";

export default async function Home() {
  const profiles = await prisma.profile.findMany({
    orderBy: { createdAt: "asc" },
  });
  return <ProfilePicker profiles={profiles} />;
}
