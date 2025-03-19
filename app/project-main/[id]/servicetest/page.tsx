"use client";

import { CSSProperties, useState } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getUnivId } from "@/app/util/storage";
import usePermissionGuard from "@/app/util/usePermissionGuard";
import React from "react";

type TestType = {
  doc_t_group1: string;
  doc_t_name: string;
  doc_t_start: string;
  doc_t_end: string;
  doc_t_pass: number;
  doc_t_group1no: number;
};

export default function ServiceTestForm(props: any) {
  const [testCases, setTestCases] = useState<TestType[]>([{
    doc_t_group1: "",
    doc_t_name: "",
    doc_t_start: "",
    doc_t_end: "",
    doc_t_pass: 0,
    doc_t_group1no: 0
  }]);

  const router = useRouter();
  const s_no = getUnivId();

  usePermissionGuard(props.params.id, s_no, { leader: 1, ut: 1 }, true);

  const handleSave = async () => {

    const data = {
      testcases: testCases,
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

  const addTestCase = () => {
    setTestCases(prev => [
      ...prev,
      {
        doc_t_group1: "",
        doc_t_name: "",
        doc_t_start: "",
        doc_t_end: "",
        doc_t_pass: 0,
        doc_t_group1no: 0
      }
    ]);
  };

  const handleTestCaseChange = (
    index: number, 
    field: keyof TestType, 
    value: string
  ) => {
    if(field === "doc_t_pass"){
      setTestCases(prev => {
        const newCases = [...prev];
        newCases[index] = { ...newCases[index], [field]: Number(value) };
        return newCases;
      });
    }else{
      setTestCases(prev => {
        const newCases = [...prev];
        newCases[index] = { ...newCases[index], [field]: value };
        return newCases;
      });
    }
    
  };

  return (
    <div style={outerContainerStyle}>
      <MainHeader pid={props.params.id} />
      <div style={layoutContainerStyle}>
        <MainSide pid={props.params.id} />
        <div style={contentContainerStyle}>
          <h2 style={sectionHeaderStyle}>📝 서비스 테스트 작성 ver8</h2>

          <table style={tableStyle}>
            <tbody>
              {testCases.map((tc, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td style={thStyle}>테스트 시작일</td>
                    <td style={tdStyle}>
                    <input
                      type="date"
                      value={tc.doc_t_start}
                      onChange={(e) => handleTestCaseChange(index, "doc_t_start", e.target.value)}
                      style={{width: '100%'}}
                    />
                    </td>
                    <td style={thStyle}>테스트 종료일</td>
                    <td style={tdStyle}>
                    <input
                      type="date"
                      value={tc.doc_t_end}
                      onChange={(e) => handleTestCaseChange(index, "doc_t_end", e.target.value)}
                      style={{width: '100%'}}
                    />
                    </td>
                    <td style={thStyle}>테스트 통과 여부</td>
                    <td style={tdStyle}>
                    <input
                      type="checkbox"
                      checked={tc.doc_t_pass === 1}
                      onChange={(e) => handleTestCaseChange(index, "doc_t_pass", e.target.checked ? "1" : "0")}
                    />
                    </td>
                  </tr>
                  <tr>
                    <td style={thStyle}>테스트 항목</td>
                    <td colSpan={1} style={tdStyle}>
                    <input
                      type="text"
                      value={tc.doc_t_group1}
                      onChange={(e) => handleTestCaseChange(index, "doc_t_group1", e.target.value)}
                      style={{ width: "90%", padding: "8px" }}
                    />
                    </td>
                    <td style={thStyle}>테스트 제목</td>
                    <td colSpan={3} style={tdStyle}>
                    <input
                      type="text"
                      value={tc.doc_t_name}
                      onChange={(e) => handleTestCaseChange(index, "doc_t_name", e.target.value)}
                      style={{ width: "90%", padding: "8px" }}
                    />
                    </td>
                  </tr>
                </React.Fragment>
              ))}
              
            </tbody>
          </table>

          <div style={buttonContainerStyle}>
          <button onClick={addTestCase} style={{ marginRight: "10px" }}>테스트 항목 추가</button>
          <button onClick={handleSave}>저장</button>
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
const tableStyle: CSSProperties = { width: "90%", borderCollapse: "collapse", tableLayout: "fixed", };
const thStyle: CSSProperties = { backgroundColor: "#ddd", padding: "14px", border: "1px solid black", fontWeight: "bold", textAlign: "center" };
const tdStyle: CSSProperties = { padding: "18px", border: "1px solid black", textAlign: "left" };
const buttonContainerStyle: CSSProperties = { display: "flex", justifyContent: "center", marginTop: "20px" };

const Field = ({ value, setter, type = "text" }: { value: string; setter: (value: string) => void; type?: string }) => (
  <input type={type} value={value} onChange={(e) => setter(e.target.value)} style={{ width: "96%", padding: "14px", border: "1px solid #ccc", borderRadius: "5px" }} />
);

const CheckboxField = ({ checked, setter }: { checked: boolean; setter: (checked: boolean) => void }) => (
  <input type="checkbox" checked={checked} onChange={(e) => setter(e.target.checked)} style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
);

const ActionButton = ({ label, onClick, color }: { label: string; onClick: () => void; color: string }) => (
  <button onClick={onClick} style={{ backgroundColor: color, color: "#fff", padding: "12px 28px", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>{label}</button>
);


// 확인했습니당