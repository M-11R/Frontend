"use client";

import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import { useState } from "react";

export default function ReportForm(props: any) {
  // 상태 관리
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

  // 미리보기 토글
  const handlePreviewToggle = () => setIsPreview(!isPreview);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <MainHeader pid={props.params.id} />

      <div style={{ display: "flex", flex: 1 }}>
        <MainSide pid={props.params.id} />

        <div style={{ padding: "20px", width: "100%", overflowY: "auto" }}>
          {!isPreview ? (
            <div>
              <h1 style={{ borderBottom: "2px solid #4CAF50", paddingBottom: "10px" }}>보고서 작성</h1>

              {/* 제목 */}
              <div style={{ marginBottom: "20px" }}>
                <label>제목:</label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="제목 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>

              {/* 팀명 */}
              <div style={{ marginBottom: "20px" }}>
                <label>팀명:</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="팀명 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>

              {/* 프로젝트 명 */}
              <div style={{ marginBottom: "20px" }}>
                <label>프로젝트 명:</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="프로젝트 명 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>

              {/* 작성일 */}
              <div style={{ marginBottom: "20px" }}>
                <label>작성일:</label>
                <input
                  type="date"
                  value={submissionDate}
                  onChange={(e) => setSubmissionDate(e.target.value)}
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>

              {/* 소개 */}
              <div style={{ marginBottom: "20px" }}>
                <label>소개:</label>
                <textarea
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  placeholder="소개 내용 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px", height: "100px" }}
                />
              </div>

              {/* 팀원 */}
              <div style={{ marginBottom: "20px" }}>
                <label>팀원:</label>
                <input
                  type="text"
                  value={teamMembers}
                  onChange={(e) => setTeamMembers(e.target.value)}
                  placeholder="팀원 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>

              {/* 지도 교수 */}
              <div style={{ marginBottom: "20px" }}>
                <label>지도 교수:</label>
                <input
                  type="text"
                  value={advisor}
                  onChange={(e) => setAdvisor(e.target.value)}
                  placeholder="지도 교수 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>

              {/* 문제 정의 */}
              <div style={{ marginBottom: "20px" }}>
                <label>문제 정의:</label>
                <textarea
                  value={problemDefinition}
                  onChange={(e) => setProblemDefinition(e.target.value)}
                  placeholder="문제 정의 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px", height: "100px" }}
                />
              </div>

              {/* 연구 목표 */}
              <div style={{ marginBottom: "20px" }}>
                <label>연구 목표:</label>
                <textarea
                  value={researchGoal}
                  onChange={(e) => setResearchGoal(e.target.value)}
                  placeholder="연구 목표 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px", height: "100px" }}
                />
              </div>

              {/* 설계 및 개발 과정 */}
              <div style={{ marginBottom: "20px" }}>
                <label>설계 및 개발 과정:</label>
                <textarea
                  value={designProcess}
                  onChange={(e) => setDesignProcess(e.target.value)}
                  placeholder="설계 및 개발 과정 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px", height: "100px" }}
                />
              </div>

              {/* 시스템 아키텍처 */}
              <div style={{ marginBottom: "20px" }}>
                <label>시스템 아키텍처:</label>
                <textarea
                  value={systemArchitecture}
                  onChange={(e) => setSystemArchitecture(e.target.value)}
                  placeholder="시스템 아키텍처 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px", height: "100px" }}
                />
              </div>

              {/* 실험 및 결과 */}
              <div style={{ marginBottom: "20px" }}>
                <label>실험 및 결과:</label>
                <textarea
                  value={experimentResults}
                  onChange={(e) => setExperimentResults(e.target.value)}
                  placeholder="실험 및 결과 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px", height: "100px" }}
                />
              </div>

              {/* 결론 */}
              <div style={{ marginBottom: "20px" }}>
                <label>결론:</label>
                <textarea
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  placeholder="결론 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px", height: "100px" }}
                />
              </div>

              {/* 참고문헌 */}
              <div style={{ marginBottom: "20px" }}>
                <label>참고문헌:</label>
                <textarea
                  value={references}
                  onChange={(e) => setReferences(e.target.value)}
                  placeholder="참고문헌 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px", height: "100px" }}
                />
              </div>

              {/* 부록 */}
              <div style={{ marginBottom: "20px" }}>
                <label>부록:</label>
                <textarea
                  value={appendices}
                  onChange={(e) => setAppendices(e.target.value)}
                  placeholder="부록 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px", height: "100px" }}
                />
              </div>

              <button
                onClick={handlePreviewToggle}
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
              <h1 style={{ borderBottom: "2px solid #4CAF50", paddingBottom: "10px" }}>보고서 미리보기</h1>
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
              <button
                onClick={handlePreviewToggle}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f0ad4e",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "20px",
                }}
              >
                수정
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
