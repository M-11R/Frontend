'use client'

import axios from "axios";
import { useEffect, useState, useRef } from "react";

const LLMChat = ({pid}: {pid: number}) => {
    const [messages, setMessages] = useState<string[]>(['테스트 1']);
    const [input, setInput] = useState<string>('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = async() => {
        if (input.trim() === '') return; // 빈 입력 방지
        
        setMessages((prevMessages) => [...prevMessages, input]); // 사용자 메시지 추가
        setMessages((prevMessages) => [...prevMessages, '현재 점검중입니다.']); // 상대방 메시지 추가
        // try{
        //     const response = await axios.post("https://cd-api.chals.kim/api/llm/interact", {pid: pid, prompt: input}, {headers:{Authorization: process.env.SECRET_API_KEY}});
        //     const tmpMessage = response.data.response.text
            
        // }catch(err){}
        
        setInput(''); // 입력 필드 초기화
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSendMessage(); // 엔터키로 메시지 전송
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div
            style={{
                width: '1200px',
                height: '550px',
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
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}
            >
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            alignSelf: index % 2 === 0 ? 'flex-start' : 'flex-end',
                            maxWidth: '70%',
                            padding: '10px',
                            borderRadius: '10px',
                            backgroundColor: index % 2 === 0 ? '#f1f0f0' : '#daf8cb',
                            color: '#333',
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {msg}
                    </div>
                ))}
            </div>

            {/* 입력창 영역 */}
            <div
                style={{
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
                    onKeyDown={handleKeyDown}
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
                    onClick={handleSendMessage}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    확인
                </button>
            </div>
        </div>
    )
}
export default LLMChat;