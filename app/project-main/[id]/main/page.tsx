"use client";

import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import TodoList from "@/app/components/Todo";
import LLMChat from "@/app/components/LLMChat";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import teamIcon from "@/app/img/team.jpg"
import usePermissionGuard from "@/app/util/usePermissionGuard";
import { getUnivId } from "@/app/util/storage";
import LLMManagement from "@/app/components/LLMManagement";
import { useCallback } from "react";


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
type returnUser = {
  PAYLOADS: userType[]
}
type userType = {
  name: string,
  permission: number,
  role: string
}



export default function Main(props: any) {
  const [ratio, setRatio] = useState<wbsRatio[]>([])
  const [noData, setNoData] = useState(false);
  const [profId, setProfId] = useState("Loading...");
  const [pm, setPM] = useState<userType[]>([{name: "Loading...", permission: 1, role: "팀장" }]);
  const [team, setTeam] = useState<userType[]>([{name: "Loading...", permission: 0, role: "팀원"}]);

  const getAverageRatio = useCallback(() => {
    if (ratio.length === 0) return 0;
    const total = ratio.reduce((sum, item) => sum + item.ratio, 0);
    return Math.round(total / ratio.length);
  }, [ratio]);
  
  const s_no = getUnivId()
  const leaderPermission = usePermissionGuard(props.params.id, s_no, { leader: 1 }, false);

  const loadWBS = async() => {
    const pid: number = props.params.id;
    try{
      const response = await axios.post("https://cd-api.chals.kim/api/wbs/load_ratio", {pid: pid}, {headers:{Authorization: process.env.SECRET_API_KEY}});
      const tmpRatio = response.data.RESULT_MSG;
      setRatio(tmpRatio);
      if(tmpRatio.length === 1 && tmpRatio[0].group1 === "") setNoData(true);
    }catch(err){}
  }


  useEffect(() => {
    loadWBS()
    loadProf()
    loadUser()
  }, [])

  const loadProf = async() => {
    const pid: number = props.params.id;
    try{
      const response = await axios.post("https://cd-api.chals.kim/api/project/load_prof", {pid: pid}, {headers:{Authorization: process.env.SECRET_API_KEY}});
      setProfId(response.data.PAYLOAD.Result.f_name)
    }catch(err){}
  }

  const loadUser = async() => {
    const pid: number = props.params.id;
    try {
      const response = await axios.post<returnUser>(
        "https://cd-api.chals.kim/api/project/checkuser",
        { pid: pid },
        { headers: { Authorization: process.env.SECRET_API_KEY } }
      );
  
      const userList = response.data.PAYLOADS;
  
      const tmp1 = userList
  .filter(user => user.permission === 1)
  .map(user => ({ name: user.name, permission: user.permission, role: user.role }));
setPM(tmp1);

const tmp2 = userList
  .filter(user => user.permission === 0)
  .map(user => ({ name: user.name, permission: user.permission, role: user.role }));
setTeam(tmp2);

  
      setPM(tmp1);
      setTeam(tmp2);
    } catch(err) {
      console.error("사용자 로딩 오류", err);
    }
  };
  

  return (
    <div style={{ height: "100vh"}}>
      {/* 메인 헤더 */}
      <MainHeader pid={props.params.id} />

      {/* Body */}
      <div style={{ backgroundColor: "#f9f9f9", display: "flex", flex: 1, height: 'calc(100% - 100px)'}}>
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
          
         {/* 페이지 위 : 진척도 + TodoList */}
<div style={{ display: "flex", gap: "10px", height: "30%" }}>
  {/* 진척도 섹션 */}
  <div
    style={{
      flex: 7,
      padding: "10px",
      borderRadius: "10px",
      backgroundColor: "#f0f7ff",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    {/* SVG 원형 진척도 */}
    <div style={{ width: "120px", height: "120px", position: "relative", marginRight: "20px" }}>
      <svg height="120" width="120">
        <circle
          stroke="#e0e0e0"
          fill="transparent"
          strokeWidth="10"
          r="50"
          cx="60"
          cy="60"
        />
        <circle
          stroke="#4db8ff"
          fill="transparent"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 50}`}
          strokeDashoffset={`${2 * Math.PI * 50 * (1 - getAverageRatio() / 100)}`}
          r="50"
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        {`${getAverageRatio()}%`}
      </div>
      <div style={{ textAlign: "center", fontSize: "14px", marginTop: "10px" }}>진척도</div>
    </div>

    {/* 막대형 카테고리 진척도 */}
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "15px" }}>
    {Array.from({ length: Math.ceil(ratio.length / 2) }, (_, rowIndex) => (
  <div key={rowIndex} style={{ display: "flex", gap: "40px", justifyContent: "space-between" }}>
    {ratio.slice(rowIndex * 2, rowIndex * 2 + 2).map((item, colIndex) => (
      <div
        key={colIndex}
        style={{
          display: "flex",
          alignItems: "center",
          width: "calc(50% - 20px)", // 여기에서 비율 조절!
          gap: "10px",
        }}
      >
        <span style={{ width: "60px", fontWeight: "bold", whiteSpace: "nowrap" }}>{item.group1}</span>
        <div style={{
          flex: 1,
          height: "12px",
          backgroundColor: "#e0e0e0",
          borderRadius: "6px",
          overflow: "hidden",
        }}>
          <div style={{
            width: `${item.ratio}%`,
            height: "100%",
            backgroundColor: item.ratio === 0 ? "transparent" : "#4db8ff",
            transition: "width 0.3s ease-in-out",
          }} />
        </div>
        <span style={{ width: "40px", textAlign: "right" }}>{item.ratio}%</span>
      </div>
    ))}
  </div>
))}

</div>

  </div>

  {/* Todo List 섹션 */}
  <div
    style={{
      flex: 3,
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
          <div style={{ display: "flex", gap: "10px", height: '70%'}}>
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
    overflowY: "auto",
  }}
>
  <div style={{ marginBottom: "10px", fontSize: "16px", fontWeight: "bold" }}>
    팀원
  </div>
  <div style={{ borderBottom: "2px solid #ddd", marginBottom: "10px" }}></div>

  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px" }}>
    <thead>
      <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #ccc", height: "40px" }}>
        <th style={{ textAlign: "left", padding: "10px" }}>구분</th>
        <th style={{ textAlign: "left", padding: "10px" }}>이름</th>
        <th style={{ textAlign: "left", padding: "10px" }}>역할</th>
      </tr>
    </thead>
    <tbody>
      <tr style={{ borderBottom: "1px solid #eee" }}>
        <td style={{ padding: "10px" }}>담당 교수</td>
        <td style={{ padding: "10px" }}>{profId}</td>
        <td style={{ padding: "10px" }}>-</td>
      </tr>
      {pm.map((item, index) => (
        <tr key={`pm-${index}`} style={{ borderBottom: "1px solid #eee" }}>
          <td style={{ padding: "10px" }}>팀장</td>
          <td style={{ padding: "10px" }}>{item.name}</td>
          <td style={{ padding: "10px" }}>{item.role}</td>

        </tr>
      ))}
      {team.map((item, index) => (
        <tr key={`team-${index}`} style={{ borderBottom: "1px solid #eee" }}>
          <td style={{ padding: "10px" }}>팀원</td>
          <td style={{ padding: "10px" }}>{item.name}</td>
          <td style={{ padding: "10px" }}>{item.role}</td>

        </tr>
      ))}
    </tbody>
  </table>
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
                height: 'calc(100% - 20px)'
              }}
            >
              <div style={{ marginBottom: "10px", display: 'flex', position: 'relative'}}>
                <span style={{fontSize: "16px", fontWeight: "bold" }}>PMS Assistant</span>
                {(leaderPermission === null || !leaderPermission) ? (<div></div>) : (
                  <div style={{position: 'absolute', right: '0', bottom: '0'}}><LLMManagement pid={props.params.id}/></div>
                )}
                
              </div>
              <div style={{ borderBottom: "2px solid #ddd", marginBottom: "10px" }}></div>
              <div style={{ fontSize: "14px", color: "#777", height: 'calc(100% - 40px)' }}>
                <LLMChat pid = {props.params.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

