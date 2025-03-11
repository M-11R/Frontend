"use client";

import { CSSProperties, useState } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getUnivId } from "@/app/util/storage";
import usePermissionGuard from "@/app/util/usePermissionGuard";

export default function ProjectOverview(props: any) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [roles, setRoles] = useState("");
  const [overview, setOverview] = useState("");
  const [goal, setGoal] = useState("");
  const [scope, setScope] = useState("");
  const [techStack, setTechStack] = useState("");
  const [expectedOutcomes, setExpectedOutcomes] = useState("");

  const router = useRouter();
  const s_no = getUnivId();

  usePermissionGuard(props.params.id, s_no, { leader: 1, od: 1 }, true);

  const handleSave = async () => {
    const data = {
      pname: title,
      pteam: teamMembers,
      poverview: overview,
      poutcomes: expectedOutcomes,
      pgoals: goal,
      pstart: startDate,
      pend: endDate,
      prange: scope,
      pstack: techStack,
      pid: props.params.id,
    };

    if (Object.values(data).some((value) => !value)) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      await axios.post("https://cd-api.chals.kim/api/output/ovr_doc_add", data, {
        headers: { Authorization: process.env.SECRET_API_KEY },
      });
      router.push(`/project-main/${props.params.id}/outputManagement`);
    } catch (err) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={contentContainerStyle}>
      <MainHeader pid={props.params.id} />
      <div style={flexRowStyle}>
        <MainSide pid={props.params.id} />
        <div style={contentContainerStyle}>
          <h1 style={titleStyle}>📌 프로젝트 개요서</h1>

          {/* 문서 스타일 적용된 출력 */}
          <table style={tableStyle}>
            <tbody>
              <tr><td style={thStyle}>제 목</td><td colSpan={3} style={tdStyle}><Field value={title} setter={setTitle} /></td></tr>
              <tr>
                <td style={thStyle}>프로젝트 시작일</td>
                <td style={tdStyle}><Field type="date" value={startDate} setter={setStartDate} /></td>
                <td style={thStyle} rowSpan={2}>팀 구성 및 역할 분담</td>
                <td style={tdStyle} rowSpan={2}>
                  <Field value={teamMembers} setter={setTeamMembers} />
                  <Field value={roles} setter={setRoles} />
                </td>
              </tr>
              <tr>
                <td style={thStyle}>프로젝트 종료일</td>
                <td style={tdStyle}><Field type="date" value={endDate} setter={setEndDate} /></td>
              </tr>
              <tr><td style={thStyle}>작성일</td><td colSpan={3} style={tdStyle}></td></tr>
              <tr><td style={thStyle}>프로젝트 개요</td><td colSpan={3} style={tdStyle}><TextAreaField value={overview} setter={setOverview} /></td></tr>
              <tr><td style={thStyle}>프로젝트 목표</td><td colSpan={3} style={tdStyle}><TextAreaField value={goal} setter={setGoal} /></td></tr>
              <tr><td style={thStyle}>프로젝트 범위</td><td colSpan={3} style={tdStyle}><TextAreaField value={scope} setter={setScope} /></td></tr>
              <tr><td style={thStyle}>기술 스택 및 도구</td><td colSpan={3} style={tdStyle}><Field value={techStack} setter={setTechStack} /></td></tr>
              <tr><td style={thStyle}>기대 성과</td><td colSpan={3} style={tdStyle}><TextAreaField value={expectedOutcomes} setter={setExpectedOutcomes} /></td></tr>
            </tbody>
          </table>

          {/* 저장 버튼 */}
          <div style={buttonContainerStyle}>
            <ActionButton label="저장" onClick={handleSave} color="#2196F3" />
          </div>
        </div>
      </div>
    </div>
  );
}

const outerContainerStyle: CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center", width: "100%" };
const contentContainerStyle: CSSProperties = { padding: "20px", backgroundColor: "#fff", maxWidth: "1400px", width: "100%" };
const flexRowStyle: CSSProperties = { display: "flex", justifyContent: "center", width: "100%" };
const titleStyle: CSSProperties = { fontSize: "28px", fontWeight: "bold", color: "#4CAF50" };
const tableStyle: CSSProperties = { width: "100%", borderCollapse: "collapse", maxWidth: "1200px", margin: "auto" };
const thStyle: CSSProperties = { backgroundColor: "#ddd", padding: "16px", border: "1px solid black", fontWeight: "bold", textAlign: "center" };
const tdStyle: CSSProperties = { padding: "16px", border: "1px solid black", textAlign: "left" };
const buttonContainerStyle: CSSProperties = { display: "flex", justifyContent: "center", marginTop: "20px" };

const Field = ({ value, setter, type = "text" }: { value: string; setter: (value: string) => void; type?: string }) => (
  <input type={type} value={value} onChange={(e) => setter(e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "5px" }} />
);

const TextAreaField = ({ value, setter }: { value: string; setter: (value: string) => void }) => (
  <textarea value={value} onChange={(e) => setter(e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "5px", height: "120px" }} />
);

const ActionButton = ({ label, onClick, color }: { label: string; onClick: () => void; color: string }) => (
  <button onClick={onClick} style={{ backgroundColor: color, color: "#fff", padding: "12px 24px", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>{label}</button>
);
