import Image from 'next/image';

export function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <div
      className="logo-mark"
      style={{ width: size, height: size - 8, marginRight: 10 }}
    >
      <Image
        src="/logo.svg"
        alt=""
        width={size}
        height={size}
        className="logo-mark-img"
        style={{ width: size, height: size }}
        priority
      />
    </div>
  );
}
