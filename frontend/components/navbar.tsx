"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Briefcase,
  Home,
  Info,
  LogOut,
  LogOutIcon,
  Menu,
  User,
  X,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./mode-toggle";
import { useAppData } from "@/app/context/AppContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { isAuth, user, setIsAuth, setUser, loading, logoutUser } =
    useAppData();

  const toggleMenu = () => setIsOpen(!isOpen);

  const logoutHandler = () => {
    logoutUser();
  };

  return (
    <nav className="z-50 sticky top-0 bg-background border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="text-blue-600">Hire</span>
            <span className="text-red-500">Heaven</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/">
              <Button variant="ghost" className="flex gap-2">
                <Home size={16} /> Home
              </Button>
            </Link>

            <Link href="/jobs">
              <Button variant="ghost" className="flex gap-2">
                <Briefcase size={16} /> Jobs
              </Button>
            </Link>

            <Link href="/about">
              <Button variant="ghost" className="flex gap-2">
                <Info size={16} /> About
              </Button>
            </Link>
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3 ">
            {loading ? (
              ""
            ) : (
              <>
                {isAuth ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Avatar
                          className="h-9 w-9 ring-2 ring-offset-2 ring-offset-background
                    ring-blue-500/20 cursor-pointer hover:ring-blue-500/40 transition-all"
                        >
                          <AvatarImage
                            src={user?.profile_pic || undefined}
                            alt={user?.name || "user"}
                          />
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </PopoverTrigger>

                    <PopoverContent align="end" className="w-56 p-2">
                      <div className="px-3 py-2 border-b mb-2">
                        <p className="text-sm font-semibold">
                          {user && user.name}
                        </p>
                        <p className="text-xs opacity-60">
                          {user && user.email}
                        </p>
                      </div>

                      <Link href="/account">
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                        >
                          <User size={16} /> My Profile
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 mt-1"
                        onClick={logoutHandler}
                      >
                        <LogOutIcon size={16} /> Logout
                      </Button>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Link href="/login">
                    <Button className="gap-2">
                      <User size={16} /> Sign In
                    </Button>
                  </Link>
                )}
              </>
            )}

            <ModeToggle />
          </div>

          {/* Mobile Top */}
          <div className="md:hidden flex items-center gap-3">
            <ModeToggle />
            <button onClick={toggleMenu}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden border-t overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-3 py-3 space-y-2 bg-background">
          <Link href="/" onClick={toggleMenu}>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Home size={16} /> Home
            </Button>
          </Link>

          <Link href="/jobs" onClick={toggleMenu}>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Briefcase size={16} /> Jobs
            </Button>
          </Link>

          <Link href="/about" onClick={toggleMenu}>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Info size={16} /> About
            </Button>
          </Link>

          {isAuth ? (
            <>
              <Link href="/account" onClick={toggleMenu}>
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <User size={16} /> Profile
                </Button>
              </Link>

              <Button
                variant="destructive"
                className="w-full justify-start gap-3 bg-red-600 text-white hover:bg-red-400"
                onClick={() => {
                  logoutHandler();
                  toggleMenu();
                }}
              >
                <LogOut size={16} /> Logout
              </Button>
            </>
          ) : (
            <Link href="/login" onClick={toggleMenu}>
              <Button className="w-full justify-start gap-3 mt-2">
                <User size={16} /> Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
