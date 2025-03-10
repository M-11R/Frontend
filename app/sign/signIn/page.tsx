"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getToken, getUserId, setToken, setUnivId, setUserId } from "@/app/util/storage";

type postType = {
  RESULT_CODE: number;
  RESULT_MSG: string;
  PAYLOADS: {
    Token: string;
    Univ_ID: number;
  };
};

type checkType = {
  user_id: string;
  token: string;
};

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
    padding: "50px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center" as "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  input: {
    width: "93%",
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
  buttonDisabled: {
    backgroundColor: "#cccccc",
    cursor: "not-allowed",
  },
};

export default function Login() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const data = {
    id: studentId,
    pw: password,
  };

  useEffect(() => {
    const check: checkType = {
      user_id: getUserId(),
      token: getToken(),
    };
    if (check.token !== "") {
      CheckSession(check);
    }
  }, []);

  const CheckSession = async (check: checkType) => {
    try {
      const response = await axios.post(
        "https://cd-api.chals.kim/api/acc/checksession",
        check,
        { headers: { Authorization: process.env.SECRET_API_KEY } }
      );
      if (response.data.RESULT_CODE === 200) {
        router.push("/");
      }
    } catch (err) {
      console.error("세션 확인 실패:", err);
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post<postType>(
        "https://cd-api.chals.kim/api/acc/signin",
        data,
        { headers: { Authorization: process.env.SECRET_API_KEY } }
      );
      if (response.data.RESULT_CODE === 200) {
        setToken(response.data.PAYLOADS.Token);
        setUnivId(response.data.PAYLOADS.Univ_ID);
        setUserId(data.id);
        router.push("/project-main");
      } else {
        alert(response.data.RESULT_MSG);
      }
    } catch (err) {
      console.error("로그인 실패:", err);
      alert("❌ 로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToMain = () => router.push("/");
  const handleNavigateToRegister = () => router.push("/sign/register");

  return (
    <div style={commonStyles.container}>
      <div style={commonStyles.card}>
        <h2 style={commonStyles.title}>🔑 로그인</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="아이디"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            style={commonStyles.input}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={commonStyles.input}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...commonStyles.button,
              ...(isLoading ? commonStyles.buttonDisabled : {}),
            }}
          >
            {isLoading ? "⏳ 로그인 중..." : "로그인"}
          </button>
        </form>

        {/* 회원가입 / 아이디 찾기 버튼 */}
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={handleNavigateToRegister}
            style={{
              ...commonStyles.button,
              width: "48%",
              backgroundColor: "#6c757d",
            }}
          >
            📝 회원가입
          </button>
          <button
             onClick={() => router.push("/sign/find-password")}
             style={{
                ...commonStyles.button,
                width: "48%",
                backgroundColor: "#6c757d",
             }}
          >
            🔍 비밀번호 찾기
          </button>
        </div>
      </div>
    </div>
  );
}
