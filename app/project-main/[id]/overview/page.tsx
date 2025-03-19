"use client";

import { CSSProperties, useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getUnivId } from "@/app/util/storage";
import usePermissionGuard from "@/app/util/usePermissionGuard";

type userList = {
  univ_id: number,
  role: string,
  name: string,
  permission: string
}

type returnType = {
  "RESULT_CODE": number,
  "RESULT_MSG": string,
  "PAYLOADS": userList[]
}

export default function ProjectOverview(props: any) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [teamMembers, setTeamMembers] = useState([{ name: "", role: "" }]);
  const [overview, setOverview] = useState("");
  const [goal, setGoal] = useState("");
  const [scope, setScope] = useState("");
  const [techStack, setTechStack] = useState(""); // ✅ 기술 스택 추가
  const [expectedOutcomes, setExpectedOutcomes] = useState(""); // ✅ 기대 성과 추가

  const router = useRouter();
  const s_no = getUnivId();

  const [user, setUser] = useState<userList[]>([{
    univ_id: 0,
    role: '',
    name: '',
    permission: ''
  }]);

  useEffect(() => {
    const getTeamData = async() => {
      try{
        const response = await axios.post<returnType>("https://cd-api.chals.kim/api/project/checkuser", {pid: props.params.id}, {headers:{Authorization: process.env.SECRET_API_KEY}});
        setUser(response.data.PAYLOADS);
      }catch(err){}
    }
    getTeamData()
  }, [])

  usePermissionGuard(props.params.id, s_no, { leader: 1, od: 1 }, true);

  const handleSave = async () => {
    const data = {
      pname: title,
      pteam: teamMembers.map((tm) => `${tm.name} (${tm.role})`).join(", "),
      poverview: overview,
      poutcomes: expectedOutcomes,
      pgoals: goal,
      pstart: startDate,
      pend: endDate,
      pcreated: createdDate,
      prange: scope,
      pstack: techStack, // ✅ 기술 스택 저장
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

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", role: "" }]);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (index: number, field: "name" | "role", value: string) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index][field] = value;
    setTeamMembers(updatedMembers);
  };

  return (
    <div style={outerContainerStyle}>
      <MainHeader pid={props.params.id} />
      <div style={layoutContainerStyle}>
        <MainSide pid={props.params.id} />
        <div style={contentContainerStyle}>
          <h2 style={sectionHeaderStyle}>📄 프로젝트 개요서</h2>

          <table style={tableStyle}>
            <tbody>
              {/* 프로젝트 기본 정보 */}
              <tr>
                <td style={thStyle}>제 목</td>
                <td colSpan={3} style={tdStyle}><TitleField value={title} setter={setTitle} /></td>
              </tr>
              <tr>
                <td style={thStyle}>프로젝트 시작일</td>
                <td style={tdStyle}><Field type="date" value={startDate} setter={setStartDate} /></td>
                <td style={thStyle}>프로젝트 종료일</td>
                <td style={tdStyle}><Field type="date" value={endDate} setter={setEndDate} /></td>
              </tr>
              <tr>
              <td style={thStyle}>작성일</td>
                 <td colSpan={3} style={tdStyle}><DateField value={createdDate} setter={setCreatedDate} /></td>
                </tr>


              {/* 팀 구성 및 역할 분담 */}
              <tr><td colSpan={4} style={thStyle}>팀 구성 및 역할 분담</td></tr>
              {teamMembers.map((member, index) => (
                <tr key={index}>
                  <td colSpan={4} style={tdStyle}>
                    <div style={teamMemberRowStyle}>
                      <Field value={member.name} setter={(val) => updateTeamMember(index, "name", val)} placeholder="이름" />
                      <Field value={member.role} setter={(val) => updateTeamMember(index, "role", val)} placeholder="역할" />
                      <button onClick={() => removeTeamMember(index)} style={deleteButtonStyle}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={4} style={tdStyle}>
                  <button onClick={addTeamMember} style={addButtonStyle}>팀원 추가</button>
                </td>
              </tr>

              {/* 프로젝트 개요 */}
              <tr><td colSpan={4} style={thStyle}>프로젝트 개요</td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField value={overview} setter={setOverview} /></td></tr>

              {/* 프로젝트 목표 */}
              <tr><td colSpan={4} style={thStyle}>프로젝트 목표</td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField value={goal} setter={setGoal} /></td></tr>

              {/* 프로젝트 범위 */}
              <tr><td colSpan={4} style={thStyle}>프로젝트 범위</td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField value={scope} setter={setScope} /></td></tr>

              {/* ✅ 기술 스택 */}
              <tr><td colSpan={4} style={thStyle}>기술 스택</td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField value={techStack} setter={setTechStack} /></td></tr>

              {/* ✅ 기대 성과 */}
              <tr><td colSpan={4} style={thStyle}>기대 성과</td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField value={expectedOutcomes} setter={setExpectedOutcomes} /></td></tr>
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
const contentContainerStyle: CSSProperties = { padding: "30px", backgroundColor: "#fff", maxWidth: "2100px", width: "100%" };
const sectionHeaderStyle: CSSProperties = { fontSize: "24px", fontWeight: "bold", color: "#4CAF50" };
const tableStyle: CSSProperties = { width: "100%", borderCollapse: "collapse" };
const thStyle: CSSProperties = { backgroundColor: "#ddd", padding: "14px", border: "1px solid black", fontWeight: "bold", textAlign: "center" };
const tdStyle: CSSProperties = { padding: "8px", border: "1px solid black", textAlign: "left" };
const buttonContainerStyle: CSSProperties = { display: "flex", justifyContent: "center", marginTop: "20px" };
const deleteButtonStyle: CSSProperties = { backgroundColor: "#f44336", color: "#fff", border: "none", padding: "8px 12px", cursor: "pointer", borderRadius: "5px", minWidth: "60px" };
const addButtonStyle: CSSProperties = { backgroundColor: "#4CAF50", color: "#fff", border: "none", padding: "10px", cursor: "pointer", borderRadius: "5px", marginTop: "5px" };
const teamMemberRowStyle: CSSProperties = { display: "flex", alignItems: "center", gap: "15px", width: "100%", marginBottom: "8px" };


// 수정정 제목,작성일
const TitleField = ({ value, setter }: { value: string; setter: (value: string) => void }) => (
  <input type="text" value={value} onChange={(e) => setter(e.target.value)}
    style={{
      width: "97.5%", 
      padding: "12px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      fontSize: "12px" 
    }}
  />
);

const DateField = ({ value, setter }: { value: string; setter: (value: string) => void }) => (
  <input type="date" value={value} onChange={(e) => setter(e.target.value)}
    style={{
      width: "98%", // 
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px"
    }}
  />
);



/* ✅ 공통 입력 필드 */
const Field = ({ value, setter, placeholder, type = "text" }: { value: string; setter: (value: string) => void; placeholder?: string; type?: string }) => (
  <input type={type} value={value} onChange={(e) => setter(e.target.value)} placeholder={placeholder} style={{ width: "94%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />
);

/* ✅ 텍스트 영역 */
const TextAreaField = ({ value, setter }: { value: string; setter: (value: string) => void }) => (
  <textarea value={value} onChange={(e) => setter(e.target.value)} style={{ width: "98%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", height: "100px" }} />
);

/* ✅ 버튼 */
const ActionButton = ({ label, onClick, color }: { label: string; onClick: () => void; color: string }) => (
  <button onClick={onClick} style={{ backgroundColor: color, color: "#fff", padding: "12px 28px", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>{label}</button>
);
