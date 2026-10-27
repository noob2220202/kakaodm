export default function AvatarImage({
  src,
  alt,
  size = 64,
  className = "",
}: {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
}) {
  const style = { width: size, height: size };
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        style={style}
        className={`rounded-full object-cover shrink-0 ${className}`}
      />
    );
  }
  return (
    <div
      style={style}
      className={`rounded-full bg-[#d7dde3] text-[#8b95a1] shrink-0 flex items-center justify-center font-semibold ${className}`}
    >
      {alt.slice(0, 1)}
    </div>
  );
}
