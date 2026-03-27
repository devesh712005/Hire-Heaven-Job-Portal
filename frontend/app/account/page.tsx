"use client";
import React, { useEffect } from "react";
import { useAppData } from "../context/AppContext";
import Loading from "@/components/loading";
import Info from "./components/info";
import Skills from "./components/skills";
import Company from "./components/company";
import { useRouter } from "next/navigation";
import AppliedJobs from "./components/appliedJobs";

const AccountPage = () => {
  const { isAuth, user, loading, applications, fetchApplications } =
    useAppData();

  const router = useRouter();

  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login");
    }
  }, [isAuth, router, loading]);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  if (loading) return <Loading />;

  return (
    <>
      {user && (
        <div className="w-[90%] md:w-[60%] m-auto">
          <Info user={user} isYourAccount={true} />

          {user.role === "jobseeker" && (
            <Skills user={user} isYourAccount={true} />
          )}

          {/* ✅ safer rendering */}
          {user.role === "jobseeker" && applications && (
            <AppliedJobs applications={applications} />
          )}

          {user.role === "recruiter" && <Company />}
        </div>
      )}
    </>
  );
};

export default AccountPage;
