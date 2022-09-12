interface DocsSidebarModalProps {
  toggleAside: () => void;
  children: React.ReactNode;
}
export default function DocsSidebarModal({
  toggleAside,
  children,
}: DocsSidebarModalProps) {
  return (
    <div id="Modal-Background" className="relative">
      <div
        className="absolute top-0 z-40 h-screen w-screen bg-black/50 backdrop-blur-sm"
        onClick={toggleAside}
      />
      <aside className="absolute top-0 z-50 h-screen w-screen max-w-xs bg-white">
        {children}
      </aside>
    </div>
  );
}
