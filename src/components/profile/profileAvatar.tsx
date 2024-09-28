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
        <Skeleton className="w-[84px] h-[84px] rounded-full" />
      ) : steamProfile ? (
        <Image
          src={steamProfile.avatarfull}
          alt="Profile Picture"
          width={84}
          height={84}
          priority
          style={{ width: "84px", height: "84px" }}
          className="rounded-md"
          objectFit="cover"
        />
      ) : (
        <div className="w-[84px] h-[84px] rounded-full mx-auto bg-gray-300"></div>
      )}
    </>
  );
}
