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

type dnoPayLoad = {
  RESULT_CODE: number,
  RESULT_MSG: string,
  PAYLOAD: {
      Result: dnoType[]
  }
}

type dnoType = {
  dno: number,
  dname: string
}

// ✅ 스타일 공통 적용
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
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    marginBottom: "15px",
    boxSizing: "border-box",
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
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("naver.com");
  const [customEmailDomain, setCustomEmailDomain] = useState(""); // 직접 입력 도메인
  const [id, setID] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [department, setDepartment] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [deptList, setDeptList] = useState<dnoType[]>([{dno: 0, dname: "Loading..."}]);

  const router = useRouter();
  // ✅ 대표적인 이메일 도메인 목록
  const emailProviders = [
    "naver.com",
    "gmail.com",
    "daum.net",
    "kakao.com",
    "nate.com",
    "hanmail.net",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "yahoo.com",
    "protonmail.com",
    "zoho.com",
    "직접 입력"
  ];

  const data = {
    name,
    univ_id: hak,
    email: `${emailId}@${emailDomain === "직접 입력" ? customEmailDomain : emailDomain}`,
    id,
    pw: password,
    department,
  };

  const loadDept = async() => {
    try{
      const response = await axios.post<dnoPayLoad>("https://cd-api.chals.kim/api/acc/load_dept", {}, {headers:{Authorization: process.env.SECRET_API_KEY}});
      // console.log("result: ",response.data.PAYLOAD.Result)
      setDeptList(response.data.PAYLOAD.Result);
    }catch(err){}
  }

  useEffect(() => {
    if (getToken() && router) {
      // router.push("/");
    }
    loadDept()
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== repassword) {
      alert(mb.register.wrongpass.value);
      return;
    }

    if (emailDomain === "직접 입력" && !customEmailDomain) {
      alert("이메일 도메인을 입력해주세요.");
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
        router.push("/project-main");
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
          {/* ✅ 입력 필드들 */}
          {[
            { label: mb.user.name.value, value: name, setter: setName, type: "text", placeholder: "" },
            { label: mb.user.hak.value, value: hak, setter: setHak, type: "number", placeholder: "" },
            { label: mb.user.id.value, value: id, setter: setID, type: "text", placeholder: "" },
            
            { label: mb.user.password.value, value: password, setter: setPassword, type: "password", placeholder: "8자리, 특수문자를 입력해주세요." },
            {
              label: mb.register["re-password"].value,
              value: repassword,
              setter: setRePassword,
              type: "password",
              placeholder: "비밀번호를 다시 입력해주세요."
            },
          ].map(({ label, value, setter, type, placeholder }, index) => (
            <div key={index}>
              <label style={{ display: "block", fontSize: "16px", fontWeight: "bold", color: "#555", marginBottom: "5px" }}>
                {label}
              </label>
              <input type={type} value={value} onChange={(e) => setter(e.target.value)} required style={commonStyles.input} placeholder={placeholder}/>
            </div>
          ))}

          {/* ✅ 이메일 입력 필드 (수정된 부분) */}
          <div>
            <label style={{ display: "block", fontSize: "16px", fontWeight: "bold", color: "#555", marginBottom: "5px" }}>
              {mb.user.email.value}
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <input
                type="text"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="아이디 입력"
                required
                style={{ flex: 2, ...commonStyles.input }}
              />
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>@</span>
              <select
                value={emailDomain}
                onChange={(e) => setEmailDomain(e.target.value)}
                style={{ flex: 2, ...commonStyles.input }}
              >
                {emailProviders.map((provider, index) => (
                  <option key={index} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>
            {emailDomain === "직접 입력" && (
              <input type="text" value={customEmailDomain} onChange={(e) => setCustomEmailDomain(e.target.value)} placeholder="도메인 입력" style={commonStyles.input} />
            )}
          </div>
          <div>
            <label style={{ display: "block", fontSize: "16px", fontWeight: "bold", color: "#555", marginBottom: "5px" }}>
              학과
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(Number(e.target.value))}
              style={{ width: 'calc(100% + 24px)', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#ffffff' }}
            >
              {Array.isArray(deptList) &&
                deptList.map((item) => (
                  <option key={item.dno} value={item.dno}>
                    {item.dname}
                  </option>
                ))
              }
            </select>
          </div>

          {/* ✅ 버튼 */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <button type="button" onClick={() => router.push("/")} style={{ ...commonStyles.button, backgroundColor: "#6c757d", color: "#fff" }}>
              {mb.register["start-page"].value}
            </button>
            <button type="submit" disabled={isLoading} style={{ ...commonStyles.button, backgroundColor: isLoading ? "#cccccc" : "#007bff", color: "#fff" }}>
              {isLoading ? "가입 중..." : mb.register.registerbtn.value}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
