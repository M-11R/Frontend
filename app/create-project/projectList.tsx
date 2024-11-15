'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import todojson from '../json/test.json';

interface ProjectListProps {
  projects: { id: number; name: string; description: string; startDate: string; endDate: string }[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const router = useRouter();

  const handleProjectClick = (projectName: string) => {
    // JSON 파일에서 프로젝트 이름 존재 여부 확인
    const isProjectValid = todojson.pjlist.some((pjlist) => pjlist.Pname === projectName);

    if (isProjectValid) {
      // 프로젝트가 존재하면 해당 주소로 이동
      router.push(`/project-main/${projectName}/main`);
    } else {
      // 프로젝트가 없으면 초기 화면으로 이동
      router.push('/');
    }
  };

  return (
    <div className="project-list-container" style={{ padding: '20px', maxWidth: '800px', margin: '20px auto' }}>
      <h2>프로젝트 리스트</h2>
      {projects.length === 0 ? (
        <p style={{ textAlign: 'center' }}>생성된 프로젝트가 없습니다.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}
              onClick={() => handleProjectClick(project.name)}
            >
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
