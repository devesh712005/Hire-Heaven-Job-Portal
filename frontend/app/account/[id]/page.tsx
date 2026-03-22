"use client";
import { user_service } from "@/app/context/AppContext";
import { User } from "@/components/type";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Loading from "@/components/loading";
import Info from "../components/info";

const UserAccount = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
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
          <Info user={user} isYourAccount={true} />
        </div>
      )}
    </>
  );
};

export default UserAccount;
