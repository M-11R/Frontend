"use client";

import { useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import axios from "axios";
import { fixDate } from "@/app/util/fixDate";
import { checkNull } from "@/app/util/check";
import { useRouter } from "next/navigation";

export default function ProjectOverview(props: any) {
  // 상태 관리
  const [isMounted, setIsMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [roles, setRoles] = useState("");
  const [writeDate, setWriteDate] = useState("");
  const [overview, setOverview] = useState("");
  const [goal, setGoal] = useState("");
  const [scope, setScope] = useState("");
  const [techStack, setTechStack] = useState("");
  const [expectedOutcomes, setExpectedOutcomes] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const router = useRouter();
  // 클라이언트 렌더링 여부 확인
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 미리보기 핸들러
  const handlePreview = () => {
    setIsPreview(true);
  };

  // 수정 핸들러
  const handleEdit = () => {
    setIsPreview(false);
  };

  // 다운로드 핸들러
  const handleDownload = async() => {
    const data = {
      pname: title,
      poutcomes: expectedOutcomes,
      poverview: overview,
      pteam: teamMembers,
      pgoals: goal,
      pstart: fixDate(startDate),
      pend: fixDate(endDate),
      prange: scope,
      pstack: techStack,
      pid: props.params.id,
    };
    // const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    // const url = URL.createObjectURL(blob);

    // const link = document.createElement("a");
    // link.href = url;
    // link.download = "project_overview.json";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // URL.revokeObjectURL(url);
    if(checkNull(data)){
      try{
        const response = await axios.post("https://cd-api.chals.kim/api/output/ovr_doc_add", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
        router.push(`/project-main/${props.params.id}/outputManagement`);
      }catch(err){
  
      }
    }else{
      alert("데이터를 모두 입력해주세요.");
    }
    
  };

  if (!isMounted) {
    return null; // 서버와 클라이언트 불일치 방지
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* 메인 헤더 */}
      <MainHeader pid={props.params.id} />

      <div style={{ display: "flex", flex: 1 }}>
        {/* 사이드 메뉴 */}
        <MainSide pid={props.params.id} />

        {/* 메인 콘텐츠 */}
        <div style={{ padding: "20px", width: "100%", overflowY: "auto" }}>
          <h1 style={{ borderBottom: "2px solid #4CAF50", paddingBottom: "10px" }}>프로젝트 개요서</h1>

          {!isPreview ? (
            <div>
              {/* 기본 정보 섹션 */}
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd" }}>기본 정보</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginTop: "10px" }}>
                  <label>제목:</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="프로젝트 제목" />

                  <label>시작일:</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

                  <label>종료일:</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              {/* 팀 구성 섹션 */}
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd" }}>팀 구성</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginTop: "10px" }}>
                  <label>팀원:</label>
                  <input type="text" value={teamMembers} onChange={(e) => setTeamMembers(e.target.value)} placeholder="팀원 이름" />

                  <label>역할:</label>
                  <input type="text" value={roles} onChange={(e) => setRoles(e.target.value)} placeholder="팀 내 역할" />
                </div>
              </div>

              {/* 세부사항 섹션 */}
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd" }}>프로젝트 세부사항</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginTop: "10px" }}>
                  <label>작성일:</label>
                  <input type="date" value={writeDate} onChange={(e) => setWriteDate(e.target.value)} />

                  <label>개요:</label>
                  <textarea value={overview} onChange={(e) => setOverview(e.target.value)} placeholder="프로젝트 개요" style={{ height: "100px" }} />

                  <label>목표:</label>
                  <textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="프로젝트 목표" style={{ height: "100px" }} />
                </div>
              </div>

              {/* 기술 및 결과 섹션 */}
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd" }}>기술 및 결과</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginTop: "10px" }}>
                  <label>범위:</label>
                  <textarea value={scope} onChange={(e) => setScope(e.target.value)} placeholder="프로젝트 범위" style={{ height: "100px" }} />

                  <label>기술 스택:</label>
                  <input type="text" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="사용된 기술 스택" />

                  <label>예상 결과:</label>
                  <textarea value={expectedOutcomes} onChange={(e) => setExpectedOutcomes(e.target.value)} placeholder="예상 결과" style={{ height: "100px" }} />
                </div>
              </div>

              {/* 미리보기 버튼 */}
              <button
                onClick={handlePreview}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                미리보기
              </button>
            </div>
          ) : (
            <div>
              <h2 style={{ borderBottom: "1px solid #ddd" }}>미리보기</h2>
              <div style={{ marginBottom: "20px" }}>
                <strong>제목:</strong> {title}
              </div>
              <div>
                <strong>시작일:</strong> {startDate}
              </div>
              <div>
                <strong>종료일:</strong> {endDate}
              </div>
              <div>
                <strong>팀원:</strong> {teamMembers}
              </div>
              <div>
                <strong>역할:</strong> {roles}
              </div>
              <div>
                <strong>작성일:</strong> {writeDate}
              </div>
              <div>
                <strong>개요:</strong> {overview}
              </div>
              <div>
                <strong>목표:</strong> {goal}
              </div>
              <div>
                <strong>범위:</strong> {scope}
              </div>
              <div>
                <strong>기술 스택:</strong> {techStack}
              </div>
              <div>
                <strong>예상 결과:</strong> {expectedOutcomes}
              </div>

              {/* 수정 및 다운로드 버튼 */}
              <div style={{ marginTop: "20px" }}>
                <button
                  onClick={handleEdit}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#f0ad4e",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  수정
                </button>
                <button
                  onClick={handleDownload}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  다운로드
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
