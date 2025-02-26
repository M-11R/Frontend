export type WbsRow = {
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
    completed: boolean;
};
  
// 폭포수 모델 초기 데이터
export const waterfallRows: WbsRow[] = [
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
export const agileRows: WbsRow[] = [
    { id: "1", category: "백로그", subCategory: "유저 스토리 작성", subSubCategory: "요구사항 정의", subSubSubCategory: "스토리 맵 작성", taskName: "유저 스토리 정의", product: "유저 스토리 목록", assignee: "홍길동", note: "", progress: 10, startDate: "2024-01-01", endDate: "2024-01-03", completed: false },
    { id: "2", category: "백로그", subCategory: "백로그 정리", subSubCategory: "우선순위 결정", subSubSubCategory: "MoSCoW 기법 적용", taskName: "우선순위 설정", product: "정리된 백로그", assignee: "김영희", note: "", progress: 15, startDate: "2024-01-04", endDate: "2024-01-06", completed: false },
    { id: "3", category: "스프린트 계획", subCategory: "목표 설정", subSubCategory: "스프린트 범위 결정", subSubSubCategory: "기능 분류 및 선정", taskName: "스프린트 목표 설정", product: "목표 리스트", assignee: "이영희", note: "", progress: 20, startDate: "2024-01-07", endDate: "2024-01-09", completed: false },
    { id: "4", category: "스프린트 계획", subCategory: "작업 분배", subSubCategory: "팀별 업무 배정", subSubSubCategory: "페어 프로그래밍 구성", taskName: "팀별 작업 배분", product: "작업 계획서", assignee: "홍길동", note: "", progress: 30, startDate: "2024-01-10", endDate: "2024-01-12", completed: false },
    { id: "5", category: "개발 작업", subCategory: "프론트엔드 개발", subSubCategory: "UI 개발", subSubSubCategory: "컴포넌트 설계 및 구현", taskName: "UI 구현", product: "UI 컴포넌트", assignee: "김철수", note: "", progress: 40, startDate: "2024-01-13", endDate: "2024-01-20", completed: false },
    { id: "6", category: "개발 작업", subCategory: "백엔드 개발", subSubCategory: "API 개발", subSubSubCategory: "RESTful API 설계 및 구현", taskName: "API 개발", product: "API 모듈", assignee: "이영희", note: "", progress: 50, startDate: "2024-01-21", endDate: "2024-01-30", completed: false },
    { id: "7", category: "QA", subCategory: "단위 테스트", subSubCategory: "테스트 코드 작성", subSubSubCategory: "Jest 테스트 적용", taskName: "테스트 작성 및 실행", product: "테스트 결과 보고서", assignee: "홍길동", note: "", progress: 60, startDate: "2024-01-31", endDate: "2024-02-05", completed: false },
    { id: "8", category: "QA", subCategory: "통합 테스트", subSubCategory: "기능 및 성능 검증", subSubSubCategory: "CI/CD 파이프라인 활용", taskName: "전체 기능 테스트", product: "테스트 결과 보고서", assignee: "김영희", note: "", progress: 70, startDate: "2024-02-06", endDate: "2024-02-10", completed: false },
    { id: "9", category: "스프린트 회고", subCategory: "성과 리뷰", subSubCategory: "개선 사항 도출", subSubSubCategory: "KPT(Keep, Problem, Try) 분석", taskName: "스프린트 성과 분석", product: "회고 보고서", assignee: "이영희", note: "", progress: 80, startDate: "2024-02-11", endDate: "2024-02-15", completed: false },
    { id: "10", category: "배포 및 릴리스", subCategory: "운영 환경 설정", subSubCategory: "배포 환경 구성", subSubSubCategory: "AWS 서버 설정", taskName: "운영 환경 구성", product: "운영 기록", assignee: "홍길동", note: "", progress: 90, startDate: "2024-02-16", endDate: "2024-02-20", completed: false },
    { id: "11", category: "배포 및 릴리스", subCategory: "최종 릴리스", subSubCategory: "릴리스 문서화", subSubSubCategory: "버전 관리 및 태깅", taskName: "제품 배포 완료", product: "릴리스 기록", assignee: "김철수", note: "", progress: 100, startDate: "2024-02-21", endDate: "2024-02-25", completed: false },
];

//기타
export const etcRows: WbsRow[] = [
    { id: "1", category: "", subCategory: "", subSubCategory: "", subSubSubCategory: "", taskName: "", product: "", assignee: "", note: "", progress: 0, startDate: "2024-01-01", endDate: "2099-01-03", completed: false },
]

