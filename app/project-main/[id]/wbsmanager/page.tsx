"use client";

import { useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import axios from "axios";

interface WbsRow {
  id: string;
  category: string;
  subCategory: string;
  subSubCategory: string;
  subSubSubCategory: string;
  taskName: string;
  product: string;
  assignee: string;
  note: string;
  progress: number;
  startDate: string;
  endDate: string;
  completed: boolean; // 완료 여부 필드 추가
}

interface postWbs {
  group1: string
  group2: string
  group3: string
  group4: string
  work: string
  output_file: string
  manager: string
  note: string
  ratio: number
  start_date: string
  end_date: string
  group1no: number
  group2no: number
  group3no: number
  group4no: number
}
interface parseWbs {
  category: string
  subCategory: string
  subSubCategory: string
  subSubSubCategory: string
  taskName: string
  product: string
  assignee: string
  note: string
  progress: number
  startDate: string
  endDate: string
  group1no: number
  group2no: number
  group3no: number
  group4no: number
}

type fetchType = {
  "RESULT_CODE": number, 
  "RESULT_MSG": string, 
  "PAYLOADS": (string | number)[][]
}
type pidPost = {
  pid: number
}
export default function Main(props: any) {
  const [model, setModel] = useState<string>("Waterfall"); // 기본값: 폭포수 모델
  const [rows, setRows] = useState<WbsRow[]>([]);
  const [list, setList] = useState<(string | number)[][]>([])
  
  const [hasSavedData, setHasSavedData] = useState<boolean>(false); // 저장된 데이터 여부 확인

  // 폭포수 모델 초기 데이터
  const waterfallRows: WbsRow[] = [
    { id: "1", category: "계획", subCategory: "프로젝트 관리", subSubCategory: "", subSubSubCategory: "", taskName: "위험 관리", product: "위험 등록부", assignee: "홍길동", note: "", progress: 10, startDate: "2024-01-01", endDate: "2024-01-10", completed: false },
    { id: "2", category: "계획", subCategory: "프로젝트 관리", subSubCategory: "", subSubSubCategory: "", taskName: "자원 계획", product: "자원 계획서", assignee: "김철수", note: "", progress: 20, startDate: "2024-01-11", endDate: "2024-01-15", completed: false },
    { id: "3", category: "분석", subCategory: "요구사항 수집 및 분석", subSubCategory: "", subSubSubCategory: "", taskName: "요구사항 수집", product: "요구사항 정의서", assignee: "이영희", note: "", progress: 30, startDate: "2024-01-16", endDate: "2024-01-20", completed: false },
    { id: "4", category: "분석", subCategory: "요구사항 수집 및 분석", subSubCategory: "", subSubSubCategory: "", taskName: "요구사항 분석", product: "요구사항 분석 보고서", assignee: "김영희", note: "", progress: 40, startDate: "2024-01-21", endDate: "2024-01-25", completed: false },
    { id: "5", category: "설계", subCategory: "시스템 설계", subSubCategory: "", subSubSubCategory: "", taskName: "인터페이스 설계", product: "인터페이스 설계서", assignee: "홍길동", note: "", progress: 50, startDate: "2024-01-26", endDate: "2024-01-30", completed: false },
    { id: "6", category: "설계", subCategory: "시스템 설계", subSubCategory: "", subSubSubCategory: "", taskName: "데이터베이스 설계", product: "DB 설계 문서", assignee: "김철수", note: "", progress: 60, startDate: "2024-02-01", endDate: "2024-02-05", completed: false },
    { id: "7", category: "구현", subCategory: "개발", subSubCategory: "", subSubSubCategory: "", taskName: "프론트엔드 개발", product: "UI 컴포넌트", assignee: "이영희", note: "", progress: 70, startDate: "2024-02-06", endDate: "2024-02-15", completed: false },
    { id: "8", category: "구현", subCategory: "개발", subSubCategory: "", subSubSubCategory: "", taskName: "백엔드 개발", product: "API 모듈", assignee: "김철수", note: "", progress: 80, startDate: "2024-02-16", endDate: "2024-02-28", completed: false },
    { id: "9", category: "테스트", subCategory: "QA", subSubCategory: "", subSubSubCategory: "", taskName: "단위 테스트", product: "테스트 결과 보고서", assignee: "홍길동", note: "", progress: 90, startDate: "2024-03-01", endDate: "2024-03-05", completed: false },
    { id: "10", category: "테스트", subCategory: "QA", subSubCategory: "", subSubSubCategory: "", taskName: "통합 테스트", product: "테스트 결과 보고서", assignee: "김영희", note: "", progress: 95, startDate: "2024-03-06", endDate: "2024-03-10", completed: false },
    { id: "11", category: "배포", subCategory: "릴리스 및 유지보수", subSubCategory: "", subSubSubCategory: "", taskName: "운영 환경 설정", product: "배포 기록", assignee: "홍길동", note: "", progress: 100, startDate: "2024-03-11", endDate: "2024-03-15", completed: false },
  ];

  // 애자일 모델 초기 데이터
  const agileRows: WbsRow[] = [
    { id: "1", category: "백로그", subCategory: "유저 스토리 작성", subSubCategory: "", subSubSubCategory: "", taskName: "유저 스토리 정의", product: "유저 스토리 목록", assignee: "홍길동", note: "", progress: 10, startDate: "2024-01-01", endDate: "2024-01-03", completed: false },
    { id: "2", category: "백로그", subCategory: "백로그 정리", subSubCategory: "", subSubSubCategory: "", taskName: "우선순위 설정", product: "정리된 백로그", assignee: "김영희", note: "", progress: 15, startDate: "2024-01-04", endDate: "2024-01-06", completed: false },
    { id: "3", category: "스프린트 계획", subCategory: "목표 설정", subSubCategory: "", subSubSubCategory: "", taskName: "스프린트 목표 설정", product: "목표 리스트", assignee: "이영희", note: "", progress: 20, startDate: "2024-01-07", endDate: "2024-01-09", completed: false },
    { id: "4", category: "스프린트 계획", subCategory: "작업 분배", subSubCategory: "", subSubSubCategory: "", taskName: "팀별 작업 배분", product: "작업 계획서", assignee: "홍길동", note: "", progress: 30, startDate: "2024-01-10", endDate: "2024-01-12", completed: false },
    { id: "5", category: "개발 작업", subCategory: "프론트엔드 개발", subSubCategory: "", subSubSubCategory: "", taskName: "UI 구현", product: "UI 컴포넌트", assignee: "김철수", note: "", progress: 40, startDate: "2024-01-13", endDate: "2024-01-20", completed: false },
    { id: "6", category: "개발 작업", subCategory: "백엔드 개발", subSubCategory: "", subSubSubCategory: "", taskName: "API 개발", product: "API 모듈", assignee: "이영희", note: "", progress: 50, startDate: "2024-01-21", endDate: "2024-01-30", completed: false },
    { id: "7", category: "QA", subCategory: "단위 테스트", subSubCategory: "", subSubSubCategory: "", taskName: "테스트 작성 및 실행", product: "테스트 결과 보고서", assignee: "홍길동", note: "", progress: 60, startDate: "2024-01-31", endDate: "2024-02-05", completed: false },
    { id: "8", category: "QA", subCategory: "통합 테스트", subSubCategory: "", subSubSubCategory: "", taskName: "전체 기능 테스트", product: "테스트 결과 보고서", assignee: "김영희", note: "", progress: 70, startDate: "2024-02-06", endDate: "2024-02-10", completed: false },
    { id: "9", category: "스프린트 회고", subCategory: "성과 리뷰", subSubCategory: "", subSubSubCategory: "", taskName: "스프린트 성과 분석", product: "회고 보고서", assignee: "이영희", note: "", progress: 80, startDate: "2024-02-11", endDate: "2024-02-15", completed: false },
    { id: "10", category: "배포 및 릴리스", subCategory: "운영 환경 설정", subSubCategory: "", subSubSubCategory: "", taskName: "운영 환경 구성", product: "운영 기록", assignee: "홍길동", note: "", progress: 90, startDate: "2024-02-16", endDate: "2024-02-20", completed: false },
    { id: "11", category: "배포 및 릴리스", subCategory: "최종 릴리스", subSubCategory: "", subSubSubCategory: "", taskName: "제품 배포 완료", product: "릴리스 기록", assignee: "김철수", note: "", progress: 100, startDate: "2024-02-21", endDate: "2024-02-25", completed: false },
  ];

  // 초기 로드: 로컬 저장소에서 데이터 불러오기
  useEffect(() => {
    if (model === "Waterfall") {
      setRows([...waterfallRows]);
    } else if (model === "Agile") {
      setRows([...agileRows]);
    }
  }, [model]);
  useEffect(() => {
    loadData();
  }, [])

    // 모델 설정 및 데이터 초기화
    const handleModelChange = (selectedModel: string) => {
      setModel(selectedModel);
      localStorage.removeItem("wbsData"); // 모델 변경 시 기존 저장된 데이터 삭제
    };

  // 저장 기능
  const saveData = async() => {
    // const pidData = {pid: props.params.id}
    const data = {
      wbs_data: transWbs(rows),
      pid : parseInt(props.params.id)
    }
    try{
      const response = await axios.post("https://cd-api.chals.kim/api/wbs/update", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
      alert("WBS가 저장되었습니다.")
    }catch(err){
    }
  };

  // 불러오기
  const loadData = async() => {
    const data = {pid : parseInt(props.params.id)}
    try{
      const response = await axios.post<fetchType>("https://cd-api.chals.kim/api/wbs/fetch_all", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
      if(response.data.RESULT_CODE === 200){
        const parseRow = parseData(response.data.PAYLOADS);
        setRows(parseRow);
      }else{
        alert('저장된 WBS가 없습니다.')
      }
    }catch(err){

    }
  };

  const deleteData = async() => {
    const data: pidPost = {pid: props.params.id}
    try{
      const response = await axios.post("https://cd-api.chals.kim/api/wbs/delete_all", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
    }catch(err){

    };
  }

  // 초기화
  const clearData = () => {
    if (window.confirm("초기화하시겠습니까? 저장된 데이터도 초기화됩니다.")) {
      deleteData();
      if (model === "Waterfall") {
        setRows(waterfallRows);
      } else {
        setRows(agileRows);
      }
    }
  };
  // 새 행 추가
  const addRow = () => {
    const newRow: WbsRow = {
      id: Date.now().toString(),
      category: "",
      subCategory: "",
      subSubCategory: "",
      subSubSubCategory: "",
      taskName: "",
      product: "",
      assignee: "",
      note: "",
      progress: 0,
      startDate: "",
      endDate: "",
      completed: false,
    };
    setRows((prevRows) => [...prevRows, newRow]);
  };

  // 기존 데이터 업데이트
  const updateRow = (id: string, key: keyof WbsRow, value: any) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { 
          ...row, 
          [key]: value,
          completed: key === "progress" ? value === 100 : row.completed,
        } : row
      )
    );
  };

  // 완료 상태 변경
  // const toggleCompleted = (id: string) => {
  //   setRows((prevRows) =>
  //     prevRows.map((row) =>
  //       row.id === id ? { ...row, completed: !row.completed } : row
  //     )
  //   );
  // };

  // 행 삭제 기능
  const deleteRow = (id: string) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const moveRowUp = (index: number) => {
    if (index > 0){
      const newRows = [...rows];
      [newRows[index], newRows[index -1]] = [newRows[index -1], newRows[index]];
      setRows(newRows);
    }
  }

  const moveRowDown = (index: number) => {
    if (index < rows.length -1){
      const newRows = [...rows];
      [newRows[index], newRows[index +1]] = [newRows[index +1], newRows[index]];
      setRows(newRows);
    }
  }

  const transWbs = (rows: WbsRow[]): (string | number)[][] => {
    let group1Counter = 0;
    let group2Counter = 0;
    let group3Counter = 0;
    let group4Counter = 0;

    let prevGroup1 = "";
    let prevGroup2 = "";
    let prevGroup3 = "";
    let prevGroup4 = "";

    return rows.map((row) => {
      if(row.category !== prevGroup1) {
        group1Counter += 1;
        group2Counter = 0;
        group3Counter = 0;
        group4Counter = 0;
        prevGroup1 = row.category;
      }
      if(row.subCategory !== prevGroup2){
        group2Counter += 1;
        group3Counter = 0;
        group4Counter = 0;
        prevGroup2 = row.subCategory;
      }
      if(row.subSubCategory !== prevGroup3){
        group3Counter += 1;
        group4Counter = 0;
        prevGroup3 = row.subSubCategory;
      }
      if(row.subSubSubCategory !== prevGroup4){
        group4Counter += 1;
        prevGroup4 = row.subSubSubCategory;
      }

      return [
        row.category,
        row.subCategory,
        row.subSubCategory,
        row.subSubSubCategory,
        row.taskName,
        row.product,
        row.assignee,
        row.note,
        row.progress,
        row.startDate,
        row.endDate,
        group1Counter,
        group2Counter,
        group3Counter,
        group4Counter,
      ]
    })
  }

  const parseData = (data: any[]): WbsRow[] => {
    return data.map((row, index) => {
      return {
      id: `${index + 1}`,
      category: row.group1,
      subCategory: row.group2,
      subSubCategory: row.group3,
      subSubSubCategory: row.group4,
      taskName: row.work,
      product: row.output_file,
      assignee: row.manager,
      note: row.note,
      progress: row.ratio,
      startDate: row.start_date,
      endDate: row.end_date,
      group1no: row.group1no,
      group2no: row.group2no,
      group3no: row.group3no,
      group4no: row.group4no,
      completed: row.ratio === 100
      };
    });
  };

  return (
    <div>
      <MainHeader pid={props.params.id} />
      <div style={{ display: "flex" }}>
        <MainSide pid={props.params.id} />
        <div
          style={{
            height: "calc(100vh - 105px)",
            width: "calc(90% - 200px)",
            border: "1px solid #000000",
            padding: "20px",
            overflowX: "auto",
          }}
        >
          <h2>{model === "Waterfall" ? "폭포수 모델" : "애자일 모델"} WBS</h2>

          {/* 모델 선택 및 데이터 관리 */}
          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={() => setModel("Waterfall")}
              style={{
                padding: "10px 20px",
                marginRight: "10px",
                backgroundColor: model === "Waterfall" ? "#007BFF" : "#E0E0E0",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              폭포수 모델
            </button>
            <button
              onClick={() => setModel("Agile")}
              style={{
                padding: "10px 20px",
                backgroundColor: model === "Agile" ? "#007BFF" : "#E0E0E0",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              애자일 모델
            </button>
            <button
              onClick={saveData}
              style={{
                padding: "10px 20px",
                marginLeft: "10px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              저장하기
            </button>
            <button
              onClick={loadData}
              style={{
                padding: "10px 20px",
                marginLeft: "10px",
                backgroundColor: "#FFA500",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              불러오기
            </button>
            <button
              onClick={clearData}
              style={{
                padding: "10px 20px",
                marginLeft: "10px",
                backgroundColor: "#FF4D4D",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              초기화
            </button>
          </div>
          {/* 스크롤 관리 */}
          <div style={{overflow: 'auto', whiteSpace: 'nowrap'}}> 
          {/* WBS 테이블 */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0", textAlign: "left" }}>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>대분류</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>중분류</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>소분류</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>소소분류</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>작업명</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>산출물</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>담당자</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>비고</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>진척률</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>시작일</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>마감일</th>
                {/* <th style={{ padding: "10px", border: "1px solid #ddd" }}>완료</th> */}
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>위/아래</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.id}
                  style={{
                    backgroundColor: row.completed ? "#DFFFD6" : "transparent",
                  }}
                >
                  <td style={{ padding: "10px" }}>
                    <input
                      type="text"
                      value={row.category}
                      onChange={(e) => updateRow(row.id, "category", e.target.value)}
                      style={{ width: "60px", border: "none", outline: "none" }}
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="text"
                      value={row.subCategory}
                      onChange={(e) => updateRow(row.id, "subCategory", e.target.value)}
                      style={{ width: "120px", border: "none", outline: "none" }}
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="text"
                      value={row.subSubCategory}
                      onChange={(e) => updateRow(row.id, "subSubCategory", e.target.value)}
                      style={{ width: "120px", border: "none", outline: "none" }}
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="text"
                      value={row.subSubSubCategory}
                      onChange={(e) => updateRow(row.id, "subSubSubCategory", e.target.value)}
                      style={{ width: "120px", border: "none", outline: "none" }}
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="text"
                      value={row.taskName}
                      onChange={(e) => updateRow(row.id, "taskName", e.target.value)}
                      style={{ width: "120px", border: "none", outline: "none" }}
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="text"
                      value={row.product}
                      onChange={(e) => updateRow(row.id, "product", e.target.value)}
                      style={{ width: "120px", border: "none", outline: "none" }}
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="text"
                      value={row.assignee}
                      onChange={(e) => updateRow(row.id, "assignee", e.target.value)}
                      style={{ width: "60px", border: "none", outline: "none" }}
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="text"
                      value={row.note}
                      onChange={(e) => updateRow(row.id, "note", e.target.value)}
                      style={{ width: "120px", border: "none", outline: "none" }}
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="number"
                      value={row.progress}
                      onChange={(e) => updateRow(row.id, "progress", parseInt(e.target.value))}
                      style={{ width: "40px", border: "none", outline: "none" }}
                      min="0"
                      max="100"
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="date"
                      value={row.startDate}
                      onChange={(e) => updateRow(row.id, "startDate", e.target.value)}
                      style={{ border: "none", outline: "none" }}
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="date"
                      value={row.endDate}
                      onChange={(e) => updateRow(row.id, "endDate", e.target.value)}
                      style={{ border: "none", outline: "none" }}
                    />
                  </td>
                  {/* <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={row.completed}
                      onChange={() => toggleCompleted(row.id)}
                      style={{ cursor: "pointer" }}
                    />
                  </td> */}
                  <td style={{ textAlign: "center" }}>
                    <button
                      onClick={() => moveRowUp(index)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#FF4D4D",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveRowDown(index)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#FF4D4D",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      ▼
                    </button>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      onClick={() => deleteRow(row.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#FF4D4D",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <button
            onClick={addRow}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            행 추가
          </button>
        </div>
      </div>
    </div>
  );
}
