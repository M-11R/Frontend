"use client";

import { CSSProperties, useState } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getUnivId } from "@/app/util/storage";
import usePermissionGuard from "@/app/util/usePermissionGuard";

type postType = {
  feature_name: string
    description: string
    priority: number
    non_functional_requirement_name: string
    non_functional_description: string
    non_functional_priority: number
    system_item: string
    system_description: string
    pid: number
    doc_r_no: number
}

export default function RequirementsForm(props: any) {
  const [creationDate, setCreationDate] = useState("");
  const [systemRequirements, setSystemRequirements] = useState("");
  const [systemDes, setSystemDes] = useState("");
  const [functionalRequirements, setFunctionalRequirements] = useState("");
  const [functionalDes, setFunctionalDes] = useState("");
  const [functionalRequirementsPriority, setFunctionalRequirementsPriority] = useState<number>(1);
  const [nonFunctionalRequirements, setNonFunctionalRequirements] = useState("");
  const [nonFunctionalDes, setNonFunctionalDes] = useState("");
  const [nonFunctionalRequirementsPriority, setNonFunctionalRequirementsPriority] = useState<number>(1);

  const router = useRouter();
  const s_no = getUnivId();

  usePermissionGuard(props.params.id, s_no, { leader: 1, rs: 1 }, true);

  const handleSave = async () => {
    const data: postType = {
      feature_name: functionalRequirements,
      description: functionalDes,
      priority: functionalRequirementsPriority,
      non_functional_requirement_name: nonFunctionalRequirements,
      non_functional_description: nonFunctionalDes,
      non_functional_priority: nonFunctionalRequirementsPriority,
      system_item: systemRequirements,
      system_description: systemDes,
      pid: props.params.id,
      doc_r_no: 0
      // system_item: systemRequirements,
      // feature_name: functionalRequirements,
      // priority: functionalRequirementsPriority,
      // non_functional_requirement_name: nonFunctionalRequirements,
      // non_functional_priority: nonFunctionalRequirementsPriority,
      // pid: props.params.id,
    };

    try {
      await axios.post("https://cd-api.chals.kim/api/output/reqspec_add", data, {
        headers: { Authorization: process.env.SECRET_API_KEY },
      });
      router.push(`/project-main/${props.params.id}/outputManagement`);
    } catch (err) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={outerContainerStyle}>
      <MainHeader pid={props.params.id} />
      <div style={layoutContainerStyle}>
        <MainSide pid={props.params.id} />
        <div style={contentContainerStyle}>
          <h2 style={sectionHeaderStyle}>📝 요구사항 작성 ver.2</h2>

          <table style={tableStyle}>
            <tbody>
              <tr><td colSpan={4} style={sectionThStyle}>📌 기본 정보</td></tr>
              <tr><td style={thStyle}>작성일</td><td colSpan={3} style={tdStyle}><Field type="date" value={creationDate} setter={setCreationDate} /></td></tr>
              <tr><td colSpan={4} style={sectionThStyle}>📌 시스템 요구사항</td></tr>
              <tr><td style={thStyle}>요구사항</td><td colSpan={3} style={tdStyle}><TextAreaField value={systemRequirements} setter={setSystemRequirements} /></td></tr>
              <tr><td style={thStyle}>설명</td><td colSpan={3} style={tdStyle}><TextAreaField value={systemDes} setter={setSystemDes} /></td></tr>
              <tr><td colSpan={4} style={sectionThStyle}>📌 기능 요구사항</td></tr>
              <tr><td style={thStyle}>요구사항</td><td colSpan={3} style={tdStyle}><TextAreaField value={functionalRequirements} setter={setFunctionalRequirements} /></td></tr>
              <tr><td style={thStyle}>설명</td><td colSpan={3} style={tdStyle}><TextAreaField value={functionalDes} setter={setFunctionalDes} /></td></tr>
              <tr><td style={thStyle}>우선순위</td>
                <td colSpan={3} style={tdStyle}>
                  <select value={functionalRequirementsPriority} onChange={(e) => setFunctionalRequirementsPriority(Number(e.target.value))} style={selectStyle}>
                    <option value={1}>낮음 (1)</option>
                    <option value={2}>보통 (2)</option>
                    <option value={3}>높음 (3)</option>
                  </select>
                </td>
              </tr>
              <tr><td colSpan={4} style={sectionThStyle}>📌 비기능 요구사항</td></tr>
              <tr><td style={thStyle}>요구사항</td><td colSpan={3} style={tdStyle}><TextAreaField value={nonFunctionalRequirements} setter={setNonFunctionalRequirements} /></td></tr>
              <tr><td style={thStyle}>설명</td><td colSpan={3} style={tdStyle}><TextAreaField value={nonFunctionalDes} setter={setNonFunctionalDes} /></td></tr>
              <tr><td style={thStyle}>우선순위</td>
                <td colSpan={3} style={tdStyle}>
                  <select value={nonFunctionalRequirementsPriority} onChange={(e) => setNonFunctionalRequirementsPriority(Number(e.target.value))} style={selectStyle}>
                    <option value={1}>낮음 (1)</option>
                    <option value={2}>보통 (2)</option>
                    <option value={3}>높음 (3)</option>
                  </select>
                </td>
              </tr>
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


const tableStyle: CSSProperties = { width: "100%", borderCollapse: "collapse" };
const selectStyle: CSSProperties = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: "#fff", cursor: "pointer" };
const thStyle: CSSProperties = { backgroundColor: "#ddd", padding: "8px", border: "1px solid black", fontWeight: "bold", textAlign: "center" };
const tdStyle: CSSProperties = { padding: "8px", border: "1px solid black", textAlign: "left" };
const outerContainerStyle: CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center", width: "100%" };
const layoutContainerStyle: CSSProperties = { display: "flex", width: "100%" };
const contentContainerStyle: CSSProperties = { padding: "20px", backgroundColor: "#fff", maxWidth: "2100px", width: "100%" };
const buttonContainerStyle: CSSProperties = { display: "flex", justifyContent: "center", marginTop: "20px" };
const sectionThStyle: CSSProperties = { backgroundColor: "#ddd", padding: "14px", border: "1px solid black", fontWeight: "bold", textAlign: "center" };
const sectionHeaderStyle: CSSProperties = { fontSize: "24px", fontWeight: "bold", color: "#4CAF50", marginBottom: "20px" };


const Field = ({ value, setter, type = "text" }: { value: string; setter: (value: string) => void; type?: string }) => (
  <input type={type} value={value} onChange={(e) => setter(e.target.value)} style={{ width: "calc(99% - 10px)", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />
);

const TextAreaField = ({ value, setter }: { value: string; setter: (value: string) => void }) => (
  <textarea value={value} onChange={(e) => setter(e.target.value)} style={{ width: "calc(99% - 10px)", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", height: "100px" }} />
);

const ActionButton = ({ label, onClick, color }: { label: string; onClick: () => void; color: string }) => (
  <button onClick={onClick} style={{ backgroundColor: color, color: "#fff", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}>{label}</button>
);
