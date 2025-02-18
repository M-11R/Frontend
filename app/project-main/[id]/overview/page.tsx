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

  // ✅ 입력 필드 상태
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

  usePermissionGuard(props.params.id, s_no, { leader: 1, od: 1 }, true);

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
            <Preview 
              title={title}
              startDate={startDate}
              endDate={endDate}
              teamMembers={teamMembers}
              roles={roles}
              overview={overview}
              goal={goal}
              scope={scope}
              techStack={techStack}
              expectedOutcomes={expectedOutcomes}
              handleEdit={handleEdit}
              handleDownload={handleDownload}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ✅ 미리보기 컴포넌트
const Preview = ({ title, startDate, endDate, teamMembers, roles, overview, goal, scope, techStack, expectedOutcomes, handleEdit, handleDownload }: any) => (
  <div style={previewContainerStyle}>
  <h2 style={sectionHeaderStyle}>📄 프로젝트 개요서</h2>

  {/* ✅ 프로젝트 기본 정보 테이블 */}
  {/* <table style={tableStyle}>
  <tbody>
    <tr>
      <th style={thStyle}>제목</th>
      <td colSpan={3} style={tdStyle}>{title}</td>
    </tr>
    <tr>
      <th style={thStyle}>팀원</th>
      <td style={tdStyle}>{teamMembers}</td>
      <th style={thStyle}>역할</th>
      <td style={tdStyle}>{roles}</td>
    </tr>
    <tr>
      <th style={thStyle}>시작일</th>
      <td style={tdStyle}>{startDate}</td>
      <th style={thStyle}>종료일</th>
      <td style={tdStyle}>{endDate}</td>
    </tr>
  </tbody>
</table> */}

<table style={tableStyle}>
  <thead>
    <th></th>
    <th></th>
    <th></th>
    <th></th>
  </thead>
  <tbody>
    <tr>
      <td style={thStyle}>제 목</td>
      <td colSpan={3} style={tdStyle}>{title}</td>
    </tr>
    <tr>
      <td style={thStyle}>프로젝트 시작일</td>
      <td style={tdStyle}>{startDate}</td>
      <td rowSpan={2} style={thStyle}>팀 구성 및 역할 분담</td>
      <td rowSpan={2} style={tdStyle}>
        {teamMembers}
        {roles}
      </td>
    </tr>
    <tr>
      <td style={thStyle}>프로젝트 종료일</td>
      <td style={tdStyle}>{endDate}</td>
    </tr>
    <tr>
      <td style={thStyle}>작성일</td>
      <td colSpan={3} style={tdStyle}></td>
    </tr>
    <tr>
      <td colSpan={4} style={thStyle}>프로젝트 개요</td>
    </tr>
    <tr>
      <td colSpan={4} style={tdStyle}>{overview} </td>
    </tr>
    <tr>
      <td colSpan={4} style={thStyle}>프로젝트 목표</td>
    </tr>
    <tr>
      <td colSpan={4} style={tdStyle}>{goal} </td>
    </tr>
    <tr>
      <td colSpan={4} style={thStyle}>프로젝트 범위</td>
    </tr>
    <tr>
      <td colSpan={4} style={tdStyle}>{scope} </td>
    </tr>
    <tr>
      <td colSpan={4} style={thStyle}>기술 스택 및 도구</td>
    </tr>
    <tr>
      <td colSpan={4} style={tdStyle}>{techStack} </td>
    </tr>
    <tr>
      <td colSpan={4} style={thStyle}>기대 성과</td>
    </tr>
    <tr>
      <td colSpan={4} style={tdStyle}>{expectedOutcomes} </td>
    </tr>
  </tbody>
</table>


  {/* ✅ 프로젝트 상세 정보 */}
  {/* <div style={detailSectionStyle}>
    <div style={textBlockStyle}><strong>개요:</strong> {overview}</div>
    <div style={textBlockStyle}><strong>목표:</strong> {goal}</div>
    <div style={textBlockStyle}><strong>범위:</strong> {scope}</div>
    <div style={textBlockStyle}><strong>기술 스택:</strong> {techStack}</div>
    <div style={textBlockStyle}><strong>예상 결과:</strong> {expectedOutcomes}</div>
  </div> */}

  {/* ✅ 버튼 영역 */}
  <div style={buttonContainerStyle}>
    <ActionButton label="수정" onClick={handleEdit} color="#f0ad4e" />
    <ActionButton label="저장" onClick={handleDownload} color="#2196F3" />
  </div>
</div>

);




const commonBorder = "1px solid #ddd";
const commonPadding = "10px";
const commonRadius = "8px";


/* ✅ 전체 레이아웃 */
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
  borderRadius: commonRadius,
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  margin: "20px",
};


/* ✅ 제목 및 섹션 */
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
  marginBottom: "10px",
};

/* ✅ 미리보기 */
const previewContainerStyle: CSSProperties = { 
  padding: "20px", 
  backgroundColor: "#fff", 
  borderRadius: commonRadius, 
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  marginTop: "20px"
};

const detailSectionStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "20px"
};

/* ✅ 테이블 */
const tableStyle: CSSProperties = { 
  width: "100%", 
  borderCollapse: "collapse", 
  marginBottom: "20px", 
  // tableLayout: "fixed"
};

const thStyle: CSSProperties = { 
  backgroundColor: "#dbdbdb", 
  padding: "12px", 
  border: "1px solid #000000", 
  textAlign: "center", 
  fontWeight: "bold",
  verticalAlign: "middle", // ✅ 세로 중앙 정렬
  width: "25%",
  whiteSpace: "pre-wrap", // 자동 줄바꿈
  wordWrap: "break-word", // 긴 단어/문장도 줄바꿈
};

const tdStyle: CSSProperties = { 
  padding: "12px", 
  border: "1px solid #000000", 
  textAlign: "center",
  verticalAlign: "middle", // ✅ 세로 중앙 정렬
  backgroundColor: "#fff", 
  width: "25%",
  whiteSpace: "pre-wrap", // 자동 줄바꿈
  wordWrap: "break-word", // 긴 단어/문장도 줄바꿈
};


/* ✅ 텍스트 박스 */
const textBlockStyle: CSSProperties = { 
  padding: "12px", 
  backgroundColor: "#f8f9fa", 
  borderRadius: "6px",
  border: "1px solid #ddd",
  marginBottom: "10px"
};

/* ✅ 버튼 */
const buttonContainerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
  gap: "10px"
};


//윗 부분 개선중 까먹 ㄴㄴ


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
