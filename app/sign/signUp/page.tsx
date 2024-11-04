'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Login() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // 로그인 로직을 추가
    console.log("로그인 시도: ", studentId, password);
  };

  const handleNavigateToMain = () => {
    router.push('/');
  };

  const handleNavigateToRegister = () => {
    router.push('/sign/register');
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>로그인</h2>
      <form onSubmit={handleLogin} style={{ width: "300px", textAlign: "center" }}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="학번"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "1em",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "1em",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "1em",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "15px",
          }}
        >
          로그인
        </button>
      </form>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button
          onClick={handleNavigateToRegister}
          style={{
            padding: "10px",
            fontSize: "1em",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          회원가입
        </button>
        <button
          onClick={handleNavigateToMain}
          style={{
            padding: "10px",
            fontSize: "1em",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          메인 페이지로 이동
        </button>
      </div>
    </div>
  );
}
