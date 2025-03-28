import Link from "next/link";

const AppLogo = () => {
  return (
    <Link href="/beranda">
      <img
        src="/siprusEduLogo.webp"
        className="bg-primary h-6 w-full object-contain object-left md:h-12"
        alt="Logo"
        data-testid="app-logo"
      />
    </Link>
  );
};

export default AppLogo;
