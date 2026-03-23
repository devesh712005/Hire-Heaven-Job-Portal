"use client";
import { job_service, useAppData } from "@/app/context/AppContext";
import axios from "axios";
import Cookies from "js-cookie";
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
  const [bgnLoading, setBtnLoading] = useState("");
  const [companies, setCompanies] = useState([]);
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
  }
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

  useEffect(() => {
    fetchCompanies();
  }, []);
  return <div>Company</div>;
};

export default Company;
