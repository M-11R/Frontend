"use client";

import { CSSProperties, useState } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getUnivId } from "@/app/util/storage";
import usePermissionGuard from "@/app/util/usePermissionGuard";

type TestType = {
  doc_t_group1: string;
  doc_t_name: string;
  doc_t_start: string;
  doc_t_end: string;
  doc_t_pass: number;
  doc_t_group1no: number;
};

export default function ServiceTestForm(props: any) {
  const [testStartDate, setTestStartDate] = useState("");
  const [testEndDate, setTestEndDate] = useState("");
  const [testItemName, setTestItemName] = useState("");
  const [testPassStatus, setTestPassStatus] = useState(false);

  const router = useRouter();
  const s_no = getUnivId();

  usePermissionGuard(props.params.id, s_no, { leader: 1, ut: 1 }, true);

  const handleSave = async () => {
    const testcases: TestType[] = [
      {
        doc_t_group1: "",
        doc_t_name: testItemName,
        doc_t_start: testStartDate,
        doc_t_end: testEndDate,
        doc_t_pass: Number(testPassStatus),
        doc_t_group1no: 0,
      },
    ];

    const data = {
      testcases,
      pid: props.params.id,
    };

    try {
      await axios.post("https://cd-api.chals.kim/api/output/testcase_add", data, {
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
          <h2 style={sectionHeaderStyle}>📝 서비스 테스트 작성</h2>

          <table style={tableStyle}>
            <tbody>
              <tr>
                <td style={thStyle}>테스트 시작일</td>
                <td style={tdStyle}><Field type="date" value={testStartDate} setter={setTestStartDate} /></td>
                <td style={thStyle}>테스트 종료일</td>
                <td style={tdStyle}><Field type="date" value={testEndDate} setter={setTestEndDate} /></td>
              </tr>
              <tr>
                <td style={thStyle}>테스트 항목</td>
                <td colSpan={3} style={tdStyle}><Field value={testItemName} setter={setTestItemName} /></td>
              </tr>
              <tr>
                <td style={thStyle}>테스트 통과 여부</td>
                <td colSpan={3} style={tdStyle}><CheckboxField checked={testPassStatus} setter={setTestPassStatus} /></td>
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

const outerContainerStyle: CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center", width: "100%" };
const layoutContainerStyle: CSSProperties = { display: "flex", width: "100%" };
const contentContainerStyle: CSSProperties = { padding: "20px", backgroundColor: "#fff", maxWidth: "2100px", width: "100%" };
const sectionHeaderStyle: CSSProperties = { fontSize: "24px", fontWeight: "bold", color: "#4CAF50" };
const tableStyle: CSSProperties = { width: "100%", borderCollapse: "collapse" };
const thStyle: CSSProperties = { backgroundColor: "#ddd", padding: "14px", border: "1px solid black", fontWeight: "bold", textAlign: "center" };
const tdStyle: CSSProperties = { padding: "18px", border: "1px solid black", textAlign: "left" };
const buttonContainerStyle: CSSProperties = { display: "flex", justifyContent: "center", marginTop: "20px" };

const Field = ({ value, setter, type = "text" }: { value: string; setter: (value: string) => void; type?: string }) => (
  <input type={type} value={value} onChange={(e) => setter(e.target.value)} style={{ width: "95%", padding: "14px", border: "1px solid #ccc", borderRadius: "5px" }} />
);

const CheckboxField = ({ checked, setter }: { checked: boolean; setter: (checked: boolean) => void }) => (
  <input type="checkbox" checked={checked} onChange={(e) => setter(e.target.checked)} style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
);

const ActionButton = ({ label, onClick, color }: { label: string; onClick: () => void; color: string }) => (
  <button onClick={onClick} style={{ backgroundColor: color, color: "#fff", padding: "12px 28px", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>{label}</button>
);
