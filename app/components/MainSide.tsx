"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getUserId, getToken, getUnivId } from '../util/storage';
import { limitTitle } from '../util/string';

const MainSide = ({ pid }: { pid: number }) => {
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const [selectedButton, setSelectedButton] = useState<{ index: number; subIndex: number | null } | null>(null);
  const [data, setData] = useState<any[]>([]);
  const router = useRouter();

  const mainMenu = ["메인", "WBS 관리", "산출물 작성", "산출물 관리", "업무 관리"];
  const subMenu = [
    ["메인 페이지"],
    ["WBS 관리", "사용자 관리"],
    ["개요서", "회의록", "테스트", "요구사항", "보고서", "기타"],
    ["산출물 관리"],
    ["업무 관리"]
  ];
  const routMenu = [
    [`/project-main/${pid}/main`],
    [`/project-main/${pid}/wbsmanager`, `/project-main/${pid}/project-management/user`],
    [`/project-main/${pid}/overview`, `/project-main/${pid}/minutes`, `/project-main/${pid}/servicetest`, `/project-main/${pid}/Requirements`, `/project-main/${pid}/Report`, `/project-main/${pid}/output/create`],
    [`/project-main/${pid}/outputManagement`],
    [`/project-main/${pid}/task`]
  ];

  useEffect(() => {
    loadTask();
  }, [pid]);

  const loadTask = async () => {
    const univId = getUnivId();
    const postData = { pid, univ_id: univId };
    try {
      const response = await axios.post("https://cd-api.chals.kim/api/task/load", postData, {
        headers: { Authorization: process.env.SECRET_API_KEY },
      });
      const sortedData = response.data.PAYLOADS.sort((a: any, b: any) => new Date(a.tend).getTime() - new Date(b.tend).getTime());
      setData(sortedData.slice(0, 3)); // 상위 3개의 작업만 표시
    } catch (err) {
      console.error("To-Do List 로드 실패:", err);
    }
  };

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
        marginLeft: "100px",
        display: "relative",
        justifyContent: "center",
        alignItems: "center",
        width: "220px",
        backgroundColor: "#f4f4f4",
        height: "calc(100vh - 105px)",
        padding: "10px",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
      }}
    >
      {/* To-Do List */}
      <div
        style={{
          padding: "15px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ fontSize: "18px", color: "#333", marginBottom: "10px" }}>To-Do List</h3>
        {data.length === 0 ? (
          <p style={{ fontSize: "14px", color: "#777" }}>할 일이 없습니다.</p>
        ) : (
          data.map((item) => (
            <div key={item.tid} style={{ marginBottom: "10px", fontSize: "14px", color: "#333" }}>
              <p style={{ marginBottom: "5px", fontWeight: "bold", color: "#007BFF" }}>{limitTitle(item.tname, 15)}</p>
              <p style={{ margin: 0 }}>마감일: {item.tend}</p>
            </div>
          ))
        )}
      </div>

      {/* 메뉴 바 */}
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
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MainSide;
