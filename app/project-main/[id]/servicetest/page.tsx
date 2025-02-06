"use client";

import { CSSProperties, useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getUnivId } from "@/app/util/storage";
import usePermissionGuard from "@/app/util/usePermissionGuard";

export default function ServiceTestForm(props: any) {
  const [isMounted, setIsMounted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const [testStartDate, setTestStartDate] = useState("");
  const [testEndDate, setTestEndDate] = useState("");
  const [testItemName, setTestItemName] = useState("");
  const [testPassStatus, setTestPassStatus] = useState(false);
  const router = useRouter();
  const s_no = getUnivId();
  useEffect(() => {
    setIsMounted(true);
  }, []);
  usePermissionGuard(props.params.id, s_no, {leader: 1, ut: 1}, true)

  const handlePreview = () => setIsPreview(true);
  const handleEdit = () => setIsPreview(false);

  const handleSave = async () => {
    const data = {
      tcname: testItemName,
      tcstart: testStartDate,
      tcend: testEndDate,
      tcpass: testPassStatus,
      pid: props.params.id,
    };

    try {
      await axios.post("https://cd-api.chals.kim/api/output/testcase_add", data, {
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
          <h1 style={titleStyle}>📝서비스 테스트 작성</h1>

          {!isPreview ? (
            <div>
              {/* 테스트 정보 섹션 */}
              <Section title="테스트 정보">
                <Field label="테스트 시작일" value={testStartDate} setter={setTestStartDate} type="date" />
                <Field label="테스트 종료일" value={testEndDate} setter={setTestEndDate} type="date" />
                <Field label="테스트 항목 이름" value={testItemName} setter={setTestItemName} />
                <CheckboxField
                  label="테스트 통과 여부"
                  checked={testPassStatus}
                  setter={setTestPassStatus}
                />
              </Section>

              <ActionButton label="미리보기" onClick={handlePreview} color="#4CAF50" />
            </div>
          ) : (
            <div>
              <h2 style={sectionHeaderStyle}>미리보기</h2>
              <PreviewField label="테스트 시작일" value={testStartDate} />
              <PreviewField label="테스트 종료일" value={testEndDate} />
              <PreviewField label="테스트 항목 이름" value={testItemName} />
              <PreviewField label="테스트 통과 여부" value={testPassStatus ? "예" : "아니오"} />
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

const CheckboxField = ({
  label,
  checked,
  setter,
}: {
  label: string;
  checked: boolean;
  setter: (checked: boolean) => void;
}) => (
  <>
    <label style={{ fontWeight: "bold" }}>{label}:</label>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => setter(e.target.checked)}
      style={{
        marginLeft: "10px",
        transform: "scale(1.2)",
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
