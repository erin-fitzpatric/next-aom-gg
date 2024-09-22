import { SteamProfile } from "@/types/Steam";
import { CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";

export function ProfileAvatar({
  steamProfile,
  loading,
}: {
  steamProfile?: SteamProfile;
  loading: boolean;
}) {
  return (
    <>
      {loading ? (
        <Skeleton className="w-24 h-24 rounded-full mx-auto" />
      ) : steamProfile ? (
        <Image
          src={steamProfile.avatarfull}
          alt="Profile Picture"
          width={84}
          height={84}
          className="rounded-full mx-auto"
        />
      ) : (
        <div className="w-24 h-24 rounded-full mx-auto bg-gray-300"></div>
      )}
    </>
  );
}
