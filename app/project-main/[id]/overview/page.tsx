"use client";

import { useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import axios from "axios";
import { fixDate } from "@/app/util/fixDate";
import { checkNull } from "@/app/util/check";
import { useRouter } from "next/navigation";

export default function ProjectOverview(props: any) {
  // 상태 관리
  const [isMounted, setIsMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [roles, setRoles] = useState("");
  const [writeDate, setWriteDate] = useState("");
  const [overview, setOverview] = useState("");
  const [goal, setGoal] = useState("");
  const [scope, setScope] = useState("");
  const [techStack, setTechStack] = useState("");
  const [expectedOutcomes, setExpectedOutcomes] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePreview = () => setIsPreview(true);
  const handleEdit = () => setIsPreview(false);

  const handleDownload = async () => {
    const data = {
      pname: title,
      pteam: teamMembers,
      poverview: overview,
      poutcomes: expectedOutcomes,
      pgoals: goal,
      pstart: fixDate(startDate),
      pend: fixDate(endDate),
      prange: scope,
      pstack: techStack,
      pid: props.params.id,
    };

    if (checkNull(data)) {
      try {
        await axios.post(
          "https://cd-api.chals.kim/api/output/ovr_doc_add",
          data,
          { headers: { Authorization: process.env.SECRET_API_KEY } }
        );
        router.push(`/project-main/${props.params.id}/outputManagement`);
      } catch (err) {
        console.error("저장 실패:", err);
        alert("저장 중 오류가 발생했습니다.");
      }
    } else {
      alert("모든 필드를 입력해주세요.");
    }
  };

  if (!isMounted) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <MainHeader pid={props.params.id} />
      <div style={{ display: "flex", flex: 1 }}>
        <MainSide pid={props.params.id} />

        <div style={{ padding: "20px", width: "100%", overflowY: "auto" }}>
          <h1 style={{ borderBottom: "2px solid #4CAF50", paddingBottom: "10px", color: "#4CAF50" }}>
            프로젝트 개요서
          </h1>

          {!isPreview ? (
            <div>
              <Section title="기본 정보">
                <Field label="제목" value={title} setter={setTitle} />
                <Field label="시작일" value={startDate} setter={setStartDate} type="date" />
                <Field label="종료일" value={endDate} setter={setEndDate} type="date" />
              </Section>

              <Section title="팀 구성">
                <Field label="팀원" value={teamMembers} setter={setTeamMembers} />
                <Field label="역할" value={roles} setter={setRoles} />
              </Section>

              <Section title="프로젝트 세부사항">
                <Field label="작성일" value={writeDate} setter={setWriteDate} type="date" />
                <TextAreaField label="개요" value={overview} setter={setOverview} />
                <TextAreaField label="목표" value={goal} setter={setGoal} />
              </Section>

              <Section title="기술 및 결과">
                <TextAreaField label="범위" value={scope} setter={setScope} />
                <Field label="기술 스택" value={techStack} setter={setTechStack} />
                <TextAreaField label="예상 결과" value={expectedOutcomes} setter={setExpectedOutcomes} />
              </Section>

              <ActionButton label="미리보기" onClick={handlePreview} color="#4CAF50" />
            </div>
          ) : (
            <div>
              <h2 style={{ borderBottom: "1px solid #ddd", marginBottom: "20px" }}>미리보기</h2>
              <PreviewField label="제목" value={title} />
              <PreviewField label="시작일" value={startDate} />
              <PreviewField label="종료일" value={endDate} />
              <PreviewField label="팀원" value={teamMembers} />
              <PreviewField label="역할" value={roles} />
              <PreviewField label="작성일" value={writeDate} />
              <PreviewField label="개요" value={overview} />
              <PreviewField label="목표" value={goal} />
              <PreviewField label="범위" value={scope} />
              <PreviewField label="기술 스택" value={techStack} />
              <PreviewField label="예상 결과" value={expectedOutcomes} />

              <div style={{ marginTop: "20px" }}>
                <ActionButton label="수정" onClick={handleEdit} color="#f0ad4e" />
                <ActionButton label="저장" onClick={handleDownload} color="#2196F3" />
              </div>
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
