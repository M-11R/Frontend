"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProjectCreationForm from './projectCreationForm';

interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

const ProjectList: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const router = useRouter();

  const handleProjectClick = (projectId: number) => {
    router.push(`/projects/${projectId}/mainside`);
  };

  return (
    <div className="project-list-container" style={{ padding: '20px', maxWidth: '800px', margin: '20px auto' }}>
      <h2>프로젝트 리스트</h2>
      {projects.length === 0 ? (
        <p style={{ textAlign: 'center' }}>생성된 프로젝트가 없습니다.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {projects.map((project) => (
            <div key={project.id} className="project-card" style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }} onClick={() => handleProjectClick(project.id)}>
              <h3>{project.name}</h3>
              <p>설명: {project.description}</p>
              <p>시작일: {project.startDate}</p>
              <p>마감일: {project.endDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ClientPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isMounted, setIsMounted] = useState(false); // 클라이언트 마운트 상태 체크

  useEffect(() => {
    // 클라이언트에서만 실행
    setIsMounted(true);
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const addProject = (name: string, description: string, startDate: string, endDate: string) => {
    const newProject = {
      id: Date.now(),
      name,
      description,
      startDate,
      endDate,
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  // 클라이언트가 마운트되기 전에는 아무것도 렌더링하지 않음
  if (!isMounted) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1>프로젝트 매니저</h1>
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