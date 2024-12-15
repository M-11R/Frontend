"use client";

import { useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";

export default function ReportForm(props: any) {
  // 상태 관리
  const [isMounted, setIsMounted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const [reportTitle, setReportTitle] = useState("");
  const [teamName, setTeamName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [advisor, setAdvisor] = useState("");
  const [problemDefinition, setProblemDefinition] = useState("");
  const [researchGoal, setResearchGoal] = useState("");
  const [designProcess, setDesignProcess] = useState("");
  const [systemArchitecture, setSystemArchitecture] = useState("");
  const [experimentResults, setExperimentResults] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [references, setReferences] = useState("");
  const [appendices, setAppendices] = useState("");

  // 클라이언트 렌더링 여부 확인
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 미리보기 핸들러
  const handlePreview = () => setIsPreview(true);

  // 수정 핸들러
  const handleEdit = () => setIsPreview(false);

  // 다운로드 핸들러
  const handleDownload = () => {
    const data = {
      제목: reportTitle,
      팀명: teamName,
      프로젝트명: projectName,
      작성일: submissionDate,
      소개: introduction,
      팀원: teamMembers,
      지도교수: advisor,
      문제정의: problemDefinition,
      연구목표: researchGoal,
      설계및개발과정: designProcess,
      시스템아키텍처: systemArchitecture,
      실험및결과: experimentResults,
      결론: conclusion,
      참고문헌: references,
      부록: appendices,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "report.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
                  <label>제목:</label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="제목 입력"
                  />

                  <label>팀명:</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="팀명 입력"
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
                </div>
              </div>

              {/* 상세 내용 입력 */}
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd" }}>세부 내용</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginTop: "10px" }}>
                  <label>소개:</label>
                  <textarea
                    value={introduction}
                    onChange={(e) => setIntroduction(e.target.value)}
                    placeholder="소개 내용 입력"
                    style={{ height: "100px" }}
                  />

                  <label>팀원:</label>
                  <input
                    type="text"
                    value={teamMembers}
                    onChange={(e) => setTeamMembers(e.target.value)}
                    placeholder="팀원 입력"
                  />

                  <label>지도 교수:</label>
                  <input
                    type="text"
                    value={advisor}
                    onChange={(e) => setAdvisor(e.target.value)}
                    placeholder="지도 교수 입력"
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd" }}>연구 세부사항</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginTop: "10px" }}>
                  <label>문제 정의:</label>
                  <textarea
                    value={problemDefinition}
                    onChange={(e) => setProblemDefinition(e.target.value)}
                    placeholder="문제 정의 입력"
                    style={{ height: "100px" }}
                  />

                  <label>연구 목표:</label>
                  <textarea
                    value={researchGoal}
                    onChange={(e) => setResearchGoal(e.target.value)}
                    placeholder="연구 목표 입력"
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

              {/* 결과 및 참고문헌 */}
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd" }}>결과 및 참고문헌</h2>
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

                  <label>참고문헌:</label>
                  <textarea
                    value={references}
                    onChange={(e) => setReferences(e.target.value)}
                    placeholder="참고문헌 입력"
                    style={{ height: "100px" }}
                  />

                  <label>부록:</label>
                  <textarea
                    value={appendices}
                    onChange={(e) => setAppendices(e.target.value)}
                    placeholder="부록 입력"
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
              <p><strong>제목:</strong> {reportTitle}</p>
              <p><strong>팀명:</strong> {teamName}</p>
              <p><strong>프로젝트 명:</strong> {projectName}</p>
              <p><strong>작성일:</strong> {submissionDate}</p>
              <p><strong>소개:</strong> {introduction}</p>
              <p><strong>팀원:</strong> {teamMembers}</p>
              <p><strong>지도 교수:</strong> {advisor}</p>
              <p><strong>문제 정의:</strong> {problemDefinition}</p>
              <p><strong>연구 목표:</strong> {researchGoal}</p>
              <p><strong>설계 및 개발 과정:</strong> {designProcess}</p>
              <p><strong>시스템 아키텍처:</strong> {systemArchitecture}</p>
              <p><strong>실험 및 결과:</strong> {experimentResults}</p>
              <p><strong>결론:</strong> {conclusion}</p>
              <p><strong>참고문헌:</strong> {references}</p>
              <p><strong>부록:</strong> {appendices}</p>

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
