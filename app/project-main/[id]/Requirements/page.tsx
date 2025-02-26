"use client";

import { CSSProperties, useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getUnivId } from "@/app/util/storage";
import usePermissionGuard from "@/app/util/usePermissionGuard";

export default function RequirementsForm(props: any) {
  const [isMounted, setIsMounted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // ✅ 요구사항 입력 상태값
  const [creationDate, setCreationDate] = useState("");
  const [systemRequirements, setSystemRequirements] = useState("");
  const [systemRequirementsDesc, setSystemRequirementsDesc] = useState("");
  const [functionalRequirements, setFunctionalRequirements] = useState("");
  const [functionalRequirementsDesc, setFunctionalRequirementsDesc] = useState("");
  const [functionalRequirementsPriority, setFunctionalRequirementsPriority] = useState<number>(1);
  const [nonFunctionalRequirements, setNonFunctionalRequirements] = useState("");
  const [nonFunctionalRequirementsDesc, setNonFunctionalRequirementsDesc] = useState("");
  const [nonFunctionalRequirementsPriority, setNonFunctionalRequirementsPriority] = useState<number>(1);

  const router = useRouter();
  const s_no = getUnivId();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  usePermissionGuard(props.params.id, s_no, { leader: 1, rs: 1 }, true);

  const handlePreview = () => setIsPreview(true);
  const handleEdit = () => setIsPreview(false);

  const handleSave = async () => {
    const data = {
      system_item: systemRequirements,
      system_description: systemRequirementsDesc,
      feature_name: functionalRequirements,
      description: functionalRequirementsDesc,
      priority: functionalRequirementsPriority,
      non_functional_requirement_name: nonFunctionalRequirements,
      non_functional_description: nonFunctionalRequirementsDesc,
      non_functional_priority: nonFunctionalRequirementsPriority,
      pid: props.params.id,
    };

    try {
      await axios.post("https://cd-api.chals.kim/api/output/reqspec_add", data, {
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
          <h1 style={titleStyle}>📝 요구사항 작성</h1>

          {!isPreview ? (
            <div>
              {/* 기본 정보 */}
              <Section title="기본 정보">
                <Field label="작성일" value={creationDate} setter={setCreationDate} type="date" />
              </Section>

              {/* 시스템 요구사항 */}
              <Section title="시스템 요구사항">
                <Field label="요구사항" value={systemRequirements} setter={setSystemRequirements} />
                <TextAreaField label="설명" value={systemRequirementsDesc} setter={setSystemRequirementsDesc} />
              </Section>

              {/* 기능 요구사항 */}
              <Section title="기능 요구사항">
                <Field label="요구사항" value={functionalRequirements} setter={setFunctionalRequirements} />
                <TextAreaField label="설명" value={functionalRequirementsDesc} setter={setFunctionalRequirementsDesc} />
                <Field label="우선순위 (1~3)" value={functionalRequirementsPriority.toString()} setter={(val) => setFunctionalRequirementsPriority(Number(val))} type="number" />
              </Section>

              {/* 비기능 요구사항 */}
              <Section title="비기능 요구사항">
                <Field label="요구사항" value={nonFunctionalRequirements} setter={setNonFunctionalRequirements} />
                <TextAreaField label="설명" value={nonFunctionalRequirementsDesc} setter={setNonFunctionalRequirementsDesc} />
                <Field label="우선순위 (1~3)" value={nonFunctionalRequirementsPriority.toString()} setter={(val) => setNonFunctionalRequirementsPriority(Number(val))} type="number" />
              </Section>

              <ActionButton label="미리보기" onClick={handlePreview} color="#4CAF50" />
            </div>
          ) : (
            <Preview
              creationDate={creationDate}
              systemRequirements={systemRequirements}
              systemRequirementsDesc={systemRequirementsDesc}
              functionalRequirements={functionalRequirements}
              functionalRequirementsDesc={functionalRequirementsDesc}
              functionalRequirementsPriority={functionalRequirementsPriority}
              nonFunctionalRequirements={nonFunctionalRequirements}
              nonFunctionalRequirementsDesc={nonFunctionalRequirementsDesc}
              nonFunctionalRequirementsPriority={nonFunctionalRequirementsPriority}
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
  creationDate,
  systemRequirements,
  systemRequirementsDesc,
  functionalRequirements,
  functionalRequirementsDesc,
  functionalRequirementsPriority,
  nonFunctionalRequirements,
  nonFunctionalRequirementsDesc,
  nonFunctionalRequirementsPriority,
  handleEdit,
  handleSave,
}: any) => (
  <div style={previewContainerStyle}>
    <h2 style={sectionHeaderStyle}>📝 요구사항 명세서 미리보기</h2>

    <table style={tableStyle}>
      <thead>
        <tr>
          <th colSpan={4} style={thStyle}>기본 정보</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={thStyle}>작성일</td>
          <td colSpan={3} style={tdStyle}>{creationDate}</td>
        </tr>
      </tbody>

      <thead>
        <tr>
          <th colSpan={4} style={thStyle}>시스템 요구사항</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={4} style={tdStyle}>{systemRequirements}</td>
        </tr>
        <tr>
          <td colSpan={4} style={tdStyle}>{systemRequirementsDesc}</td>
        </tr>
      </tbody>

      <thead>
        <tr>
          <th colSpan={4} style={thStyle}>기능 요구사항</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={thStyle}>항목</td>
          <td style={tdStyle}>{functionalRequirements}</td>
          <td style={thStyle}>우선순위</td>
          <td style={{ 
            ...tdStyle, 
            fontWeight: "bold", 
            color: functionalRequirementsPriority === 3 ? "#D32F2F" : functionalRequirementsPriority === 2 ? "#F57C00" : "#2E7D32",
            backgroundColor: functionalRequirementsPriority === 3 ? "#FFEBEE" : functionalRequirementsPriority === 2 ? "#FFF3E0" : "#E8F5E9"
          }}>
            {["낮음", "보통", "높음"][functionalRequirementsPriority - 1]}
          </td>
        </tr>
        <tr>
          <td colSpan={4} style={tdStyle}>{functionalRequirementsDesc}</td>
        </tr>
      </tbody>

      <thead>
        <tr>
          <th colSpan={4} style={thStyle}>비기능 요구사항</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={thStyle}>항목</td>
          <td style={tdStyle}>{nonFunctionalRequirements}</td>
          <td style={thStyle}>우선순위</td>
          <td style={{ 
            ...tdStyle, 
            fontWeight: "bold", 
            color: nonFunctionalRequirementsPriority === 3 ? "#D32F2F" : nonFunctionalRequirementsPriority === 2 ? "#F57C00" : "#2E7D32",
            backgroundColor: nonFunctionalRequirementsPriority === 3 ? "#FFEBEE" : nonFunctionalRequirementsPriority === 2 ? "#FFF3E0" : "#E8F5E9"
          }}>
            {["낮음", "보통", "높음"][nonFunctionalRequirementsPriority - 1]}
          </td>
        </tr>
        <tr>
          <td colSpan={4} style={tdStyle}>{nonFunctionalRequirementsDesc}</td>
        </tr>
      </tbody>
    </table>

    <div style={buttonContainerStyle}>
      <ActionButton label="수정" onClick={handleEdit} color="#f0ad4e" />
      <ActionButton label="저장" onClick={handleSave} color="#2196F3" />
    </div>
  </div>
);


// ✅ 미리보기 컨테이너 스타일
const previewContainerStyle: CSSProperties = { 
  padding: "20px", 
  backgroundColor: "#fff", 
  borderRadius: "12px", 
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  marginTop: "20px"
};

const tableStyle: CSSProperties = { 
  width: "100%", 
  borderCollapse: "collapse", 
  marginBottom: "20px", 
};

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

const buttonContainerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
  gap: "10px"
};


// ✅ 페이지 레이아웃 스타일
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

// ✅ 제목 스타일
const titleStyle: CSSProperties = {
  borderBottom: "3px solid #4CAF50",
  paddingBottom: "10px",
  fontSize: "24px",
  fontWeight: "bold",
  color: "#4CAF50",
};

// ✅ 섹션 헤더 스타일
const sectionHeaderStyle: CSSProperties = {
  color: "#4CAF50",
  borderBottom: "1px solid #ddd",
  marginBottom: "20px",
};

// ✅ 섹션 컴포넌트
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: "20px" }}>
    <h2 style={sectionHeaderStyle}>{title}</h2>
    {children}
  </div>
);

// ✅ 입력 필드 컴포넌트
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
        boxSizing: "border-box",
      }}
    />
  </>
);

// ✅ 텍스트 영역 필드 컴포넌트
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
        resize: "vertical",
        boxSizing: "border-box",
      }}
    />
  </>
);

// ✅ 미리보기 필드 컴포넌트
const PreviewField = ({ label, value }: { label: string; value: string }) => (
  <p>
    <strong>{label}:</strong> {value}
  </p>
);

// ✅ 버튼 컴포넌트
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
