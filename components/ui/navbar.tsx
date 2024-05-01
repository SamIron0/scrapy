import Link from "next/link"

export default function Navbar() {
  function handleButtonClick(): void {}

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center  justify-between border-b border-[#232325] bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center pl-3 pt-1.5 lg:pl-32">
        <Link href="/" rel="nofollow">
          <img
            className="h-[110px]  md:h-[120px]"
            src="/logo.svg"
            alt="logo"
          ></img>
        </Link>
      </div>
      <div className="flex items-center justify-end space-x-2 pr-3 lg:pr-32">
        <Link
          href="/signup"
          className="group flex scale-100 items-center justify-center rounded-md bg-[#f5f7f9] px-4 py-2 text-[13px] font-semibold text-[#1E2B3A] no-underline transition-all duration-75 active:scale-95"
          style={{
            boxShadow: "0 1px 1px #0c192714, 0 1px 3px #0c192724"
          }}
        >
          Get Started
        </Link>
      </div>
    </header>
  )
}
