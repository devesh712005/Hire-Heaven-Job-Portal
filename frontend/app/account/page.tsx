"use client";
import React from "react";
import { useAppData } from "../context/AppContext";
import Loading from "@/components/loading";

const AccountPage = () => {
  const { isAuth, user, loading } = useAppData();
  if (loading) return <Loading />;
  return (
    <>{user && <div className="w-[90%] md:w-[60%] m-auto">AccountPage</div>}</>
  );
};

export default AccountPage;
