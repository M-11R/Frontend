"use client";

import { CSSProperties, useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getUnivId } from "@/app/util/storage";
import usePermissionGuard from "@/app/util/usePermissionGuard";

type ReportType = {
  rname: string;
  rwriter: string;
  rdate: string;
  pname: string;
  pmember: string;
  pprof: string;
  presearch: string;
  pdesign: string;
  parch: string;
  presult: string;
  pconc: string;
  pid: number;
};

export default function ReportForm(props: any) {
  const [isMounted, setIsMounted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // ✅ 상태 변수
  const [reportTitle, setReportTitle] = useState("");
  const [projectName, setProjectName] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [writer, setWriter] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [problemDefinition, setProblemDefinition] = useState("");
  const [researchGoal, setResearchGoal] = useState("");
  const [designProcess, setDesignProcess] = useState("");
  const [systemArchitecture, setSystemArchitecture] = useState("");
  const [experimentResults, setExperimentResults] = useState("");
  const [conclusion, setConclusion] = useState("");

  const router = useRouter();
  const s_no = getUnivId();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  usePermissionGuard(props.params.id, s_no, { leader: 1, rp: 1 }, true);

  const handlePreview = () => setIsPreview(true);
  const handleEdit = () => setIsPreview(false);

  const handleSave = async () => {
    const data: ReportType = {
      rname: reportTitle,
      pname: projectName,
      rdate: submissionDate,
      rwriter: writer,
      pmember: teamMembers,
      pprof: problemDefinition,
      presearch: researchGoal,
      pdesign: designProcess,
      parch: systemArchitecture,
      presult: experimentResults,
      pconc: conclusion,
      pid: props.params.id,
    };

    try {
      await axios.post("https://cd-api.chals.kim/api/output/report_add", data, {
        headers: { Authorization: process.env.SECRET_API_KEY },
      });
      router.push(`/project-main/${props.params.id}/outputManagement`);
    } catch (err) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  if (!isMounted) return null;

  return (
    <div style={pageContainerStyle}>
      <MainHeader pid={props.params.id} />
      <div style={flexRowStyle}>
        <MainSide pid={props.params.id} />
        <div style={contentContainerStyle}>
          <h1 style={titleStyle}>📑 보고서 작성</h1>

          {!isPreview ? (
            <div>
              <Section title="기본 정보">
                <Field label="보고서 제목" value={reportTitle} setter={setReportTitle} />
                <Field label="프로젝트 명" value={projectName} setter={setProjectName} />
                <Field label="작성일" value={submissionDate} setter={setSubmissionDate} type="date" />
                <Field label="작성자" value={writer} setter={setWriter} />
              </Section>

              <Section title="세부 내용">
                <TextAreaField label="팀원 및 지도 교수" value={teamMembers} setter={setTeamMembers} />
                <TextAreaField label="문제 정의" value={problemDefinition} setter={setProblemDefinition} />
                <TextAreaField label="연구 목표" value={researchGoal} setter={setResearchGoal} />
                <TextAreaField label="설계 및 개발 과정" value={designProcess} setter={setDesignProcess} />
                <TextAreaField label="시스템 아키텍처" value={systemArchitecture} setter={setSystemArchitecture} />
                <TextAreaField label="실험 및 결과" value={experimentResults} setter={setExperimentResults} />
                <TextAreaField label="결론" value={conclusion} setter={setConclusion} />
              </Section>

              <ActionButton label="미리보기" onClick={handlePreview} color="#4CAF50" />
            </div>
          ) : (
            <ReportPreview
              reportTitle={reportTitle}
              projectName={projectName}
              submissionDate={submissionDate}
              writer={writer}
              teamMembers={teamMembers}
              problemDefinition={problemDefinition}
              researchGoal={researchGoal}
              designProcess={designProcess}
              systemArchitecture={systemArchitecture}
              experimentResults={experimentResults}
              conclusion={conclusion}
              handleEdit={handleEdit}
              handleSave={handleSave}
            />
          )}
        </div>
      </div>
    </div>
  );
}
const ReportPreview = ({
  reportTitle,
  projectName,
  submissionDate,
  writer,
  teamMembers,
  problemDefinition,
  researchGoal,
  designProcess,
  systemArchitecture,
  experimentResults,
  conclusion,
  handleEdit,
  handleSave,
}: any) => (
  <div style={previewContainerStyle}>
    <h2 style={sectionHeaderStyle}>📄 보고서 미리보기</h2>

    <table style={tableStyle}>
      <tbody>
        <tr>
          <th style={thStyle}>보고서 제목</th>
          <td colSpan={3} style={tdStyle}>{reportTitle}</td>
        </tr>
        <tr>
          <th style={thStyle}>프로젝트 명</th>
          <td style={tdStyle}>{projectName}</td>
          <th style={thStyle}>작성일</th>
          <td style={tdStyle}>{submissionDate}</td>
        </tr>
        <tr>
          <th style={thStyle}>작성자</th>
          <td style={tdStyle}>{writer}</td>
          <th style={thStyle}>팀원 및 지도 교수</th>
          <td style={tdStyle}>{teamMembers}</td>
        </tr>
      </tbody>
    </table>

    <table style={tableStyle}>
      <tbody>
        <tr><th colSpan={4} style={thStyle}>문제 정의</th></tr>
        <tr><td colSpan={4} style={tdStyle}>{problemDefinition}</td></tr>
        <tr><th colSpan={4} style={thStyle}>연구 목표</th></tr>
        <tr><td colSpan={4} style={tdStyle}>{researchGoal}</td></tr>
        <tr><th colSpan={4} style={thStyle}>설계 및 개발 과정</th></tr>
        <tr><td colSpan={4} style={tdStyle}>{designProcess}</td></tr>
        <tr><th colSpan={4} style={thStyle}>시스템 아키텍처</th></tr>
        <tr><td colSpan={4} style={tdStyle}>{systemArchitecture}</td></tr>
        <tr><th colSpan={4} style={thStyle}>실험 및 결과</th></tr>
        <tr><td colSpan={4} style={tdStyle}>{experimentResults}</td></tr>
        <tr><th colSpan={4} style={thStyle}>결론</th></tr>
        <tr><td colSpan={4} style={tdStyle}>{conclusion}</td></tr>
      </tbody>
    </table>

    <div style={buttonContainerStyle}>
      <ActionButton label="수정" onClick={handleEdit} color="#f0ad4e" />
      <ActionButton label="저장" onClick={handleSave} color="#2196F3" />
    </div>
  </div>
);


const previewContainerStyle: CSSProperties = { 
  padding: "20px", 
  backgroundColor: "#fff", 
  borderRadius: "12px", 
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  marginTop: "20px"
};

const tableStyle: CSSProperties = { 
  width: "100%", 
  borderCollapse: "collapse", 
  marginBottom: "20px", 
};

const thStyle: CSSProperties = { 
  backgroundColor: "#dbdbdb", 
  padding: "12px", 
  border: "1px solid #000000", 
  textAlign: "center", 
  fontWeight: "bold",
  verticalAlign: "middle",
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",
};

const tdStyle: CSSProperties = { 
  padding: "12px", 
  border: "1px solid #000000", 
  textAlign: "center",
  verticalAlign: "middle",
  backgroundColor: "#fff",
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",
};

const buttonContainerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
  gap: "10px"
};


// ✅ 정보 블록 스타일 (텍스트 위주)
const textBlockStyle: CSSProperties = {
  padding: "12px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  marginBottom: "10px",
  lineHeight: "1.5",
};

// ✅ 페이지 전체 컨테이너
const pageContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "auto",
  backgroundColor: "#f4f4f4",
};

const flexRowStyle: CSSProperties = {
  display: "flex",
  flex: 1,
};

const contentContainerStyle: CSSProperties = {
  padding: "20px",
  width: "100%",
  overflowY: "auto",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  margin: "20px",
};

// ✅ 제목 스타일
const titleStyle: CSSProperties = {
  borderBottom: "3px solid #4CAF50",
  paddingBottom: "10px",
  fontSize: "24px",
  fontWeight: "bold",
  color: "#4CAF50",
};

// ✅ 섹션 헤더 스타일
const sectionHeaderStyle: CSSProperties = {
  color: "#4CAF50",
  borderBottom: "1px solid #ddd",
  marginBottom: "20px",
};

// ✅ 공통 섹션 컴포넌트
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: "20px" }}>
    <h2 style={sectionHeaderStyle}>{title}</h2>
    {children}
  </div>
);

// ✅ 입력 필드 (텍스트/숫자 입력)
const Field = ({
  label,
  value,
  setter,
  type = "text",
}: {
  label: string;
  value: string;
  setter: (value: string) => void;
  type?: string;
}) => (
  <div style={{ marginBottom: "10px" }}>
    <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>{label}:</label>
    <input
      type={type}
      value={value}
      onChange={(e) => setter(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        backgroundColor: "#f9f9f9",
      }}
    />
  </div>
);

// ✅ 텍스트 영역 입력 필드
const TextAreaField = ({
  label,
  value,
  setter,
}: {
  label: string;
  value: string;
  setter: (value: string) => void;
}) => (
  <div style={{ marginBottom: "10px" }}>
    <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>{label}:</label>
    <textarea
      value={value}
      onChange={(e) => setter(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        backgroundColor: "#f9f9f9",
        height: "100px",
        resize: "vertical",
      }}
    />
  </div>
);

// ✅ 미리보기 필드 (출력 전용)
const PreviewField = ({ label, value }: { label: string; value: string }) => (
  <div style={textBlockStyle}>
    <strong>{label}:</strong> {value}
  </div>
);

// ✅ 버튼 공통 스타일
const ActionButton = ({
  label,
  onClick,
  color,
}: {
  label: string;
  onClick: () => void;
  color: string;
}) => (
  <button
    onClick={onClick}
    style={{
      padding: "10px 20px",
      backgroundColor: color,
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      marginRight: "10px",
    }}
  >
    {label}
  </button>
);
