"use client";

import { CSSProperties, useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getUnivId } from "@/app/util/storage";
import usePermissionGuard from "@/app/util/usePermissionGuard";

export default function MeetingMinutesForm(props: any) {
  const [isMounted, setIsMounted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const [agenda, setAgenda] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [location, setLocation] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [meetingContent, setMeetingContent] = useState("");
  const [meetingResult, setMeetingResult] = useState("");
  const [participants, setParticipants] = useState<{ name: string; studentId: string }[]>([
    { name: "", studentId: "" },
  ]);

  const router = useRouter();
  const s_no = getUnivId();
  useEffect(() => {
    setIsMounted(true);
  }, []);
  usePermissionGuard(props.params.id, s_no, { leader: 1, mm: 1 }, true);

  const handlePreview = () => setIsPreview(true);
  const handleEdit = () => setIsPreview(false);

  const handleAddParticipant = () => {
    setParticipants([...participants, { name: "", studentId: "" }]);
  };

  const handleRemoveParticipant = (index: number) => {
    const updatedParticipants = participants.filter((_, i) => i !== index);
    setParticipants(updatedParticipants);
  };

  const handleParticipantChange = (
    index: number,
    field: keyof { name: string; studentId: string },
    value: string
  ) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  };

  const handleSave = async () => {
    const data = {
      main_agenda: agenda,
      date_time: meetingDate,
      location,
      responsible_person: responsiblePerson,
      meeting_content: meetingContent,
      meeting_outcome: meetingResult,
      participants: participants.map((p) => `${p.name}, ${p.studentId}`).join(";"),
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

  if (!isMounted) return null;

  return (
    <div style={pageContainerStyle}>
      <MainHeader pid={props.params.id} />
      <div style={flexRowStyle}>
        <MainSide pid={props.params.id} />
        <div style={contentContainerStyle}>
          <h1 style={titleStyle}>📌 회의록 작성</h1>

          {!isPreview ? (
            <div>
              {/* 회의 정보 입력 */}
              <Section title="회의 정보">
                <Field label="안건" value={agenda} setter={setAgenda} />
                <Field label="회의 날짜" value={meetingDate} setter={setMeetingDate} type="date" />
                <Field label="장소" value={location} setter={setLocation} />
                <Field label="책임자명" value={responsiblePerson} setter={setResponsiblePerson} />
              </Section>

              {/* 회의 내용 입력 */}
              <Section title="회의 내용">
                <TextAreaField label="회의 내용" value={meetingContent} setter={setMeetingContent} />
                <TextAreaField label="회의 결과" value={meetingResult} setter={setMeetingResult} />
              </Section>

              {/* 참석자 목록 */}
              <Section title="참석자 목록">
                {participants.map((participant, index) => (
                  <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                    <Field
                      label="이름"
                      value={participant.name}
                      setter={(value) => handleParticipantChange(index, "name", value)}
                    />
                    <Field
                      label="학번"
                      value={participant.studentId}
                      setter={(value) => handleParticipantChange(index, "studentId", value)}
                    />
                    <ActionButton
                      label="삭제"
                      onClick={() => handleRemoveParticipant(index)}
                      color="#f44336"
                    />
                  </div>
                ))}
                <ActionButton label="참석자 추가" onClick={handleAddParticipant} color="#4CAF50" />
              </Section>

              <ActionButton label="미리보기" onClick={handlePreview} color="#4CAF50" />
            </div>
          ) : (
            <Preview
              agenda={agenda}
              meetingDate={meetingDate}
              location={location}
              responsiblePerson={responsiblePerson}
              meetingContent={meetingContent}
              meetingResult={meetingResult}
              participants={participants}
              handleEdit={handleEdit}
              handleSave={handleSave}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ✅ 미리보기 컴포넌트
const Preview = ({
  agenda,
  meetingDate,
  location,
  responsiblePerson,
  meetingContent,
  meetingResult,
  participants,
  handleEdit,
  handleSave,
}: any) => (
  <div style={previewContainerStyle}>
    <h2 style={sectionHeaderStyle}>📄 회의록 미리보기</h2>

    {/* ✅ 회의 정보 테이블 */}
    <table style={tableStyle}>
      <thead>
        <tr>
          <th colSpan={4} style={thStyle}>회의 정보</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={thStyle}>안건</td>
          <td colSpan={3} style={tdStyle}>{agenda}</td>
        </tr>
        <tr>
          <td style={thStyle}>회의 날짜</td>
          <td style={tdStyle}>{meetingDate}</td>
          <td rowSpan={2} style={thStyle}>회의 장소 및 책임자</td>
          <td rowSpan={2} style={tdStyle}>
            <strong>장소:</strong> {location} <br />
            <strong>책임자:</strong> {responsiblePerson}
          </td>
        </tr>
        <tr>
          <td style={thStyle}>작성일</td>
          <td style={tdStyle}>{new Date().toLocaleDateString()}</td>
        </tr>
      </tbody>
    </table>

    {/* ✅ 회의 내용 및 결과 */}
    <table style={tableStyle}>
      <thead>
        <tr>
          <th colSpan={4} style={thStyle}>회의 내용 및 결과</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={4} style={tdStyle}>{meetingContent}</td>
        </tr>
        <tr>
          <th colSpan={4} style={thStyle}>회의 결과</th>
        </tr>
        <tr>
          <td colSpan={4} style={tdStyle}>{meetingResult}</td>
        </tr>
      </tbody>
    </table>

    {/* ✅ 참석자 목록 */}
    <h3 style={{ marginTop: "20px", fontSize: "18px", color: "#4CAF50" }}>참석자 목록</h3>
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>이름</th>
          <th style={thStyle}>학번</th>
        </tr>
      </thead>
      <tbody>
        {participants.length > 0 ? (
          participants.map((participant: any, index: number) => (
            <tr key={index}>
              <td style={tdStyle}>{participant.name}</td>
              <td style={tdStyle}>{participant.studentId}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={2} style={tdStyle}>등록된 참석자가 없습니다.</td>
          </tr>
        )}
      </tbody>
    </table>

    {/* ✅ 버튼 영역 */}
    <div style={buttonContainerStyle}>
      <ActionButton label="수정" onClick={handleEdit} color="#f0ad4e" />
      <ActionButton label="저장" onClick={handleSave} color="#2196F3" />
    </div>
  </div>
);




const previewContainerStyle: CSSProperties = { padding: "20px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", marginTop: "20px" };

const tableStyle: CSSProperties = { width: "100%", borderCollapse: "collapse", marginBottom: "10px" };

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

const textBlockStyle: CSSProperties = { padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "8px", marginBottom: "10px" };

const buttonContainerStyle: CSSProperties = { display: "flex", justifyContent: "flex-end", marginTop: "20px" };



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
        width: "100%",
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
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        backgroundColor: "#f9f9f9",
        height: "100px",
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
