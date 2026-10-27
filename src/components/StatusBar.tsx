export default function StatusBar({ time }: { time: string }) {
  return (
    <div className="h-9 shrink-0 bg-white flex items-center justify-between px-5 text-[13px] font-semibold text-black select-none">
      <span>{time}</span>
      <div className="flex items-center gap-1.5">
        {/* signal */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="0.5" />
          <rect x="4.5" y="5" width="3" height="6" rx="0.5" />
          <rect x="9" y="3" width="3" height="8" rx="0.5" />
          <rect x="13" y="0" width="3" height="11" rx="0.5" />
        </svg>
        {/* wifi */}
        <svg width="15" height="11" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 10.2a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Zm-2.6-3a3.7 3.7 0 0 1 5.2 0 .6.6 0 0 1-.85.85 2.5 2.5 0 0 0-3.5 0 .6.6 0 0 1-.85-.85Zm-2.1-2.1a6.8 6.8 0 0 1 9.4 0 .6.6 0 1 1-.84.86 5.6 5.6 0 0 0-7.72 0 .6.6 0 1 1-.84-.86Z" />
        </svg>
        {/* battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect
            x="0.5"
            y="0.5"
            width="21"
            height="11"
            rx="2.5"
            stroke="currentColor"
          />
          <rect x="2" y="2" width="18" height="8" rx="1.3" fill="currentColor" />
          <rect x="22.5" y="4" width="2" height="4" rx="1" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
