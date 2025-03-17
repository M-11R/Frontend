"use client";

import { CSSProperties, useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getUnivId } from "@/app/util/storage";
import usePermissionGuard from "@/app/util/usePermissionGuard";

export default function ReportForm(props: any) {
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
  usePermissionGuard(props.params.id, s_no, { leader: 1, rp: 1 }, true);

  const handleSave = async () => {
    const data = {
      rname: reportTitle,
      pname: projectName,
      rdate: submissionDate,
      rwriter: writer,
      pmember: teamMembers,
      pprof: "",
      presearch: `${problemDefinition}\n${researchGoal}`,
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

  return (
    <div style={containerStyle}>
      <MainHeader pid={props.params.id} />
      <div style={layoutStyle}>
        <MainSide pid={props.params.id} />
        <div style={contentStyle}>
          <h2 style={titleStyle}>📑 보고서 작성2</h2>

          <table style={tableStyle}>
            <tbody>
              <tr><td colSpan={4} style={sectionHeaderStyle}>📌 기본 정보</td></tr>
              <tr>
                <td style={thStyle}>보고서 제목</td>
                <td colSpan={3} style={tdStyle}><Field value={reportTitle} setter={setReportTitle} /></td>
              </tr>
              <tr>
                <td style={thStyle}>프로젝트 명</td>
                <td colSpan={3} style={tdStyle}><Field value={projectName} setter={setProjectName} /></td>
              </tr>
              <tr>
                <td style={thStyle}>작성일</td>
                <td style={tdStyle}><Field type="date" value={submissionDate} setter={setSubmissionDate} /></td>
                <td style={thStyle}>작성자</td>
                <td style={tdStyle}><Field value={writer} setter={setWriter} /></td>
              </tr>

              <tr><td colSpan={4} style={sectionHeaderStyle}>📌 보고서 세부 내용</td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField label="팀원 및 지도 교수" value={teamMembers} setter={setTeamMembers} /></td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField label="문제 정의" value={problemDefinition} setter={setProblemDefinition} /></td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField label="연구 목표" value={researchGoal} setter={setResearchGoal} /></td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField label="설계 및 개발 과정" value={designProcess} setter={setDesignProcess} /></td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField label="시스템 아키텍처" value={systemArchitecture} setter={setSystemArchitecture} /></td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField label="실험 및 결과" value={experimentResults} setter={setExperimentResults} /></td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField label="결론" value={conclusion} setter={setConclusion} /></td></tr>
            </tbody>
          </table>

          <div style={buttonContainerStyle}>
            <ActionButton label="저장" onClick={handleSave} color="#2196F3" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ✅ 스타일 정의 */
const containerStyle: CSSProperties = { display: "flex", flexDirection: "column", width: "100%" };
const layoutStyle: CSSProperties = { display: "flex", width: "100%" };
const contentStyle: CSSProperties = { padding: "20px", backgroundColor: "#fff", maxWidth: "2100px", width: "100%" };
const titleStyle: CSSProperties = { fontSize: "24px", fontWeight: "bold", color: "#4CAF50", textAlign: "center", marginBottom: "20px" };
const tableStyle: CSSProperties = { width: "100%", borderCollapse: "collapse" };
const sectionHeaderStyle: CSSProperties = { backgroundColor: "#ddd", padding: "14px", border: "1px solid black", fontWeight: "bold", textAlign: "center" };
const thStyle: CSSProperties = { backgroundColor: "#ddd", padding: "14px", border: "1px solid black", fontWeight: "bold", textAlign: "center" };
const tdStyle: CSSProperties = { padding: "18px", border: "1px solid black", textAlign: "left" };
const buttonContainerStyle: CSSProperties = { display: "flex", justifyContent: "center", marginTop: "20px" };



/* ✅ 컴포넌트 정의 */
const Field = ({ value, setter, type = "text" }: { value: string; setter: (value: string) => void; type?: string }) => (
  <input type={type} value={value} onChange={(e) => setter(e.target.value)} style={{ width: "98%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />
);

const TextAreaField = ({ label, value, setter }: { label: string; value: string; setter: (value: string) => void }) => (
  <div>
    <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>{label}:</label>
    <textarea value={value} onChange={(e) => setter(e.target.value)} style={{ width: "99%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", height: "100px" }} />
  </div>
);

const ActionButton = ({ label, onClick, color }: { label: string; onClick: () => void; color: string }) => (
  <button onClick={onClick} style={{ backgroundColor: color, color: "#fff", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}>{label}</button>
);
