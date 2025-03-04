"use client";

import Image from 'next/image';
import ico from '../img/logo.png';
import mb from '@/app/json/msBox.json';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import TapList from '@/app/components/ProjectTap'
import { ProjectCreateModal } from "@/app/components/ProjectCreateModal";
import { EditDraftProjectModal } from "@/app/components/EditDraftProjectModal";

import axios from 'axios';

type fetchType = {
  "RESULT_CODE": number, 
  "RESULT_MSG": string, 
  "PAYLOADS": (string | number)[][]
}

const jinchek = (pid: number) => {
  const [persent, setPersent] = useState(0);

  useEffect(() => {
    loadData();
  },[]);

  const loadData = async() => {
    if(pid === 200) return;
    const data = {pid : pid}
    try{
      const response = await axios.post<fetchType>("https://cd-api.chals.kim/api/wbs/fetch_all", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
      if(response.data.RESULT_CODE === 200){
        const parsePersent = fixData(response.data.PAYLOADS);
        setPersent(parsePersent);
      }else{
        
      }
    }catch(err){

    }
  };

  const fixData = (data: any[]): number => {
    const value = data.map((row) => row.ratio as number);
    const total = value.reduce((sum, value) => sum + value, 0);
    const average = total / value.length;
    return Math.round(average) || 0;
  }

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "#4a4a4a",
          marginBottom: "15px",
          textAlign: "center",
        }}
      >
        {mb.header.jinchuk.value} {persent}%
      </div>
      <div
        style={{
          width: "100%",
          height: "25px",
          backgroundColor: "#f0f0f0",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            width: `${persent}%`,
            height: "100%",
            background: `linear-gradient(to right, ${
              persent >= 75 ? "#4caf50" : persent >= 50 ? "#ff9800" : "#f44336"
            }, #b3b3b3)`,
            transition: "width 0.4s ease",
            borderRadius: "15px",
          }}
        ></div>
      </div>
    </div>
  );
};


const MainHeader = ({ pid }: { pid: number }) => {
  return (
    <header
      style={{
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "10px 20px",
        borderBottom: "2px solid #ddd",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* ✅ 로고 */}
      <Link href="/">
        <Image
          src={ico}
          alt="Logo"
          style={{
            width: "100px",
            height: "80px",
            objectFit: "contain",
            cursor: "pointer",
          }}
        />
      </Link>

      {/* ✅ 버튼을 프로젝트 탭 위에 배치 */}
      <div style={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
        marginLeft: "20px", // 로고와 간격 조정
      }}>
        <EditDraftProjectModal />
        <ProjectCreateModal />
      </div>

      {/* ✅ 프로젝트 탭 리스트 */}
      <TapList pid={pid} />

      {/* ✅ 진척도 표시 */}
      <div style={{ flex: 1, textAlign: "center", maxWidth: "900px" }}>
        {jinchek(pid)}
      </div>
    </header>
  );
};


export default MainHeader;