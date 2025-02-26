'use client';

import React, { useState, useEffect, useRef, CSSProperties } from "react";
import axios from "axios";
import { getUnivId } from "../util/storage";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { limitTitle } from "../util/string";

export interface DataItem {
    pid: number
    pname: string
    pdetails: string
    psize: number
    pperiod: string
    pmm: string
    wizard: number
}
type returnType = {
    RESULT_CODE: number
    RESULT_MSG: string
    PAYLOADS: DataItem[]
}

const TabList = ({pid}: {pid: number}) => {
  const [data, setData] = useState<DataItem[]>([]);
  const s_no = getUnivId();
  const [showScrollbar, setShowScrollbar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post<returnType>("https://cd-api.chals.kim/api/project/load", {univ_id: s_no}, {headers:{Authorization: process.env.SECRET_API_KEY}});
        setData(response.data.PAYLOADS);
      } catch (error) {
        console.error("데이터 가져오기 오류 : ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      style={{
        ...containerStyle,
        overflowX: showScrollbar ? "auto" : "hidden", // 조건부 overflowX 설정
      }}
      onMouseEnter={() => setShowScrollbar(true)}
      onMouseLeave={() => setShowScrollbar(false)}
    >
      {data.map((item) => (
        <HoverTab key={item.pid} item={item} />
      ))}
    </div>
  );
};

interface HoverTabProps {
  item: DataItem;
}

const HoverTab: React.FC<HoverTabProps> = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const tabRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleClick = () => {
    router.push(`/project-main/${item.pid}/main`);
  }

  return (
    <div
      ref={tabRef}
      style={tabStyle}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 탭에서는 제목만 표시 */}
      <div>{limitTitle(item.pname, 20)}</div>

      {/* 마우스 오버 시 툴팁 형태로 세부 정보 표시 */}
      {isHovered && tabRef.current && (
        <Tooltip targetRef={tabRef}>
          <div style={{padding: "3px"}}>
            <strong>제목: </strong>{item.pname}
          </div>
          <div style={{padding: "3px"}}>
            <strong>설명: </strong>{item.pdetails}
          </div>
          <div style={{padding: "3px"}}>
            <strong>기간: </strong>{item.pperiod}
          </div>
        </Tooltip>
      )}
    </div>
  );
};

interface TooltipProps {
  targetRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ targetRef, children }) => {
  const [style, setStyle] = useState<CSSProperties>({ opacity: 0 });

  useEffect(() => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setStyle({
        position: "absolute",
        top: rect.top + 35, // 탭 위쪽에 표시 (필요시 오프셋 조절)
        left: rect.left,
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        padding: "2px",
        width: "300px",
        zIndex: 10000,
      });
    }
  }, [targetRef]);

  return createPortal(<div style={style}>{children}</div>, document.body);
};

const containerStyle: CSSProperties = {
  position: "relative",
  top: "20px",
  bottom: "0",
  width: "1100px",
  height: "30px",
  overflowY: "hidden",
  display: "flex",
  flexWrap: "nowrap",
  gap: "5px",
  alignItems: "center",
  padding: "5px",
  // border: "1px solid #ccc",
};

const tabStyle: CSSProperties = {
  position: "relative",
  width: "auto",
  minWidth: "70px",
  height: "30px",
  backgroundColor: "#eee",
  border: "1px solid #ccc",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flex: "0 0 auto",
  paddingLeft: "5px",
  paddingRight: "5px",
};

export default TabList;