"use client";

import { useState, useEffect } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";

export default function WbsManagerPage(props: any) {
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [agileTemplateData, setAgileTemplateData] = useState<any[]>([]);
    const [waterfallTemplateData, setWaterfallTemplateData] = useState<any[]>([]);
    const [newStep, setNewStep] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newDetails, setNewDetails] = useState("");
    const [title, setTitle] = useState<string | null>(null); // 클라이언트에서만 변경될 title

    // Default Templates
    const agileTemplate = [
        { step: "프로젝트 시작", description: "팀 목표 설정 및 역할 분배", details: "팀 목표 설정, 역할 분배, 프로젝트 환경 설정" },
        { step: "백로그 작성", description: "작업 목록 및 우선순위 작성", details: "기능 목록 작성, 작업 항목 우선순위 설정" },
        { step: "스프린트 계획", description: "짧은 작업 주기의 목표 설정", details: "스프린트 목표 수립, 작업 분배, 기간 설정" },
        { step: "스프린트 실행", description: "팀원별 작업 수행", details: "개발, 설계, 테스트 수행, 진행 상황 추적" },
        { step: "리뷰 및 회고", description: "작업 결과 검토 및 피드백", details: "성과 리뷰, 피드백 수집, 개선 방안 설정" },
    ];

    const waterfallTemplate = [
        { step: "요구사항 분석", description: "프로젝트 목표 정의 및 필요 요소 확인", details: "기능 요구사항 분석, 시스템 요구사항 정의" },
        { step: "설계", description: "시스템 구조 설계 및 기술 스택 선정", details: "시스템 설계, UI/UX 설계, 기술 스택 결정" },
        { step: "구현", description: "설계에 따라 코딩 작업 수행", details: "모듈 개발, 단위 테스트 진행" },
        { step: "테스트", description: "오류 검출 및 수정 작업 수행", details: "유닛 테스트, 통합 테스트, 버그 수정" },
        { step: "결과물 제출", description: "최종 결과물 정리 및 발표 준비", details: "최종 보고서 작성, 발표 준비, 시스템 배포" },
    ];

    // 데이터가 초기화될 때마다 방법론에 맞는 템플릿 로드
    useEffect(() => {
        if (selectedModel === "Agile") {
            setAgileTemplateData(agileTemplate);
        } else if (selectedModel === "Waterfall") {
            setWaterfallTemplateData(waterfallTemplate);
        }
    }, [selectedModel]);

    // 클라이언트에서만 title을 설정하여 Hydration Error 방지
    useEffect(() => {
        setTitle("WBS Manager");
    }, []);

    const handleModelSelection = (model: string) => {
        setSelectedModel(model);
    };

    const renderWbsTemplate = () => {
        const template = selectedModel === "Agile" ? agileTemplateData : waterfallTemplateData;
        return (
            <table style={tableStyle}>
                <thead>
                    <tr style={tableHeaderStyle}>
                        <th>단계</th>
                        <th>설명</th>
                        <th>상세 작업</th>
                    </tr>
                </thead>
                <tbody>
                    {template.map((row, index) => (
                        <tr key={index}>
                            <td>{isEditMode ? (
                                <input
                                    type="text"
                                    value={row.step}
                                    onChange={(e) => handleFieldChange(e, index, "step")}
                                    style={inputStyle}
                                />
                            ) : row.step}</td>
                            <td>{isEditMode ? (
                                <input
                                    type="text"
                                    value={row.description}
                                    onChange={(e) => handleFieldChange(e, index, "description")}
                                    style={inputStyle}
                                />
                            ) : row.description}</td>
                            <td>{isEditMode ? (
                                <input
                                    type="text"
                                    value={row.details}
                                    onChange={(e) => handleFieldChange(e, index, "details")}
                                    style={inputStyle}
                                />
                            ) : row.details}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: string) => {
        const updatedTemplate = selectedModel === "Agile" ? [...agileTemplateData] : [...waterfallTemplateData];
        updatedTemplate[index][field] = e.target.value;
        if (selectedModel === "Agile") {
            setAgileTemplateData(updatedTemplate);
        } else {
            setWaterfallTemplateData(updatedTemplate);
        }
    };

    const handleDownload = () => {
        const template = selectedModel === "Agile" ? agileTemplateData : waterfallTemplateData;
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
        element.href = URL.createObjectURL(file);
        element.download = `${selectedModel}_wbs_template.json`;
        document.body.appendChild(element);
        element.click();
    };

    const handleEdit = () => {
        setIsEditMode(!isEditMode);
    };

    const handleAddStep = () => {
        if (newStep && newDescription && newDetails) {
            const newStepData = {
                step: newStep,
                description: newDescription,
                details: newDetails,
            };
            if (selectedModel === "Agile") {
                setAgileTemplateData([...agileTemplateData, newStepData]);
            } else {
                setWaterfallTemplateData([...waterfallTemplateData, newStepData]);
            }
            setNewStep("");
            setNewDescription("");
            setNewDetails("");
        }
    };

    return (
        <div>
            <MainHeader name={props.params.id} />
            <div style={{ display: "flex" }}>
                <MainSide qwe={props.params.id} />
                <div style={{ padding: "20px", flex: 1 }}>
                    <h1 style={{ textAlign: 'center' }}>{title}</h1> {/* 클라이언트에서만 title 설정 */}

                    {/* 방법론 선택 */}
                    <div style={centeredButtons}>
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
                            <button onClick={handleEdit} style={actionButtonStyle}>
                                {isEditMode ? "저장" : "수정"}
                            </button>
                            <button onClick={handleDownload} style={actionButtonStyle}>
                                다운로드
                            </button>
                        </div>
                    )}

                    {/* 새 항목 추가 폼 */}
                    {isEditMode && (
                        <div style={{ marginTop: "20px" }}>
                            <h3>새 항목 추가</h3>
                            <input
                                type="text"
                                placeholder="단계"
                                value={newStep}
                                onChange={(e) => setNewStep(e.target.value)}
                                style={inputStyle}
                            />
                            <input
                                type="text"
                                placeholder="설명"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                style={inputStyle}
                            />
                            <input
                                type="text"
                                placeholder="상세 작업"
                                value={newDetails}
                                onChange={(e) => setNewDetails(e.target.value)}
                                style={inputStyle}
                            />
                            <button onClick={handleAddStep} style={actionButtonStyle}>
                                추가
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const buttonStyle = {
    margin: "10px",
    padding: "10px 20px",
    background: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
};

const actionButtonStyle = {
    margin: "5px",
    padding: "10px 15px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    fontSize: "16px",
};

const inputStyle = {
    margin: "5px",
    padding: "8px",
    width: "300px",
    border: "1px solid #ccc",
    borderRadius: "4px",
};

const centeredButtons = {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
};

const tableStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #ddd",
    textAlign: "left",  // Ensure textAlign is a valid string type
    marginTop: "20px",
};

const tableHeaderStyle: React.CSSProperties = {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
    textAlign: "center",
};
