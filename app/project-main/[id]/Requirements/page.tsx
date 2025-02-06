"use client";

import { CSSProperties, useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getUnivId } from "@/app/util/storage";
import usePermissionGuard from "@/app/util/usePermissionGuard";

type reqType = {
  feature_name: string
  description: string
  priority: number
  non_functional_requirement_name: string
  non_functional_description: string
  non_functional_priority: number
  system_item: string
  system_description: string
  pid: number
}


export default function RequirementsForm(props: any) {
  const [isMounted, setIsMounted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const [creationDate, setCreationDate] = useState("");
  const [systemRequirements, setSystemRequirements] = useState("");
  const [systemRequirementsDesc, setSystemRequirementsDesc] = useState("");
  const [functionalRequirements, setFunctionalRequirements] = useState("");
  const [functionalRequirementsDesc, setFunctionalRequirementsDesc] = useState("");
  const [functionalRequirementsPriority, setFunctionalRequirementsPriority] = useState<number>(0);
  const [nonFunctionalRequirements, setNonFunctionalRequirements] = useState("");
  const [nonFunctionalRequirementsDesc, setNonFunctionalRequirementsDesc] = useState("");
  const [nonFunctionalRequirementsPriority, setNonFunctionalRequirementsPriority] = useState<number>(0);
  const router = useRouter();
  const s_no = getUnivId();
  useEffect(() => {
    setIsMounted(true);
  }, []);
  usePermissionGuard(props.params.id, s_no, {leader: 1, rs: 1}, true)

  const handlePreview = () => setIsPreview(true);
  const handleEdit = () => setIsPreview(false);

  const handleSave = async () => {
    const data: reqType = {
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
          <h1 style={titleStyle}>📝요구사항 작성</h1>

          {!isPreview ? (
            <div>
              {/* 기본 정보 */}
              <Section title="기본 정보">
                <Field label="작성일" value={creationDate} setter={setCreationDate} type="date" />
              </Section>

              {/* 시스템 요구사항 */}
              <Section title="시스템 요구사항">
                <Field label="시스템 요구사항" value={systemRequirements} setter={setSystemRequirements} />
                <TextAreaField
                  label="시스템 요구사항 설명"
                  value={systemRequirementsDesc}
                  setter={setSystemRequirementsDesc}
                />
              </Section>

              {/* 기능 요구사항 */}
              <Section title="기능 요구사항">
                <Field label="기능 요구사항" value={functionalRequirements} setter={setFunctionalRequirements} />
                <TextAreaField
                  label="기능 요구사항 설명"
                  value={functionalRequirementsDesc}
                  setter={setFunctionalRequirementsDesc}
                />
                <Field
                  label="기능 요구사항 우선순위"
                  value={functionalRequirementsPriority.toString()}
                  setter={(val) => setFunctionalRequirementsPriority(Number(val))}
                  type="number"
                />
              </Section>

              {/* 비기능 요구사항 */}
              <Section title="비기능 요구사항">
                <Field
                  label="비기능 요구사항"
                  value={nonFunctionalRequirements}
                  setter={setNonFunctionalRequirements}
                />
                <TextAreaField
                  label="비기능 요구사항 설명"
                  value={nonFunctionalRequirementsDesc}
                  setter={setNonFunctionalRequirementsDesc}
                />
                <Field
                  label="비기능 요구사항 우선순위"
                  value={nonFunctionalRequirementsPriority.toString()}
                  setter={(val) => setNonFunctionalRequirementsPriority(Number(val))}
                  type="number"
                />
              </Section>

              <ActionButton label="미리보기" onClick={handlePreview} color="#4CAF50" />
            </div>
          ) : (
            <div>
              <h2 style={sectionHeaderStyle}>미리보기</h2>
              <PreviewField label="작성일" value={creationDate} />
              <PreviewField label="시스템 요구사항" value={systemRequirements} />
              <PreviewField label="시스템 요구사항 설명" value={systemRequirementsDesc} />
              <PreviewField label="기능 요구사항" value={functionalRequirements} />
              <PreviewField label="기능 요구사항 설명" value={functionalRequirementsDesc} />
              <PreviewField label="기능 요구사항 우선순위" value={functionalRequirementsPriority.toString()} />
              <PreviewField label="비기능 요구사항" value={nonFunctionalRequirements} />
              <PreviewField label="비기능 요구사항 설명" value={nonFunctionalRequirementsDesc} />
              <PreviewField label="비기능 요구사항 우선순위" value={nonFunctionalRequirementsPriority.toString()} />

              <div style={{ marginTop: "20px" }}>
                <ActionButton label="수정" onClick={handleEdit} color="#f0ad4e" />
                <ActionButton label="저장" onClick={handleSave} color="#2196F3" />
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
        resize: "vertical",
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
