interface DocsSidebarModalProps {
  toggleAside: () => void;
  children: React.ReactNode;
}
export default function DocsSidebarModal({
  toggleAside,
  children,
}: DocsSidebarModalProps) {
  return (
    <div id="Modal-Background" className="fixed h-screen w-screen">
      <div
        className="absolute top-0 z-40 h-full w-full bg-black/50 backdrop-blur-sm"
        onClick={toggleAside}
      />
      <aside className="absolute top-0 z-50 h-screen w-1/2 bg-white">
        {children}
      </aside>
    </div>
  );
}
