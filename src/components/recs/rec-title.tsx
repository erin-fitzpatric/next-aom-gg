export default function RecTitle({gameTitle}: {gameTitle: string}) {
  return (
    <div className="text-center text-xl text-prim font-semibold w-[240px] min-h-2-lines line-clamp-2">
      {gameTitle}
    </div>
  );
}
