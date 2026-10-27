import { prisma } from "@/lib/prisma";
import ProfilePicker from "@/components/ProfilePicker";
import { asPlatform } from "@/lib/kakaoSpec";

export const dynamic = "force-dynamic";

export default async function Home() {
  const profiles = await prisma.profile.findMany({
    orderBy: { createdAt: "asc" },
  });
  return (
    <ProfilePicker
      profiles={profiles.map((p) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        platform: asPlatform(p.platform),
      }))}
    />
  );
}
