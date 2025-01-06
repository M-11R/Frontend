"use client";

import { useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import { useRouter } from "next/navigation";
import axios from "axios";

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <MainHeader pid={props.params.id} />
      <div style={{ display: "flex", flex: 1 }}>
        <MainSide pid={props.params.id} />
        <div style={{ padding: "20px", width: "100%", overflowY: "auto" }}>
          <h1 style={{ borderBottom: "2px solid #4CAF50", paddingBottom: "10px" }}>회의록 작성</h1>

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
            <div>
              <h2 style={{ borderBottom: "1px solid #ddd", marginBottom: "10px" }}>미리보기</h2>
              <PreviewField label="안건" value={agenda} />
              <PreviewField label="회의 날짜" value={meetingDate} />
              <PreviewField label="장소" value={location} />
              <PreviewField label="책임자명" value={responsiblePerson} />
              <PreviewField label="회의 내용" value={meetingContent} />
              <PreviewField label="회의 결과" value={meetingResult} />
              <h3>참석자 목록</h3>
              <ul>
                {participants.map((participant, index) => (
                  <li key={index}>
                    {participant.name} ({participant.studentId})
                  </li>
                ))}
              </ul>
              <ActionButton label="수정" onClick={handleEdit} color="#f0ad4e" />
              <ActionButton label="저장" onClick={handleSave} color="#2196F3" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: "20px" }}>
    <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd", marginBottom: "10px" }}>{title}</h2>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px" }}>{children}</div>
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
    <label style={{ alignSelf: "center" }}>{label}:</label>
    <input
      type={type}
      value={value}
      onChange={(e) => setter(e.target.value)}
      style={{
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
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
    <label style={{ alignSelf: "start" }}>{label}:</label>
    <textarea
      value={value}
      onChange={(e) => setter(e.target.value)}
      style={{
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        height: "100px",
        resize: "vertical",
      }}
    />
  </>
);

const PreviewField = ({ label, value }: { label: string; value: string }) => (
  <div style={{ marginBottom: "10px" }}>
    <strong>{label}:</strong> {value}
  </div>
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
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginRight: "10px",
    }}
  >
    {label}
  </button>
);
