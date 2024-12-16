"use client";

import { useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import { checkNull } from "@/app/util/check";
import { fixDate } from "@/app/util/fixDate";
import { useRouter } from "next/navigation";
import axios from "axios";

// 참석자 타입 정의
type Participant = {
  name: string;
  studentId: string;
};

export default function MeetingMinutes(props: any) {
  // 상태 관리
  const [isMounted, setIsMounted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const [agenda, setAgenda] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [location, setLocation] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [attendees, setAttendees] = useState("");
  const [meetingContent, setMeetingContent] = useState("");
  const [meetingResult, setMeetingResult] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([{ name: "", studentId: "" }]);
  const [team, setTeam] = useState('');
  const router = useRouter();
  // 클라이언트 렌더링 여부 확인
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 미리보기 핸들러
  const handlePreview = () => setIsPreview(true);

  // 수정 핸들러
  const handleEdit = () => setIsPreview(false);

  // 다운로드 핸들러
  const handleDownload = async() => {
    setTeam(participants.map(item => `${item.name},${item.studentId}`).join(';') + ';');
    const data = {
      // 참석자목록: participants,
      main_agenda: agenda,
      date_time: fixDate(meetingDate),
      location: location,
      participants: team,
      responsible_person: responsiblePerson,
      meeting_content: meetingContent,
      meeting_outcome: meetingResult,
      pid: props.params.id,
    };
    console.log(team)
    console.log(participants.map(item => `${item.name},${item.studentId}`).join(';') + ';')
    // const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    // const url = URL.createObjectURL(blob);

    // const link = document.createElement("a");
    // link.href = url;
    // link.download = "meeting_minutes.json";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // URL.revokeObjectURL(url);
    if(checkNull(data)){
      try{
        const response = await axios.post("https://cd-api.chals.kim/api/output/mm_add", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
        router.push(`/project-main/${props.params.id}/outputManagement`);
      }catch(err){
  
      }
    }else{
      alert("데이터를 모두 입력해주세요.");
    }
  };

  if (!isMounted) {
    return null; // 서버와 클라이언트 불일치 방지
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
              {/* 회의 정보 섹션 */}
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd" }}>회의 정보</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginTop: "10px" }}>
                  <label>안건:</label>
                  <input
                    type="text"
                    value={agenda}
                    onChange={(e) => setAgenda(e.target.value)}
                    placeholder="회의 안건 입력"
                  />

                  <label>회의 날짜:</label>
                  <input
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                  />

                  <label>장소:</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="회의 장소 입력"
                  />

                  <label>책임자명:</label>
                  <input
                    type="text"
                    value={responsiblePerson}
                    onChange={(e) => setResponsiblePerson(e.target.value)}
                    placeholder="책임자명 입력"
                  />

                  <label>참석 인원:</label>
                  <input
                    type="text"
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    placeholder="참석 인원 입력"
                  />
                </div>
              </div>

              {/* 회의 내용 섹션 */}
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd" }}>회의 내용</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginTop: "10px" }}>
                  <label>회의 내용:</label>
                  <textarea
                    value={meetingContent}
                    onChange={(e) => setMeetingContent(e.target.value)}
                    placeholder="회의 내용 입력"
                    style={{ height: "100px" }}
                  />

                  <label>회의 결과:</label>
                  <textarea
                    value={meetingResult}
                    onChange={(e) => setMeetingResult(e.target.value)}
                    placeholder="회의 결과 입력"
                    style={{ height: "100px" }}
                  />
                </div>
              </div>

              {/* 참석자 정보 섹션 */}
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd" }}>참석자 정보</h2>
                {participants.map((participant, index) => (
                  <div key={index} style={{ marginBottom: "15px" }}>
                    <label>참석자 {index + 1}:</label>
                    <input
                      type="text"
                      value={participant.name}
                      onChange={(e) =>
                        setParticipants((prev) => {
                          const updated = [...prev];
                          updated[index].name = e.target.value;
                          return updated;
                        })
                      }
                      placeholder="이름"
                      style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                    <input
                      type="text"
                      value={participant.studentId}
                      onChange={(e) =>
                        setParticipants((prev) => {
                          const updated = [...prev];
                          updated[index].studentId = e.target.value;
                          return updated;
                        })
                      }
                      placeholder="학번"
                      style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                  </div>
                ))}
                <button
                  onClick={() =>
                    setParticipants((prev) => [...prev, { name: "", studentId: "" }])
                  }
                  style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  참석자 추가
                </button>
              </div>

              {/* 미리보기 버튼 */}
              <button
                onClick={handlePreview}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                미리보기
              </button>
            </div>
          ) : (
            <div>
              <h2 style={{ borderBottom: "1px solid #ddd" }}>미리보기</h2>
              <div>
                <strong>안건:</strong> {agenda}
              </div>
              <div>
                <strong>회의 날짜:</strong> {meetingDate}
              </div>
              <div>
                <strong>장소:</strong> {location}
              </div>
              <div>
                <strong>책임자명:</strong> {responsiblePerson}
              </div>
              <div>
                <strong>참석 인원:</strong> {attendees}
              </div>
              <div>
                <strong>회의 내용:</strong> {meetingContent}
              </div>
              <div>
                <strong>회의 결과:</strong> {meetingResult}
              </div>
              <h2>참석자 목록</h2>
              <ul>
                {participants.map((participant, index) => (
                  <li key={index}>
                    {participant.name} ({participant.studentId})
                  </li>
                ))}
              </ul>

              {/* 수정 및 다운로드 버튼 */}
              <div style={{ marginTop: "20px" }}>
                <button
                  onClick={handleEdit}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#f0ad4e",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  수정
                </button>
                <button
                  onClick={handleDownload}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  저장
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
