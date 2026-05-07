"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Menu,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Stethoscope,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/hospitals", label: "Hospitals" },
  { href: "/diagnoses", label: "Diagnoses" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  // Check for auth - in real app, this would come from context/session
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Check session storage for auth
    const jwt = sessionStorage.getItem("jwt");
    const name = sessionStorage.getItem("userName");
    const role = sessionStorage.getItem("userRole");
    
    if (jwt) {
      setIsLoggedIn(true);
      setUserName(name || "User");
      setIsAdmin(role === "admin");
    }
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    router.push("/login");
  };

  const isActiveLink = (href: string) => {
    if (href === "/") return router.pathname === "/";
    return router.pathname.startsWith(href);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg shadow-md border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-lg group-hover:blur-xl transition-all" />
              <div className="relative bg-primary p-2 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold text-primary">
              Healix
            </span>
          </Link>

          {/* Desktop Auth Button + Theme Toggle */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{userName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/change-password" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Change Password
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/signup">Get Started</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col h-full">
                {/* Mobile Logo */}
                <div className="flex items-center gap-2 pb-6 border-b">
                  <div className="bg-primary p-2 rounded-lg">
                    <Stethoscope className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold">Healix</span>
                </div>

                {/* Mobile Links */}
                <div className="flex flex-col gap-1 py-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${
                        isActiveLink(link.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Theme Toggle (Mobile) */}
                {mounted && (
                  <div className="px-4 py-3">
                    <Button
                      variant="outline"
                      onClick={toggleTheme}
                      className="w-full justify-start gap-3"
                    >
                      {theme === "dark" ? (
                        <>
                          <Sun className="h-4 w-4" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <Moon className="h-4 w-4" />
                          Dark Mode
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Mobile Auth */}
                <div className="mt-auto pt-6 border-t space-y-3">
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center gap-3 px-4 py-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{userName}</p>
                          <p className="text-sm text-muted-foreground">
                            {isAdmin ? "Administrator" : "Patient"}
                          </p>
                        </div>
                      </div>
                      {isAdmin && (
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          asChild
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href="/admin">Admin Dashboard</Link>
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/login">Sign In</Link>
                      </Button>
                      <Button
                        className="w-full bg-primary"
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}
