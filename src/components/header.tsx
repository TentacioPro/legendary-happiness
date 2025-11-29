"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
const goldenSignature = localFont({
  src: "../assets/GoldenSignature.otf",
  display: "swap",
});

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const scrollLinks = ["about", "skills", "contact"];
  const pageLinks = [
    { name: "Resume", href: "/resume" },
    { name: "Analytics", href: "/analytics" },
    { name: "Docs", href: "/docs" },
  ];

  return (
    <>
      <nav className="justify-centerpy-2 flex w-full select-none pt-6 font-light md:px-28 md:pb-2">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div
            className={cn(
              "text-4xl drop-shadow-2xl sm:text-5xl",
              goldenSignature.className,
            )}
          >
            <Link href="/">Abishek Maharajan</Link>
          </div>
          <div className="nav-links flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:gap-x-6 md:gap-x-8 md:text-base">
            {isHomePage &&
              scrollLinks.map((link) => (
                <span
                  key={link}
                  className="cursor-pointer transition-colors hover:text-blue-600"
                  onClick={() => {
                    document
                      .getElementById(link)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {link.charAt(0).toUpperCase() + link.slice(1)}
                </span>
              ))}
            {pageLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-blue-600",
                  pathname === link.href && "font-semibold text-blue-600",
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
