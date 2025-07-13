export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
      {children}
    </div>
  );
}