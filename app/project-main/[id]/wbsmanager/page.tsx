"use client";

import { useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import axios from "axios";
import { getUnivId } from "@/app/util/storage";
import usePermissionGuard from "@/app/util/usePermissionGuard";
import { wfOptions, agileOptions } from "@/app/util/wbs";
import { useRouter } from "next/navigation";

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
interface tmpWbsRow {
  category: string;
  subCategory: string;
  subSubCategory: string;
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
  const router = useRouter()
  const [model, setModel] = useState<string>("Waterfall"); // 기본값: 폭포수 모델
  const [rows, setRows] = useState<WbsRow[]>([]);
  const [nowCat, setNowCat] = useState(wfOptions)
  const [tmpRow, setTmpRow] = useState<WbsRow>({
    id: "1",
    category: "계획",
    subCategory: "프로젝트 관리",
    subSubCategory: "리스크 관리",
    subSubSubCategory: "",
    taskName: "",
    product: "",
    assignee: "",
    note: "",
    progress: 0,
    startDate: "",
    endDate: "",
    completed: false
});
  const tmpWF: WbsRow = {
    id: "1",
    category: "계획",
    subCategory: "프로젝트 관리",
    subSubCategory: "리스크 관리",
    subSubSubCategory: "",
    taskName: "",
    product: "",
    assignee: "",
    note: "",
    progress: 0,
    startDate: "",
    endDate: "",
    completed: false
  }
  const tmpAG: WbsRow = {
    id: "1",
    category: "백로그",
    subCategory: "유저 스토리 작성",
    subSubCategory: "요구사항 정의",
    subSubSubCategory: "",
    taskName: "",
    product: "",
    assignee: "",
    note: "",
    progress: 0,
    startDate: "",
    endDate: "",
    completed: false
  }

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState<string>("");

  const s_no = getUnivId();
  const readPermission = usePermissionGuard(props.params.id, s_no, {leader: 1, wbs: [1, 2]}, false)
  const writePermission = usePermissionGuard(props.params.id, s_no, { leader: 1, wbs: 1 }, false);

  // 폭포수 모델 초기 데이터
  const waterfallRows: WbsRow[] = [
    { id: "1", category: "계획", subCategory: "프로젝트 관리", subSubCategory: "리스크 관리", subSubSubCategory: "위험 평가", taskName: "위험 관리", product: "위험 등록부", assignee: "홍길동", note: "", progress: 10, startDate: "2024-01-01", endDate: "2029-01-10", completed: false },
    { id: "2", category: "계획", subCategory: "프로젝트 관리", subSubCategory: "자원 관리", subSubSubCategory: "자원 할당 계획", taskName: "자원 계획", product: "자원 계획서", assignee: "김철수", note: "", progress: 20, startDate: "2024-01-11", endDate: "2029-01-15", completed: false },
    { id: "3", category: "분석", subCategory: "요구사항 수집 및 분석", subSubCategory: "요구사항 수집", subSubSubCategory: "이해관리자 인터뷰", taskName: "요구사항 수집", product: "요구사항 정의서", assignee: "이영희", note: "", progress: 30, startDate: "2024-01-16", endDate: "2029-01-20", completed: false },
    { id: "4", category: "분석", subCategory: "요구사항 수집 및 분석", subSubCategory: "여구사항 분석", subSubSubCategory: "우선순위 결정", taskName: "요구사항 분석", product: "요구사항 분석 보고서", assignee: "김영희", note: "", progress: 40, startDate: "2024-01-21", endDate: "2029-01-25", completed: false },
    { id: "5", category: "설계", subCategory: "시스템 설계", subSubCategory: "인터페이스 설계", subSubSubCategory: "UI/UX 디자인", taskName: "인터페이스 설계", product: "인터페이스 설계서", assignee: "홍길동", note: "", progress: 50, startDate: "2024-01-26", endDate: "2029-01-30", completed: false },
    { id: "6", category: "설계", subCategory: "시스템 설계", subSubCategory: "데이터베이스 설계", subSubSubCategory: "ERD 모델링", taskName: "데이터베이스 설계", product: "DB 설계 문서", assignee: "김철수", note: "", progress: 60, startDate: "2024-02-01", endDate: "2029-02-05", completed: false },
    { id: "7", category: "구현", subCategory: "개발", subSubCategory: "프론트엔드 개발", subSubSubCategory: "React 컴포넌트 개발", taskName: "프론트엔드 개발", product: "UI 컴포넌트", assignee: "이영희", note: "", progress: 70, startDate: "2024-02-06", endDate: "2029-02-15", completed: false },
    { id: "8", category: "구현", subCategory: "개발", subSubCategory: "백엔드 개발", subSubSubCategory: "API 설계 및 구현", taskName: "백엔드 개발", product: "API 모듈", assignee: "김철수", note: "", progress: 80, startDate: "2024-02-16", endDate: "2029-02-28", completed: false },
    { id: "9", category: "테스트", subCategory: "QA", subSubCategory: "단위 테스트", subSubSubCategory: "테스트 케이스 작성", taskName: "단위 테스트", product: "테스트 결과 보고서", assignee: "홍길동", note: "", progress: 90, startDate: "2024-03-01", endDate: "2029-03-05", completed: false },
    { id: "10", category: "테스트", subCategory: "QA", subSubCategory: "통합 테스트", subSubSubCategory: "시스템 통합 검증", taskName: "통합 테스트", product: "테스트 결과 보고서", assignee: "김영희", note: "", progress: 95, startDate: "2024-03-06", endDate: "2029-03-10", completed: false },
    { id: "11", category: "배포", subCategory: "릴리스 및 유지보수", subSubCategory: "운영 환경 설정", subSubSubCategory: "서버 구성 및 배포", taskName: "운영 환경 설정", product: "배포 기록", assignee: "홍길동", note: "", progress: 100, startDate: "2024-03-11", endDate: "2029-03-15", completed: false },
  ];

  // 애자일 모델 초기 데이터
  const agileRows: WbsRow[] = [
    { id: "1", category: "백로그", subCategory: "유저 스토리 작성", subSubCategory: "요구사항 정의", subSubSubCategory: "스토리 맵 작성", taskName: "유저 스토리 정의", product: "유저 스토리 목록", assignee: "홍길동", note: "", progress: 10, startDate: "2024-01-01", endDate: "2029-01-03", completed: false },
    { id: "2", category: "백로그", subCategory: "백로그 정리", subSubCategory: "우선순위 결정", subSubSubCategory: "MoSCoW 기법 적용", taskName: "우선순위 설정", product: "정리된 백로그", assignee: "김영희", note: "", progress: 15, startDate: "2024-01-04", endDate: "2029-01-06", completed: false },
    { id: "3", category: "스프린트 계획", subCategory: "목표 설정", subSubCategory: "스프린트 범위 결정", subSubSubCategory: "기능 분류 및 선정", taskName: "스프린트 목표 설정", product: "목표 리스트", assignee: "이영희", note: "", progress: 20, startDate: "2024-01-07", endDate: "2029-01-09", completed: false },
    { id: "4", category: "스프린트 계획", subCategory: "작업 분배", subSubCategory: "팀별 업무 배정", subSubSubCategory: "페어 프로그래밍 구성", taskName: "팀별 작업 배분", product: "작업 계획서", assignee: "홍길동", note: "", progress: 30, startDate: "2024-01-10", endDate: "2029-01-12", completed: false },
    { id: "5", category: "개발 작업", subCategory: "프론트엔드 개발", subSubCategory: "UI 개발", subSubSubCategory: "컴포넌트 설계 및 구현", taskName: "UI 구현", product: "UI 컴포넌트", assignee: "김철수", note: "", progress: 40, startDate: "2024-01-13", endDate: "2029-01-20", completed: false },
    { id: "6", category: "개발 작업", subCategory: "백엔드 개발", subSubCategory: "API 개발", subSubSubCategory: "RESTful API 설계 및 구현", taskName: "API 개발", product: "API 모듈", assignee: "이영희", note: "", progress: 50, startDate: "2024-01-21", endDate: "2029-01-30", completed: false },
    { id: "7", category: "QA", subCategory: "단위 테스트", subSubCategory: "테스트 코드 작성", subSubSubCategory: "Jest 테스트 적용", taskName: "테스트 작성 및 실행", product: "테스트 결과 보고서", assignee: "홍길동", note: "", progress: 60, startDate: "2024-01-31", endDate: "2029-02-05", completed: false },
    { id: "8", category: "QA", subCategory: "통합 테스트", subSubCategory: "기능 및 성능 검증", subSubSubCategory: "CI/CD 파이프라인 활용", taskName: "전체 기능 테스트", product: "테스트 결과 보고서", assignee: "김영희", note: "", progress: 70, startDate: "2024-02-06", endDate: "2029-02-10", completed: false },
    { id: "9", category: "스프린트 회고", subCategory: "성과 리뷰", subSubCategory: "개선 사항 도출", subSubSubCategory: "KPT(Keep, Problem, Try) 분석", taskName: "스프린트 성과 분석", product: "회고 보고서", assignee: "이영희", note: "", progress: 80, startDate: "2024-02-11", endDate: "2029-02-15", completed: false },
    { id: "10", category: "배포 및 릴리스", subCategory: "운영 환경 설정", subSubCategory: "배포 환경 구성", subSubSubCategory: "AWS 서버 설정", taskName: "운영 환경 구성", product: "운영 기록", assignee: "홍길동", note: "", progress: 90, startDate: "2024-02-16", endDate: "2029-02-20", completed: false },
    { id: "11", category: "배포 및 릴리스", subCategory: "최종 릴리스", subSubCategory: "릴리스 문서화", subSubSubCategory: "버전 관리 및 태깅", taskName: "제품 배포 완료", product: "릴리스 기록", assignee: "김철수", note: "", progress: 100, startDate: "2024-02-21", endDate: "2029-02-25", completed: false },
];

  const etcRows: WbsRow[] = [
    { id: "1", category: "", subCategory: "", subSubCategory: "", subSubSubCategory: "", taskName: "", product: "", assignee: "", note: "", progress: 0, startDate: "2024-01-01", endDate: "2099-01-03", completed: false },
  ]

  const resetCat = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedSubSubCategory("");
  }

  // 초기 로드: 로컬 저장소에서 데이터 불러오기
  useEffect(() => {
    if (model === "Waterfall") {
      setRows([...waterfallRows]);
      setNowCat(wfOptions)
      resetCat()
      setTmpRow(tmpWF)
    } else if (model === "Agile") {
      setRows([...agileRows]);
      setNowCat(agileOptions)
      resetCat()
      setTmpRow(tmpAG)
    } else if (model === "etc"){
      setRows([...etcRows])
      resetCat()
    }
  }, [model]);
  useEffect(() => {
    loadData();
  }, [])

  // 현재 선택된 옵션에 따른 중분류 목록
  const subCategories = selectedCategory && nowCat[selectedCategory]
    ? Object.keys(nowCat[selectedCategory].subCategories)
    : [];

  // 현재 선택된 중분류에 따른 소분류 목록
  const subSubCategories =
    selectedCategory && selectedSubCategory && nowCat[selectedCategory].subCategories[selectedSubCategory]
      ? nowCat[selectedCategory].subCategories[selectedSubCategory]
      : [];

    // 모델 설정 및 데이터 초기화
    const handleModelChange = (selectedModel: string) => {
      setModel(selectedModel);
      localStorage.removeItem("wbsData"); // 모델 변경 시 기존 저장된 데이터 삭제
    };

    

  // 저장 기능
  const saveData = async() => {
    if (writePermission === null) {
      alert("권한 확인 중입니다. 잠시만 기다려주세요.");
      return;
    }
    if (writePermission) {
      const data = {
        wbs_data: transWbs(rows),
        pid : parseInt(props.params.id)
      };
      try{
        const response = await axios.post("https://cd-api.chals.kim/api/wbs/update", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
        alert("WBS가 저장되었습니다.")
      }catch(err){}
    } else {
      alert("권한이 없습니다.");
    }
    
  };

  // 불러오기
  const loadData = async() => {
    const data = {pid : parseInt(props.params.id)}
    try{
      const response = await axios.post<fetchType>("https://cd-api.chals.kim/api/wbs/fetch_all", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
      if(response.data.RESULT_CODE === 200){
        const parseRow = parseData(response.data.PAYLOADS);
        const tmpRow: WbsRow[] = parseRow
        tmpRow.map((row) => {
          if(row.assignee === "INITWBS"){
            setRows([...waterfallRows])
          }else{
            setRows(parseRow);
          }
        })
        
      }else{
        alert('저장된 WBS가 없습니다.')
      }
    }catch(err){

    }
  };

  // 초기화
  const clearData = () => {
    if (window.confirm("초기화하시겠습니까?")) {
      if (model === "Waterfall") {
        setRows(waterfallRows);
      } else if (model === "Agile"){
        setRows(agileRows);
      } else {
        setRows(etcRows)
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

  const handleAddTmpRow = () => {
    const newRow: WbsRow = {
      id: Date.now().toString(),
      category: tmpRow.category,
      subCategory: tmpRow.subCategory,
      subSubCategory: tmpRow.subSubCategory,
      subSubSubCategory: tmpRow.subSubSubCategory,
      taskName: tmpRow.taskName,
      product: tmpRow.product,
      assignee: tmpRow.assignee,
      note: "",
      progress: 0,
      startDate: tmpRow.startDate,
      endDate: tmpRow.endDate,
      completed: false,
    };

    setRows((prevRows) => [...prevRows, newRow])
    if(model === "Waterfall"){
      setTmpRow(tmpWF);
    }else{
      setTmpRow(tmpAG);
    }
  }

  const handleCategorySelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setSelectedSubCategory("");
    setSelectedSubSubCategory("");
    if (value !== "") {
      // 임시 변수가 "직접 입력"이 아니라면 원래 변수도 업데이트
      setTmpRow((prev) => ({ ...prev, category: value, subCategory: "", subSubCategory: ""  }));
    }
  };

  // Category input onChange 핸들러
  const handleCategoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setSelectedSubCategory("");
    setSelectedSubSubCategory("");
    // input으로 직접 입력한 값은 원래 변수에 바로 업데이트
    setTmpRow((prev) => ({ ...prev, category: value, subCategory: "", subSubCategory: "" }));
  };

  // SubCategory select onChange 핸들러
  const handleSubCategorySelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setSelectedSubCategory(value);
    setSelectedSubSubCategory("");
    if (value !== "") {
      setTmpRow((prev) => ({ ...prev, subCategory: value, subSubCategory: "" }));
    }
  };

  // SubCategory input onChange 핸들러
  const handleSubCategoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSelectedSubCategory(value);
    setSelectedSubSubCategory("");
    setTmpRow((prev) => ({ ...prev, subCategory: value, subSubCategory: ""  }));
  };

  // SubSubCategory select onChange 핸들러
  const handleSubSubCategorySelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setSelectedSubSubCategory(value);
    if (value !== "") {
      setTmpRow((prev) => ({ ...prev, subSubCategory: value }));
    }
  };

  // SubSubCategory input onChange 핸들러
  const handleSubSubCategoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSelectedSubSubCategory(value);
    setTmpRow((prev) => ({ ...prev, subSubCategory: value }));
  };

  const handleEtcChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof WbsRow
  ) => {
    const value = e.target.value;
    
    setTmpRow((prev) => ({ ...prev, [field]: value }));

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

  const isOver = (tend: string) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const dueDate = new Date(tend).setHours(0, 0, 0, 0);
    return dueDate < today;
}
  if(readPermission === null){
    return (
      <div>Loading...</div>
    )
  }
  if(!readPermission){
    router.push(`/project-main/${props.params.id}/main`);
    return null
  }  


  return (
    <div>
      <MainHeader pid={props.params.id} />
      <div style={{ display: "flex" }}>
        <MainSide pid={props.params.id} />
        <div
          style={{
            height: "calc(100vh - 105px)",
            width: "calc(95% - 150px)",
            // border: "1px solid #000000",
            padding: "20px",
            paddingTop: '0',
            paddingBottom: '0',
            overflowX: "auto",
          }}
        >
          
          
          

          
          <h2>{model === "Waterfall" ? "폭포수 모델" : (model === "Agile" ? "애자일 모델" : "기타 모델")} WBS</h2>

          {/* 모델 선택 및 데이터 관리 */}
          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={() => setModel("Waterfall")}
              style={{
                padding: "10px 20px",
                backgroundColor: model === "Waterfall" ? "#4CAF50" : "#808080", 
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              폭포수 모델
            </button>
            <button
              onClick={() => setModel("Agile")}
              style={{
                padding: "10px 20px",
                backgroundColor: model === "Agile" ? "#4CAF50" : "#808080", 
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              애자일 모델
            </button>
            <button
              onClick={() => setModel("etc")}
              style={{
                padding: "10px 20px",
                backgroundColor: model === "etc" ? "#4CAF50" : "#808080", 
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              기타 모델
            </button>

            <div style={{float: 'right'}}>
            <button
              onClick={saveData}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              저장하기
            </button>
            <button
              onClick={clearData}
              style={{
                padding: "10px 20px",
                backgroundColor: "#FF4D4D", 
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              초기화
            </button>
            </div>
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
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>액티비티</th>
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
                    backgroundColor: row.completed ? "#DFFFD6" : (isOver(row.endDate) ? "#ffe4e1" : "transparent"),
                  }}
                >
                  <td style={{ padding: "10px" }}>
                    <input
                      type="text"
                      value={row.category}
                      onChange={(e) => updateRow(row.id, "category", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#f9f9f9",
                        outline: "none",
                      }}
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="text"
                      value={row.subCategory}
                      onChange={(e) => updateRow(row.id, "subCategory", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#f9f9f9",
                        outline: "none",
                      }}
                      
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="text"
                      value={row.subSubCategory}
                      onChange={(e) => updateRow(row.id, "subSubCategory", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#f9f9f9",
                        outline: "none",
                      }}
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="text"
                      value={row.subSubSubCategory}
                      onChange={(e) => updateRow(row.id, "subSubSubCategory", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#f9f9f9",
                        outline: "none",
                      }}
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="text"
                      value={row.taskName}
                      onChange={(e) => updateRow(row.id, "taskName", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#f9f9f9",
                        outline: "none",
                      }}
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="text"
                      value={row.product}
                      onChange={(e) => updateRow(row.id, "product", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#f9f9f9",
                        outline: "none",
                      }}
                    />
                  </td>
                  <td style={{ padding: "5px" }}>
                    <input
                      type="text"
                      value={row.assignee}
                      onChange={(e) => updateRow(row.id, "assignee", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#f9f9f9",
                        outline: "none",
                      }}
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="text"
                      value={row.note}
                      onChange={(e) => updateRow(row.id, "note", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#f9f9f9",
                        outline: "none",
                      }}
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="number"
                      value={row.progress}
                      onChange={(e) => updateRow(row.id, "progress", parseInt(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#f9f9f9",
                        outline: "none",
                      }}
                      min="0"
                      max="100"
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="date"
                      value={row.startDate}
                      onChange={(e) => updateRow(row.id, "startDate", e.target.value)}
                      style={{ padding: "10px", border: "1px solid #ddd" }}

                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="date"
                      value={row.endDate}
                      onChange={(e) => updateRow(row.id, "endDate", e.target.value)}
                      style={{ padding: "10px", border: "1px solid #ddd" }}

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
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        backgroundColor: "#FF4D4D",
                        color: "#fff",
                      }}
                      
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveRowDown(index)}
                      style={{
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        backgroundColor: "#FF4D4D",
                        color: "#fff",
                      }}
                      
                    >
                      ▼
                    </button>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      onClick={() => deleteRow(row.id)}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#FF4D4D",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        marginRight: "10px",
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
          {model === "etc" ? (
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
            
          ) : (
            <div style={{width: '95%', backgroundColor: '#F1EEEE', borderRadius: '15px', padding: '10px', marginTop: '15px'}}>
              {/* WBS 위자드 */}
              {/* 제목 */}
              <div>
                <span style={{padding: '5px', fontSize: '24px'}}>WBS 위자드6</span>
              </div>
              {/* Form */}
              <form onSubmit={(e) => e.preventDefault()} >
                {/* 윗쪽: 대분류, 중분류, 소분류 */}
                <div style={{display: 'flex', alignItems: "center", padding: '15px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '5px', flex: 1}}>
                    <label style={{ fontWeight: "bold", marginRight: "10px" }}>대분류 :</label>
                    <select
                      value={selectedCategory}
                      onChange={handleCategorySelectChange}
                      style={{width: '100px', padding: '5px', fontSize: '16px'}}
                    >
                      <option value="">직접 입력</option>
                      {Object.keys(nowCat).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div style={{width: '40%'}}>
                      {selectedCategory === "" ? (
                        <input
                          type="text"
                          value={tmpRow.category}
                          onChange={handleCategoryInputChange}
                          style={{
                            padding: "5px",
                            fontSize: "16px",
                            width: "100%",
                            border: '1px solid #000',
                            backgroundColor: '#fff',
                            height: '20px',
                          }}
                        />
                        
                      ) : (
                        <div style={{
                          padding: "5px",
                          fontSize: "16px",
                          width: "100%",
                          border: '1px solid #000',
                          backgroundColor: '#fff',
                          height: '20px',
                        }}>{selectedCategory}</div>
                      )}
                    </div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '5px', flex: 1}}>
                    <label style={{ fontWeight: "bold", marginRight: "10px" }}>중분류 :</label>
                    <select
                      value={selectedSubCategory}
                      onChange={handleSubCategorySelectChange}
                      style={{width: '100px', padding: '5px', fontSize: '16px'}}
                    >
                      <option value="">직접 입력</option>
                      {subCategories.map((subCat) => (
                        <option key={subCat} value={subCat}>
                          {subCat}
                        </option>
                      ))}
                    </select>
                    <div style={{width: '40%'}}>
                      {selectedSubCategory === "" ? (
                        <input
                          type="text"
                          value={tmpRow.subCategory}
                          onChange={handleSubCategoryInputChange}
                          style={{
                            padding: "5px",
                            fontSize: "16px",
                            width: "100%",
                            border: '1px solid #000',
                            backgroundColor: '#fff',
                            height: '20px',
                          }}
                        />
                        
                      ) : (
                        <div style={{
                          padding: "5px",
                          fontSize: "16px",
                          width: "100%",
                          border: '1px solid #000',
                          backgroundColor: '#fff',
                          height: '20px',
                        }}>{selectedSubCategory}</div>
                      )}
                    </div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '5px', flex: 1}}>
                    <label style={{ fontWeight: "bold", marginRight: "10px" }}>소분류 :</label>
                    <select
                      value={selectedSubSubCategory}
                      onChange={handleSubSubCategorySelectChange}
                      style={{width: '100px', padding: '5px', fontSize: '16px'}}
                    >
                      <option value="">직접 입력</option>
                      {subSubCategories.map((subSubCat) => (
                        <option key={subSubCat} value={subSubCat}>
                          {subSubCat}
                        </option>
                      ))}
                    </select>
                    <div style={{width: '40%'}}>
                      {selectedSubSubCategory === "" ? (
                        <input
                          type="text"
                          value={tmpRow.subSubCategory}
                          onChange={handleSubSubCategoryInputChange}
                          style={{
                            padding: "5px",
                            fontSize: "16px",
                            width: "100%",
                            border: '1px solid #000',
                            backgroundColor: '#fff',
                            height: '20px',
                          }}
                        />
                        
                      ) : (
                        <div style={{
                          padding: "5px",
                          fontSize: "16px",
                          width: "100%",
                          border: '1px solid #000',
                          backgroundColor: '#fff',
                          height: '20px',
                        }}>{selectedSubSubCategory}</div>
                      )}
                    </div>
                  </div>
                </div>
                {/* 중간: 소소분류, 작업명 산출물, 담당자 */}
                <div style={{display: 'flex', alignItems: "center", padding: '15px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '5px', flex: 3}}>
                    <label style={{ fontWeight: "bold", marginRight: "10px" }}>액티비티 :</label>
                    <input
                          type="text"
                          value={tmpRow.subSubSubCategory}
                          onChange={(e) => handleEtcChange(e, "subSubSubCategory")}
                          style={{
                            padding: "5px",
                            fontSize: "16px",
                            width: "60%",
                            border: '1px solid #000',
                            backgroundColor: '#fff',
                            height: '20px',
                          }}
                        />
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '5px', flex: 3}}>
                    <label style={{ fontWeight: "bold", marginRight: "10px" }}>작업명 :</label>
                    <input
                          type="text"
                          value={tmpRow.taskName}
                          onChange={(e) => handleEtcChange(e, "taskName")}
                          style={{
                            padding: "5px",
                            fontSize: "16px",
                            width: "60%",
                            border: '1px solid #000',
                            backgroundColor: '#fff',
                            height: '20px',
                          }}
                        />
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '5px', flex: 2}}>
                    <label style={{ fontWeight: "bold", marginRight: "10px" }}>산출물 :</label>
                    <input
                          type="text"
                          value={tmpRow.product}
                          onChange={(e) => handleEtcChange(e, "product")}
                          style={{
                            padding: "5px",
                            fontSize: "16px",
                            width: "40%",
                            border: '1px solid #000',
                            backgroundColor: '#fff',
                            height: '20px',
                          }}
                        />
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '5px', flex: 2}}>
                    <label style={{ fontWeight: "bold", marginRight: "10px" }}>담당자 :</label>
                    <input
                          type="text"
                          value={tmpRow.assignee}
                          onChange={(e) => handleEtcChange(e, "assignee")}
                          style={{
                            padding: "5px",
                            fontSize: "16px",
                            width: "40%",
                            border: '1px solid #000',
                            backgroundColor: '#fff',
                            height: '20px',
                          }}
                        />
                  </div>
                  <div style={{flex: 1}}></div>
                </div>
                {/* 중간: 소소분류, 작업명 산출물, 담당자 */}
                <div style={{display: 'flex', alignItems: "center", padding: '15px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '5px', flex: 1}}>
                    <label style={{ fontWeight: "bold", marginRight: "10px" }}>시작일 :</label>
                    <input
                      type="date"
                      value={tmpRow.startDate}
                      onChange={(e) => handleEtcChange(e, "startDate")}
                      style={{
                        padding: "5px",
                        fontSize: "16px",
                        width: "60%",
                        border: '1px solid #000',
                        backgroundColor: '#fff',
                        height: '20px',
                      }}
                    />
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '5px', flex: 1}}>
                    <label style={{ fontWeight: "bold", marginRight: "10px" }}>마감일 :</label>
                    <input
                      type="date"
                      value={tmpRow.endDate}
                      onChange={(e) => handleEtcChange(e, "endDate")}
                      style={{
                        padding: "5px",
                        fontSize: "16px",
                        width: "60%",
                        border: '1px solid #000',
                        backgroundColor: '#fff',
                        height: '20px',
                      }}
                    />
                  </div>
                  <div style={{flex: 1}}></div>
                </div>
                <button
                  onClick={handleAddTmpRow}
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
              </form>
            </div>
          )}
          
        
        </div>
      </div>
    </div>
  );
}

