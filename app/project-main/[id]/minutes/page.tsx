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

export default function MeetingMinutesForm(props: any) {
  const [agenda, setAgenda] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [location, setLocation] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [meetingContent, setMeetingContent] = useState("");
  const [meetingResult, setMeetingResult] = useState("");
  const [participants, setParticipants] = useState([{ name: "", studentId: "" }]);

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

  const router = useRouter();
  const s_no = getUnivId();

  usePermissionGuard(props.params.id, s_no, { leader: 1, mm: 1 }, true);

  const handleSave = async () => {
    const data = {
      main_agenda: agenda,
      date_time: meetingDate,
      location,
      responsible_person: responsiblePerson,
      meeting_content: meetingContent,
      meeting_outcome: meetingResult,
      participants: participants.map((p) => `${p.name},${p.studentId}`).join(";"),
      pid: props.params.id,
    };

    try {
      await axios.post("https://cd-api.chals.kim/api/output/mm_add", data, {
        headers: { Authorization: process.env.SECRET_API_KEY },
      });
      router.push(`/project-main/${props.params.id}/outputManagement`);
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const addParticipant = () => {
    setParticipants([...participants, { name: "", studentId: "" }]);
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const updateParticipant = (index: number, field: "name" | "studentId", value: string) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  };

  return (
    <div style={outerContainerStyle}>
      <MainHeader pid={props.params.id} />
      <div style={layoutContainerStyle}>
        <MainSide pid={props.params.id} />
        <div style={contentContainerStyle}>
          <h2 style={sectionHeaderStyle}>📄 회의록 작성</h2>

          <table style={tableStyle}>
            <tbody>
              <tr>
                <td style={thStyle}>안건</td>
                <td colSpan={3} style={tdStyle}><Field value={agenda} setter={setAgenda} /></td>
              </tr>
              <tr>
                <td style={thStyle}>회의 날짜</td>
                <td style={tdStyle}><Field type="date" value={meetingDate} setter={setMeetingDate} /></td>
              </tr>
              <tr>
                <td style={thStyle}>장소</td>
                <td colSpan={3} style={tdStyle}><Field value={location} setter={setLocation} /></td>
              </tr>
              <tr>
                <td style={thStyle}>책임자명</td>
                <td colSpan={3} style={tdStyle}><Field value={responsiblePerson} setter={setResponsiblePerson} /></td>
              </tr>
              <tr><td colSpan={4} style={thStyle}>회의 내용</td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField value={meetingContent} setter={setMeetingContent} /></td></tr>
              <tr><td colSpan={4} style={thStyle}>회의 결과</td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField value={meetingResult} setter={setMeetingResult} /></td></tr>
              <tr>
             <td style={thStyle}>참석자</td>

            <td colSpan={3} style={tdStyle}>
             {participants.map((participant, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "10px" }}>
                  {/* 성명 입력 필드 */}
                  <label>성명:</label>
                  <input
                    type="text"
                    value={participant.name}
                    onChange={(e) => updateParticipant(index, "name", e.target.value)}
                   style={participantNameStyle}
                 />

                 {/* 학번 입력 필드 */}
                  <label>학번:</label>
                  <input
                    type="text"
                    value={participant.studentId}
                    onChange={(e) => updateParticipant(index, "studentId", e.target.value)}
                   style={participantIdStyle}
                  />

                  {/* 삭제 버튼 */}
                  <button onClick={() => removeParticipant(index)} style={deleteButtonStyle}>삭제</button>
                </div>
             ))}

           {/* 참석자 추가 버튼 */}
             <button onClick={addParticipant} style={addButtonStyle}>참석자 추가</button>
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






/* ✅ 스타일 */
const outerContainerStyle: CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center", width: "100%" };
const layoutContainerStyle: CSSProperties = { display: "flex", width: "100%" };
const contentContainerStyle: CSSProperties = { padding: "20px", backgroundColor: "#fff", maxWidth: "2100px", width: "100%" };
const sectionHeaderStyle: CSSProperties = { fontSize: "24px", fontWeight: "bold", color: "#4CAF50" };
const tableStyle: CSSProperties = { width: "100%", borderCollapse: "collapse" };
const thStyle: CSSProperties = { backgroundColor: "#ddd", padding: "14px", border: "1px solid black", fontWeight: "bold", textAlign: "center" };
const tdStyle: CSSProperties = { padding: "18px", border: "1px solid black", textAlign: "left" };
const buttonContainerStyle: CSSProperties = { display: "flex", justifyContent: "center", marginTop: "20px", gap: "10px" };
const deleteButtonStyle: CSSProperties = { backgroundColor: "#f44336", color: "#fff", border: "none", padding: "8px 12px", cursor: "pointer", borderRadius: "5px", marginLeft: "25px" };
const addButtonStyle: CSSProperties = { backgroundColor: "#4CAF50", color: "#fff", border: "none", padding: "10px", cursor: "pointer", borderRadius: "5px", marginTop: "5px" };

const participantNameStyle: CSSProperties = {
  width: "250px", 
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const participantIdStyle: CSSProperties = {
  width: "250px", 
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};


/* ✅ 입력 필드 */
const Field = ({ label, value, setter, type = "text" }: { label?: string; value: string; setter: (value: string) => void; type?: string }) => (
  <div>
    {label && <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>{label}:</label>}
    <input type={type} value={value} onChange={(e) => setter(e.target.value)} style={{ width: "99%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />
  </div>
);

/* ✅ 텍스트 영역 */
const TextAreaField = ({ value, setter }: { value: string; setter: (value: string) => void }) => (
  <textarea value={value} onChange={(e) => setter(e.target.value)} style={{ width: "99%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", height: "100px" }} />
);

/* ✅ 버튼 */
const ActionButton = ({ label, onClick, color }: { label: string; onClick: () => void; color: string }) => (
  <button onClick={onClick} style={{ backgroundColor: color, color: "#fff", padding: "12px 28px", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>{label}</button>
);
