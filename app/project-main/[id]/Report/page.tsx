"use client";

import { useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import axios from "axios";
import { checkNull } from "@/app/util/check";
import { fixDate } from "@/app/util/fixDate";
import { useRouter } from "next/navigation";

export default function ReportForm(props: any) {
  // 상태 관리
  const [isMounted, setIsMounted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const [reportTitle, setReportTitle] = useState("");
  const [projectName, setProjectName] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [writer, setWriter] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [advisor, setAdvisor] = useState("");
  const [problemDefinition, setProblemDefinition] = useState("");
  const [researchGoal, setResearchGoal] = useState("");
  const [designProcess, setDesignProcess] = useState("");
  const [systemArchitecture, setSystemArchitecture] = useState("");
  const [experimentResults, setExperimentResults] = useState("");
  const [conclusion, setConclusion] = useState("");
  const router = useRouter();

  // 클라이언트 렌더링 여부 확인
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 미리보기 핸들러
  const handlePreview = () => setIsPreview(true);

  // 수정 핸들러
  const handleEdit = () => setIsPreview(false);

  // 다운로드 및 API 호출
  const handleDownload = async () => {
    const data = {
      reportTitle,
      projectName,
      submissionDate: fixDate(submissionDate),
      writer,
      teamMembers,
      advisor,
      problemDefinition,
      researchGoal,
      designProcess,
      systemArchitecture,
      experimentResults,
      conclusion,
      pid: props.params.id,
    };

   // const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    // const url = URL.createObjectURL(blob);

    // const link = document.createElement("a");
    // link.href = url;
    // link.download = "report.json";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // URL.revokeObjectURL(url);
    if(checkNull(data)){
      try{
        const response = await axios.post("https://cd-api.chals.kim/api/output/report_add", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
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
      <MainHeader pid={props.params.id} />

      <div style={{ display: "flex", flex: 1 }}>
        <MainSide pid={props.params.id} />

        <div style={{ padding: "20px", width: "100%", overflowY: "auto" }}>
          <h1 style={{ borderBottom: "2px solid #4CAF50", paddingBottom: "10px" }}>보고서 작성</h1>

          {!isPreview ? (
            <div>
              {/* 보고서 정보 입력 */}
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd" }}>기본 정보</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginTop: "10px" }}>
                  <label>보고서 제목:</label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="보고서 제목 입력"
                  />

                  <label>프로젝트 명:</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="프로젝트 명 입력"
                  />

                  <label>작성일:</label>
                  <input
                    type="date"
                    value={submissionDate}
                    onChange={(e) => setSubmissionDate(e.target.value)}
                  />

                  <label>작성자:</label>
                  <input
                    type="text"
                    value={writer}
                    onChange={(e) => setWriter(e.target.value)}
                    placeholder="작성자 이름 입력"
                  />
                </div>
              </div>

              {/* 상세 내용 입력 */}
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd" }}>세부 내용</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginTop: "10px" }}>
                  <label>팀원 및 지도 교수:</label>
                  <textarea
                    value={teamMembers}
                    onChange={(e) => setTeamMembers(e.target.value)}
                    placeholder="팀원 및 지도 교수 정보 입력"
                    style={{ height: "100px" }}
                  />

                  <label>문제 정의 및 연구 목표:</label>
                  <textarea
                    value={problemDefinition}
                    onChange={(e) => setProblemDefinition(e.target.value)}
                    placeholder="문제 정의 및 연구 목표 입력"
                    style={{ height: "100px" }}
                  />

                  <label>설계 및 개발 과정:</label>
                  <textarea
                    value={designProcess}
                    onChange={(e) => setDesignProcess(e.target.value)}
                    placeholder="설계 및 개발 과정 입력"
                    style={{ height: "100px" }}
                  />
                </div>
              </div>

              {/* 결과 섹션 */}
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd" }}>결과 및 결론</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginTop: "10px" }}>
                  <label>시스템 아키텍처:</label>
                  <textarea
                    value={systemArchitecture}
                    onChange={(e) => setSystemArchitecture(e.target.value)}
                    placeholder="시스템 아키텍처 입력"
                    style={{ height: "100px" }}
                  />

                  <label>실험 및 결과:</label>
                  <textarea
                    value={experimentResults}
                    onChange={(e) => setExperimentResults(e.target.value)}
                    placeholder="실험 및 결과 입력"
                    style={{ height: "100px" }}
                  />

                  <label>결론:</label>
                  <textarea
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    placeholder="결론 입력"
                    style={{ height: "100px" }}
                  />
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
                  marginTop: "20px",
                }}
              >
                미리보기
              </button>
            </div>
          ) : (
            <div>
              <h2 style={{ borderBottom: "1px solid #ddd" }}>미리보기</h2>
              <p><strong>보고서 제목:</strong> {reportTitle}</p>
              <p><strong>프로젝트 명:</strong> {projectName}</p>
              <p><strong>작성일:</strong> {submissionDate}</p>
              <p><strong>작성자:</strong> {writer}</p>
              <p><strong>팀원 및 지도 교수:</strong> {teamMembers}</p>
              <p><strong>문제 정의 및 연구 목표:</strong> {problemDefinition}</p>
              <p><strong>설계 및 개발 과정:</strong> {designProcess}</p>
              <p><strong>시스템 아키텍처:</strong> {systemArchitecture}</p>
              <p><strong>실험 및 결과:</strong> {experimentResults}</p>
              <p><strong>결론:</strong> {conclusion}</p>

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
                  저장
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
