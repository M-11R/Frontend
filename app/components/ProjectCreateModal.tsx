'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getUnivId } from '../util/storage';
import { waterfallRows, agileRows, etcRows, WbsRow } from '../util/wbs';

export function Modal({ isOpen, closeModal, children }: { isOpen: boolean; closeModal: () => void; children?: React.ReactNode }) {
    
    return (
        isOpen && (
        <div style={{position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <div style={{background: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px #000000', maxWidth: '500px', width: '100%'}}>
                <div style={{width: '100%', display: 'flex'}}><div style={{marginLeft: 'auto'}}><button onClick={closeModal} style={{fontSize: '15px'}}>X</button></div></div>
                {children}
            </div>
        </div>
        )
    );
}

type draft = {
    leader_univ_id: number
    new: boolean // 새로 만든 프로젝트인지, 아니면 수정본인지 확인하는 변수; 새로 만들고 처음 저장한다면 True로
    draft_id: number | null

    pname: string | null
    pdetails: string | null
    psize: number | null
    pperiod: string | null
    pmm: number | null
    univ_id: string | null // 팀원의 학번, 사람이 여러명이라면 ;으로 구분한다. (20100000;20102222;20103333)
    prof_id: number | null
    subject: number | null
}

type project = {
    wizard: number //# 프로젝트 Setup Wizard의 완료 여부를 기록

    pname: string  //# 프로젝트 이름
    pdetails: string  //# 프로젝트 내용
    psize: number  //# 프로젝트 개발 인원
    pperiod: string  //# 프로젝트 개발 기간 (예: "241012-241130")
    pmm: number  //# 프로젝트 관리 방법론 (프로젝트 관리 방식)
    univ_id: number
    prof_id: number //# 담당 교수의 교번
    subject: number //# 과목 코드
}

type subjectPayload = {
    RESULT_CODE: number,
    RESULT_MSG: string,
    PAYLOAD: {
        Result: subjectType[]
    }
}

type subjectType = {
    subj_no: number
    subj_name: string
}

export function ProjectCreateModal() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false)
        reset()
    };
    
    const [subjectList, setSubjectList] = useState<subjectType[]>([{subj_name: "Loading...", subj_no: 0}])
    const s_no = getUnivId();

    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [members, setMembers] = useState(0);
    const [method, setMethod] = useState(0);
    const [profId, setProfId] = useState<number>(0);
    const [subject, setSubject] = useState(13230);

    const [page, setPage] = useState(0);

    useEffect(() => {
        if(isOpen){
            loadSubject();
        }
    }, [isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (projectName.trim() === "" || projectDescription.trim() === '' || startDate === '' || endDate === '' || profId === 0) {
            alert("값을 모두 입력해주세요.");
        }else{
            postInit()
            reset()
            closeModal()
        }
        
    };

    const reset = () => {
        setProjectName('');
        setProjectDescription('');
        setStartDate('');
        setEndDate('');
        setMembers(0);
        setMethod(0);
        setSubject(0)
        setProfId(0)
        setPage(0)
    }

    const loadProf = async() => {
        try{
            // const response = await axios.post("https://cd-api.chals.kim/api/project/load_prof", {}, {headers:{Authorization: process.env.SECRET_API_KEY}});
        }catch(err){}
    }

    const loadSubject = async() => {
        try{
            const response = await axios.post<subjectPayload>("https://cd-api.chals.kim/api/subject/load_all", {}, {headers:{Authorization: process.env.SECRET_API_KEY}});
            const result = response.data.PAYLOAD.Result;
            setSubjectList(Array.isArray(result) ? result : []);
            
        }catch(err){}
    }

    const postDraft = async() => {
        const postDraft: draft = {
            leader_univ_id: s_no,
            new: true,
            draft_id: 0,

            pname: projectName,
            pdetails: projectDescription,
            psize: members,
            pperiod: `${fixDate(startDate)}-${fixDate(endDate)}`,
            pmm: method,
            univ_id: '',
            prof_id: profId,
            subject: subject
        }
        try{
            const response = await axios.post("https://cd-api.chals.kim/api/project/save_draft", postDraft, {headers:{Authorization: process.env.SECRET_API_KEY}});
            closeModal();
            // console.log(postDraft)
        }catch(err){}
    }

    const postInit = async() => {
        const postInit: project = {
            wizard: 0,
            pname: projectName,
            pdetails: projectDescription,
            psize: 0,
            pperiod: `${fixDate(startDate)}-${fixDate(endDate)}`,
            pmm: method,
            univ_id: s_no,
            prof_id: profId,
            subject: subject
        }

        try{
            const response = await axios.post("https://cd-api.chals.kim/api/project/init", postInit, {headers:{Authorization: process.env.SECRET_API_KEY}});
            // console.log(postInit)
            if (response.data.RESULT_CODE === 200) {
                const response2 = await axios.post("https://cd-api.chals.kim/api/pm/add_leader", {pid: response.data.PAYLOADS.PUID, univ_id: s_no}, {headers:{Authorization: process.env.SECRET_API_KEY}});
                router.push(`/project-main/${response.data.PAYLOADS.PUID}`);
            };
        }catch(err){}
    }

    const fixDate = (date: string) => {
        const rawValue = date;
        const formatted = rawValue.replace(/-/g, "").slice(2);
        return formatted;
    };

    const handlePageUp = () => {
        if(page < 2){
            const tmpPage = page;
            setPage(tmpPage + 1)
        }
    }

    const handlePageDown = () => {
        if(page > 0){
            const tmpPage = page;
            setPage(tmpPage - 1)
        }
    }

    return (
        <div>
            <button onClick={openModal} style={{ 
                position: 'relative', 
                bottom: '25px', 
                left: '20px', 
                padding: '15px 25px', 
                backgroundColor: '#007bff', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '8px', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                cursor: 'pointer' 
            }}>
                프로젝트 생성
            </button>
            <Modal isOpen={isOpen} closeModal={closeModal}>
                {(() => {
                    switch (page){
                        case 0:
                            return (
                                <form onSubmit={handleSubmit} onKeyDown={(e) => {if (e.key === "Enter"){e.preventDefault();}}} style={{ padding: '30px', borderRadius: '12px', backgroundColor: '#ffffff' }}>
                                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>프로젝트 개설</h2>
                                <div style={{ marginBottom: '15px' }}>
                                    <label htmlFor="projectName" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>프로젝트 이름:</label>
                                    <input
                                        type="text"
                                        id="projectName"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        required
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label htmlFor="projectDescription" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>프로젝트 설명:</label>
                                    <textarea
                                        id="projectDescription"
                                        value={projectDescription}
                                        onChange={(e) => setProjectDescription(e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', resize: 'vertical' }}
                                    ></textarea>
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label htmlFor="startDate" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>시작일:</label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label htmlFor="endDate" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>마감일:</label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <div style={{width: '100%', display: 'flex'}}>
                                    <button type="button" onClick={postDraft} style={{ padding: '5px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: 'auto', fontWeight: 'bold' }}>임시 저장</button>
                                    <button type="button" onClick={handlePageUp} style={{ padding: '5px', marginLeft: 'auto', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: 'auto', fontWeight: 'bold' }}>다음 페이지</button>
                                </div>
                            </form>
                        )
                        case 1:
                            return (
                                <div>
                                    <form onSubmit={handleSubmit} onKeyDown={(e) => {if (e.key === "Enter"){e.preventDefault();}}} style={{ padding: '30px', borderRadius: '12px', backgroundColor: '#ffffff' }}>
                                        <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>프로젝트 개설</h2>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label htmlFor="members" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>학과:</label>
                                            <select
                                                value={subject}
                                                onChange={(e) => setSubject(Number(e.target.value))}
                                                style={{ width: 'calc(100% + 24px)', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#ffffff' }}
                                            >
                                                {Array.isArray(subjectList) &&
                                                    subjectList.map((tmp) => (
                                                        <option key={tmp.subj_no} value={tmp.subj_no}>
                                                            {tmp.subj_name}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label htmlFor="members" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>교수 번호:</label>
                                            <input
                                                type="number"
                                                id="prof_id"
                                                value={profId}
                                                onChange={(e) => setProfId(Number(e.target.value))}
                                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                            />
                                        </div>
                                        
                                        <div style={{width: '100%', display: 'flex'}}>
                                            <button type="button" onClick={postDraft} style={{ padding: '5px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: 'auto', fontWeight: 'bold' }}>임시 저장</button>
                                            <button type="button" onClick={handlePageDown} style={{ padding: '5px', marginLeft: 'auto', marginRight: '0px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: 'auto', fontWeight: 'bold' }}>이전 페이지</button>
                                            <button type="button" onClick={handlePageUp} style={{ padding: '5px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: 'auto', fontWeight: 'bold' }}>다음 페이지</button>
                                        </div>
                                    </form>
                                </div>
                                
                            )
                        case 2:
                            return (
                                <div>
                                    <form onSubmit={handleSubmit} onKeyDown={(e) => {if (e.key === "Enter"){e.preventDefault();}}} style={{ padding: '30px', borderRadius: '12px', backgroundColor: '#ffffff' }}>
                                        <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>프로젝트 개설</h2>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label htmlFor="method" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>개발 방식:</label>
                                            <select
                                                value={method}
                                                onChange={(e) => setMethod(Number(e.target.value))}
                                                style={{ width: 'calc(100% + 24px)', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#ffffff' }}
                                            >
                                                <option value={0}>폭포수 모델</option>
                                                <option value={1}>에자일 모델</option>
                                                <option value={2}>기타</option>
                                            </select>
                                        </div>
                                        <div style={{width: '100%', display: 'flex'}}>
                                            <button type="button" onClick={postDraft} style={{ padding: '5px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: 'auto', fontWeight: 'bold' }}>임시 저장</button>
                                            <button type="button" onClick={handlePageDown} style={{ padding: '5px', marginLeft: 'auto', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: 'auto', fontWeight: 'bold' }}>이전 페이지</button>
                                            <button type="submit" style={{ padding: '5px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: 'auto', fontWeight: 'bold' }}>저장</button>
                                        </div>
                                    </form>
                                </div>
                            )
                        default:
                            return (
                                <div>
                                    Loading...
                                </div>
                            );
                    }
                })()}
            
            </Modal>
        </div>
    )
}