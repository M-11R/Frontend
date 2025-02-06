"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const commonStyles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to bottom, #f0f0f0, #FFFFFF)",
    fontFamily: "'Roboto', sans-serif",
  },
  card: {
    width: "400px",
    padding: "40px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center" as "center",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  input: {
    width: "94%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    transition: "border-color 0.3s ease",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  message: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#333",
  },
};

export default function FindPassword() {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFindPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "https://cd-api.chals.kim/api/acc/find-password",
        { name, studentId, userId, email },
        { headers: { Authorization: process.env.SECRET_API_KEY } }
      );

      if (response.data.RESULT_CODE === 200) {
        setMessage(`✅ 비밀번호: ${response.data.PAYLOADS.password}`);
      } else {
        setMessage("❌ 입력하신 정보와 일치하는 계정이 없습니다.");
      }
    } catch (err) {
      console.error("비밀번호 찾기 실패:", err);
      setMessage("❌ 서버 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToLogin = () => router.push("/sign/signIn");

  return (
    <div style={commonStyles.container}>
      <div style={commonStyles.card}>
        <h2 style={commonStyles.title}>🔑 비밀번호 찾기</h2>
        <form onSubmit={handleFindPassword}>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={commonStyles.input}
          />
          <input
            type="text"
            placeholder="학번"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            style={commonStyles.input}
          />
          <input
            type="text"
            placeholder="아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            style={commonStyles.input}
          />
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={commonStyles.input}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...commonStyles.button,
              backgroundColor: isLoading ? "#cccccc" : "#007bff",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "🔎 찾는 중..." : "비밀번호 찾기"}
          </button>
        </form>

        {message && <p style={commonStyles.message}>{message}</p>}

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={handleNavigateToLogin}
            style={{
              ...commonStyles.button,
              backgroundColor: "#6c757d",
            }}
          >
            🔙 로그인 페이지로 이동
          </button>
        </div>
      </div>
    </div>
  );
}
