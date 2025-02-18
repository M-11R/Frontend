"use client";

import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import json from "@/app/json/test.json";
import TodoList from "@/app/components/Todo";
import LLMChat from "@/app/components/LLMChat";
import axios from "axios";
import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { useEffect, useState } from "react";

type wbs = {
  Sid: string;
  Sname: string;
  Sscore: number;
};
type wbsRatio = {
  group1no: number 
  group1: string
  ratio: number
}
type pjlist = {
  pid: number
  pname: string
  pdetails: string
  psize: number
  pperiod: string
  pmm: string
  wizard: number
}

export default function Main(props: any) {
  const [ratio, setRatio] = useState<wbsRatio[]>([])

  const loadWBS = async() => {
    const pid: number = props.params.id;
    try{
      const response = await axios.post("https://cd-api.chals.kim/api/wbs/load_ratio", {pid: pid}, {headers:{Authorization: process.env.SECRET_API_KEY}});
      const tmpRatio = response.data.RESULT_MSG;
      setRatio(tmpRatio);
    }catch(err){}
  }


  useEffect(() => {
    loadWBS()
  }, [])

  return (
    <div style={{ backgroundColor: "#f9f9f9", height: "100vh", padding: "10px" }}>
      {/* 메인 헤더 */}
      <MainHeader pid={props.params.id} />

      {/* Body */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px", }}>
        {/* 왼쪽 사이드 */}
        <MainSide pid={props.params.id} />

        {/* 메인 페이지 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "10px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* 페이지 위 : 진척도 */}
          <div style={{ display: "flex", gap: "10px", height: "25%" }}>
            {/* 진척도 섹션 */}
            <div
              style={{
                flex: 7,
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: "#f0f7ff",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {Array.from({ length: Math.ceil(ratio.length / 3) }, (_, rowIndex) => (
                  <div
                    key={rowIndex}
                    style={{
                      display: "flex",
                      width: "100%",
                      flex: 1, // 높이를 균등하게 설정
                    }}
                  >
                    {ratio.slice(rowIndex * 3, rowIndex * 3 + 3).map((item, colIndex) => (
                      <div
                        key={colIndex}
                        style={{
                          flex: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "24px",
                            backgroundColor: "#ffffff",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                            margin: "2px",
                        }}
                      >
                        {item.group1}: {item.ratio}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {/* Todo List 섹션 */}
            <div
                style={{
                  flex: 4,
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: "#ffffff",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ marginBottom: "10px", fontSize: "16px", fontWeight: "bold" }}>Todo List</div>
                <div style={{ borderBottom: "2px solid #ddd", marginBottom: "5px" }}></div>
                <TodoList p_id={props.params.id} />
              </div>
          </div>
          {/* 페이지 아래 */}
          <div style={{ display: "flex", gap: "10px"}}>
            {/* 팀원 */}
            <div
              style={{
                flex: 1, 
                padding: "10px",
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ marginBottom: "10px", fontSize: "16px", fontWeight: "bold" }}>팀원</div>
              <div style={{ borderBottom: "2px solid #ddd", marginBottom: "10px" }}></div>
              
            </div>

            {/* LLM 섹션 */}
            <div
              style={{
                flex: 3, 
                padding: "10px",
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ marginBottom: "10px", fontSize: "16px", fontWeight: "bold" }}>PMS Assistant</div>
              <div style={{ borderBottom: "2px solid #ddd", marginBottom: "10px" }}></div>
              <div style={{ fontSize: "14px", color: "#777" }}>
                <LLMChat pid = {props.params.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
