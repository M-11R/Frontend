"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProjectCreationForm from "./projectCreationForm";
import ProjectList from "./projectList";
import axios from "axios";
import { getToken, getUnivId, getUserId } from "../util/storage";

type returnType = {
  RESULT_CODE: number;
  RESULT_MSG: string;
};
type checkType = {
  user_id: string;
  token: string;
};
type pjinit = {
  pname: string;
  pdetails: string;
  psize: number;
  pperiod: string;
  pmm: number;
  univ_id: number;
  wizard: number;
  prof_id: number;
  subject: number
};
type returnPJ = {
  RESULT_CODE: number;
  RESULT_MSG: string;
  PAYLOADS: { PUID: number };
};
type loadPj = {
  RESULT_CODE: number;
  RESULT_MSG: string;
  PAYLOADS: PJ[];
};
type PJ = {
  pid: number;
  pname: string;
  pdetails: string;
  pperiod: string;
};
type univ = {
  univ_id: number;
};

const ClientPage: React.FC = () => {
  const [projects, setProjects] = useState<PJ[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);

    const check: checkType = { user_id: getUserId(), token: getToken() };
    if (check.token !== "") {
      CheckSession({ data: check });
    } else {
      router.push("/");
    }
  }, []);

  const CheckSession = async ({ data }: { data: checkType }) => {
    try {
      const response = await axios.post<returnType>(
        "https://cd-api.chals.kim/api/acc/checksession",
        data,
        { headers: { Authorization: process.env.SECRET_API_KEY } }
      );
      if (response.data.RESULT_CODE === 200) {
        LoadPJ();
        return;
      }
      router.push("/");
    } catch (err) {
      router.push("/");
      alert("로그인 혹은 로그아웃 후 다시 로그인 해주세요.");
    }
  };

  const LoadPJ = async () => {
    const data: univ = { univ_id: getUnivId() };
    try {
      const response = await axios.post<loadPj>(
        "https://cd-api.chals.kim/api/project/load",
        data,
        { headers: { Authorization: process.env.SECRET_API_KEY } }
      );
      if (response.data.RESULT_CODE === 200) {
        setProjects(response.data.PAYLOADS);
      }
    } catch (err) {
      console.error("프로젝트 로드 실패:", err);
    }
  };

  const handleDelete = async (projectId: number) => {
    const data = { pid: projectId };
    try {
      const response = await axios.post(
        "https://cd-api.chals.kim/api/project/delete",
        data,
        { headers: { Authorization: process.env.SECRET_API_KEY } }
      );
      if (response.status === 200) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.pid !== projectId)
        );
        alert("프로젝트가 삭제되었습니다.");
      } else {
        alert("프로젝트 삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("프로젝트 삭제 실패:", err);
      alert("서버와의 통신에 실패했습니다.");
    }
  };

  const fixDate = (date: string) => {
    const rawValue = date;
    const formatted = rawValue.replace(/-/g, "").slice(2);
    return formatted;
  };

  const addProject = (
    name: string,
    description: string,
    startDate: string,
    endDate: string,
    psize: number,
    profId: number
  ) => {
    const newProject: pjinit = {
      pname: name,
      pdetails: description,
      psize: 5,
      pperiod: `${fixDate(startDate)}-${fixDate(endDate)}`,
      pmm: psize,
      univ_id: getUnivId(),
      wizard: 0,
      prof_id: profId,
      subject: 13230
    };
    postPJ(newProject);
  };

  const postPJ = async (data: pjinit) => {
    try {
      const response = await axios.post<returnPJ>(
        "https://cd-api.chals.kim/api/project/init",
        data,
        { headers: { Authorization: process.env.SECRET_API_KEY } }
      );
      if (response.data.RESULT_CODE === 200) {
        router.push(`/project-main/${response.data.PAYLOADS.PUID}`);
      };
    } catch (err) {
      console.error("프로젝트 생성 실패:", err);
    }
  };

  if (!isMounted) return null;

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <header style={{ marginBottom: "20px", textAlign: "center" }}>
        <h1>프로젝트 매니저</h1>
        <Link href="/" style={{ color: "#007bff", textDecoration: "none" }}>
          메인페이지로 이동
        </Link>
      </header>
      <ProjectCreationForm onCreate={addProject} />
      <ProjectList projects={projects} onDelete={handleDelete} />
    </div>
  );
};

export default ClientPage;
