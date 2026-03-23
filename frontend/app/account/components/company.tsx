"use client";
import { job_service, useAppData } from "@/app/context/AppContext";
import Loading from "@/components/loading";
import { Company as CompanyType } from "@/components/type";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import axios from "axios";
import Cookies from "js-cookie";
import { Building2, Eye, Globe, Link, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const Company = () => {
  const { loading } = useAppData();
  const addRef = useRef<HTMLButtonElement | null>(null);
  const openDialog = () => {
    addRef.current?.click();
  };
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const clearData = () => {
    setName("");
    setDescription("");
    setWebsite("");
    setLogo(null);
  };
  const token = Cookies.get("token");
  async function fetchCompanies() {
    try {
      const { data } = await axios.get(`${job_service}/api/job/company/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompanies(data);
    } catch (error) {
      console.log(error);
    }
  }
  async function addCompanyHandler() {
    if (!name || !description || !website || !logo) {
      return alert("Please provide all details");
    }
    const formData = new FormData();
    formData.append("title", name);
    formData.append("description", description);
    formData.append("website", website);
    formData.append("file", logo);

    try {
      setBtnLoading(true);
      const { data } = await axios.post(
        `${job_service}/api/job/add/company`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(data.message);
      clearData();
      fetchCompanies();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setBtnLoading(false);
    }
  }

  async function deleteCompany(id: string) {
    try {
      setBtnLoading(true);
      const { data } = await axios.delete(
        `${job_service}/api/job/company/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success(data.message);
      fetchCompanies();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setBtnLoading(false);
    }
  }
  useEffect(() => {
    fetchCompanies();
  }, []);
  if (loading) return <Loading />;
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 ">
      <Card className="shadow-lg border-2 overflow-hidden">
        <div className="bg-blue-500 p-6 border-b">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="fle items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Building2 size={20} className="text-blue-600 " />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">My Companies</CardTitle>
            <CardDescription className="text-sm mt-1 text-white">
              Manage your registered companies ({companies.length}/3)
            </CardDescription>

            {companies.length < 3 && (
              <Button onClick={openDialog} className="gap-2">
                <Plus size={18} />
                Add Company
              </Button>
            )}
          </div>
        </div>
        <div className="p-6">
          {companies.length > 0 ? (
            <div className="grid-gap-4">
              {companies.map((c) => (
                <div
                  key={c.company_id}
                  className="flex items-center gap-4 p-4 rounded-lg border-2 hover:border-blue-500 transition-all bg-background"
                >
                  <div className="h-16 w-16 rounded-full border-2 overflow-hidden shrink-0 bg-background">
                    <img
                      src={c.logo}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Company Info */}
                  <div className="flex-1 min-w-0 ">
                    <h3 className="font-semibold text-lg mb-1 truncate">
                      {c.name}
                    </h3>
                    <p className="text-sm opacity-70 line-clamp-2 mb-2 ">
                      {c.description}
                    </p>
                    <a
                      href={c.website}
                      target="_blank"
                      className="text-xs text-blue-500 hover:underline flex items-center gap-1 "
                    >
                      <Globe size={12} />
                      {c.website}
                    </a>
                  </div>
                  {/* Actios */}
                  <div className="flex items-center gap-2 shrink-0 ">
                    <Link href={`/company/${c.company_id}`}>
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        className="h-9 w-9"
                      >
                        <Eye size={16} />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Company;
