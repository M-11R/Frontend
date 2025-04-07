"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { LoginModal } from "./components/AccountModal";
import axios from "axios";
import { getToken, getName, getUserId, clearStorage } from "./util/storage";
import useSessionGuard from "./util/checkAccount";

export default function Home() {
  const [session, setSession] = useState(false);
  const id = getUserId();
  const token = getToken();
  const check = useSessionGuard();
  const name = getName();

  useEffect(() => {
    if (check !== null) {
      if (check !== 0) {
        setSession(true);
      } else {
        setSession(false);
        clearStorage();
      }
    }
  }, [check]);

  const signOut = async () => {
    try {
      const response = await axios.post(
        "https://cd-api.chals.kim/api/acc/signout",
        { token },
        { headers: { Authorization: process.env.SECRET_API_KEY } }
      );
      if (response.data.RESULT_CODE === 200) {
        clearStorage();
        setSession(false);
        alert("로그아웃 되었습니다.");
      }
    } catch (err) {
      try {
        const response = await axios.post(
          "https://cd-api.chals.kim/api/prof/signout",
          { token },
          { headers: { Authorization: process.env.SECRET_API_KEY } }
        );
        if (response.data.RESULT_CODE === 200) {
          clearStorage();
          setSession(false);
          alert("로그아웃 되었습니다.");
        }
      } catch (err) {}
    }
  };

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(to bottom, #f0f0f0, #FFFFFF)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Roboto', sans-serif",
        padding: "0 20px",
        color: "#333",
      }}
    >
      {/* 상단 로그인 버튼 */}
      <header
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          display: "flex",
          gap: "15px",
        }}
      >
        {session ? (
          <button
            onClick={signOut}
            style={{
              fontSize: "1em",
              color: "#5858FA",
              textDecoration: "none",
              fontWeight: "bold",
              border: "1px solid #5858FA",
              padding: "8px 12px",
              borderRadius: "6px",
              transition: "all 0.3s",
            }}
          >
            로그아웃
          </button>
        ) : (
          <LoginModal />
        )}
      </header>

      {/* 메인 콘텐츠 카드 */}
      <main
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "40px 50px",
          borderRadius: "12px",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          maxWidth: "640px",
        }}
      >
        {session && (
          <p
            style={{
              fontSize: "1.2em",
              marginBottom: "10px",
              fontWeight: "bold",
              color: "#22c55e",
            }}
          >
            👋 {name}님, 환영합니다!
          </p>
        )}
        <h1
          style={{
            fontSize: "3.2em",
            marginBottom: "20px",
            color: "#5858FA",
            fontWeight: "bold",
          }}
        >
          대학생을 위한 웹 기반 PMS
        </h1>
        <p style={{ fontSize: "1.1em", lineHeight: "1.8", marginBottom: "30px" }}>
          대학생 프로젝트 매니저. 팀원 관리, 산출물 제출, 업무 분장을 손쉽게 관리할 수 있는 도구입니다.
        </p>

        <Link href="/project-main" legacyBehavior>
          <a
            style={{
              display: "inline-block",
              padding: "14px 28px",
              fontSize: "1.1em",
              color: "#FFFFFF",
              backgroundColor: "#5858FA",
              borderRadius: "8px",
              textDecoration: "none",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease-in-out",
            }}
          >
            프로젝트 시작하기 🚀
          </a>
        </Link>

        {/* 주요 기능 소개 */}
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "📁 프로젝트 관리", desc: "팀별 프로젝트 설정 및 팀원 구성" },
            { label: "📝 산출물 제출", desc: "회의록, 개요서, 보고서 업로드" },
            { label: "✅ 역할 분담", desc: "각 팀원별 업무 권한 부여" },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                width: "180px",
                background: "#f9f9ff",
                borderRadius: "10px",
                padding: "18px",
                textAlign: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                fontSize: "14px",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "8px", color: "#4f46e5" }}>
                {item.label}
              </div>
              <div style={{ color: "#666" }}>{item.desc}</div>
            </div>
          ))}
        </div>


        {/* 공지사항 */}
        <div style={{ marginTop: "30px", fontSize: "13px", color: "#888" }}>
          🔔 최근 업데이트: "팀장 자동 권한 부여 기능"이 추가되었습니다.
        </div>
      </main>


      {/* 푸터 */}
      <footer
        style={{
          marginTop: "40px",
          fontSize: "0.85em",
          color: "#999",
          textAlign: "center",
        }}
      >
        <p>문의: leemir01011@nsu.ac.kr | Capstone Design © 2025</p>
      </footer>
    </div>
  );
}
