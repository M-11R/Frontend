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
  permission: number
}

export default function Main(props: any) {
  const [ratio, setRatio] = useState<wbsRatio[]>([])
  const [noData, setNoData] = useState(false);
  const [profId, setProfId] = useState("Loading...");
  const [pm, setPM] = useState<userType[]>([{name: "Loading...", permission: 1}]);
  const [team, setTeam] = useState<userType[]>([{name: "Loading...", permission: 0}]);

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
    try{
      const response = await axios.post<returnUser>("https://cd-api.chals.kim/api/project/checkuser", {pid: pid}, {headers:{Authorization: process.env.SECRET_API_KEY}});
      const userList = response.data.PAYLOADS;
      const tmp1 = userList.filter(user => user.permission === 1)
      setPM(tmp1)
      const tmp2 = userList.filter(user => user.permission === 0)
      setTeam(tmp2)
      
    }catch(err){}
  }

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
          {/* 페이지 위 : 진척도 */}
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
                flexDirection: "column",
              }}
            >
              {noData ? (
                <div style={{display : 'flex', justifyContent : "center", alignItems : "center", height: '100%', fontSize: '35px', textDecorationLine: "underline"}}>
                  WBS를 생성해주세요.
                </div>
              ) : (
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
              )}
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
                overflowY: 'auto',
              }}
            >
              <div style={{ marginBottom: "10px", fontSize: "16px", fontWeight: "bold" }}>팀원</div>
              <div style={{ borderBottom: "2px solid #ddd", marginBottom: "10px" }}></div> {/**밑줄 */}
              <div style={{height: '80%', width: '95%'}}> {/**팀 인원 넣는 칸 */}
                <div style={{display: 'flex', width: '100%', whiteSpace: "pre-wrap"}}> {/**팀장 및 담당교수 */}
                  <div style={{position: "relative", width: '30%', height: '100px',
                    // border: '1px solid #000', 
                    display: 'flex', alignItems: 'flex-end'}}>
                    <Image
                      src={teamIcon}
                      alt="Image 2"
                      fill
                      style={{ objectFit: "contain" }}
                      sizes="100vw"
                    />
                    <div style={{position: "absolute", bottom: '0', left: '0', textShadow: "1px 1px 0 #fff, -1px 1px 0 #fff, 1px -1px 0 #fff, -1px -1px 0 #fff"}}>
                      {`팀장\n${pm[0].name}`}
                    </div>
                    
                  </div>
                  <div style={{position: "relative", width: '30%', height: '100px',
                    // border: '1px solid #000', 
                    display: 'flex', alignItems: 'flex-end', marginLeft: 'auto'}}>
                  <Image
                      src={teamIcon}
                      alt="Image 2"
                      fill
                      style={{ objectFit: "contain" }}
                      sizes="100vw"
                    />
                    <div style={{position: "absolute", bottom: '0', left: '0', textShadow: "1px 1px 0 #fff, -1px 1px 0 #fff, 1px -1px 0 #fff, -1px -1px 0 #fff"}}>
                      {`담당교수\n${profId}`}
                    </div>
                  </div>
                </div>
                {Array.from({ length: Math.ceil(team.length / 3) }, (_, rowIndex) => (
                  <div
                    key={rowIndex}
                    style={{
                      display: "flex",
                      width: "100%",
                      whiteSpace: "pre-wrap",
                      paddingTop: '15px' 
                    }}
                  >
                    {team.slice(rowIndex * 3, rowIndex * 3 + 3).map((item, colIndex) => (
                      <div
                        key={colIndex}
                        style={{
                            width: '30%',
                            height: '100px',
                            display: "flex",
                            alignItems: "flex-end",
                            // border: "1px solid #000",
                            position: 'relative'
                        }}
                      >
                        <Image
                          src={teamIcon}
                          alt="Image 2"
                          fill
                          style={{ objectFit: "contain" }}
                          sizes="100vw"
                        />
                        <div style={{position: "absolute", bottom: '0', left: '0', textShadow: "1px 1px 0 #fff, -1px 1px 0 #fff, 1px -1px 0 #fff, -1px -1px 0 #fff"}}>
                          {`팀원\n${item.name}`}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
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
