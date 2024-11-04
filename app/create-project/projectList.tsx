"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProjectListProps {
  projects: { id: number; name: string; description: string; startDate: string; endDate: string }[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
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

export default ProjectList;