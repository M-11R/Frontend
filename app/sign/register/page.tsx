"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import mb from "@/app/json/msBox.json";
import { setToken, getToken, setUnivId, setUserId } from "@/app/util/storage";

type postType = {
  RESULT_CODE: number;
  RESULT_MSG: string;
  PAYLOADS: {
    Token: string;
    Univ_ID: number;
  };
};

const commonStyles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "'Roboto', sans-serif",
    background: "linear-gradient(to bottom, #f0f0f0, #FFFFFF)",
  },
  card: {
    width: "400px",
    padding: "40px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center" as "center",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333333",
    marginBottom: "20px",
  },
  input: {
    width: "93%",
    padding: "13px",
    fontSize: "18px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    marginBottom: "15px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default function Signup() {
  const [name, setName] = useState("");
  const [hak, setHak] = useState<string | number>("");
  const [email, setEmail] = useState("");
  const [id, setID] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [department, setDepartment] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const data = {
    name,
    univ_id: hak,
    email,
    id,
    pw: password,
    department,
  };

  useEffect(() => {
    if (getToken()) {
      router.push("/");
    }
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== repassword) {
      alert(mb.register.wrongpass.value);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post<postType>(
        "https://cd-api.chals.kim/api/acc/signup",
        data,
        { headers: { Authorization: process.env.SECRET_API_KEY } }
      );

      if (response.data.RESULT_CODE === 200) {
        setToken(response.data.PAYLOADS.Token);
        setUserId(id);
        setUnivId(Number(hak));
        router.push("/create-project");
      } else {
        alert(response.data.RESULT_MSG || "회원가입 중 문제가 발생했습니다.");
      }
    } catch (err) {
      alert("회원가입 요청 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={commonStyles.container}>
      <div style={commonStyles.card}>
        <div style={commonStyles.title}>{mb.register.title.value}</div>
        <form onSubmit={handleSignup}>
          {[
            { label: mb.user.name.value, value: name, setter: setName, type: "text" },
            { label: mb.user.hak.value, value: hak, setter: setHak, type: "number" },
            { label: mb.user.email.value, value: email, setter: setEmail, type: "email" },
            { label: mb.user.id.value, value: id, setter: setID, type: "text" },
            { label: mb.user.password.value, value: password, setter: setPassword, type: "password" },
            {
              label: mb.register["re-password"].value,
              value: repassword,
              setter: setRePassword,
              type: "password",
            },
          ].map(({ label, value, setter, type }, index) => (
            <div key={index}>
              <label
                style={{
                  display: "block",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#555",
                  marginBottom: "5px",
                }}
              >
                {label}
              </label>
              <input
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                required
                style={commonStyles.input}
              />
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <button
              type="button"
              onClick={() => router.push("/")}
              style={{
                ...commonStyles.button,
                backgroundColor: "#6c757d",
                color: "#fff",
                border: "none",
              }}
            >
              {mb.register["start-page"].value}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...commonStyles.button,
                backgroundColor: isLoading ? "#cccccc" : "#007bff",
                color: "#fff",
                border: "none",
              }}
            >
              {isLoading ? "가입 중..." : mb.register.registerbtn.value}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
