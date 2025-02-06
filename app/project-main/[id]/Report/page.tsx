"use client";

import { CSSProperties, useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getUnivId } from "@/app/util/storage";
import usePermissionGuard from "@/app/util/usePermissionGuard";

type postType = {
  rname: string
    rwriter: string
    rdate: string
    pname: string
    pmember: string
    pprof: string
    presearch: string
    pdesign: string
    parch: string
    presult: string
    pconc: string
    pid: number
}

export default function ReportForm(props: any) {
  const [isMounted, setIsMounted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // 상태 변수
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
  usePermissionGuard(props.params.id, s_no, {leader: 1, rp: 1}, true)

  const handlePreview = () => setIsPreview(true);
  const handleEdit = () => setIsPreview(false);

  const handleSave = async () => {
    const data:postType = {
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
          <h1 style={titleStyle}>보고서 작성</h1>

          {!isPreview ? (
            <div>
              {/* 기본 정보 */}
              <Section title="기본 정보">
                <Field label="보고서 제목" value={reportTitle} setter={setReportTitle} />
                <Field label="프로젝트 명" value={projectName} setter={setProjectName} />
                <Field label="작성일" value={submissionDate} setter={setSubmissionDate} type="date" />
                <Field label="작성자" value={writer} setter={setWriter} />
              </Section>

              {/* 상세 정보 */}
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
            <div>
              <h2 style={sectionHeaderStyle}>미리보기</h2>
              <PreviewField label="보고서 제목" value={reportTitle} />
              <PreviewField label="프로젝트 명" value={projectName} />
              <PreviewField label="작성일" value={submissionDate} />
              <PreviewField label="작성자" value={writer} />
              <PreviewField label="팀원 및 지도 교수" value={teamMembers} />
              <PreviewField label="문제 정의" value={problemDefinition} />
              <PreviewField label="연구 목표" value={researchGoal} />
              <PreviewField label="설계 및 개발 과정" value={designProcess} />
              <PreviewField label="시스템 아키텍처" value={systemArchitecture} />
              <PreviewField label="실험 및 결과" value={experimentResults} />
              <PreviewField label="결론" value={conclusion} />

              <div style={{ marginTop: "20px" }}>
                <ActionButton label="수정" onClick={handleEdit} color="#f0ad4e" />
                <ActionButton label="저장" onClick={handleSave} color="#2196F3" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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

const titleStyle: CSSProperties = {
  borderBottom: "3px solid #4CAF50",
  paddingBottom: "10px",
  fontSize: "24px",
  fontWeight: "bold",
  color: "#4CAF50",
};

const sectionHeaderStyle: CSSProperties = {
  color: "#4CAF50",
  borderBottom: "1px solid #ddd",
  marginBottom: "20px",
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: "20px" }}>
    <h2 style={sectionHeaderStyle}>{title}</h2>
    {children}
  </div>
);

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
  <>
    <label style={{ fontWeight: "bold" }}>{label}:</label>
    <input
      type={type}
      value={value}
      onChange={(e) => setter(e.target.value)}
      style={{
        width: "99%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        backgroundColor: "#f9f9f9",
      }}
    />
  </>
);

const TextAreaField = ({
  label,
  value,
  setter,
}: {
  label: string;
  value: string;
  setter: (value: string) => void;
}) => (
  <>
    <label style={{ fontWeight: "bold" }}>{label}:</label>
    <textarea
      value={value}
      onChange={(e) => setter(e.target.value)}
      style={{
        width: "99%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        backgroundColor: "#f9f9f9",
        height: "100px",
        resize: "vertical",
      }}
    />
  </>
);

const PreviewField = ({ label, value }: { label: string; value: string }) => (
  <p>
    <strong>{label}:</strong> {value}
  </p>
);

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
