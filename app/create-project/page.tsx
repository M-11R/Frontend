"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProjectCreationForm from './projectCreationForm';
import axios from 'axios';
import { getToken, getUnivId, getUserId } from '../util/storage';

// Project 인터페이스 정의
interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

type returnType = {
  "RESULT_CODE": number, 
  "RESULT_MSG": string
}
type checkType = {
  "user_id": string,
  "token": string
}
type pjinit = {
    pname: string,
    pdetails: string,
    psize: number,
    pperiod: string,
    pmm: number,
    univ_id: number
}
type returnPJ = {
  "RESULT_CODE": number,
  "RESULT_MSG": string,
  "PAYLOADS": {"PUID": number},
}
type loadPj = {
  "RESULT_CODE": number, 
  "RESULT_MSG": string, 
  "PAYLOADS": PJ[]
}
type PJ = {
  "pid": number,
  "pname": string,
  "pdetails": string,
  "psize": number,
  "pperiod": string,
  "pmm": number,
}

// ProjectList 컴포넌트 정의
const ProjectList: React.FC<{ projects: PJ[] }> = ({ projects }) => {
  const router = useRouter();

  const handleProjectClick = (projectName: string) => {
    router.push(`/project-main/${projectName}/main`);
  };

  return (
    <div className="project-list-container" style={{ padding: '20px', maxWidth: '800px', margin: '20px auto' }}>
      <h2>프로젝트 리스트</h2>
      {projects.length === 0 ? (
        <p style={{ textAlign: 'center' }}>생성된 프로젝트가 없습니다.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {projects.map((project) => (
            <div key={project.pid} className="project-card" style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }} onClick={() => handleProjectClick(project.pname)}>
              <h3>{project.pname}</h3>
              <p>설명: {project.pdetails}</p>
              <p>시작일: {project.pperiod}</p>
              <p>마감일: {project.pperiod}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ClientPage 컴포넌트 정의
const ClientPage: React.FC = () => {
  const [projects, setProjects] = useState<PJ[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    LoadPJ();
    const check: checkType = {user_id: getUserId(), token: getToken()};
    CheckSession({data: check});
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const CheckSession = async({data}: {data: checkType}) => {
    try{
        const response = await axios.post<returnType>("https://cd-api.chals.kim/api/acc/checksession", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
        if(response.data.RESULT_CODE === 200){
          return;
        }
        router.push('/');
    }catch(err){
        router.push('/');
        alert("로그인 혹은 로그아웃 후 다시 로그인 해주세요.");
    };
  }

  const LoadPJ = async() => {
    const data = getUnivId;
    try{
      const response = await axios.post<loadPj>("https://cd-api.chals.kim/api/project/load", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
      if(response.data.RESULT_CODE === 200){
        setProjects(response.data.PAYLOADS)
      }
    }catch(err){
      console.log(err)
    }
  }

  const fixDate = (date: string) => {
    const rawValue = date;
    const formatted = rawValue.replace(/-/g, '').slice(2);
    return formatted;
  }

  const addProject = (name: string, description: string, startDate: string, endDate: string) => {
    // const newProject = {
    //   id: Date.now(),
    //   name,
    //   description,
    //   startDate,
    //   endDate,
    // };
    
    const newProject: pjinit = {
      pname: name,
      pdetails: description,
      psize: 5,
      pperiod: `${fixDate(startDate)}-${fixDate(endDate)}`,
      pmm: 0,
      univ_id: getUnivId()
    }
    postPJ(newProject);
    // const updatedProjects = [...projects, newProject];
    // setProjects(updatedProjects);
    // localStorage.setItem('projects', JSON.stringify(updatedProjects));

    // 프로젝트 생성 후 특정 경로로 이동
    // router.push('/project-main/main');
  };

  const postPJ = async(data: pjinit) => {
    try{
      const response = await axios.post<returnPJ>("https://cd-api.chals.kim/api/project/init", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
      if(response.data.RESULT_CODE === 200){
        router.push(`/project-main/${response.data.PAYLOADS.PUID}`);
      }
    }catch(err){
      console.log(data);
    }
  }

  if (!isMounted) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1>프로젝트 매니저.</h1>
        <Link href="/" style={{ color: '#007bff', textDecoration: 'none' }}>
          메인 페이지로 이동
        </Link>
      </header>
      <ProjectCreationForm onCreate={addProject} />
      <ProjectList projects={projects} />
    </div>
  );
};

export default ClientPage;
