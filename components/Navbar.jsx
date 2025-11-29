import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import TextShine from "@/components/TextShine";
import useUserStore from "@/store/useUserStore";
import Image from "next/image";
import { UserCircle } from "lucide-react";
import { useClickOutside } from "@/lib/hooks";

const Navbar = () => {
  const { user, isLoggedIn, setUser, logout } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => setIsMenuOpen(false));

  // Check if we're on the client side and sync with localStorage for backward compatibility
  useEffect(() => {
    if (!isLoggedIn) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Failed to parse user from localStorage:", error);
        }
      }
    }
  }, [isLoggedIn, setUser]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user"); // For backward compatibility
    window.location.href = "/";
  };

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>

        <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
          <Link href='/' className='flex z-40 font-semibold items-center justify-center gap-x-2 rounded-md'>
            <div className='h-5 w-5 bg-black'></div>
            <span>SPONZO</span>
          </Link>

          <div className="hidden items-center space-x-4 sm:flex">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/explore"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Explore
                </Link>
                <Link
                  href="/#howitworks"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  How It Works
                </Link>
                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Login
                </Link>
                <Link
                  href="/brand/signup"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  <TextShine text={"Join as Brand"} />
                </Link>
                <Link
                  href="/creator/signup"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  <TextShine text={"Join as Creator"} />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={user.role === "creator" ? "/creator" : "/brand/dashboard"}
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Dashboard
                </Link>
                <Link
                  href={user.role === "creator" ? "/creator/campaigns" : "/brand/campaigns"}
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Campaigns
                </Link>
                <div className="relative" ref={menuRef}>
                  <div
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        width={32}
                        height={32}
                        alt="Profile"
                        className="rounded-full h-8 w-8 object-cover"
                      />
                    ) : (
                      <UserCircle className="h-8 w-8" />
                    )}
                    <span className="text-sm font-medium">{user.name || user.username}</span>
                  </div>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1">
                      <Link
                        href={user.role === "creator" ? "/creator/profilesetup" : "/brand/profilesetup"}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
