'use client'

import { useState, useEffect, CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getUnivId } from '../util/storage';

export function Modal({ isOpen, closeModal, children }: { isOpen: boolean; closeModal: () => void; children?: React.ReactNode }) {
    
    return (
        isOpen && (
        <div style={{position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', zIndex: 9999}}>
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

type getDraft = {
    leader_univ_id: number
    new: boolean
    draft_id: number

    pname: string
    pdetails: string
    psize: number
    pperiod: string
    pmm: number
    univ_id: string
    prof_id: number
    subject: number
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

type draftPayLoad = {
    RESULT_CODE: number
    RESULT_MSG: string
    draft_num: number
    draft_data: {
        draft_id: getDraft[]
    }
}

type dnoPayLoad = {
    RESULT_CODE: number,
    RESULT_MSG: string,
    PAYLOAD: {
        Result: dnoType[]
    }
}

type dnoType = {
    dno: number,
    dname: string
}

type profPayload = {
    RESULT_CODE: number,
    RESULT_MSG: string,
    PAYLOAD: {
        Result: profType[]
    }
}

type profType = {
    f_no: number
    f_name: string
}

type cppList = {
    ver: number;
    date: string;
    s_no: number;
    msg: string;
  };
  
  // 기존 cppList 배열 대신, 이제 그룹별로 받습니다.
  type GroupedLog = {
    pname: string | null;
    history: cppList[];
  };

export function EditDraftProjectModal() {
    const [isLoading, setIsLoading] = useState(false);
    const [newPj, setNewPj] = useState(true);
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
    const [draftId, setDraftId] = useState(0);
    const [isNew, setIsNew] = useState(true);
    const [profList, setProfList] = useState<profType[]>([{f_no: 0, f_name: "Loading..."}])

    const [draftLoading, setDraftLoading] = useState(true);
    const [recoveryLoading, setRecoveryLoading] = useState(true);

    const [logList, setLogList] = useState<cppList[]>([{
            ver: -1,
            date: "",
            s_no: -1,
            msg: ""
        }]);

    const [selectRecovery, setSelectRecovery] = useState<cppList>({
        ver: -1,
        date: "",
        s_no: -1,
        msg: ""
    })
    const [selectPid, setSelectPid] = useState(0)

    const [draftList, setDraftList] = useState<getDraft[]>([
        {
            leader_univ_id: 0,
            new: false,
            draft_id: 0,
            pname: "Loading...",
            pdetails: '',
            psize: 0,
            pperiod: '',
            pmm: 0,
            univ_id: '',
            prof_id: 0,
            subject: 0,
            
        }
    ]);

    const [page, setPage] = useState(0);

    const [groupedLogs, setGroupedLogs] = useState<Record<number, GroupedLog>>({});
    const [selectedPNo, setSelectedPNo] = useState<number | null>(null);

    const loadRecovery = async () => {
        try {
          // 예시: pid는 0 (혹은 필요에 따라 값 변경)
          const response = await axios.post(
            "https://cd-api.chals.kim/api/ccp/load_history_id",
            { pid: 0, univ_id: s_no, msg: "", ver: 0 },
            { headers: { Authorization: process.env.SECRET_API_KEY } }
          );

          setGroupedLogs(response.data.PAYLOAD);
          setRecoveryLoading(false);
        } catch (err) {
          console.error(err);
          setRecoveryLoading(false);
        }
      };

    // useEffect(() => {
    //     const groups = logList.reduce((acc: Record<number, cppList[]>, log) => {
    //         if (!acc[log.p_no]) {
    //         acc[log.p_no] = [];
    //         }
    //         acc[log.p_no].push(log);
    //         return acc;
    //     }, {});
    //     setGroupedLogs(groups);
    // }, [logList]);

    const handleGroupClick = (p_no: number) => {
        setSelectedPNo(selectedPNo === p_no ? null : p_no);
      };

    useEffect(() => {
        if(isOpen){
            loadSubject();
            loadDraft();
            loadRecovery();
        }
    }, [isOpen])

    // const loadRecovery = async() => {
    //     try{
    //         const response = await axios.post("https://cd-api.chals.kim/api/ccp/load_history_id", {pid: 0, univ_id: s_no, msg: "", ver: 0}, {headers:{Authorization: process.env.SECRET_API_KEY}});
    //         setLogList(response.data.PAYLOAD)
    //         setRecoveryLoding(false);
    //     }catch(err){}
    // }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (projectName.trim() === "" || projectDescription.trim() === '' || startDate === '' || endDate === '') {
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
        setSubject(13230)
        setProfId(0)
        setPage(0)
        setDraftList([])
        setNewPj(true)
    }

    const reset2 = () => { // 새 프로젝트 클릭 시 리셋
        setProjectName('');
        setProjectDescription('');
        setStartDate('');
        setEndDate('');
        setMembers(0);
        setMethod(0);
        setSubject(13230)
        setProfId(0)
        setPage(0)
        setIsNew(true)
        // setDraftList([])
        setNewPj(true)
    }

    const loadProf = async() => {
        try{
            const response = await axios.post<profPayload>("https://cd-api.chals.kim/api/acc/load_prof", {subj_no: subject}, {headers:{Authorization: process.env.SECRET_API_KEY}});
            setProfList(response.data.PAYLOAD.Result)
        }catch(err){}
    }

    useEffect(() => {
        loadProf()
    }, [subject])

    useEffect(() => {
        if(profList.length > 0){
            setProfId(profList[0].f_no)
        }else{
            setProfId(0)
        }
    }, [profList])

    const loadSubject = async() => {
        try{
            const response = await axios.post<subjectPayload>("https://cd-api.chals.kim/api/subject/load_all", {}, {headers:{Authorization: process.env.SECRET_API_KEY}});
            
            const result = response.data.PAYLOAD.Result;
            setSubjectList(Array.isArray(result) ? result : []);
        }catch(err){}
    }

    

    const loadDraft = async() => {
        const postDraft: draft = {
            leader_univ_id: s_no,
            new: false,
            draft_id: 0,

            pname: 'a',
            pdetails: 'a',
            psize: 0,
            pperiod: `a`,
            pmm: 0,
            univ_id: '',
            prof_id: 0,
            subject: 0
        }
        try{
            const response = await axios.post<draftPayLoad>("https://cd-api.chals.kim/api/project/load_draft", postDraft, {headers:{Authorization: process.env.SECRET_API_KEY}});
            const tmp = response.data.draft_data.draft_id;
            setDraftList(Object.values(tmp));
            setDraftLoading(false)
        }catch(err){}
    }

    const postDraft = async() => {
        const postDraft: draft = {
            leader_univ_id: s_no,
            new: isNew,
            draft_id: draftId,
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
            closeModal()
        }catch(err){
        }
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

        const postDraft: draft = {
            leader_univ_id: s_no,
            new: false,
            draft_id: draftId,
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
            const response = await axios.post("https://cd-api.chals.kim/api/project/init", postInit, {headers:{Authorization: process.env.SECRET_API_KEY}});
            // console.log(postInit)
            if (response.data.RESULT_CODE === 200) {
                router.push(`/project-main/${response.data.PAYLOADS.PUID}`);
                const response2 = await axios.post("https://cd-api.chals.kim/api/project/del_draft", postDraft, {headers:{Authorization: process.env.SECRET_API_KEY}});
            };
        }catch(err){}
    }

    const fixDate = (date: string) => {
        const rawValue = date;
        const formatted = rawValue.replace(/-/g, "").slice(2);
        return formatted;
    };

    const handlePageUp = () => {
        if(page < 3){
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

    const handleRecoveryClick = () => {
        setPage(-1)
    }

    const handleDraftClick = (item: getDraft, index: number) => {
        if(item.pperiod === "-"){
            setStartDate('');
            setEndDate('');
        }else{
            const [sStr = "", eStr = ""] = item.pperiod.split("-");
            let sDate = "";
            let eDate = "";

            if(sStr && sStr.length === 6){
                sDate = `20${sStr.slice(0,2)}-${sStr.slice(2,4)}-${sStr.slice(4,6)}`
                setStartDate(sDate)
            }
            if(eStr && eStr.length === 6){
                eDate = `20${eStr.slice(0,2)}-${eStr.slice(2,4)}-${eStr.slice(4,6)}`
                setEndDate(eDate)
            }
        }
        setProjectName(item.pname);
        setProjectDescription(item.pdetails);
        setIsNew(false)
        setMethod(item.pmm);
        setSubject(item.subject)
        setProfId(item.prof_id)
        setDraftId(index)
        setNewPj(false)
        setPage(1)
    }

    const handleNewPJClick = () => {
        reset2();
        setPage(1);
    }

    const handlereturnPJClick = () => {
        alert("준비중입니다.")
    }

    const handleFirstPage = () => {
        setPage(0)
    }

    const handleCppClick = (item: cppList) => {
        setSelectRecovery(item)
        setPage(-2)
    }

    const handleImport = async() => {
            if(isLoading) return
            setIsLoading(true)
            const data = {
                pid: selectPid,
                univ_id: selectRecovery.s_no,
                msg: selectRecovery.msg,
                ver: selectRecovery.ver,
                is_removed: 1
            }
            try{
                    const response = await axios.post("https://cd-api.chals.kim/api/ccp/import", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
                    closeModal()
                    alert("가져오기 완료!")
                    router.push(`/project-main/${selectPid}/main`)
            }catch(err){
    
            }finally{
                setIsLoading(false)
            }
        }

    return (
        <div>
            <button onClick={openModal} style={{ 
                position: 'relative', 
                // bottom: '25px', 
                // left: '20px', 
                backgroundColor: '#007bff', 
                color: '#fff', 
                minWidth: "130px",
                height: "36px",
                border: "1px solid #d1d5db",
                borderRadius: "12px 12px 0 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flex: "0 0 auto",
                padding: "0 12px",
                transition: "all 0.3s ease-in-out",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            }}>
                새로운 프로젝트
            </button>
            <Modal isOpen={isOpen} closeModal={closeModal}>
                {(() => {
                    switch (page){
                        case 0:
                            return (
                                <div style={{width: '100%', height: '100%',marginBottom: '15px', overflowY: 'auto', maxHeight: '500px'}}>
                                    <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>임시 프로젝트 리스트</h2>
                                    {(draftLoading) ? (
                                        <div style={{width: '100%', height: '300px',maxHeight: '300px', overflowY: 'auto'}}>
                                            
                                        </div>
                                        ) : (
                                        <div style={{width: '100%', height: '300px',maxHeight: '300px', overflowY: 'auto'}}>
                                            {draftList.map((item: getDraft, index: number) => (
                                                <div key={index} style={{width: 'calc(80%)', padding: '5px', margin: 'auto'}}>
                                                    <button onClick={() => handleDraftClick(item, index)} style={{border: '1px solid #000', borderRadius: '8px', padding: '5px', width: '100%', backgroundColor: '#fff'}}>
                                                        <span style={{fontSize: '18px'}}>{index+1}: {item.pname}</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>)}
                                    <div style={{width: 'calc(80%)', padding: '5px', margin: 'auto'}}>
                                        <button onClick={handleNewPJClick} style={{border: '1px solid #000', borderRadius: '8px', padding: '5px', width: '100%', backgroundColor: '#fff'}}>
                                            <span style={{fontSize: '18px'}}>새로운 프로젝트 생성</span>
                                        </button>
                                    </div>
                                    <div style={{width: 'calc(80%)', padding: '5px', margin: 'auto'}}>
                                        <button onClick={handleRecoveryClick} style={{border: '1px solid #000', borderRadius: '8px', padding: '5px', width: '100%', backgroundColor: '#fff'}}>
                                            <span style={{fontSize: '18px'}}>프로젝트 복원</span>
                                        </button>
                                    </div>
                                </div>
                            )
                        case 1:
                            return (
                                <form onSubmit={handleSubmit} onKeyDown={(e) => {if (e.key === "Enter"){e.preventDefault();}}} style={{ padding: '30px', borderRadius: '12px', backgroundColor: '#ffffff' }}>
                                {newPj?(<h2>새로운 프로젝트</h2>):(<h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>프로젝트 개설</h2>)}
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
                                    <button type="button" onClick={handlePageDown} style={{ padding: '5px', marginLeft: 'auto', marginRight: '0px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: 'auto', fontWeight: 'bold' }}>이전 페이지</button>
                                    <button type="button" onClick={handlePageUp} style={{ padding: '5px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: 'auto', fontWeight: 'bold' }}>다음 페이지</button>
                                </div>
                            </form>
                        )
                        case 2:
                            return (
                                <div>
                                    <form onSubmit={handleSubmit} onKeyDown={(e) => {if (e.key === "Enter"){e.preventDefault();}}} style={{ padding: '30px', borderRadius: '12px', backgroundColor: '#ffffff' }}>
                                        <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>프로젝트 개설</h2>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label htmlFor="members" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>과목:</label>
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
                                            <select
                                                value={profId}
                                                onChange={(e) => setProfId(Number(e.target.value))}
                                                style={{ width: 'calc(100% + 24px)', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#ffffff' }}
                                            >
                                                {Array.isArray(profList) &&
                                                    profList.map((item) => (
                                                        <option key={item.f_no} value={item.f_no}>
                                                            {item.f_name}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        
                                        <div style={{width: '100%', display: 'flex'}}>
                                            <button type="button" onClick={postDraft} style={{ padding: '5px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: 'auto', fontWeight: 'bold' }}>임시 저장</button>
                                            <button type="button" onClick={handlePageDown} style={{ padding: '5px', marginLeft: 'auto', marginRight: '0px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: 'auto', fontWeight: 'bold' }}>이전 페이지</button>
                                            <button type="button" onClick={handlePageUp} style={{ padding: '5px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: 'auto', fontWeight: 'bold' }}>다음 페이지</button>
                                        </div>
                                    </form>
                                </div>
                                
                            )
                        case 3:
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
                        case -1:
                            return(
                                <div style={{width: '100%', height: '100%',marginBottom: '15px', overflowY: 'auto', maxHeight: '500px'}}>
                                    <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>삭제된 프로젝트 리스트</h2>
                                    {(recoveryLoading) ? (
                                        <div style={{width: '100%', height: '300px',maxHeight: '300px', overflowY: 'auto'}}>
                                            
                                        </div>
                                        ) : (
                                        <div style={{width: '100%', height: '300px',maxHeight: '300px', overflowY: 'auto'}}>
                                            {recoveryLoading ? (
                                                <div>Loading...</div>
                                            ) : (
                                                Object.keys(groupedLogs).map((p_noStr) => {
                                                const p_no = parseInt(p_noStr);
                                                const group = groupedLogs[p_no];
                                                return (
                                                    <div key={p_no} style={{ marginBottom: "10px", width: "80%", margin: "auto" }}>
                                                    {/* 그룹 버튼 */}
                                                    <button
                                                        onClick={() => handleGroupClick(p_no)}
                                                        style={{
                                                        width: "100%",
                                                        padding: "10px",
                                                        border: "1px solid #000",
                                                        borderRadius: "8px",
                                                        backgroundColor: "#fff",
                                                        cursor: "pointer",
                                                        textAlign: "left",
                                                        }}
                                                    >
                                                        {`${group.pname}: (${group.history.length} 개 로그)`}
                                                    </button>
                                                    {/* 선택된 그룹이면 해당 그룹의 로그 나열 */}
                                                    {selectedPNo === p_no && (
                                                        <div style={{ marginTop: "5px", margin: "10px" }}>
                                                        {group.history.map((item, index) => (
                                                            <div key={index} style={{ marginBottom: "5px" }}>
                                                            <button
                                                                onClick={() => handleCppClick(item)}
                                                                style={{
                                                                width: "100%",
                                                                padding: "8px",
                                                                border: "1px solid #000",
                                                                borderRadius: "8px",
                                                                backgroundColor: "#fff",
                                                                cursor: "pointer",
                                                                }}
                                                            >
                                                                <span>{`ver.${item.ver} | ${item.msg}`}</span>
                                                                <br />
                                                                <span>{item.date.replace("T", " ")}</span>
                                                            </button>
                                                            </div>
                                                        ))}
                                                        </div>
                                                    )}
                                                    </div>
                                                );
                                                })
                                            )}
                                        </div>)}
                                    <div style={{width: 'calc(80%)', padding: '5px', margin: 'auto'}}>
                                        <button onClick={handlePageUp} style={{border: '1px solid #000', borderRadius: '8px', padding: '5px', width: '100%', backgroundColor: '#fff'}}>
                                            <span style={{fontSize: '18px'}}>첫 페이지 이동</span>
                                        </button>
                                    </div>
                                </div>
                            )
                        case -2:
                            return (
                                <div style={{width: '100%', height: '100%',marginBottom: '15px', overflowY: 'auto', maxHeight: '500px'}}>
                                    <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>프로젝트 정보</h2>
                                    <div style={{ display: "flex", flexDirection: "column", width: '80%', margin: '20px auto' }}>
                                                            <div style={modalFieldStyle}>
                                                                <strong>버전: </strong>
                                                                {selectRecovery.ver}
                                                            </div>
                                                            <div style={modalFieldStyle}>
                                                                <strong>수정자: </strong>
                                                                {selectRecovery.s_no}
                                                            </div>
                                                            <div style={modalFieldStyle}>
                                                                <strong>수정 날짜: </strong>
                                                                {selectRecovery.date.replace("T", " ")}
                                                            </div>
                                                            <div style={modalFieldStyle}>
                                                                <strong>수정 사항: </strong>
                                                                {selectRecovery.msg}
                                                            </div>
                                                        </div>
                                    <div style={{width: 'calc(80%)', padding: '5px', margin: 'auto'}}>
                                        <button onClick={handleImport} disabled={isLoading} style={{border: '1px solid #000', borderRadius: '8px', padding: '5px', width: '100%', backgroundColor: '#fff'}}>
                                            <span style={{fontSize: '18px'}}>복원하기</span>
                                        </button>
                                    </div>
                                    <div style={{width: 'calc(80%)', padding: '5px', margin: 'auto'}}>
                                        <button onClick={handlePageUp} style={{border: '1px solid #000', borderRadius: '8px', padding: '5px', width: '100%', backgroundColor: '#fff'}}>
                                            <span style={{fontSize: '18px'}}>이전 페이지</span>
                                        </button>
                                    </div>
                                    <div style={{width: 'calc(80%)', padding: '5px', margin: 'auto'}}>
                                        <button onClick={handleFirstPage} style={{border: '1px solid #000', borderRadius: '8px', padding: '5px', width: '100%', backgroundColor: '#fff'}}>
                                            <span style={{fontSize: '18px'}}>첫 페이지 이동</span>
                                        </button>
                                    </div>
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

const modalFieldStyle: CSSProperties = {
    marginBottom: "10px",
    fontSize: "16px",
  };