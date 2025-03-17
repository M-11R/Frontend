"use client";

import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import TodoList from "@/app/components/Todo";
import LLMChat from "@/app/components/LLMChat";
import axios from "axios";
import { useEffect, useState } from "react";
import { getToken, getUserId } from "../util/storage";
import { useRouter } from "next/navigation";

type wbsRatio = {
  group1no: number;
  group1: string;
  ratio: number;
};

export default function Main(props: any) {
  const [ratio, setRatio] = useState<wbsRatio[]>([]);
  const [showPopup, setShowPopup] = useState(true); // ✅ 팝업 상태 추가
  const [projectId, setProjectId] = useState<number | null>(null);

  const check = async() => {
    const uid = getUserId();
    const token = getToken();
    const router = useRouter();
    try{
      const response = await axios.post(
        "https://cd-api.chals.kim/api/acc/checksession",
        { user_id: uid,
          token: token },
        { headers: { Authorization: process.env.SECRET_API_KEY } }
      );

      if(response.data.RESULT_CODE !== 200){router.push('/')}
    }catch(err){}
  }

  const loadWBS = async () => {
    if (!projectId) return;

    try {
      const response = await axios.post(
        "https://cd-api.chals.kim/api/wbs/load_ratio",
        { pid: projectId },
        { headers: { Authorization: process.env.SECRET_API_KEY } }
      );
      const tmpRatio = response.data.RESULT_MSG;
      setRatio(tmpRatio);
    } catch (err) {
      console.error("진척도 로드 실패:", err);
    }
  };

  const handleProjectSelection = (id: number) => {
    setProjectId(id);
    setShowPopup(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    // loadWBS();
  }, [projectId]);

  return (
    <div style={{ height: "100vh"}}>
      {/* 메인 헤더 */}
      <MainHeader pid={0} />

      {/* Body */}
      <div style={{ backgroundColor: "#f9f9f9", display: "flex", flex: 1, height: 'calc(100% - 100px)'}}>
        {/* 왼쪽 사이드 */}
        <MainSide pid={0} />

        {/* 메인 페이지 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "10px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* 페이지 위 : 진척도 */}
          <div style={{ display: "flex", gap: "10px", height: "30%" }}>
            {/* 진척도 섹션 */}
            <div
              style={{
                flex: 7,
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: "#f0f7ff",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {Array.from({ length: Math.ceil(ratio.length / 3) }, (_, rowIndex) => (
                  <div key={rowIndex} style={{ display: "flex", width: "100%", flex: 1 }}>
                    {ratio.slice(rowIndex * 3, rowIndex * 3 + 3).map((item, colIndex) => (
                      <div
                        key={colIndex}
                        style={{
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "24px",
                          backgroundColor: "#ffffff",
                          border: "1px solid #ddd",
                          borderRadius: "5px",
                          margin: "2px",
                        }}
                      >
                        {item.group1}: {item.ratio}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Todo List 섹션 */}
            <div
              style={{
                flex: 4,
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: "#ffffff",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ marginBottom: "10px", fontSize: "16px", fontWeight: "bold" }}>Todo List 2</div>
              <div style={{ borderBottom: "2px solid #ddd", marginBottom: "5px" }}></div>
              {/* <TodoList p_id={projectId || 0} /> */}
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", height: '70%'}}>
            {/* 팀원 */}
            <div
              style={{
                flex: 1, 
                padding: "10px",
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                overflowY: 'auto',
              }}
            >
              <div style={{ marginBottom: "10px", fontSize: "16px", fontWeight: "bold" }}>팀원2</div>
              <div style={{ borderBottom: "2px solid #ddd", marginBottom: "10px" }}></div> {/**밑줄 */}
              <div style={{height: '80%', width: '95%'}}> {/**팀 인원 넣는 칸 */}
                <div style={{display: 'flex', width: '100%', whiteSpace: "pre-wrap"}}> {/**팀장 및 담당교수 */}
                  <div style={{position: "relative", width: '30%', height: '100px',
                    // border: '1px solid #000', 
                    display: 'flex', alignItems: 'flex-end'}}>
                    
                    
                  </div>
                  <div style={{position: "relative", width: '30%', height: '100px',
                    // border: '1px solid #000', 
                    display: 'flex', alignItems: 'flex-end', marginLeft: 'auto'}}>
                  
                  </div>
                </div>
                
              </div>
            </div>

            {/* LLM 섹션 */}
            <div
              style={{
                flex: 3, 
                padding: "10px",
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ marginBottom: "10px", fontSize: "16px", fontWeight: "bold" }}>PMS Assistant</div>
              <div style={{ borderBottom: "2px solid #ddd", marginBottom: "10px" }}></div>
              <div style={{ fontSize: "14px", color: "#777", height: '100%' }}>
                {/* <LLMChat pid = {props.params.id} /> */}
              </div>
            </div>
          </div>

          {/* 팝업 창 */}
          {showPopup && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: '9999'
              }}
            >
              <div
                style={{
                  width: "400px",
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "10px",
                  textAlign: "center",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                <h2 style={{ color: "#333", fontSize: "22px", marginBottom: "15px" }}>📌 프로젝트 선택</h2>
                <p style={{ color: "#666", fontSize: "16px", marginBottom: "20px" }}>
                  현재 페이지는 임시 페이지입니다. <br />
                  새 프로젝트를 생성하거나 상단 탭에있는 기존 프로젝트를 선택하세요.
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>

                   

                  <button
                    onClick={handleClosePopup}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#ccc",
                      color: "#333",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
