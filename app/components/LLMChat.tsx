'use client'

import axios from "axios";
import { useEffect, useState, useRef, CSSProperties, use } from "react";
import { getUnivId } from "../util/storage";
import usePermissionGuard from "../util/usePermissionGuard";

const LLMChat = ({pid}: {pid: number}) => {
    const [messages, setMessages] = useState<string[]>(['인녕하세요. 프로젝트 진행을 도와드릴 PMS Assistant입니다.']);
    const messageBox: {[key: number]: string} = {
        0: "현재 이 프로젝트의 진행 상태를 전반적으로 분석해줘.",
        1: "현재 이 프로젝트의 진행 상황을 바탕으로, 잠재적인 리스크 요소들을 분석해줘.",
        2: "현재 이 프로젝트에서 작성된 산출물(온라인 산출물과 기타 산출물)의 내용을 바탕으로, 각 산출물의 주요 구성 요소와 특징을 분석해줘.",
        3: "현재 이 프로젝트에서 작성된 산출물(온라인 산출물과 기타 산출물)의 품질을 평가해줘."
    }
    const [input, setInput] = useState<string>('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [nowLoading, setLoading] = useState(false);
    const s_no = getUnivId()
    const permission = usePermissionGuard(pid, s_no, {leader: 1, llm: [1, 2]}, false)

    useEffect(() => {
        if(permission !== null && permission){
            setMessages((prevMessages) => [...prevMessages, "INIT_0"]);
        }
    }, [permission])

    const handleMessageChange = (change: string) => {
        setMessages((prev) => {
            if(prev.length === 0){
                return [change];
            }
            return [...prev.slice(0, prev.length -1), change]
        })
    }
    
    function getMessageByNumber(option: number): string{
        return messageBox[option] || "";
    }

    const handleSendMessage = async(messageCode: number) => {
        if(pid === 0) return;
        if(nowLoading) return;
        // if (input.trim() === '') return; // 빈 입력 방지
        setInput(''); // 입력 필드 초기화
        setLoading(true)
        handleMessageChange(getMessageByNumber(messageCode))
        // setMessages((prevMessages) => [...prevMessages, `현재 점검중입니다. 코드 : ${messageCode}`]); // 상대방 메시지 추가
        
        // setLoading(false)
        try{
            const response = await axios.post("https://cd-api.chals.kim/api/llm/interact", {pid: pid, prompt: "", menu: messageCode}, {headers:{Authorization: process.env.SECRET_API_KEY}});
            const tmpMessage = response.data
            setMessages((prevMessages) => [...prevMessages, tmpMessage]); // 상대방 메시지 추가
        }catch(err){
            setMessages((prevMessages) => [...prevMessages, "오류가 발생했습니다."]); // 상대방 메시지 추가
        }finally{
            setLoading(false);
            setMessages((prevMessages) => [...prevMessages, "INIT_0"]); // 사용자 메시지 추가
        }
    };

    const handleInfoMessage = (messageCode: number) => {
        handleMessageChange(`${messageCode}`)
        setMessages((prevMessages) => [...prevMessages, `현재 점검중입니다. 코드 : ${messageCode}`]); // 상대방 메시지 추가
        setMessages((prevMessages) => [...prevMessages, "INIT_0"]); // 사용자 메시지 추가
    }

    // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (e.key === 'Enter') handleSendMessage(); // 엔터키로 메시지 전송
    // };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                maxHeight: '100%',
                minHeight: '100%',
                border: '1px solid #ccc',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                margin: '0 auto',
            }}
        >
            {/* 채팅창 영역 */}
            <div
                ref={chatContainerRef}
                style={{
                    flex: 1,
                    padding: '10px',
                    paddingBottom: '0',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    minHeight: 'calc(100% - 70px)',
                    maxHeight: 'calc(100% - 70px)'
                }}
            >
                {messages.map((msg, index) => {
                    // 기본 스타일
                    const baseStyle: React.CSSProperties = {
                        alignSelf: index % 2 === 0 ? "flex-start" : "flex-end",
                        maxWidth: "70%",
                        padding: "10px",
                        // paddingBottom: '0px',
                        borderRadius: "10px",
                        backgroundColor: index % 2 === 0 ? "#f1f0f0" : "#daf8cb",
                        color: "#333",
                        wordWrap: "break-word",
                        whiteSpace: "pre-wrap",
                        display: "flex", 
                        flexDirection: "column" 
                    };

                    let content: React.ReactNode;

                    switch (msg) {
                        case "INIT_0":
                            content = (
                                <>
                                <span>PMS Assistant에게 묻고싶은 메뉴를 선택해주세요. ver.8</span>
                                <div style={{ marginTop: "20px" }}>
                                    <button onClick={() => handleMessageChange("INIT_1")} style={chatbotBtn}>📋 프로젝트</button>
                                    <button onClick={() => handleMessageChange("INIT_2")} style={chatbotBtn}>📂 산출물</button>
                                    <button onClick={() => handleMessageChange("INIT_3")} style={chatbotBtn}>❔ 서비스 안내</button>
                                </div>
                                </>
                            );
                            break;
                        case "INIT_1":    
                            content = (
                                <>
                                <span>프로젝트에 관하여 어떤 도움이 필요하신가요?</span>
                                <div style={{ marginTop: "20px" }}>
                                    <button onClick={() => handleSendMessage(0)} style={chatbotBtn}>👓 프로젝트 분석 및 조언</button>
                                    <button onClick={() => handleSendMessage(1)} style={chatbotBtn}>🔍 프로젝트 리스크 분석</button>
                                    <button onClick={() => handleMessageChange("INIT_0")} style={chatbotBtn}>🔙 돌아가기</button>
                                </div>
                                </>
                            )
                            break;
                        case "INIT_2":
                            content = (
                                <>
                                <span>산출물에 관하여 어떤 도움이 필요하신가요?</span>
                                <div style={{ marginTop: "20px" }}>
                                    <button onClick={() => handleSendMessage(2)} style={chatbotBtn}>🔍 작성된 산출물 분석</button>
                                    <button onClick={() => handleSendMessage(3)} style={chatbotBtn}>📝 산출물 품질 평가</button>
                                    <button onClick={() => handleMessageChange("INIT_0")} style={chatbotBtn}>🔙 돌아가기</button>
                                </div>
                                </>
                            )
                            break;
                        case "INIT_3":
                            content = (
                                <>
                                <span></span>
                                <div style={{ marginTop: "20px" }}>
                                    <button onClick={() => handleInfoMessage(0)} style={chatbotBtn}>❔ 대학생을 위한 PMS 서비스란?</button>
                                    <button onClick={() => handleMessageChange("INIT_4")} style={chatbotBtn}>🗂️ 각 메뉴별 안내</button>
                                    <button onClick={() => handleMessageChange("INIT_0")} style={chatbotBtn}>🔙 돌아가기</button>
                                </div>
                                </>
                            )
                            break;
                        case "INIT_4":
                            content = (
                                <>
                                <span></span>
                                <div style={{ marginTop: "20px" }}>
                                    <button onClick={() => handleInfoMessage(1)} style={chatbotBtn}>WBS</button>
                                    <button onClick={() => handleInfoMessage(2)} style={chatbotBtn}>온라인 산출물</button>
                                    <button onClick={() => handleInfoMessage(3)} style={chatbotBtn}>기타 산출물</button>
                                </div>
                                <div style={{ marginTop: "20px" }}>
                                    <button onClick={() => handleInfoMessage(4)} style={chatbotBtn}>업무 관리</button>
                                    <button onClick={() => handleInfoMessage(5)} style={chatbotBtn}>평가</button>
                                    <button onClick={() => handleInfoMessage(6)} style={chatbotBtn}>프로젝트 관리</button>
                                </div>
                                <div style={{ marginTop: "20px" }}>
                                    <button onClick={() => handleMessageChange("INIT_0")} style={chatbotBtn}>🔙 돌아가기</button>
                                </div>
                                </>
                            )
                            break;
                        default:
                        content = msg;
                    }

                    return (
                        <div key={index} style={baseStyle}>
                        {content}
                        </div>
                    );
                    })}
            </div>

            {/* 입력창 영역 */}
            <div
                style={{
                    height: '40px',
                    display: 'flex',
                    borderTop: '1px solid #ccc',
                    padding: '10px',
                    backgroundColor: '#fff',
                }}
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    // onKeyDown={handleKeyDown}
                    readOnly
                    placeholder="메시지를 입력하세요..."
                    style={{
                        flex: 1,
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        outline: 'none',
                        marginRight: '10px',
                    }}
                />
                <button
                    // onClick={handleSendMessage}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    {(nowLoading ? "로딩 중" : "확인")}
                </button>
            </div>
        </div>
    )
}
export default LLMChat;

const chatbotBtn: CSSProperties = {
    border: 'none',
    backgroundColor: '#3182F6',
    borderRadius: '8px',
    color: '#fff',
    padding: '8px 15px',
    margin: '3px 5px',
    cursor: 'pointer',
    minHeight: '40px'
}
