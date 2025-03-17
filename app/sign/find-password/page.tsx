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

type postData = {
  univ_id: number
  name: string
  email: string
  user_id: string
}

export default function FindPassword() {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // ✅ 사용자 본인 확인 여부
  const [newPassword, setNewPassword] = useState(""); // ✅ 새 비밀번호 입력
  const [newPassword2, setNewPassword2] = useState(""); // ✅ 새 비밀번호 입력
  const router = useRouter();

  // 🔹 비밀번호 찾기 (본인 확인)
  const handleFindPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const tmp: postData = {
      univ_id: Number(studentId),
      name: name,
      email: email,
      user_id: userId
    }

    try {
      const response = await axios.post(
        "https://cd-api.chals.kim/api/acc/checkacc",
        tmp,
        { headers: { Authorization: process.env.SECRET_API_KEY } }
      );

      if (response.data.RESULT_CODE === 200) {
        setMessage("✅ 본인 확인 완료! 새 비밀번호를 입력하세요.");
        setIsVerified(true); // 🔹 본인 확인 성공 시, 비밀번호 변경 UI 표시
      } else {
        setMessage("❌ 입력하신 정보와 일치하는 계정이 없습니다.");
      }
    } catch (err) {
      // console.error("비밀번호 찾기 실패:", err);
      setMessage("❌ 서버 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 비밀번호 변경 요청
  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      setMessage("❌ 비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }
    if(newPassword !== newPassword2){
      setMessage("❌ 비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const tmp = {
      univ_id: studentId,
      pw: newPassword
    }

    try {
      const response = await axios.post(
        "https://cd-api.chals.kim/api/acc/resetpw",
        tmp,
        { headers: { Authorization: process.env.SECRET_API_KEY } }
      );

      if (response.data.RESULT_CODE === 200) {
        setMessage("✅ 비밀번호가 성공적으로 변경되었습니다! 로그인 페이지로 이동하세요.");
      } else {
        setMessage("❌ 비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      // console.error("비밀번호 변경 실패:", err);
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

        {!isVerified ? (
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
        ) : (
          <div>
            <input
              type="password"
              placeholder="새 비밀번호 입력"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={commonStyles.input}
            />
            <input
              type="password"
              placeholder="비밀번호 재입력"
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              required
              style={commonStyles.input}
            />
            <button
              onClick={handleResetPassword}
              disabled={isLoading}
              style={{
                ...commonStyles.button,
                backgroundColor: isLoading ? "#cccccc" : "#28a745",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "🔄 변경 중..." : "비밀번호 변경"}
            </button>
          </div>
        )}

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
