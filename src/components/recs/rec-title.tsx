export default function RecTitle({
  gameTitle,
  className = "",
}: {
  gameTitle: string | undefined;
  className?: string;
}) {
  if (!gameTitle) return null;
  return (
    <div
      className={`text-center text-xl text-prim font-semibold w-[240px] min-h-2-lines line-clamp-2 ${className}`}
    >
      {gameTitle}
    </div>
  );
}
