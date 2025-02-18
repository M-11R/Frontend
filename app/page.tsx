"use client";

import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { LoginModal } from "./components/AccountModal";


export default function Home() {
  return (
    <div
      style={{
        backgroundImage: "linear-gradient(to bottom, #f0f0f0, #FFFFFF)", // 부드러운 그라데이션 배경
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Roboto', sans-serif",
        padding: "20px",
        color: "#333",
      }}
    >
      {/* 헤더 영역 */}
      <header
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          display: "flex",
          gap: "15px",
        }}
      >
        <Link href="/util/SignOut" legacyBehavior>
          <a
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
          </a>
        </Link>
        <LoginModal />
      </header>
      

      {/* 메인 콘텐츠 */}
      <main
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "50px",
          borderRadius: "10px",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
          maxWidth: "600px",
        }}
      >
        <h1
          style={{
            fontSize: "3.5em",
            marginBottom: "20px",
            color: "#5858FA",
            fontWeight: "bold",
          }}
        >
          대학생을 위한 웹 기반 PMS
        </h1>
        <p style={{ fontSize: "1.2em", lineHeight: "1.8", marginBottom: "30px" }}>
          대학생 프로젝트 매니저. 사용자가 원하는 목표를 달성할 수 있도록 돕는
          웹 애플리케이션입니다.
        </p>
        <Link href="/create-project" legacyBehavior>
          <a
            style={{
              display: "inline-block",
              padding: "15px 30px",
              fontSize: "1.2em",
              color: "#FFFFFF",
              backgroundColor: "#5858FA",
              borderRadius: "8px",
              textDecoration: "none",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease-in-out",
            }}
          >
            프로젝트 시작하기
          </a>
        </Link>
      </main>

      {/* 푸터 영역 */}
      <footer
        style={{
          marginTop: "50px",
          fontSize: "0.9em",
          color: "#777",
          textAlign: "center",
        }}
      >
        <p>문의: leemir01011@nsu.ac.kr | Capstone Design © 2025</p>
      </footer>
    </div>
  );
}
