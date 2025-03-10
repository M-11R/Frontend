"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getUnivId } from "../util/storage";


type returnTask = {
  RESULT_CODE: number;
  RESULT_MSG: string;
  PAYLOADS: taskType[];
};

type taskType = {
  tid: number;
  tname: string;
  tperson: string;
  tstart: string;
  tend: string;
  tfinish: boolean;
};

const MainSide = ({ pid }: { pid: number }) => {
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const [selectedButton, setSelectedButton] = useState<{ index: number; subIndex: number | null } | null>(null);
  const [tasks, setTasks] = useState<taskType[]>([]); // ✅ To-Do List 데이터 상태 추가
  const router = useRouter();
  const tmpUnivId = getUnivId()

  const mainMenu = ["메인", "프로젝트 관리", "산출물 작성", "산출물 관리", "업무 관리"];
  const subMenu = [
    ["메인 페이지"],
    ["WBS 관리", "사용자 관리", "프로젝트 설정"],
    ["개요서", "회의록", "테스트", "요구사항", "보고서", "기타"],
    ["산출물 관리", "자료실"],
    ["업무 관리"],
    // ["평가", "확인"],
  ];
  const routMenu = [
    [`/project-main/${pid}/main`],
    [`/project-main/${pid}/wbsmanager`, `/project-main/${pid}/project-management/user`, `/project-main/${pid}/pm`],
    [`/project-main/${pid}/overview`, `/project-main/${pid}/minutes`, `/project-main/${pid}/servicetest`, `/project-main/${pid}/Requirements`, `/project-main/${pid}/Report`, `/project-main/${pid}/output/create`],
    [`/project-main/${pid}/outputManagement`, `/project-main/${pid}/library`],
    [`/project-main/${pid}/task`],
    [`/project-main/${pid}/grade`, `/project-main/${pid}/check`],
  ];

  useEffect(() => {
    loadTasks();
  }, [pid]);

  // ✅ To-Do List 데이터 불러오기
  const loadTasks = async () => {
    if(pid === 0) return;
    try {
      const response = await axios.post<returnTask>("https://cd-api.chals.kim/api/task/load", {pid: pid, univ_id: tmpUnivId}, {
        headers: { Authorization: process.env.SECRET_API_KEY },
      });

      // 완료되지 않은 작업만 필터링하고 마감일 순으로 정렬
      const filteredData = response.data.PAYLOADS.filter((item) => !item.tfinish)
        .sort((a, b) => new Date(a.tend).getTime() - new Date(b.tend).getTime())
        .slice(0, 2); // 최대 3개만 표시
      setTasks(filteredData);
    } catch (err) {
      
    }
  };
  

  // 메뉴 토글
  const handleToggle = (index: number) => {
    setVisibleIndex(visibleIndex === index ? null : index);
    setSelectedButton({ index, subIndex: null });
  };

  const gotoMenu = (index: number, subIndex: number) => {
    router.push(routMenu[index][subIndex]);
  };

  return (
    <div
      style={{
        width: "220px",
        minWidth: "220px",
        maxWidth: "220px",
        flexGrow: 0,
        backgroundColor: "#f4f4f4",
        // minHeight: "calc(100vh - 150px)",
        // maxHeight: "calc(100vh - 160px)",
        height: "auto",
        minHeight: 'calc(100vh - 110px)',
        padding: "10px",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        overflowY: "auto",
      }}
    >
      {/* ✅ To-Do List 추가 */}
      <div
        style={{
          padding: "15px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ fontSize: "18px", color: "#333", marginBottom: "10px" }}>📌 To-Do List2</h3>
        {tasks.length === 0 ? (
          <p style={{ fontSize: "14px", color: "#777" }}>할 일이 없습니다.</p>
        ) : (
          tasks.map((item) => (
            <div key={item.tid} style={{ marginBottom: "10px", fontSize: "14px", color: "#333" }}>
              <p style={{ fontWeight: "bold", color: new Date(item.tend) < new Date() ? "red" : "#007BFF" }}>
                {item.tname}
              </p>
              <p style={{ margin: 0 }}>마감일: {item.tend}</p>
            </div>
          ))
        )}
      </div>

      {/* ✅ 메뉴 바 */}
      {mainMenu.map((menu, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <button
            onClick={() => handleToggle(index)}
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              backgroundColor: selectedButton?.index === index ? "#007BFF" : "#fff",
              color: selectedButton?.index === index ? "#fff" : "#333",
              cursor: "pointer",
              boxShadow: selectedButton?.index === index ? "0 2px 4px rgba(0, 0, 0, 0.2)" : "none",
              transition: "all 0.3s",
            }}
          >
            {menu}
          </button>
          {visibleIndex === index && (
            <div style={{ marginTop: "5px" }}>
              {subMenu[index].map((submenu, subIndex) => (
                pid === 0 ? (
                  <button
                  key={subIndex}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "8px 12px",
                    margin: "2px 0",
                    border: "none",
                    backgroundColor: "#f9f9f9",
                    color: "#333",
                    textAlign: "left",
                    borderRadius: "5px",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E5F0FF")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
                >
                  {submenu}
                </button>
              ) :(
                <button
                  key={subIndex}
                  onClick={() => gotoMenu(index, subIndex)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "8px 12px",
                    margin: "2px 0",
                    border: "none",
                    backgroundColor: "#f9f9f9",
                    color: "#333",
                    textAlign: "left",
                    borderRadius: "5px",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E5F0FF")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
                >
                  {submenu}
                </button>
              )))}
            </div>
          )}
        </div>
      ))}
      
    </div>
  );
};

export default MainSide;
