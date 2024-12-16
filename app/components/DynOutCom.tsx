'use client'
import styles from '@/app/css/DynOutCom.module.css'
import DynOutDelbtn from '@/app/components/DynOutDelbtn'
import { useState, useEffect } from 'react'
import axios from 'axios'
import MsBox from '@/app/json/msBox.json'

type delData = {
    oid: number
    type: string
}
type returnEtc = {
    "RESULT_CODE": number, 
    "RESULT_MSG": string, 
    "PAYLOADS": etcType[]
}
type etcType = {
    file_no: number,
    file_name: string,
    file_path: string,
    file_date: Date,
    s_no: number,
}
type returnOvr = {
    "RESULT_CODE": number, 
    "RESULT_MSG": string, 
    "PAYLOADS": ovrType[]
}
type ovrType = {
    doc_s_no: number,
    doc_s_name: string,
    doc_s_overview: string,
    doc_s_goals: string,
    doc_s_range: string,
    doc_s_outcomes: string,
    doc_s_team: string,
    doc_s_stack: string,
    doc_s_start: string,
    doc_s_end: string
    doc_s_date: Date
}
type returnMm = {
    "RESULT_CODE": number, 
    "RESULT_MSG": string, 
    "PAYLOADS": mmType[]
}
type mmType = {
    doc_m_no: number,
    doc_m_title: string,
    doc_m_date: Date,
    doc_m_loc: string,
    doc_m_member: string,
    doc_m_manager: string,
    doc_m_content: string,
    doc_m_result: string
}
type returnReq = {
    "RESULT_CODE": number, 
    "RESULT_MSG": string, 
    "PAYLOADS": reqType[]
}
type reqType = {
    doc_r_no: number,
    doc_r_f_name: string,
    doc_r_f_content: string,
    doc_r_f_priority: string,
    doc_r_nf_name: string,
    doc_r_nf_content: string,
    doc_r_nf_priority: string,
    doc_r_s_name: string,
    doc_r_s_content: string,
    doc_r_date: Date
}
type returnTest = {
    "RESULT_CODE": number, 
    "RESULT_MSG": string, 
    "PAYLOADS": testType[]
}
type testType = {
    doc_t_no: number,
    doc_t_name: string,
    doc_t_start: Date,
    doc_t_end: Date,
    doc_t_pass: boolean
}
type returnReport = {
    "RESULT_CODE": number, 
    "RESULT_MSG": string, 
    "PAYLOADS": reportType[]
}
type reportType = {
    doc_rep_no: number,
    doc_rep_name: string,
    doc_rep_writer: string,
    doc_rep_date: Date,
    doc_rep_pname: string,
    doc_rep_member: string,
    doc_rep_professor: string,
    doc_rep_research: string,
    doc_rep_design: string,
    doc_rep_arch: string,
    doc_rep_result: string,
    doc_rep_conclusion: string
}
export const OutputEtc = ({oid, pid}: {oid: number, pid: number}) => {
    const [data, setData] = useState<etcType>()
    
    const formData = new FormData();
    formData.append('pid', pid.toString());

    useEffect(() => {
        loadData()
    },[])

    const loadData = async() => {
        try{
            const response = await axios.post<returnEtc>("https://cd-api.chals.kim/api/output/otherdoc_fetch_all", formData, {headers:{Authorization: process.env.SECRET_API_KEY}});
            setData(response.data.PAYLOADS.find((item) => item.file_no.toString() === oid.toString()))
        }catch(err){}
    }
    
    return(
        <table className={styles.outTable}>
            <colgroup>
                <col style={{width: `20%`}}/>
                <col style={{width: `cal(100 - 20)%`}}/>
            </colgroup>
            <tbody>
                <tr>
                    <th>제목</th>
                    <td>{data?.file_name}</td>
                </tr>
                <tr>
                    <th>작성자</th>
                    <td>{data?.s_no}</td>
                </tr>
                <tr>
                    <th>게시일</th>
                    <td>{data?.file_date.toString()}</td>
                </tr>
                <tr>
                    <td colSpan={2}>
                        <div>
                            <a href='https://google.com' target='_blank' rel='noopener noreferror' style={{textDecoration: 'none', fontSize: '15px'}}>
                                {data?.file_name}
                            </a>
                        </div>
                    </td>
                </tr>
                <tr style={{borderBottom: '0'}}>
                    <td colSpan={2} style={{borderBottom: '0'}}>
                        <div style={{margin: 'auto', float: 'right'}}>
                            <div style={{float: 'right'}}><button>수정</button></div>
                            <div style={{float: 'right'}}><DynOutDelbtn data={{type: MsBox.outType.etc.value, oid: data?.file_no ?? -1}} pid={pid}/></div>
                        </div>
                    </td>
                </tr>
            </tbody>
            
        </table>
    )
};

export const OutputOvr = ({oid, pid}: {oid: number, pid: number}) => {
    const [data, setData] = useState<ovrType>()
    const postData = {pid: pid};

    useEffect(() => {
        loadData()
    },[])

    const loadData = async() => {
        try{
            const response = await axios.post<returnOvr>("https://cd-api.chals.kim/api/output/ovr_doc_fetch", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
            setData(response.data.PAYLOADS.find((item) => item.doc_s_no.toString() === oid.toString()))
        }catch(err){}
    }
    
    return(
        <table className={styles.outTable}>
            <colgroup>
                <col style={{width: `20%`}}/>
                <col style={{width: `cal(100 - 20)%`}}/>
            </colgroup>
            <tbody>
                <tr>
                    <th>제목</th>
                    <td>{data?.doc_s_name}</td>
                </tr>
                <tr>
                    <th>개요</th>
                    <td>{data?.doc_s_overview}</td>
                </tr>
                <tr>
                    <th>게시일</th>
                    <td>{data?.doc_s_date.toString()}</td>
                </tr>
                <tr>
                    <th>목표</th>
                    <td>{data?.doc_s_goals}</td>
                </tr>
                <tr>
                    <th>범위</th>
                    <td>{data?.doc_s_range}</td>
                </tr>
                <tr>
                    <th>기대성과</th>
                    <td>{data?.doc_s_outcomes}</td>
                </tr>
                <tr>
                    <th>팀 구성 및 역할분담</th>
                    <td>{data?.doc_s_team}</td>
                </tr>
                <tr>
                    <th>기술 스택 및 도구</th>
                    <td>{data?.doc_s_stack}</td>
                </tr>
                <tr>
                    <th>프로젝트 시작일</th>
                    <td>{data?.doc_s_start}</td>
                </tr>
                <tr>
                    <th>프로젝트 종료일</th>
                    <td>{data?.doc_s_end}</td>
                </tr>
                <tr style={{borderBottom: '0'}}>
                    <td colSpan={2} style={{borderBottom: '0'}}>
                        <div style={{margin: 'auto', float: 'right'}}>
                            <div style={{float: 'right'}}><button>수정</button></div>
                            <div style={{float: 'right'}}><DynOutDelbtn data={{type: MsBox.outType.overview.value, oid: data?.doc_s_no ?? -1}} pid={pid}/></div>
                        </div>
                    </td>
                </tr>
            </tbody>
            
        </table>
    )
};

export const OutputMm = ({oid, pid}: {oid: number, pid: number}) => {
    const [data, setData] = useState<mmType>()
    const postData = {pid: pid};

    useEffect(() => {
        loadData()
    },[])

    const loadData = async() => {
        try{
            const response = await axios.post<returnMm>("https://cd-api.chals.kim/api/output/mm_fetch", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
            setData(response.data.PAYLOADS.find((item) => item.doc_m_no.toString() === oid.toString()))
        }catch(err){}
    }
    
    return(
        <table className={styles.outTable}>
            <colgroup>
                <col style={{width: `20%`}}/>
                <col style={{width: `cal(100 - 20)%`}}/>
            </colgroup>
            <tbody>
                <tr>
                    <th>주요안건</th>
                    <td>{data?.doc_m_title}</td>
                </tr>
                <tr>
                    <th>회의날짜</th>
                    <td>{data?.doc_m_date.toString()}</td>
                </tr>
                <tr>
                    <th>회의장소</th>
                    <td>{data?.doc_m_loc}</td>
                </tr>
                <tr>
                    <th>참여자</th>
                    <td>{data?.doc_m_member}</td>
                </tr>
                <tr>
                    <th>책임자</th>
                    <td>{data?.doc_m_manager}</td>
                </tr>
                <tr>
                    <th>회의 내용</th>
                    <td>{data?.doc_m_content}</td>
                </tr>
                <tr>
                    <th>회의 결과</th>
                    <td>{data?.doc_m_result}</td>
                </tr>
                <tr style={{borderBottom: '0'}}>
                    <td colSpan={2} style={{borderBottom: '0'}}>
                        <div style={{margin: 'auto', float: 'right'}}>
                            <div style={{float: 'right'}}><DynOutDelbtn data={{type: MsBox.outType.minutes.value, oid: data?.doc_m_no ?? -1}} pid={pid}/></div>
                        </div>
                    </td>
                </tr>
            </tbody>
            
        </table>
    )
};

export const OutputTest = ({oid, pid}: {oid: number, pid: number}) => {
    const [data, setData] = useState<testType>()
    const postData = {pid: pid};

    useEffect(() => {
        loadData()
    },[])

    const loadData = async() => {
        try{
            const response = await axios.post<returnTest>("https://cd-api.chals.kim/api/output/testcase_fetch_all", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
            setData(response.data.PAYLOADS.find((item) => item.doc_t_no.toString() === oid.toString()))
        }catch(err){}
    }
    
    return(
        <table className={styles.outTable}>
            <colgroup>
                <col style={{width: `20%`}}/>
                <col style={{width: `cal(100 - 20)%`}}/>
            </colgroup>
            <tbody>
                <tr>
                    <th>테스트 항목 이름</th>
                    <td>{data?.doc_t_name}</td>
                </tr>
                <tr>
                    <th>테스트 시작일</th>
                    <td>{data?.doc_t_start.toString()}</td>
                </tr>
                <tr>
                    <th>테스트 종료일</th>
                    <td>{data?.doc_t_end.toString()}</td>
                </tr>
                <tr>
                    <th>테스트 통과 여부</th>
                    <td>{data?.doc_t_pass}</td>
                </tr>
                <tr style={{borderBottom: '0'}}>
                    <td colSpan={2} style={{borderBottom: '0'}}>
                        <div style={{margin: 'auto', float: 'right'}}>
                            <div style={{float: 'right'}}><DynOutDelbtn data={{type: MsBox.outType.testcase.value, oid: data?.doc_t_no ?? -1}} pid={pid}/></div>
                        </div>
                    </td>
                </tr>
            </tbody>
            
        </table>
    )
};

export const OutputReq = ({oid, pid}: {oid: number, pid: number}) => {
    const [data, setData] = useState<reqType>()
    const postData = {pid: pid};

    useEffect(() => {
        loadData()
    },[])

    const loadData = async() => {
        try{
            const response = await axios.post<returnReq>("https://cd-api.chals.kim/api/output/reqspec_fetch_all", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
            setData(response.data.PAYLOADS.find((item) => item.doc_r_no.toString() === oid.toString()))
        }catch(err){}
    }
    
    return(
        <table className={styles.outTable}>
            <colgroup>
                <col style={{width: `20%`}}/>
                <col style={{width: `cal(100 - 20)%`}}/>
            </colgroup>
            <tbody>
                <tr>
                    <th>기능요구사항</th>
                    <td>{data?.doc_r_f_name}</td>
                </tr>
                <tr>
                    <th>기능요구사항 설명</th>
                    <td>{data?.doc_r_f_content}</td>
                </tr>
                <tr>
                    <th>기능요구사항 우선순위</th>
                    <td>{data?.doc_r_f_priority}</td>
                </tr>
                <tr>
                    <th>비기능요구사항</th>
                    <td>{data?.doc_r_nf_name}</td>
                </tr>
                <tr>
                    <th>비기능요구사항 설명</th>
                    <td>{data?.doc_r_nf_content}</td>
                </tr>
                <tr>
                    <th>비기능요구사항 우선순위</th>
                    <td>{data?.doc_r_nf_priority}</td>
                </tr>
                <tr>
                    <th>시스템요구사항</th>
                    <td>{data?.doc_r_s_name}</td>
                </tr>
                <tr>
                    <th>시스템요구사항 설명</th>
                    <td>{data?.doc_r_s_content}</td>
                </tr>
                <tr>
                    <th>명세서 작성일</th>
                    <td>{data?.doc_r_date.toString()}</td>
                </tr>
                <tr style={{borderBottom: '0'}}>
                    <td colSpan={2} style={{borderBottom: '0'}}>
                        <div style={{margin: 'auto', float: 'right'}}>
                            <div style={{float: 'right'}}><DynOutDelbtn data={{type: MsBox.outType.request.value, oid: data?.doc_r_no ?? -1}} pid={pid}/></div>
                        </div>
                    </td>
                </tr>
            </tbody>
            
        </table>
    )
};

export const OutputReport = ({oid, pid}: {oid: number, pid: number}) => {
    const [data, setData] = useState<reportType>()
    const postData = {pid: pid};

    useEffect(() => {
        loadData()
    },[])

    const loadData = async() => {
        try{
            const response = await axios.post<returnReport>("https://cd-api.chals.kim/api/output/report_fetch_all", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
            setData(response.data.PAYLOADS.find((item) => item.doc_rep_no.toString() === oid.toString()))
        }catch(err){}
    }
    
    return(
        <table className={styles.outTable}>
            <colgroup>
                <col style={{width: `20%`}}/>
                <col style={{width: `cal(100 - 20)%`}}/>
            </colgroup>
            <tbody>
                <tr>
                    <th>제목</th>
                    <td>{data?.doc_rep_name}</td>
                </tr>
                <tr>
                    <th>작성자</th>
                    <td>{data?.doc_rep_writer}</td>
                </tr>
                <tr>
                    <th>작성일</th>
                    <td>{data?.doc_rep_date.toString()}</td>
                </tr>
                <tr>
                    <th>프로젝트 제목</th>
                    <td>{data?.doc_rep_pname}</td>
                </tr>
                <tr>
                    <th>프로젝트 팀원</th>
                    <td>{data?.doc_rep_member}</td>
                </tr>
                <tr>
                    <th>담당 교수</th>
                    <td>{data?.doc_rep_professor}</td>
                </tr>
                <tr>
                    <th>문제 정의 및 연구 목표</th>
                    <td>{data?.doc_rep_research}</td>
                </tr>
                <tr>
                    <th>설계 및 개발 과정</th>
                    <td>{data?.doc_rep_design}</td>
                </tr>
                <tr>
                    <th>시스템 아키텍처</th>
                    <td>{data?.doc_rep_arch}</td>
                </tr>
                <tr>
                    <th>실험 및 결과</th>
                    <td>{data?.doc_rep_result}</td>
                </tr>
                <tr>
                    <th>결론</th>
                    <td>{data?.doc_rep_conclusion}</td>
                </tr>
                <tr style={{borderBottom: '0'}}>
                    <td colSpan={2} style={{borderBottom: '0'}}>
                        <div style={{margin: 'auto', float: 'right'}}>
                            <div style={{float: 'right'}}><DynOutDelbtn data={{type: MsBox.outType.report.value, oid: data?.doc_rep_no ?? -1}} pid={pid}/></div>
                        </div>
                    </td>
                </tr>
            </tbody>
            
        </table>
    )
};