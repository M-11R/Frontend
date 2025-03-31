'use client'
import axios from "axios";
import { useEffect, useState } from "react";
import MsBox from "@/app/json/msBox.json";
import Link from "next/link";
import Pagination from "@/app/components/pagenation";
import { limitTitle } from "@/app/util/string";

type listType = {
  type: string;
  displayType: string;
  title: string;
  date: string;
  file_no: number;
};
type returnEtc = {
  RESULT_CODE: number;
  RESULT_MSG: string;
  PAYLOADS: etcType[];
};
type etcType = {
  file_no: number;
  file_name: string;
  file_path: string;
  file_date: Date;
  s_no: number;
};
type returnOvr = {
  RESULT_CODE: number;
  RESULT_MSG: string;
  PAYLOADS: ovrType[];
};
type ovrType = {
  doc_s_no: number;
  doc_s_name: string;
  doc_s_overview: string;
  doc_s_goals: string;
  doc_s_range: string;
  doc_s_outcomes: string;
  doc_s_team: string;
  doc_s_stack: string;
  doc_s_start: string;
  doc_s_end: string;
  doc_s_date: Date;
};
type returnMm = {
  RESULT_CODE: number;
  RESULT_MSG: string;
  PAYLOADS: mmType[];
};
type mmType = {
  doc_m_no: number;
  doc_m_title: string;
  doc_m_date: Date;
  doc_m_loc: string;
  doc_m_member: string;
  doc_m_manager: string;
  doc_m_content: string;
  doc_m_result: string;
};
type returnReq = {
  RESULT_CODE: number;
  RESULT_MSG: string;
  PAYLOADS: reqType[];
};
type reqType = {
  doc_r_no: number;
  doc_r_f_name: string;
  doc_r_f_content: string;
  doc_r_f_priority: string;
  doc_r_nf_name: string;
  doc_r_nf_content: string;
  doc_r_nf_priority: string;
  doc_r_s_name: string;
  doc_r_s_content: string;
  doc_r_date: Date;
};
type returnTest = {
  RESULT_CODE: number;
  RESULT_MSG: string;
  PAYLOADS: testType[];
};
type testType = {
  doc_t_no: number;
  doc_t_group1: string;
  doc_t_name: string;
  doc_t_start: Date;
  doc_t_end: Date;
  doc_t_pass: boolean;
};
type returnReport = {
  RESULT_CODE: number;
  RESULT_MSG: string;
  PAYLOADS: reportType[];
};
type reportType = {
  doc_rep_no: number;
  doc_rep_name: string;
  doc_rep_writer: string;
  doc_rep_date: Date;
  doc_rep_pname: string;
  doc_rep_member: string;
  doc_rep_professor: string;
  doc_rep_research: string;
  doc_rep_design: string;
  doc_rep_arch: string;
  doc_rep_result: string;
  doc_rep_conclusion: string;
};

function formatDate(input: string): string {
  const d = new Date(input);
  // 날짜 유효성 검사
  if (isNaN(d.getTime())) return input; // 유효하지 않은 날짜면 그대로 반환
  const year = d.getFullYear();
  const month = ("0" + (d.getMonth() + 1)).slice(-2);
  const day = ("0" + d.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

const availableTypes = ["기타", "개요서", "회의록", "요구사항 명세서", "테스트 케이스", "보고서"]

const DocumentTable = ({ page, pid }: { page: number; pid: number }) => {
  const [data, setData] = useState<listType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  // 필터링: 체크된 타입과 검색어로 data 필터링
  const filteredData = data.filter((item) => {
    const typeOk =
      selectedTypes.length === 0 || selectedTypes.includes(item.type);
    const searchOk =
      searchQuery.trim() === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return typeOk && searchOk;
  });

  const itemsPerPage = 10; // 한 페이지당 표시할 글 수
  const currentData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const loadData = async () => {
    const formData = new FormData();
    formData.append("pid", pid.toString());
    const tmpData: listType[] = [];
    const postData = {pid: pid};
    const etcData: etcType[] = []
    const ovrData: ovrType[] = []
    const mmData: mmType[] = []
    const reqData: reqType[] = []
    const testData: testType[] = []
    const reportData: reportType[] = []

    try{ // 기타 산출물
      const response = await axios.post<returnEtc>("https://cd-api.chals.kim/api/output/otherdoc_fetch_all", formData, {headers:{Authorization: process.env.SECRET_API_KEY}});
      response.data.PAYLOADS.forEach((item) => {
          const formattedData: listType = {
              type: '기타',
              displayType: 'etc',
              title: item.file_name,
              date: formatDate(item.file_date.toString()),
              file_no: item.file_no
          }
          tmpData.push(formattedData);
          etcData.push(item)
      })
  }catch(err){}
  try{ // 프로젝트 개요서
      const response = await axios.post<returnOvr>("https://cd-api.chals.kim/api/output/ovr_doc_fetch", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
      response.data.PAYLOADS.forEach((item) => {
          const formattedData: listType = {
              type: '개요서',
              displayType: 'overview',
              title: item.doc_s_name,
              date: item.doc_s_date.toString(),
              file_no: item.doc_s_no
          }
          tmpData.push(formattedData);
          ovrData.push(item)
      })
  }catch(err){}
  try{ // 회의록
      const response = await axios.post<returnMm>("https://cd-api.chals.kim/api/output/mm_fetch", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
      response.data.PAYLOADS.forEach((item) => {
          const formattedData: listType = {
              type: '회의록',
              displayType: 'minutes',
              title: item.doc_m_title,
              date: item.doc_m_date.toString(),
              file_no: item.doc_m_no
          }
          tmpData.push(formattedData);
          mmData.push(item)
      })
  }catch(err){}
  try{ // 요구사항 명세서
      const response = await axios.post<returnReq>("https://cd-api.chals.kim/api/output/reqspec_fetch_all", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
      response.data.PAYLOADS.forEach((item) => {
          const formattedData: listType = {
              type: '요구사항 명세서',
              displayType: 'request',
              title: '요구사항 명세서',
              date: item.doc_r_date.toString(),
              file_no: item.doc_r_no
          }
          tmpData.push(formattedData);
          reqData.push(item)
      })
  }catch(err){}
  try{ // 테스트 케이스
      const response = await axios.post<returnTest>("https://cd-api.chals.kim/api/output/testcase_load", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
      response.data.PAYLOADS.forEach((item) => {
          const formattedData: listType = {
              type: '테스트 케이스',
              displayType: 'testcase',
              title: item.doc_t_name,
              date: item.doc_t_start.toString(),
              file_no: item.doc_t_no
          }
          tmpData.push(formattedData);
          testData.push(item)
      })
  }catch(err){}
  try{ // 보고서
      const response = await axios.post<returnReport>("https://cd-api.chals.kim/api/output/report_fetch_all", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
      response.data.PAYLOADS.forEach((item) => {
          const formattedData: listType = {
              type: '보고서',
              displayType: 'report',
              title: item.doc_rep_name,
              date: item.doc_rep_date.toString(),
              file_no: item.doc_rep_no
          }
          tmpData.push(formattedData);
          reportData.push(item)
      })
      const sortedData = tmpData.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      })
      setData(sortedData);
  }catch(err){}

  
  };

  return (
    <div
      style={{
        margin: "5% auto",
        width: "70%",
        maxWidth: "1000px",
        display: "flex",
        flexDirection: "column",
        height: "auto",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#4CAF50",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        산출물 관리
      </h1>
      {/* 검색 및 필터 UI */}
      <div style={{
  marginBottom: "24px",
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  alignItems: "center",
  justifyContent: "space-between"
}}>
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="🔍 검색어를 입력하세요"
    style={{
      flexGrow: 1,
      minWidth: "220px",
      padding: "10px 14px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      fontSize: "14px",
    }}

    
  />
  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
    {availableTypes.map((type) => (
      <label key={type} style={{ fontSize: "14px", color: "#444" }}>
        <input
          type="checkbox"
          checked={selectedTypes.includes(type)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedTypes((prev) => [...prev, type]);
            } else {
              setSelectedTypes((prev) => prev.filter((t) => t !== type));
            }
          }}
          style={{ marginRight: "5px" }}
        />
        {type}
      </label>
    ))}
  </div>
</div>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#f9f9f9",
        }}
      >
       
        {/* 테이블 헤더 */}
      
<div style={{ 
  display: "flex",
  backgroundColor: "#E5E7EB",
  color: "#333",
  fontWeight: "bold",
  height: "50px",
  alignItems: "center",
  borderBottom: "1px solid #ddd",
  textAlign: "center"
}}>
  <div style={{ flex: 2, padding: "10px", borderRight: "1px solid #ddd" }}>산출물 타입</div>
  <div style={{ flex: 4, padding: "10px", borderRight: "1px solid #ddd" }}>제목</div>
  <div style={{ flex: 2, padding: "10px" }}>게시일</div>
</div>



        {/* 테이블 데이터 */}
        {(() => {
          const filteredData = data.filter((item) => {
            const typeOk =
              selectedTypes.length === 0 || selectedTypes.includes(item.type);
            const searchOk =
              searchQuery.trim() === "" ||
              item.title.toLowerCase().includes(searchQuery.toLowerCase());
            return typeOk && searchOk;
          });
          const itemsPerPage = 10;
          const currentData = filteredData.slice(
            (page - 1) * itemsPerPage,
            page * itemsPerPage
          );
          return currentData.map((item) => (
            <div
              key={item.file_no}
              style={{
                display: "flex",
                height: "50px",
                alignItems: "center",
                borderBottom: "1px solid #ddd",
              }}
            >
              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  borderRight: "1px solid #ddd",
                  padding: "10px",
                  color: "#555",
                }}
              >
                {item.type}
              </div>
              <div
                style={{
                  flex: 2,
                  textAlign: "center",
                  borderRight: "1px solid #ddd",
                  padding: "10px",
                  color: "#4CAF50",
                }}
              >
                <Link href={`/project-main/${pid}/output/${item.displayType}/${item.file_no}`}>
                  {limitTitle(item.title, 40)}
                </Link>
              </div>
              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "10px",
                  color: "#555",
                }}
              >
                {item.date}
              </div>
            </div>
          ));
        })()}
      </div>


      {/* 페이지네이션 */}
      <div style={{ marginTop: "20px" }}>
        <Pagination currentPage={page} totalPages={totalPages} basePath={`/project-main/${pid}/outputManagement`} />
      </div>
    </div>
  );
};







export default DocumentTable;
