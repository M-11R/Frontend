"use client";

import { useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import axios from "axios";
import { fixDate } from "@/app/util/fixDate";
import { checkNull } from "@/app/util/check";
import { useRouter } from "next/navigation";

export default function ServiceTestForm(props: any) {
  const [isMounted, setIsMounted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const [testStartDate, setTestStartDate] = useState("");
  const [testEndDate, setTestEndDate] = useState("");
  const [testItemName, setTestItemName] = useState("");
  const [testPassStatus, setTestPassStatus] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePreview = () => setIsPreview(true);
  const handleEdit = () => setIsPreview(false);

  const handleDownload = async () => {
    const data = {
      tcname: testItemName,
      tcstart: fixDate(testStartDate),
      tcend: fixDate(testEndDate),
      tcpass: testPassStatus,
      pid: props.params.id,
    };

    if (checkNull(data)) {
      try {
        await axios.post("https://cd-api.chals.kim/api/output/testcase_add", data, {
          headers: { Authorization: process.env.SECRET_API_KEY },
        });
        router.push(`/project-main/${props.params.id}/outputManagement`);
      } catch (err) {
        alert("저장 중 오류가 발생했습니다.");
      }
    } else {
      alert("모든 필드를 입력해주세요.");
    }
  };

  if (!isMounted) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "linear-gradient(to bottom right, #F3F4F6, #E2E8F0)",
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
            overflowY: "auto",
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            margin: "20px",
          }}
        >
          <h1
            style={{
              borderBottom: "2px solid #4CAF50",
              paddingBottom: "10px",
              fontSize: "24px",
              color: "#4CAF50",
            }}
          >
            서비스 테스트 작성
          </h1>

          {!isPreview ? (
            <div>
              {/* 테스트 정보 섹션 */}
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ color: "#4CAF50", borderBottom: "1px solid #ddd" }}>테스트 정보</h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: "15px",
                    marginTop: "15px",
                  }}
                >
                  <label style={{ fontWeight: "bold" }}>테스트 시작일:</label>
                  <input
                    type="date"
                    value={testStartDate}
                    onChange={(e) => setTestStartDate(e.target.value)}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />

                  <label style={{ fontWeight: "bold" }}>테스트 종료일:</label>
                  <input
                    type="date"
                    value={testEndDate}
                    onChange={(e) => setTestEndDate(e.target.value)}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />

                  <label style={{ fontWeight: "bold" }}>테스트 항목 이름:</label>
                  <input
                    type="text"
                    value={testItemName}
                    onChange={(e) => setTestItemName(e.target.value)}
                    placeholder="테스트 항목 입력"
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />

                  <label style={{ fontWeight: "bold" }}>테스트 통과 여부:</label>
                  <input
                    type="checkbox"
                    checked={testPassStatus}
                    onChange={(e) => setTestPassStatus(e.target.checked)}
                    style={{ transform: "scale(1.5)" }}
                  />
                </div>
              </div>

              {/* 미리보기 버튼 */}
              <button
                onClick={handlePreview}
                style={{
                  padding: "12px 25px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#388E3C")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
              >
                미리보기
              </button>
            </div>
          ) : (
            <div>
              <h2 style={{ borderBottom: "1px solid #ddd", marginBottom: "10px", color: "#333" }}>
                미리보기
              </h2>
              <p>
                <strong>테스트 시작일:</strong> {testStartDate}
              </p>
              <p>
                <strong>테스트 종료일:</strong> {testEndDate}
              </p>
              <p>
                <strong>테스트 항목 이름:</strong> {testItemName}
              </p>
              <p>
                <strong>테스트 통과 여부:</strong> {testPassStatus ? "예" : "아니오"}
              </p>

              <div style={{ marginTop: "20px" }}>
                <button
                  onClick={handleEdit}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#f0ad4e",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
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
                    borderRadius: "8px",
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
