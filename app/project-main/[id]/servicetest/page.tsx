"use client";

import { useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import axios from "axios";
import { fixDate } from "@/app/util/fixDate";
import { checkNull } from "@/app/util/check";
import { useRouter } from "next/navigation";

export default function ServiceTestForm(props: any) {
  // 상태 관리
  const [isMounted, setIsMounted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const [testStartDate, setTestStartDate] = useState("");
  const [testEndDate, setTestEndDate] = useState("");
  const [testItemName, setTestItemName] = useState("");
  const [testPassStatus, setTestPassStatus] = useState("");
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
      tcname: testItemName,
      tcstart: fixDate(testStartDate),
      tcend: fixDate(testEndDate),
      tcpass: testPassStatus,
      pid: props.params.id,
    };

    // const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    // const url = URL.createObjectURL(blob);

    // const link = document.createElement("a");
    // link.href = url;
    // link.download = "service_test.json";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // URL.revokeObjectURL(url);
    if(checkNull(data)){
      try{
        const response = await axios.post("https://cd-api.chals.kim/api/output/testcase_add", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
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
          <h1 style={{ borderBottom: "2px solid #4CAF50", paddingBottom: "10px" }}>서비스 테스트 작성</h1>

          {!isPreview ? (
            <div>
              {/* 테스트 정보 입력 섹션 */}
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd" }}>테스트 정보</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginTop: "10px" }}>
                  <label>테스트 시작일:</label>
                  <input
                    type="date"
                    value={testStartDate}
                    onChange={(e) => setTestStartDate(e.target.value)}
                  />

                  <label>테스트 종료일:</label>
                  <input
                    type="date"
                    value={testEndDate}
                    onChange={(e) => setTestEndDate(e.target.value)}
                  />

                  <label>테스트 항목 이름:</label>
                  <input
                    type="text"
                    value={testItemName}
                    onChange={(e) => setTestItemName(e.target.value)}
                    placeholder="테스트 항목 입력"
                  />

                  <label>테스트 통과 여부:</label>
                  <select
                    value={testPassStatus}
                    onChange={(e) => setTestPassStatus(e.target.value)}
                  >
                    <option value="">선택</option>
                    <option value="pass">통과</option>
                    <option value="fail">불합격</option>
                  </select>
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
              <div>
                <strong>테스트 시작일:</strong> {testStartDate}
              </div>
              <div>
                <strong>테스트 종료일:</strong> {testEndDate}
              </div>
              <div>
                <strong>테스트 항목 이름:</strong> {testItemName}
              </div>
              <div>
                <strong>테스트 통과 여부:</strong> {testPassStatus}
              </div>

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
                  다운로드
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
