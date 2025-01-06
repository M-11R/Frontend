"use client";

import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import json from "@/app/json/test.json";
import Image from "next/image";
import calendar from "@/app/img/calendar.png";
import TodoList from "@/app/components/Todo";

type wbs = {
  Sid: string;
  Sname: string;
  Sscore: number;
};

export default function Main(props: any) {
  const data: wbs[] = json.score;

  return (
    <div style={{ backgroundColor: "#f9f9f9", minHeight: "100vh", padding: "10px" }}>
      {/* 메인 헤더 */}
      <MainHeader pid={props.params.id} />

      {/* Body */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
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
          <div
            style={{
              height: "35%",
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: "#f0f7ff",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {Array.from({ length: Math.ceil(data.length / 3) }, (_, rowIndex) => (
                <div
                  key={rowIndex}
                  style={{
                    display: "flex",
                    width: "100%",
                    flex: 1, // 높이를 균등하게 설정
                  }}
                >
                  {data.slice(rowIndex * 3, rowIndex * 3 + 3).map((item, colIndex) => (
                    <div
                      key={colIndex}
                      style={{
                        flex: 1, // 너비를 균등하게 설정
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "16px",
                        fontWeight: "bold",
                        backgroundColor: "#ffffff",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        margin: "2px", // 여백 최소화
                      }}
                    >
                      {item.Sname}: {item.Sscore}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 페이지 아래 */}
          <div style={{ display: "flex", gap: "10px", flex: 1 }}>
            {/* Todo List */}
            <div
              style={{
                flex: 0.9,
                padding: "10px",
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ marginBottom: "10px", fontSize: "16px", fontWeight: "bold" }}>Todo List</div>
              <div style={{ borderBottom: "2px solid #ddd", marginBottom: "10px" }}></div>
              <TodoList p_id={props.params.id} />
            </div>

            {/* 캘린더 */}
            <div
              style={{
                flex: 1.1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Image src={calendar} alt="Calendar" style={{ width: "80%", height: "auto" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
