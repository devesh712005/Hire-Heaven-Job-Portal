"use client";
import { useAppData, user_service } from "@/app/context/AppContext";
import { User } from "@/components/type";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import Cookies from "js-cookie";
import Loading from "@/components/loading";
import Info from "../components/info";
import Skills from "../components/skills";

const UserAccount = () => {
  const { loading } = useAppData();
  const [user, setUser] = useState<User | null>(null);
  const { id } = useParams();
  const token = Cookies.get("token");
  async function fetchUser() {
    try {
      const { data } = await axios.get(`${user_service}/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data);
    } catch (error) {
      console.log(error);
    } finally {
    }
  }
  useEffect(() => {
    fetchUser();
  }, [id]);
  if (loading) return <Loading />;
  return (
    <>
      {user && (
        <div className="w-[90%] md:w-[60%] m-auto">
          <Info user={user} isYourAccount={false} />
          {user.role === "jobseeker" && (
            <Skills user={user} isYourAccount={false} />
          )}
        </div>
      )}
    </>
  );
};

export default UserAccount;
