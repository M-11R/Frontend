'use client'
import styles from '@/app/css/DynOutCom.module.css'
import DynOutDelbtn from '@/app/components/DynOutDelbtn'
import { useState, useEffect, CSSProperties } from 'react'
import axios from 'axios'
import MsBox from '@/app/json/msBox.json'
import DocumentDownloadBtn from '@/app/components/DocumentDownload'
import DType from '@/app/json/typeBox.json'
import usePermissionGuard from '../util/usePermissionGuard'
import { useRouter } from 'next/navigation'
import { getUnivId } from '../util/storage'

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
    const s_no = getUnivId();
    const router = useRouter();
    
    const formData = new FormData();
    formData.append('pid', pid.toString());

    const loadData = async() => {
        try{
            const response = await axios.post<returnEtc>("https://cd-api.chals.kim/api/output/otherdoc_fetch_all", formData, {headers:{Authorization: process.env.SECRET_API_KEY}});
            setData(response.data.PAYLOADS.find((item) => item.file_no.toString() === oid.toString()))
        }catch(err){}
    }

    useEffect(() => {
        loadData()
    },[])

    const readPermission = usePermissionGuard(pid, s_no, {leader: 1, om: [1, 2]}, false)

    const downloadFile = async() => {
        try{
            const response = await axios.post("https://cd-api.chals.kim/api/output/otherdoc_download", {file_no: oid}, {headers:{Authorization: process.env.SECRET_API_KEY}});

            const fileUrl = `/uploads/${data?.file_name}`;
            const link = document.createElement("a");
            link.href = fileUrl;
            link.download = data?.file_name || 'null'
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }catch(err){
        }
    }

    const handleDownload = () => {
        downloadFile();
    }

    if(readPermission === null) return <div>Loading...</div>
    if(!readPermission){
        router.push(`/project-main/${pid}/main`);
        alert("권한이 없습니다.")
        return null
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
                            {/* <a href='https://google.com' target='_blank' rel='noopener noreferror' style={{textDecoration: 'none', fontSize: '15px'}}>
                                {data?.file_name}
                            </a> */}
                            <button
                                onClick={handleDownload}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#007BFF',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                                >
                                파일 다운로드
                                </button>
                        </div>
                    </td>
                </tr>
                <tr style={{borderBottom: '0'}}>
                    <td colSpan={2} style={{borderBottom: '0'}}>
                        {/* <div style={{margin: 'auto', float: 'right'}}>
                            <div style={{float: 'right'}}><button>수정</button></div>
                            <div style={{float: 'right'}}><DynOutDelbtn data={{type: MsBox.outType.etc.value, oid: data?.file_no ?? -1}} pid={pid}/></div>
                        </div> */}
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

    const router = useRouter();
    const s_no = getUnivId();

    const readPermission = usePermissionGuard(pid, s_no, {leader: 1, od: [1, 2]}, false);
    if(readPermission === null) return <div>Loading...</div>
    if(!readPermission){
        router.push(`/project-main/${pid}/main`);
        alert("권한이 없습니다.")
        return null
    }

    const pageContainerStyle: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        height: "auto",
        backgroundColor: "#f4f4f4",
      };
      
      const flexRowStyle: CSSProperties = {
        display: "flex",
        flex: 1,
      };
      
      const contentContainerStyle: CSSProperties = {
        padding: "20px",
        width: "100%",
        overflowY: "auto",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        margin: "20px",
      };
      
      
      /* ✅ 제목 및 섹션 */
      const titleStyle: CSSProperties = {
        borderBottom: "3px solid #4CAF50",
        paddingBottom: "10px",
        fontSize: "24px",
        fontWeight: "bold",
        color: "#4CAF50",
      };
      
      const sectionHeaderStyle: CSSProperties = {
        color: "#4CAF50",
        borderBottom: "1px solid #ddd",
        marginBottom: "10px",
      };
      
      /* ✅ 미리보기 */
      const previewContainerStyle: CSSProperties = { 
        padding: "20px", 
        backgroundColor: "#fff", 
        borderRadius: "8px", 
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        marginTop: "20px"
      };
      
      const detailSectionStyle: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      };
      
      /* ✅ 테이블 */
      const tableStyle: CSSProperties = { 
        width: "100%", 
        borderCollapse: "collapse", 
        marginBottom: "20px", 
        // tableLayout: "fixed"
      };
      
      const thStyle: CSSProperties = { 
        backgroundColor: "#dbdbdb", 
        padding: "12px", 
        border: "1px solid #000000", 
        textAlign: "center", 
        fontWeight: "bold",
        verticalAlign: "middle", // ✅ 세로 중앙 정렬
        width: "25%",
        whiteSpace: "pre-wrap", // 자동 줄바꿈
        wordWrap: "break-word", // 긴 단어/문장도 줄바꿈
      };
      
      const tdStyle: CSSProperties = { 
        padding: "12px", 
        border: "1px solid #000000", 
        textAlign: "center",
        verticalAlign: "middle", // ✅ 세로 중앙 정렬
        backgroundColor: "#fff", 
        width: "25%",
        whiteSpace: "pre-wrap", // 자동 줄바꿈
        wordWrap: "break-word", // 긴 단어/문장도 줄바꿈
      };
      
      
      /* ✅ 텍스트 박스 */
      const textBlockStyle: CSSProperties = { 
        padding: "12px", 
        backgroundColor: "#f8f9fa", 
        borderRadius: "6px",
        border: "1px solid #ddd",
        marginBottom: "10px"
      };
      
      /* ✅ 버튼 */
      const buttonContainerStyle: CSSProperties = {
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
        gap: "10px"
      };
    
    return(
        <div style={previewContainerStyle}>
  <h2 style={sectionHeaderStyle}>📄 프로젝트 개요서</h2>


<table style={tableStyle}>
  <thead>
    <th></th>
    <th></th>
    <th></th>
    <th></th>
  </thead>
  <tbody>
    <tr>
      <td style={thStyle}>제 목</td>
      <td colSpan={3} style={tdStyle}>{data?.doc_s_name}</td>
    </tr>
    <tr>
      <td style={thStyle}>프로젝트 시작일</td>
      <td style={tdStyle}>{data?.doc_s_start}</td>
      <td rowSpan={2} style={thStyle}>팀 구성 및 역할 분담</td>
      <td rowSpan={2} style={tdStyle}>
        {data?.doc_s_team}
      </td>
    </tr>
    <tr>
      <td style={thStyle}>프로젝트 종료일</td>
      <td style={tdStyle}>{data?.doc_s_end}</td>
    </tr>
    <tr>
      <td style={thStyle}>작성일</td>
      <td colSpan={3} style={tdStyle}>{data?.doc_s_date.toString()}</td>
    </tr>
    <tr>
      <td colSpan={4} style={thStyle}>프로젝트 개요</td>
    </tr>
    <tr>
      <td colSpan={4} style={tdStyle}>{data?.doc_s_overview} </td>
    </tr>
    <tr>
      <td colSpan={4} style={thStyle}>프로젝트 목표</td>
    </tr>
    <tr>
      <td colSpan={4} style={tdStyle}>{data?.doc_s_goals} </td>
    </tr>
    <tr>
      <td colSpan={4} style={thStyle}>프로젝트 범위</td>
    </tr>
    <tr>
      <td colSpan={4} style={tdStyle}>{data?.doc_s_range} </td>
    </tr>
    <tr>
      <td colSpan={4} style={thStyle}>기술 스택 및 도구</td>
    </tr>
    <tr>
      <td colSpan={4} style={tdStyle}>{data?.doc_s_stack} </td>
    </tr>
    <tr>
      <td colSpan={4} style={thStyle}>기대 성과</td>
    </tr>
    <tr>
      <td colSpan={4} style={tdStyle}>{data?.doc_s_outcomes} </td>
    </tr>
  </tbody>
    <tr style={{borderBottom: '0'}}>
        <td colSpan={2} style={{borderBottom: '0'}}>
            <div style={{margin: 'auto', float: 'right'}}>
                <div style={{float: 'right', padding: '5px'}}><DynOutDelbtn data={{type: MsBox.outType.overview.value, oid: data?.doc_s_no ?? -1}} pid={pid}/></div>
                <div style={{float: 'right', padding: '5px'}}><button>수정</button></div>
                <div style={{float: 'right', padding: '5px'}}><DocumentDownloadBtn d_type={DType.dType.summary} d_no={data?.doc_s_no || 0} d_name={data?.doc_s_name || ''}/></div>
            </div>
        </td>
    </tr>
</table>
</div>
        // <table className={styles.outTable}>
        //     <colgroup>
        //         <col style={{width: `20%`}}/>
        //         <col style={{width: `cal(100 - 20)%`}}/>
        //     </colgroup>
        //     <tbody>
        //         <tr>
        //             <th>제목</th>
        //             <td>{data?.doc_s_name}</td>
        //         </tr>
        //         <tr>
        //             <th>개요</th>
        //             <td>{data?.doc_s_overview}</td>
        //         </tr>
        //         <tr>
        //             <th>게시일</th>
        //             <td>{data?.doc_s_date.toString()}</td>
        //         </tr>
        //         <tr>
        //             <th>목표</th>
        //             <td>{data?.doc_s_goals}</td>
        //         </tr>
        //         <tr>
        //             <th>범위</th>
        //             <td>{data?.doc_s_range}</td>
        //         </tr>
        //         <tr>
        //             <th>기대성과</th>
        //             <td>{data?.doc_s_outcomes}</td>
        //         </tr>
        //         <tr>
        //             <th>팀 구성 및 역할분담</th>
        //             <td>{data?.doc_s_team}</td>
        //         </tr>
        //         <tr>
        //             <th>기술 스택 및 도구</th>
        //             <td>{data?.doc_s_stack}</td>
        //         </tr>
        //         <tr>
        //             <th>프로젝트 시작일</th>
        //             <td>{data?.doc_s_start}</td>
        //         </tr>
        //         <tr>
        //             <th>프로젝트 종료일</th>
        //             <td>{data?.doc_s_end}</td>
        //         </tr>
        //         <tr style={{borderBottom: '0'}}>
        //             <td colSpan={2} style={{borderBottom: '0'}}>
        //                 <div style={{margin: 'auto', float: 'right'}}>
        //                     <div style={{float: 'right', padding: '5px'}}><DynOutDelbtn data={{type: MsBox.outType.overview.value, oid: data?.doc_s_no ?? -1}} pid={pid}/></div>
        //                     <div style={{float: 'right', padding: '5px'}}><button>수정</button></div>
        //                     <div style={{float: 'right', padding: '5px'}}><DocumentDownloadBtn d_type={DType.dType.summary} d_no={data?.doc_s_no || 0} d_name={data?.doc_s_name || ''}/></div>
        //                 </div>
        //             </td>
        //         </tr>
        //     </tbody>
            
        // </table>
    )

    
};

export const OutputMm = ({oid, pid}: {oid: number, pid: number}) => {
    const [data, setData] = useState<mmType>()
    const postData = {pid: pid};
    const router = useRouter();
    const s_no = getUnivId();

    const loadData = async() => {
        try{
            const response = await axios.post<returnMm>("https://cd-api.chals.kim/api/output/mm_fetch", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
            setData(response.data.PAYLOADS.find((item) => item.doc_m_no.toString() === oid.toString()))
        }catch(err){}
    }

    useEffect(() => {
        loadData()
    },[])

    const readPermission = usePermissionGuard(pid, s_no, {leader: 1, mm: [1, 2]}, false);
    if(readPermission === null) return <div>Loading...</div>
    if(!readPermission){
        router.push(`/project-main/${pid}/main`);
        alert("권한이 없습니다.")
        return null
    }
    
    const previewContainerStyle: CSSProperties = { padding: "20px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", marginTop: "20px" };

    const tableStyle: CSSProperties = { width: "100%", borderCollapse: "collapse", marginBottom: "10px" };
    
    const thStyle: CSSProperties = { 
      backgroundColor: "#dbdbdb", 
      padding: "12px", 
      border: "1px solid #000000", 
      textAlign: "center", 
      fontWeight: "bold",
      verticalAlign: "middle",
      whiteSpace: "pre-wrap",
      wordWrap: "break-word",
    };
    
    const tdStyle: CSSProperties = { 
      padding: "12px", 
      border: "1px solid #000000", 
      textAlign: "center",
      verticalAlign: "middle",
      backgroundColor: "#fff",
      whiteSpace: "pre-wrap",
      wordWrap: "break-word",
    };

    return(
        <div style={previewContainerStyle}>

    {/* ✅ 회의 정보 테이블 */}
    <table style={tableStyle}>
      <thead>
        <tr>
          <th colSpan={4} style={thStyle}>회의 정보</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={thStyle}>안건</td>
          <td colSpan={3} style={tdStyle}>{data?.doc_m_title}</td>
        </tr>
        <tr>
          <td style={thStyle}>회의 날짜</td>
          <td style={tdStyle}>{data?.doc_m_date.toString()}</td>
          <td rowSpan={2} style={thStyle}>회의 장소 및 책임자</td>
          <td rowSpan={2} style={tdStyle}>
            <strong>장소:</strong> {data?.doc_m_loc} <br />
            <strong>책임자:</strong> {data?.doc_m_manager}
          </td>
        </tr>
        <tr>
          <td style={thStyle}>작성일</td>
          <td style={tdStyle}>{new Date().toLocaleDateString()}</td>
        </tr>
      </tbody>
    </table>

    {/* ✅ 회의 내용 및 결과 */}
    <table style={tableStyle}>
      <thead>
        <tr>
          <th colSpan={4} style={thStyle}>회의 내용 및 결과</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={4} style={tdStyle}>{data?.doc_m_content}</td>
        </tr>
        <tr>
          <th colSpan={4} style={thStyle}>회의 결과</th>
        </tr>
        <tr>
          <td colSpan={4} style={tdStyle}>{data?.doc_m_result}</td>
        </tr>
      </tbody>
    </table>

    {/* ✅ 참석자 목록 */}
    <h3 style={{ marginTop: "20px", fontSize: "18px", color: "#4CAF50" }}>참석자 목록</h3>
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>이름</th>
          <th style={thStyle}>학번</th>
        </tr>
      </thead>
      <tbody>
        {/* {data?.doc_m_member.length > 0 ? (
          data?.doc_m_member.map((participant: any, index: number) => (
            <tr key={index}>
              <td style={tdStyle}>{participant.name}</td>
              <td style={tdStyle}>{participant.studentId}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={2} style={tdStyle}>등록된 참석자가 없습니다.</td>
          </tr>
        )} */}
      </tbody>
      <tr style={{borderBottom: '0'}}>
        <td colSpan={2} style={{borderBottom: '0'}}>
            <div style={{margin: 'auto', float: 'right'}}>
                <div style={{float: 'right', padding: '5px'}}><DynOutDelbtn data={{type: MsBox.outType.minutes.value, oid: data?.doc_m_no ?? -1}} pid={pid}/></div>
                <div style={{float: 'right', padding: '5px'}}><button>수정</button></div>
                <div style={{float: 'right', padding: '5px'}}><DocumentDownloadBtn d_type={DType.dType.meeting_minutes} d_no={data?.doc_m_no || 0} d_name={data?.doc_m_title || ''}/></div>
            </div>
        </td>
    </tr>
    </table>
  </div>
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

    const router = useRouter();
    const s_no = getUnivId();

    const readPermission = usePermissionGuard(pid, s_no, {leader: 1, ut: [1, 2]}, false);
    if(readPermission === null) return <div>Loading...</div>
    if(!readPermission){
        router.push(`/project-main/${pid}/main`);
        alert("권한이 없습니다.")
        return null
    }

    const previewContainerStyle: CSSProperties = {
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        marginTop: "20px",
      };
      
      const tableStyle: CSSProperties = {
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "20px",
      };
      
      const thStyle: CSSProperties = { 
        backgroundColor: "#f8f9fa", 
        padding: "12px", 
        border: "1px solid #ddd", 
        textAlign: "center", 
        fontWeight: "bold",
        verticalAlign: "middle", // ✅ 세로 중앙 정렬
        width: "15%" 
      };
      
      const tdStyle: CSSProperties = { 
        padding: "12px", 
        border: "1px solid #ddd", 
        textAlign: "center",
        verticalAlign: "middle", // ✅ 세로 중앙 정렬
        backgroundColor: "#fff", 
        width: "35%" 
      };
      
      const buttonContainerStyle: CSSProperties = {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "20px",
      };
    
    return(
        <div style={previewContainerStyle}>

    {/* ✅ 테스트 정보 테이블 */}
    <table style={tableStyle}>
      <tbody>
        <tr>
          <th style={thStyle}>테스트 시작일</th>
          <td style={tdStyle}>{data?.doc_t_start.toString()}</td>
          <th style={thStyle}>테스트 종료일</th>
          <td style={tdStyle}>{data?.doc_t_end.toString()}</td>
        </tr>
        <tr>
          <th style={thStyle}>테스트 항목</th>
          <td colSpan={3} style={tdStyle}>{data?.doc_t_name}</td>
        </tr>
        <tr>
          <th style={thStyle}>테스트 통과 여부</th>
          <td colSpan={3} style={{ ...tdStyle, fontWeight: "bold", color: data?.doc_t_pass ? "green" : "red" }}>
            {data?.doc_t_pass ? "✅ 통과" : "❌ 실패"}
          </td>
        </tr>
      </tbody>
      <tr style={{borderBottom: '0'}}>
                     <td colSpan={2} style={{borderBottom: '0'}}>
                         <div style={{margin: 'auto', float: 'right'}}>
                             <div style={{float: 'right', padding: '5px'}}><DynOutDelbtn data={{type: MsBox.outType.testcase.value, oid: data?.doc_t_no ?? -1}} pid={pid}/></div>
                             <div style={{float: 'right', padding: '5px'}}><button>수정</button></div>
                             <div style={{float: 'right', padding: '5px'}}><DocumentDownloadBtn d_type={DType.dType.testcase} d_no={data?.doc_t_no || 0} d_name={data?.doc_t_name || ''}/></div>
                         </div>
                     </td>
                 </tr>
    </table>

  </div>
        // <table className={styles.outTable}>
        //     <colgroup>
        //         <col style={{width: `20%`}}/>
        //         <col style={{width: `cal(100 - 20)%`}}/>
        //     </colgroup>
        //     <tbody>
        //         <tr>
        //             <th>테스트 항목 이름</th>
        //             <td>{data?.doc_t_name}</td>
        //         </tr>
        //         <tr>
        //             <th>테스트 시작일</th>
        //             <td>{data?.doc_t_start.toString()}</td>
        //         </tr>
        //         <tr>
        //             <th>테스트 종료일</th>
        //             <td>{data?.doc_t_end.toString()}</td>
        //         </tr>
        //         <tr>
        //             <th>테스트 통과 여부</th>
        //             <td>{data?.doc_t_pass}</td>
        //         </tr>
        //         <tr style={{borderBottom: '0'}}>
        //             <td colSpan={2} style={{borderBottom: '0'}}>
        //                 <div style={{margin: 'auto', float: 'right'}}>
        //                     <div style={{float: 'right', padding: '5px'}}><DynOutDelbtn data={{type: MsBox.outType.testcase.value, oid: data?.doc_t_no ?? -1}} pid={pid}/></div>
        //                     <div style={{float: 'right', padding: '5px'}}><button>수정</button></div>
        //                     <div style={{float: 'right', padding: '5px'}}><DocumentDownloadBtn d_type={DType.dType.testcase} d_no={data?.doc_t_no || 0} d_name={data?.doc_t_name || ''}/></div>
        //                 </div>
        //             </td>
        //         </tr>
        //     </tbody>
            
        // </table>
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

    const router = useRouter();
    const s_no = getUnivId();

    const readPermission = usePermissionGuard(pid, s_no, {leader: 1, rs: [1, 2]}, false);
    if(readPermission === null) return <div>Loading...</div>
    if(!readPermission){
        router.push(`/project-main/${pid}/main`);
        alert("권한이 없습니다.")
        return null
    }

    const previewContainerStyle: CSSProperties = { 
        padding: "20px", 
        backgroundColor: "#fff", 
        borderRadius: "12px", 
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        marginTop: "20px"
      };
      
      const tableStyle: CSSProperties = { 
        width: "100%", 
        borderCollapse: "collapse", 
        marginBottom: "20px", 
      };
      
      const thStyle: CSSProperties = { 
        backgroundColor: "#dbdbdb", 
        padding: "12px", 
        border: "1px solid #000000", 
        textAlign: "center", 
        fontWeight: "bold",
        verticalAlign: "middle",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
      };
      
      const tdStyle: CSSProperties = { 
        padding: "12px", 
        border: "1px solid #000000", 
        textAlign: "center",
        verticalAlign: "middle",
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
      };
      
      const buttonContainerStyle: CSSProperties = {
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
        gap: "10px"
      };
      
      
      // ✅ 페이지 레이아웃 스타일
      const pageContainerStyle: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        height: "auto",
        backgroundColor: "#f4f4f4",
      };
      
      const flexRowStyle: CSSProperties = {
        display: "flex",
        flex: 1,
      };
      
      const contentContainerStyle: CSSProperties = {
        padding: "20px",
        width: "100%",
        overflowY: "auto",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        margin: "20px",
      };
      
      // ✅ 제목 스타일
      const titleStyle: CSSProperties = {
        borderBottom: "3px solid #4CAF50",
        paddingBottom: "10px",
        fontSize: "24px",
        fontWeight: "bold",
        color: "#4CAF50",
      };
      
      // ✅ 섹션 헤더 스타일
      const sectionHeaderStyle: CSSProperties = {
        color: "#4CAF50",
        borderBottom: "1px solid #ddd",
        marginBottom: "20px",
      };
    
    return(
        <div style={previewContainerStyle}>

    <table style={tableStyle}>
      <thead>
        <tr>
          <th colSpan={4} style={thStyle}>기본 정보</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={thStyle}>작성일</td>
          <td colSpan={3} style={tdStyle}>{data?.doc_r_date.toString()}</td>
        </tr>
      </tbody>

      <thead>
        <tr>
          <th colSpan={4} style={thStyle}>시스템 요구사항</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={4} style={tdStyle}>{data?.doc_r_s_name}</td>
        </tr>
        <tr>
          <td colSpan={4} style={tdStyle}>{data?.doc_r_s_content}</td>
        </tr>
      </tbody>

      <thead>
        <tr>
          <th colSpan={4} style={thStyle}>기능 요구사항</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={thStyle}>항목</td>
          <td style={tdStyle}>{data?.doc_r_f_name}</td>
          <td style={thStyle}>우선순위</td>
          <td style={{ 
            ...tdStyle, 
            fontWeight: "bold", 
            color: Number(data?.doc_r_f_priority) === 3 ? "#D32F2F" : Number(data?.doc_r_f_priority) === 2 ? "#F57C00" : "#2E7D32",
            backgroundColor: Number(data?.doc_r_f_priority) === 3 ? "#FFEBEE" : Number(data?.doc_r_f_priority) === 2 ? "#FFF3E0" : "#E8F5E9"
          }}>
            {["낮음", "보통", "높음"][Number(data?.doc_r_f_priority) - 1]}
          </td>
        </tr>
        <tr>
          <td colSpan={4} style={tdStyle}>{data?.doc_r_f_content}</td>
        </tr>
      </tbody>

      <thead>
        <tr>
          <th colSpan={4} style={thStyle}>비기능 요구사항</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={thStyle}>항목</td>
          <td style={tdStyle}>{data?.doc_r_nf_name}</td>
          <td style={thStyle}>우선순위</td>
          <td style={{ 
            ...tdStyle, 
            fontWeight: "bold", 
            color: Number(data?.doc_r_nf_priority) === 3 ? "#D32F2F" : Number(data?.doc_r_nf_priority) === 2 ? "#F57C00" : "#2E7D32",
            backgroundColor: Number(data?.doc_r_nf_priority) === 3 ? "#FFEBEE" : Number(data?.doc_r_nf_priority) === 2 ? "#FFF3E0" : "#E8F5E9"
          }}>
            {["낮음", "보통", "높음"][Number(data?.doc_r_nf_priority) - 1]}
          </td>
        </tr>
        <tr>
          <td colSpan={4} style={tdStyle}>{data?.doc_r_nf_content}</td>
        </tr>
      </tbody>
      <tr style={{borderBottom: '0'}}>
                     <td colSpan={2} style={{borderBottom: '0'}}>
                         <div style={{margin: 'auto', float: 'right'}}>
                             <div style={{float: 'right', padding: '5px'}}><DynOutDelbtn data={{type: MsBox.outType.request.value, oid: data?.doc_r_no ?? -1}} pid={pid}/></div>
                             <div style={{float: 'right', padding: '5px'}}><button>수정</button></div>
                             <div style={{float: 'right', padding: '5px'}}><DocumentDownloadBtn d_type={DType.dType.reqspec} d_no={data?.doc_r_no || 0} d_name={data?.doc_r_s_name || ''}/></div>
                         </div>
                     </td>
                 </tr>
    </table>
  </div>
        // <table className={styles.outTable}>
        //     <colgroup>
        //         <col style={{width: `20%`}}/>
        //         <col style={{width: `cal(100 - 20)%`}}/>
        //     </colgroup>
        //     <tbody>
        //         <tr>
        //             <th>기능요구사항</th>
        //             <td>{data?.doc_r_f_name}</td>
        //         </tr>
        //         <tr>
        //             <th>기능요구사항 설명</th>
        //             <td>{data?.doc_r_f_content}</td>
        //         </tr>
        //         <tr>
        //             <th>기능요구사항 우선순위</th>
        //             <td>{data?.doc_r_f_priority}</td>
        //         </tr>
        //         <tr>
        //             <th>비기능요구사항</th>
        //             <td>{data?.doc_r_nf_name}</td>
        //         </tr>
        //         <tr>
        //             <th>비기능요구사항 설명</th>
        //             <td>{data?.doc_r_nf_content}</td>
        //         </tr>
        //         <tr>
        //             <th>비기능요구사항 우선순위</th>
        //             <td>{data?.doc_r_nf_priority}</td>
        //         </tr>
        //         <tr>
        //             <th>시스템요구사항</th>
        //             <td>{data?.doc_r_s_name}</td>
        //         </tr>
        //         <tr>
        //             <th>시스템요구사항 설명</th>
        //             <td>{data?.doc_r_s_content}</td>
        //         </tr>
        //         <tr>
        //             <th>명세서 작성일</th>
        //             <td>{data?.doc_r_date.toString()}</td>
        //         </tr>
        //         <tr style={{borderBottom: '0'}}>
        //             <td colSpan={2} style={{borderBottom: '0'}}>
        //                 <div style={{margin: 'auto', float: 'right'}}>
        //                     <div style={{float: 'right', padding: '5px'}}><DynOutDelbtn data={{type: MsBox.outType.request.value, oid: data?.doc_r_no ?? -1}} pid={pid}/></div>
        //                     <div style={{float: 'right', padding: '5px'}}><button>수정</button></div>
        //                     <div style={{float: 'right', padding: '5px'}}><DocumentDownloadBtn d_type={DType.dType.reqspec} d_no={data?.doc_r_no || 0} d_name={data?.doc_r_s_name || ''}/></div>
        //                 </div>
        //             </td>
        //         </tr>
        //     </tbody>
            
        // </table>
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

    const router = useRouter();
    const s_no = getUnivId();

    const readPermission = usePermissionGuard(pid, s_no, {leader: 1, rp: [1, 2]}, false);
    if(readPermission === null) return <div>Loading...</div>
    if(!readPermission){
        router.push(`/project-main/${pid}/main`);
        alert("권한이 없습니다.")
        return null
    }

    const previewContainerStyle: CSSProperties = { 
        padding: "20px", 
        backgroundColor: "#fff", 
        borderRadius: "12px", 
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        marginTop: "20px"
      };
      
      const tableStyle: CSSProperties = { 
        width: "100%", 
        borderCollapse: "collapse", 
        marginBottom: "20px", 
      };
      
      const thStyle: CSSProperties = { 
        backgroundColor: "#dbdbdb", 
        padding: "12px", 
        border: "1px solid #000000", 
        textAlign: "center", 
        fontWeight: "bold",
        verticalAlign: "middle",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
      };
      
      const tdStyle: CSSProperties = { 
        padding: "12px", 
        border: "1px solid #000000", 
        textAlign: "center",
        verticalAlign: "middle",
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
      };
      
      const buttonContainerStyle: CSSProperties = {
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
        gap: "10px"
      };
      
      
      // ✅ 정보 블록 스타일 (텍스트 위주)
      const textBlockStyle: CSSProperties = {
        padding: "12px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        marginBottom: "10px",
        lineHeight: "1.5",
      };
      
      // ✅ 페이지 전체 컨테이너
      const pageContainerStyle: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        height: "auto",
        backgroundColor: "#f4f4f4",
      };
      
      const flexRowStyle: CSSProperties = {
        display: "flex",
        flex: 1,
      };
      
      const contentContainerStyle: CSSProperties = {
        padding: "20px",
        width: "100%",
        overflowY: "auto",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        margin: "20px",
      };
      
      // ✅ 제목 스타일
      const titleStyle: CSSProperties = {
        borderBottom: "3px solid #4CAF50",
        paddingBottom: "10px",
        fontSize: "24px",
        fontWeight: "bold",
        color: "#4CAF50",
      };
      
      // ✅ 섹션 헤더 스타일
      const sectionHeaderStyle: CSSProperties = {
        color: "#4CAF50",
        borderBottom: "1px solid #ddd",
        marginBottom: "20px",
      };
    
    return(
        <div style={previewContainerStyle}>

    <table style={tableStyle}>
      <tbody>
        <tr>
          <th style={thStyle}>보고서 제목</th>
          <td colSpan={3} style={tdStyle}>{data?.doc_rep_name}</td>
        </tr>
        <tr>
          <th style={thStyle}>프로젝트 명</th>
          <td style={tdStyle}>{data?.doc_rep_pname}</td>
          <th style={thStyle}>작성일</th>
          <td style={tdStyle}>{data?.doc_rep_date.toString()}</td>
        </tr>
        <tr>
          <th style={thStyle}>작성자</th>
          <td style={tdStyle}>{data?.doc_rep_writer}</td>
          <th style={thStyle}>팀원 및 지도 교수</th>
          <td style={tdStyle}>{`${data?.doc_rep_member}\n${data?.doc_rep_professor}`}</td>
        </tr>
      </tbody>
    </table>

    <table style={tableStyle}>
      <tbody>
        <tr><th colSpan={4} style={thStyle}>문제 정의 및 연구 목표</th></tr>
        <tr><td colSpan={4} style={tdStyle}>{data?.doc_rep_research}</td></tr>
        {/* <tr><th colSpan={4} style={thStyle}>연구 목표</th></tr>
        <tr><td colSpan={4} style={tdStyle}>{researchGoal}</td></tr> */}
        <tr><th colSpan={4} style={thStyle}>설계 및 개발 과정</th></tr>
        <tr><td colSpan={4} style={tdStyle}>{data?.doc_rep_design}</td></tr>
        <tr><th colSpan={4} style={thStyle}>시스템 아키텍처</th></tr>
        <tr><td colSpan={4} style={tdStyle}>{data?.doc_rep_arch}</td></tr>
        <tr><th colSpan={4} style={thStyle}>실험 및 결과</th></tr>
        <tr><td colSpan={4} style={tdStyle}>{data?.doc_rep_result}</td></tr>
        <tr><th colSpan={4} style={thStyle}>결론</th></tr>
        <tr><td colSpan={4} style={tdStyle}>{data?.doc_rep_conclusion}</td></tr>
        <tr style={{borderBottom: '0'}}>
                     <td colSpan={2} style={{borderBottom: '0'}}>
                         <div style={{margin: 'auto', float: 'right'}}>
                             <div style={{float: 'right', padding: '5px'}}><DynOutDelbtn data={{type: MsBox.outType.report.value, oid: data?.doc_rep_no ?? -1}} pid={pid}/></div>
                             <div style={{float: 'right', padding: '5px'}}><button>수정3</button></div>
                             <div style={{float: 'right', padding: '5px'}}><DocumentDownloadBtn d_type={DType.dType.report} d_no={data?.doc_rep_no || 0} d_name={data?.doc_rep_name || ''}/></div>
                         </div>
                     </td>
                 </tr>
      </tbody>
      
    </table>
  </div>
        // <table className={styles.outTable}>
        //     <colgroup>
        //         <col style={{width: `20%`}}/>
        //         <col style={{width: `cal(100 - 20)%`}}/>
        //     </colgroup>
        //     <tbody>
        //         <tr>
        //             <th>제목</th>
        //             <td>{data?.doc_rep_name}</td>
        //         </tr>
        //         <tr>
        //             <th>작성자</th>
        //             <td>{data?.doc_rep_writer}</td>
        //         </tr>
        //         <tr>
        //             <th>작성일</th>
        //             <td>{data?.doc_rep_date.toString()}</td>
        //         </tr>
        //         <tr>
        //             <th>프로젝트 제목</th>
        //             <td>{data?.doc_rep_pname}</td>
        //         </tr>
        //         <tr>
        //             <th>프로젝트 팀원</th>
        //             <td>{data?.doc_rep_member}</td>
        //         </tr>
        //         <tr>
        //             <th>담당 교수</th>
        //             <td>{data?.doc_rep_professor}</td>
        //         </tr>
        //         <tr>
        //             <th>문제 정의 및 연구 목표</th>
        //             <td>{data?.doc_rep_research}</td>
        //         </tr>
        //         <tr>
        //             <th>설계 및 개발 과정</th>
        //             <td>{data?.doc_rep_design}</td>
        //         </tr>
        //         <tr>
        //             <th>시스템 아키텍처</th>
        //             <td>{data?.doc_rep_arch}</td>
        //         </tr>
        //         <tr>
        //             <th>실험 및 결과</th>
        //             <td>{data?.doc_rep_result}</td>
        //         </tr>
        //         <tr>
        //             <th>결론</th>
        //             <td>{data?.doc_rep_conclusion}</td>
        //         </tr>
        //         <tr style={{borderBottom: '0'}}>
        //             <td colSpan={2} style={{borderBottom: '0'}}>
        //                 <div style={{margin: 'auto', float: 'right'}}>
        //                     <div style={{float: 'right', padding: '5px'}}><DynOutDelbtn data={{type: MsBox.outType.report.value, oid: data?.doc_rep_no ?? -1}} pid={pid}/></div>
        //                     <div style={{float: 'right', padding: '5px'}}><button>수정</button></div>
        //                     <div style={{float: 'right', padding: '5px'}}><DocumentDownloadBtn d_type={DType.dType.report} d_no={data?.doc_rep_no || 0} d_name={data?.doc_rep_name || ''}/></div>
        //                 </div>
        //             </td>
        //         </tr>
        //     </tbody>
            
        // </table>
    )
};