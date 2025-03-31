'use client'
import { getToken, getUserId } from "@/app/util/storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { listType, returnEtc, etcType, returnOvr, ovrType, returnMm, mmType, returnReq, reqType, returnTest, testType, returnReport, reportType } from '@/app/util/types';

function formatDate(input: string): string {
    const d = new Date(input);
    // 날짜 유효성 검사
    if (isNaN(d.getTime())) return input; // 유효하지 않은 날짜면 그대로 반환
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

export default function Test(props: any) {
    const [visible, setVisible] = useState([false, false, false, false, false])
    const [mainMenu, setMainMenu] = useState<string[]>([
        "기타",
        "개요서",
        "회의록",
        "요구사항 명세서",
        "테스트 케이스",
        "보고서"
    ]);
    const subMenu = [
        ["메인 페이지"],
        ["WBS 관리", "사용자 관리", "프로젝트 설정"],
        ["개요서", "회의록", "테스트 케이스", "요구사항", "보고서", "기타"],
        ["산출물 관리", "자료실"],
        ["업무 관리"],
        ["프로젝트 평가"],
    ];
    
    const togleMenu = (index: number) => {
        setVisible(prev => prev.map((item, i) => (i === index ? !item : item)))
    }

    const [data, setData] = useState<listType[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    
    useEffect(() => {
        loadData();
    }, []);
    
    // 필터링: 체크된 타입과 검색어로 data 필터링
    const filteredData = data.filter((item) => {
    const typeOk =
        selectedTypes.length === 0 || selectedTypes.includes(item.type);
    const searchOk =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return typeOk && searchOk;
    });

    
    const loadData = async () => {
        const formData = new FormData();
        formData.append("pid", props.params.pid.toString());
        const tmpData: listType[] = [];
        const postData = {pid: props.params.pid};
        const etcData: etcType[] = []
        const ovrData: ovrType[] = []
        const mmData: mmType[] = []
        const reqData: reqType[] = []
        const testData: testType[] = []
        const reportData: reportType[] = []
    
        try{ // 기타 산출물
            const response = await axios.post<returnEtc>("https://cd-api.chals.kim/api/output/otherdoc_fetch_all", formData, {headers:{Authorization: process.env.SECRET_API_KEY}});
            response.data.PAYLOADS.forEach((item) => {
                const formattedData: listType = {
                    type: '기타',
                    displayType: 'etc',
                    title: item.file_name,
                    date: formatDate(item.file_date.toString()),
                    file_no: item.file_no
                }
                tmpData.push(formattedData);
                etcData.push(item)
            })
        }catch(err){}
        try{ // 프로젝트 개요서
            const response = await axios.post<returnOvr>("https://cd-api.chals.kim/api/output/ovr_doc_fetch", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
            response.data.PAYLOADS.forEach((item) => {
                const formattedData: listType = {
                    type: '개요서',
                    displayType: 'overview',
                    title: item.doc_s_name,
                    date: item.doc_s_date.toString(),
                    file_no: item.doc_s_no
                }
                tmpData.push(formattedData);
                ovrData.push(item)
            })
        }catch(err){}
        try{ // 회의록
            const response = await axios.post<returnMm>("https://cd-api.chals.kim/api/output/mm_fetch", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
            response.data.PAYLOADS.forEach((item) => {
                const formattedData: listType = {
                    type: '회의록',
                    displayType: 'minutes',
                    title: item.doc_m_title,
                    date: item.doc_m_date.toString(),
                    file_no: item.doc_m_no
                }
                tmpData.push(formattedData);
                mmData.push(item)
            })
        }catch(err){}
        try{ // 요구사항 명세서
            const response = await axios.post<returnReq>("https://cd-api.chals.kim/api/output/reqspec_fetch_all", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
            response.data.PAYLOADS.forEach((item) => {
                const formattedData: listType = {
                    type: '요구사항 명세서',
                    displayType: 'request',
                    title: '요구사항 명세서',
                    date: item.doc_r_date.toString(),
                    file_no: item.doc_r_no
                }
                tmpData.push(formattedData);
                reqData.push(item)
            })
        }catch(err){}
        try{ // 테스트 케이스
            const response = await axios.post<returnTest>("https://cd-api.chals.kim/api/output/testcase_load", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
            response.data.PAYLOADS.forEach((item) => {
                const formattedData: listType = {
                    type: '테스트 케이스',
                    displayType: 'testcase',
                    title: item.doc_t_name,
                    date: item.doc_t_start.toString(),
                    file_no: item.doc_t_no
                }
                tmpData.push(formattedData);
                testData.push(item)
            })
        }catch(err){}
        try{ // 보고서
            const response = await axios.post<returnReport>("https://cd-api.chals.kim/api/output/report_fetch_all", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
            response.data.PAYLOADS.forEach((item) => {
                const formattedData: listType = {
                    type: '보고서',
                    displayType: 'report',
                    title: item.doc_rep_name,
                    date: item.doc_rep_date.toString(),
                    file_no: item.doc_rep_no
                }
                tmpData.push(formattedData);
                reportData.push(item)
            })
            const sortedData = tmpData.sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return dateB - dateA;
            })
            setData(sortedData);
        }catch(err){}
    }
    

    return(
        <div style={{width: '100%', height: '100%', display: 'flex'}}>
            <div style={{width: '20%', height: '100%'}}>
                {mainMenu.map((typeItem, typeIndex) => (
                    <div key={typeIndex}>
                        <button
                        onClick={() => togleMenu(typeIndex)}
                        
                        >
                            {typeItem}
                        </button>
                        {visible[typeIndex] ? (
                            <div>
                                {data.map((listItem, index) => (
                                    <div key={`${listItem.type}.${index}`}>
                                        {listItem.type === typeItem ? (
                                            <div style={{marginLeft: '20px'}}>
                                                {listItem.title}
                                            </div>
                                        ) : (
                                            <div></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (<div></div>)}
                        
                    </div>
                ))}
            </div>
            <div style={{width: '75%', height: '100%'}}>
                h
            </div>
        </div>
        
    );
}