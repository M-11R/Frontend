"use client";

import { useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import axios from "axios";
import { checkNull } from "@/app/util/check";
import { useRouter } from "next/navigation";

export default function RequirementsForm(props: any) {
  const [isMounted, setIsMounted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const [creationDate, setCreationDate] = useState("");
  const [systemRequirements, setSystemRequirements] = useState("");
  const [systemRequirementsDesc, setSystemRequirementsDesc] = useState("");
  const [functionalRequirements, setFunctionalRequirements] = useState("");
  const [functionalRequirementsDesc, setFunctionalRequirementsDesc] = useState("");
  const [functionalRequirementsPriority, setFunctionalRequirementsPriority] = useState<number | string>("");
  const [nonFunctionalRequirements, setNonFunctionalRequirements] = useState("");
  const [nonFunctionalRequirementsDesc, setNonFunctionalRequirementsDesc] = useState("");
  const [nonFunctionalRequirementsPriority, setNonFunctionalRequirementsPriority] = useState<number | string>("");
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePreview = () => setIsPreview(true);
  const handleEdit = () => setIsPreview(false);

  const handleDownload = async () => {
    const data = {
      작성일: creationDate,
      시스템_요구사항: systemRequirements,
      시스템_요구사항_설명: systemRequirementsDesc,
      기능_요구사항: functionalRequirements,
      기능_요구사항_설명: functionalRequirementsDesc,
      기능_요구사항_우선순위: functionalRequirementsPriority,
      비기능_요구사항: nonFunctionalRequirements,
      비기능_요구사항_설명: nonFunctionalRequirementsDesc,
      비기능_요구사항_우선순위: nonFunctionalRequirementsPriority,
      pid: props.params.id,
    };

    if (checkNull(data)) {
      try {
        await axios.post("https://cd-api.chals.kim/api/output/reqspec_add", data, {
          headers: { Authorization: process.env.SECRET_API_KEY },
        });
        router.push(`/project-main/${props.params.id}/outputManagement`);
      } catch (err) {
        console.error("저장 오류:", err);
        alert("저장 중 오류가 발생했습니다.");
      }
    } else {
      alert("모든 필드를 입력해주세요.");
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "linear-gradient(to bottom, #f3f4f6, #e5e7eb)",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <MainHeader pid={props.params.id} />

      <div style={{ display: "flex", flex: 1 }}>
        <MainSide pid={props.params.id} />

        <div
          style={{
            padding: "20px",
            width: "100%",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            margin: "20px",
            overflowY: "auto",
          }}
        >
          <h1
            style={{
              borderBottom: "3px solid #4CAF50",
              paddingBottom: "10px",
              color: "#4CAF50",
              fontSize: "24px",
              marginBottom: "20px",
            }}
          >
            요구사항 작성
          </h1>

          {!isPreview ? (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", marginBottom: "10px" }}>기본 정보</h2>
                <label>작성일:</label>
                <input
                  type="date"
                  value={creationDate}
                  onChange={(e) => setCreationDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginTop: "10px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", marginBottom: "10px" }}>시스템 요구사항</h2>
                <label>시스템 요구사항:</label>
                <input
                  type="text"
                  value={systemRequirements}
                  onChange={(e) => setSystemRequirements(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginTop: "10px",
                  }}
                />
                <label>시스템 요구사항 설명:</label>
                <textarea
                  value={systemRequirementsDesc}
                  onChange={(e) => setSystemRequirementsDesc(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginTop: "10px",
                    height: "120px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", marginBottom: "10px" }}>기능 요구사항</h2>
                <label>기능 요구사항:</label>
                <input
                  type="text"
                  value={functionalRequirements}
                  onChange={(e) => setFunctionalRequirements(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginTop: "10px",
                  }}
                />
                <label>기능 요구사항 설명:</label>
                <textarea
                  value={functionalRequirementsDesc}
                  onChange={(e) => setFunctionalRequirementsDesc(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginTop: "10px",
                    height: "120px",
                  }}
                />
                <label>기능 요구사항 우선순위:</label>
                <input
                  type="number"
                  value={functionalRequirementsPriority}
                  onChange={(e) => setFunctionalRequirementsPriority(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginTop: "10px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", marginBottom: "10px" }}>비기능 요구사항</h2>
                <label>비기능 요구사항:</label>
                <input
                  type="text"
                  value={nonFunctionalRequirements}
                  onChange={(e) => setNonFunctionalRequirements(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginTop: "10px",
                  }}
                />
                <label>비기능 요구사항 설명:</label>
                <textarea
                  value={nonFunctionalRequirementsDesc}
                  onChange={(e) => setNonFunctionalRequirementsDesc(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginTop: "10px",
                    height: "120px",
                  }}
                />
                <label>비기능 요구사항 우선순위:</label>
                <input
                  type="number"
                  value={nonFunctionalRequirementsPriority}
                  onChange={(e) => setNonFunctionalRequirementsPriority(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginTop: "10px",
                  }}
                />
              </div>
              <button
                onClick={handlePreview}
                style={{
                  padding: "12px 25px",
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                미리보기
              </button>
            </div>
          ) : (
            <div>
              <h2 style={{ borderBottom: "1px solid #ddd", marginBottom: "10px" }}>미리보기</h2>
              <p>
                <strong>작성일:</strong> {creationDate}
              </p>
              <p>
                <strong>시스템 요구사항:</strong> {systemRequirements}
              </p>
              <p>
                <strong>시스템 요구설명:</strong> {systemRequirementsDesc}
              </p>
              <p>
                <strong>기능 요구사항:</strong> {functionalRequirements}
              </p>
              <p>
                <strong>기능 요구사항 설명:</strong> {functionalRequirementsDesc}
              </p>
              <p>
                <strong>기능 요구사항 우선순위:</strong> {functionalRequirementsPriority}
              </p>
              <p>
                <strong>비기능 요구사항:</strong> {nonFunctionalRequirements}
              </p>
              <p>
                <strong>비기능 요구사항 설명:</strong> {nonFunctionalRequirementsDesc}
              </p>
              <p>
                <strong>비기능 요구사항 우선순위:</strong> {nonFunctionalRequirementsPriority}
              </p>

              <div style={{ marginTop: "20px" }}>
                <button
                  onClick={handleEdit}
                  style={{
                    padding: "12px 25px",
                    backgroundColor: "#f0ad4e",
                    color: "#fff",
                    borderRadius: "8px",
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
                    padding: "12px 25px",
                    backgroundColor: "#2196F3",
                    color: "#fff",
                    borderRadius: "8px",
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

