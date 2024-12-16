"use client";

import { useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import axios from "axios";
import { checkNull } from "@/app/util/check";
import { useRouter } from 'next/navigation'

export default function RequirementsForm(props: any) {
  // 상태 관리
  const [isMounted, setIsMounted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const [creationDate, setCreationDate] = useState("");
  const [systemRequirements, setSystemRequirements] = useState("");
  const [systemRequirementsDesc, setSystemRequirementsDesc] = useState("");
  const [functionalRequirements, setFunctionalRequirements] = useState("");
  const [functionalRequirementsDesc, setFunctionalRequirementsDesc] = useState("");
  const [functionalRequirementsPriority, setFunctionalRequirementsPriority] = useState(0);
  const [nonFunctionalRequirements, setNonFunctionalRequirements] = useState("");
  const [nonFunctionalRequirementsDesc, setNonFunctionalRequirementsDesc] = useState("");
  const [nonFunctionalRequirementsPriority, setNonFunctionalRequirementsPriority] = useState(0);
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
    const data = {
      작성일: creationDate,
      feature_name: functionalRequirements,
      description: functionalRequirementsDesc,
      priority: functionalRequirementsPriority,
      non_functional_requirement_name: nonFunctionalRequirements,
      non_functional_description: nonFunctionalRequirementsDesc,
      non_functional_priority: nonFunctionalRequirementsPriority,
      system_item: systemRequirements,
      system_description: systemRequirementsDesc,
      pid: props.params.id
    };

    // const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    // const url = URL.createObjectURL(blob);

    // const link = document.createElement("a");
    // link.href = url;
    // link.download = "requirements.json";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // URL.revokeObjectURL(url);
    if(checkNull(data)){
      try{
        const response = await axios.post("https://cd-api.chals.kim/api/output/reqspec_add", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
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
          <h1 style={{ borderBottom: "2px solid #4CAF50", paddingBottom: "10px" }}>요구사항 작성</h1>

          {!isPreview ? (
            <div>
              {/* 기본 정보 입력 */}
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd" }}>기본 정보</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginTop: "10px" }}>
                  <label>작성일:</label>
                  <input
                    type="date"
                    value={creationDate}
                    onChange={(e) => setCreationDate(e.target.value)}
                  />
                </div>
              </div>

              {/* 시스템 요구사항 */}
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd" }}>시스템 요구사항</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginTop: "10px" }}>
                  <label>시스템 요구사항:</label>
                  <input
                    type="text"
                    value={systemRequirements}
                    onChange={(e) => setSystemRequirements(e.target.value)}
                    placeholder="시스템 요구사항 입력"
                  />

                  <label>시스템 요구사항 설명:</label>
                  <textarea
                    value={systemRequirementsDesc}
                    onChange={(e) => setSystemRequirementsDesc(e.target.value)}
                    placeholder="시스템 요구사항 설명 입력"
                    style={{ height: "100px" }}
                  />
                </div>
              </div>

              {/* 기능 요구사항 */}
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd" }}>기능 요구사항</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginTop: "10px" }}>
                  <label>기능 요구사항:</label>
                  <input
                    type="text"
                    value={functionalRequirements}
                    onChange={(e) => setFunctionalRequirements(e.target.value)}
                    placeholder="기능 요구사항 입력"
                  />

                  <label>기능 요구사항 설명:</label>
                  <textarea
                    value={functionalRequirementsDesc}
                    onChange={(e) => setFunctionalRequirementsDesc(e.target.value)}
                    placeholder="기능 요구사항 설명 입력"
                    style={{ height: "100px" }}
                  />

                  <label>기능 요구사항 우선순위:</label>
                  <input
                    type="number"
                    value={functionalRequirementsPriority}
                    onChange={(e) => setFunctionalRequirementsPriority(e.target.valueAsNumber)}
                    placeholder="기능 요구사항 우선순위 입력(숫자만 입력)"
                  />
                </div>
              </div>

              {/* 비기능 요구사항 */}
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd" }}>비기능 요구사항</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginTop: "10px" }}>
                  <label>비기능 요구사항:</label>
                  <input
                    type="text"
                    value={nonFunctionalRequirements}
                    onChange={(e) => setNonFunctionalRequirements(e.target.value)}
                    placeholder="비기능 요구사항 입력"
                  />

                  <label>비기능 요구사항 설명:</label>
                  <textarea
                    value={nonFunctionalRequirementsDesc}
                    onChange={(e) => setNonFunctionalRequirementsDesc(e.target.value)}
                    placeholder="비기능 요구사항 설명 입력"
                    style={{ height: "100px" }}
                  />

                  <label>비기능 요구사항 우선순위:</label>
                  <input
                    type="number"
                    value={nonFunctionalRequirementsPriority}
                    onChange={(e) => setNonFunctionalRequirementsPriority(e.target.valueAsNumber)}
                    placeholder="비기능 요구사항 우선순위 입력(숫자만 입력)"
                  />
                </div>
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
                  marginTop: "20px",
                }}
              >
                미리보기
              </button>
            </div>
          ) : (
            <div>
              <h2 style={{ borderBottom: "1px solid #ddd" }}>미리보기</h2>
              <p><strong>작성일:</strong> {creationDate}</p>
              <p><strong>시스템 요구사항:</strong> {systemRequirements}</p>
              <p><strong>시스템 요구사항 설명:</strong> {systemRequirementsDesc}</p>
              <p><strong>기능 요구사항:</strong> {functionalRequirements}</p>
              <p><strong>기능 요구사항 설명:</strong> {functionalRequirementsDesc}</p>
              <p><strong>기능 요구사항 우선순위:</strong> {functionalRequirementsPriority}</p>
              <p><strong>비기능 요구사항:</strong> {nonFunctionalRequirements}</p>
              <p><strong>비기능 요구사항 설명:</strong> {nonFunctionalRequirementsDesc}</p>
              <p><strong>비기능 요구사항 우선순위:</strong> {nonFunctionalRequirementsPriority}</p>

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
