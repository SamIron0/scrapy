import { useRouter } from "next/navigation"

import Link from "next/link"
import s from "./Navbar.module.css"
import Image from "next/image"

const Navbar = () => {
  //export default function Navbar() {
  function handleButtonClick(): void {}

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center  justify-between border-b border-[#232325] bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <Link href="/" rel="nofollow" className="flex items-center pl-3 lg:pl-32">
        <img className="h-12 " src="/logo.png" alt="logo"></img>
      </Link>
      <div className="flex items-center justify-end space-x-2 pr-3 lg:pr-32">
        <Link
          href="/login"
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
export default Navbar
