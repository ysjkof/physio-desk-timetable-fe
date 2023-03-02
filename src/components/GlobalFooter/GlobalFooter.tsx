const GlobalFooter = () => {
  return (
    <footer className="border-t border-[#D9D9D9] bg-[#F8F8F8] pb-16 pt-10 text-xs">
      <div className="mx-auto flex flex-col items-center gap-2">
        <div className="flex divide-x divide-black">
          <a href="mailto:muool.dev@gmail.com" className="px-2">
            muool.dev@gmail.com
          </a>
          <a
            href="https://www.instagram.com/muool.owner"
            target="_blank"
            className="px-2"
          >
            Instagram
          </a>
        </div>
        <span>Design by 박재홍</span>
      </div>
    </footer>
  );
};

export default GlobalFooter;
