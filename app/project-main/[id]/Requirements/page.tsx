"use client";

import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import { useState } from "react";

export default function RequirementsForm(props: any) {
  const [isPreview, setIsPreview] = useState(false);

  const [creationDate, setCreationDate] = useState("");
  const [systemRequirements, setSystemRequirements] = useState("");
  const [systemRequirementsDesc, setSystemRequirementsDesc] = useState("");
  const [functionalRequirements, setFunctionalRequirements] = useState("");
  const [functionalRequirementsDesc, setFunctionalRequirementsDesc] = useState("");
  const [functionalRequirementsPriority, setFunctionalRequirementsPriority] = useState("");
  const [nonFunctionalRequirements, setNonFunctionalRequirements] = useState("");
  const [nonFunctionalRequirementsDesc, setNonFunctionalRequirementsDesc] = useState("");
  const [nonFunctionalRequirementsPriority, setNonFunctionalRequirementsPriority] = useState("");

  // 미리보기 토글
  const handlePreviewToggle = () => setIsPreview(!isPreview);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <MainHeader pid={props.params.id} />

      <div style={{ display: "flex", flex: 1 }}>
        <MainSide pid={props.params.id} />

        <div style={{ padding: "20px", width: "100%", overflowY: "auto" }}>
          {!isPreview ? (
            <div>
              <h1 style={{ borderBottom: "2px solid #4CAF50", paddingBottom: "10px" }}>요구사항 작성</h1>

              {/* 작성일 */}
              <div style={{ marginBottom: "20px" }}>
                <label>작성일:</label>
                <input
                  type="date"
                  value={creationDate}
                  onChange={(e) => setCreationDate(e.target.value)}
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>

              {/* 시스템 요구사항 */}
              <div style={{ marginBottom: "20px" }}>
                <label>시스템 요구사항:</label>
                <input
                  type="text"
                  value={systemRequirements}
                  onChange={(e) => setSystemRequirements(e.target.value)}
                  placeholder="시스템 요구사항 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label>시스템 요구사항 설명:</label>
                <textarea
                  value={systemRequirementsDesc}
                  onChange={(e) => setSystemRequirementsDesc(e.target.value)}
                  placeholder="시스템 요구사항 설명 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px", height: "100px" }}
                />
              </div>

              {/* 기능 요구사항 */}
              <div style={{ marginBottom: "20px" }}>
                <label>기능 요구사항:</label>
                <input
                  type="text"
                  value={functionalRequirements}
                  onChange={(e) => setFunctionalRequirements(e.target.value)}
                  placeholder="기능 요구사항 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label>기능 요구사항 설명:</label>
                <textarea
                  value={functionalRequirementsDesc}
                  onChange={(e) => setFunctionalRequirementsDesc(e.target.value)}
                  placeholder="기능 요구사항 설명 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px", height: "100px" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label>기능 요구사항 우선순위:</label>
                <input
                  type="text"
                  value={functionalRequirementsPriority}
                  onChange={(e) => setFunctionalRequirementsPriority(e.target.value)}
                  placeholder="기능 요구사항 우선순위 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>

              {/* 비기능 요구사항 */}
              <div style={{ marginBottom: "20px" }}>
                <label>비기능 요구사항:</label>
                <input
                  type="text"
                  value={nonFunctionalRequirements}
                  onChange={(e) => setNonFunctionalRequirements(e.target.value)}
                  placeholder="비기능 요구사항 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label>비기능 요구사항 설명:</label>
                <textarea
                  value={nonFunctionalRequirementsDesc}
                  onChange={(e) => setNonFunctionalRequirementsDesc(e.target.value)}
                  placeholder="비기능 요구사항 설명 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px", height: "100px" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label>비기능 요구사항 우선순위:</label>
                <input
                  type="text"
                  value={nonFunctionalRequirementsPriority}
                  onChange={(e) => setNonFunctionalRequirementsPriority(e.target.value)}
                  placeholder="비기능 요구사항 우선순위 입력"
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>

              {/* 미리보기 버튼 */}
              <button
                onClick={handlePreviewToggle}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "20px",
                }}
              >
                미리보기
              </button>
            </div>
          ) : (
            <div>
              <h1 style={{ borderBottom: "2px solid #4CAF50", paddingBottom: "10px" }}>요구사항 미리보기</h1>
              <p><strong>작성일:</strong> {creationDate}</p>
              <p><strong>시스템 요구사항:</strong> {systemRequirements}</p>
              <p><strong>시스템 요구사항 설명:</strong> {systemRequirementsDesc}</p>
              <p><strong>기능 요구사항:</strong> {functionalRequirements}</p>
              <p><strong>기능 요구사항 설명:</strong> {functionalRequirementsDesc}</p>
              <p><strong>기능 요구사항 우선순위:</strong> {functionalRequirementsPriority}</p>
              <p><strong>비기능 요구사항:</strong> {nonFunctionalRequirements}</p>
              <p><strong>비기능 요구사항 설명:</strong> {nonFunctionalRequirementsDesc}</p>
              <p><strong>비기능 요구사항 우선순위:</strong> {nonFunctionalRequirementsPriority}</p>
              <button
                onClick={handlePreviewToggle}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f0ad4e",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "20px",
                }}
              >
                수정
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
