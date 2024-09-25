import UnderConstruction from "@/components/statistics/under-construction";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background antialiased p-4 lg:px-44">
      <UnderConstruction />
      {children}
    </div>
  );
}