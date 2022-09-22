import XMark from '../../../../svgs/XMark';

interface DocsSidebarModalProps {
  toggleAside: () => void;
  children: React.ReactNode;
}
export default function DocsSidebarModal({
  toggleAside,
  children,
}: DocsSidebarModalProps) {
  return (
    <div id="docs-sidebar-modal" className="fixed z-50 h-screen w-screen">
      <div
        className="absolute top-0 z-40 h-full w-full bg-black/50"
        onClick={toggleAside}
      />
      <aside className="absolute top-0 z-50 h-screen w-1/2 bg-white">
        <button className="absolute right-4 top-3" type="button">
          <XMark onClick={toggleAside} />
        </button>
        {children}
      </aside>
    </div>
  );
}
