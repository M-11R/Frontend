"use client";

import { CSSProperties, useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getUnivId } from "@/app/util/storage";
import usePermissionGuard from "@/app/util/usePermissionGuard";

export default function ProjectOverview(props: any) {
  const [isMounted, setIsMounted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

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
  useEffect(() => {
    setIsMounted(true);
  }, []);
  usePermissionGuard(props.params.id, s_no, {leader: 1, od: 1}, true)

  const handlePreview = () => setIsPreview(true);
  const handleEdit = () => setIsPreview(false);

  const handleDownload = async () => {
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

  if (!isMounted) return null;

  return (
    <div style={pageContainerStyle}>
      <MainHeader pid={props.params.id} />
      <div style={flexRowStyle}>
        <MainSide pid={props.params.id} />
        <div style={contentContainerStyle}>
          <h1 style={titleStyle}>📌 프로젝트 개요서</h1>

          {!isPreview ? (
            <div>
              <Section title="기본 정보">
                <Field label="프로젝트 제목" value={title} setter={setTitle} />
                <Field label="시작일" value={startDate} setter={setStartDate} type="date" />
                <Field label="종료일" value={endDate} setter={setEndDate} type="date" />
              </Section>

              <Section title="팀 구성">
                <Field label="팀원" value={teamMembers} setter={setTeamMembers} />
                <Field label="역할" value={roles} setter={setRoles} />
              </Section>

              <Section title="프로젝트 세부사항">
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
              <h2 style={sectionHeaderStyle}>미리보기</h2>
              <PreviewField label="프로젝트 제목" value={title} />
              <PreviewField label="시작일" value={startDate} />
              <PreviewField label="종료일" value={endDate} />
              <PreviewField label="팀원" value={teamMembers} />
              <PreviewField label="역할" value={roles} />
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
        width: "99%",
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
        width: "99%",
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
