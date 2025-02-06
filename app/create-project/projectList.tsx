"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface ProjectListProps {
  projects: {
    pid: number;
    pname: string;
    pdetails: string;
    pperiod: string;
  }[];
  onDelete: (projectId: number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onDelete }) => {
  const router = useRouter();

  const handleProjectClick = (projectId: number) => {
    router.push(`/project-main/${projectId}/main`);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "20px auto" }}>
      <h2>프로젝트 리스트</h2>
      {projects.length === 0 ? (
        <p style={{ textAlign: "center" }}>생성된 프로젝트가 없습니다.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {projects.map((project) => (
            <div
              key={project.pid}
              style={{
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                position: "relative",
              }}
              onClick={() => handleProjectClick(project.pid)}
            >
              <h3 style={{ color: "#007BFF" }}>{project.pname}</h3>
              <p>{project.pdetails}</p>
              <p>{project.pperiod}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 삭제 클릭 시 부모 이벤트 방지
                  onDelete(project.pid);
                }}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "#ff4d4d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
