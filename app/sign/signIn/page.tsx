'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { getToken, getUserId, setToken, setUnivId, setUserId } from "@/app/util/storage";

type postType = {
  "RESULT_CODE": number, 
  "RESULT_MSG": string, 
  "PAYLOADS": {
      "Token": string
      "Univ_ID": number}
}

type checkType = {
  user_id: string,
  token: string
}

export default function Login() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const data = {
    id: studentId,
    pw: password
  }

  type returnType = {
    "RESULT_CODE": number, 
    "RESULT_MSG": string
  }

  useEffect(() => {
    const check: checkType = {
      user_id: getUserId(),
      token: getToken()
    }
    if(check.token !== ''){
      CheckSession({data: check});
    }
    
  }, []);

  const CheckSession = async({data}: {data: checkType}) => {
    try{
        const response = await axios.post<returnType>("https://cd-api.chals.kim/api/acc/checksession", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
        if(response.data.RESULT_CODE === 200){
          router.push('/');
          return;
        }
    }catch(err){
    };
  }

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // 로그인 로직을 추가
    if(studentId === '' || password === ''){
      alert("error");
    }else{
      postData();
    }
  };

  const postData = async() => {
    try{
      const response = await axios.post<postType>("https://cd-api.chals.kim/api/acc/signin", data, {headers:{Authorization: process.env.SECRET_API_KEY}})
      if(response.data.RESULT_CODE === 200){
        setToken(response.data.PAYLOADS.Token);
        setUnivId(response.data.PAYLOADS.Univ_ID);
        setUserId(data.id);
        router.push('/');
      }else{
        console.log(response.data.RESULT_MSG);
      }
    }catch(err){
      alert("아이디와 비밀번호를 확인해주세요.")
    }
  }

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
            placeholder="아이디"
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
          메인화면 이동
        </button>
      </div>
    </div>
  );
}
