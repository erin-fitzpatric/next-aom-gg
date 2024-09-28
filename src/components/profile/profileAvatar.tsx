import { SteamProfile } from "@/types/Steam";

import { Skeleton } from "../ui/skeleton";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

export function ProfileAvatar({
  steamProfile,
  loading,
}: {
  steamProfile?: SteamProfile;
  loading: boolean;
}) {
  return (
    <Avatar className="w-[84px] h-[84px]">
      {loading ? (
        <AvatarFallback>
          <Skeleton className="w-full h-full rounded-full" />
        </AvatarFallback>
      ) : steamProfile ? (
        <AvatarImage src={steamProfile.avatarfull} alt="Profile Picture" />
      ) : (
        <AvatarFallback className="bg-gray-300" />
      )}
    </Avatar>
  );
}
