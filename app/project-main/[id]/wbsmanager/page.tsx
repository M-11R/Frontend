"use client";

import { useState } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";

export default function WbsManagerPage(props: any) {
    const [selectedModel, setSelectedModel] = useState<string | null>(null);

    // Agile 템플릿 데이터
    const agileTemplate = [
        { step: "프로젝트 시작", description: "팀 목표 설정 및 역할 분배", details: "프로젝트 주제 선정, 팀원 역할 분배, 기본 일정 수립" },
        { step: "백로그 작성", description: "작업 목록 및 우선순위 작성", details: "주요 기능 및 작업 항목 작성, 백로그 우선순위 정하기" },
        { step: "스프린트 계획", description: "짧은 작업 주기의 목표 설정", details: "2주 단위 작업 목표 수립, 개인별 작업 할당" },
        { step: "스프린트 실행", description: "팀원별 작업 수행", details: "코딩, 설계, 테스트 등 할당된 작업 수행" },
        { step: "리뷰 및 회고", description: "작업 결과 검토 및 피드백", details: "성과 분석, 개선 사항 논의, 다음 계획 설정" },
    ];

    // Waterfall 템플릿 데이터
    const waterfallTemplate = [
        { step: "요구사항 분석", description: "프로젝트 목표 정의 및 필요 요소 확인", details: "필수 기능 정의, 요구사항 문서화" },
        { step: "설계", description: "시스템 구조 설계 및 기술 스택 선정", details: "데이터베이스 설계, UI/UX 설계, 기술 도구 선택" },
        { step: "구현", description: "설계에 따라 코딩 작업 수행", details: "모듈별 개발, 팀원별 역할에 따른 코딩 작업 수행" },
        { step: "테스트", description: "오류 검출 및 수정 작업 수행", details: "유닛 테스트, 통합 테스트 진행" },
        { step: "결과물 제출", description: "최종 결과물 정리 및 발표 준비", details: "보고서 작성, 발표 자료 준비, 시연 연습" },
    ];

    // 방법론 선택 핸들러
    const handleModelSelection = (model: string) => {
        setSelectedModel(model);
    };

    // WBS 템플릿 렌더링
    const renderWbsTemplate = () => {
        const template = selectedModel === "Agile" ? agileTemplate : waterfallTemplate;
        return (
            <table style={{ width: "100%", border: "1px solid #ddd", textAlign: "left" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                        <th>단계</th>
                        <th>설명</th>
                        <th>상세 작업</th>
                    </tr>
                </thead>
                <tbody>
                    {template.map((row, index) => (
                        <tr key={index}>
                            <td>{row.step}</td>
                            <td>{row.description}</td>
                            <td>{row.details}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // 다운로드 버튼 핸들러
    const handleDownload = () => {
        const template = selectedModel === "Agile" ? agileTemplate : waterfallTemplate;
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
        element.href = URL.createObjectURL(file);
        element.download = `${selectedModel}_wbs_template.json`;
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div>
            {/* 메인 헤더 */}
            <MainHeader name={props.params.id} />

            {/* 메인 레이아웃 */}
            <div style={{ display: "flex" }}>
                {/* 왼쪽 사이드 */}
                <MainSide qwe={props.params.id} />

                {/* 오른쪽 메인 컨텐츠 */}
                <div style={{ padding: "20px", flex: 1 }}>
                    <h1>WBS Manager</h1>
                    <p>ID: {props.params.id}</p>

                    {/* 방법론 선택 */}
                    <div>
                        <h2>방법론 선택</h2>
                        <button onClick={() => handleModelSelection("Agile")} style={buttonStyle}>
                            Agile
                        </button>
                        <button onClick={() => handleModelSelection("Waterfall")} style={buttonStyle}>
                            Waterfall
                        </button>
                    </div>

                    {/* WBS 양식 */}
                    <div style={{ marginTop: "20px" }}>{selectedModel && renderWbsTemplate()}</div>

                    {/* 수정 및 다운로드 버튼 */}
                    {selectedModel && (
                        <div style={{ marginTop: "20px" }}>
                            <button style={actionButtonStyle}>수정</button>
                            <button onClick={handleDownload} style={actionButtonStyle}>
                                다운로드
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const buttonStyle = {
    margin: "5px",
    padding: "10px 15px",
    background: "#f0f0f0",
    border: "1px solid #ccc",
    cursor: "pointer",
};

const actionButtonStyle = {
    margin: "5px",
    padding: "10px 15px",
    background: "#007BFF",
    color: "#fff",
    border: "none",
    cursor: "pointer",
};
