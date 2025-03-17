'use client'
import LLMManagement from '@/app/components/LLMManagement'
import MainHeader from '@/app/components/MainHeader'
import MainSide from '@/app/components/MainSide'
import PJDelBtn from '@/app/components/ProjectDeleteBtn'
import { getUnivId } from '@/app/util/storage'
import usePermissionGuard from '@/app/util/usePermissionGuard'
import axios from 'axios'
import { useState, useEffect, CSSProperties } from 'react'
import { useRouter } from 'next/navigation'


type ccp = {
    pid: number
    univ_id: number
    msg: string
    ver: number
}

type cppPayload = {
    RESULT_CODE: number
    RESULT_MSG: string
    PAYLOAD: cppList[]
}

type cppList = {
    p_no: number
    ver: number
    date: string
    s_no: number
    msg: string
}

export interface PJItem {
    pid: number
    pname: string
    pdetails: string
    psize: number
    pperiod: string
    pmm: string
    wizard: number
}

type returnPJ = {
    RESULT_CODE: number
    RESULT_MSG: string
    PAYLOADS: PJItem[]
}

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

function splitPperiod(pperiod: string): { startDate: string; endDate: string } {
    const parts = pperiod.split("-");
    if (parts.length === 6) {
      const startDate = parts.slice(0, 3).join("-");
      const endDate = parts.slice(3).join("-");
      return { startDate, endDate };
    }
    return { startDate: "", endDate: "" };
}

export default function ProjectManage(props: any){
    const [isLoading, setIsLoading] = useState(false);
    const [isExportModalOpen, setExportModalOpen] = useState(false);
    const [isImportModalOpen, setImportModalOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<cppList | null>(null);
    const [page, setPage] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    const [log, setLog] = useState('');
    const router = useRouter();
    const [logList, setLogList] = useState<cppList[]>([{
        p_no: props.params.id,
        ver: -1,
        date: "",
        s_no: -1,
        msg: ""
    }]);
    const [pj, setPJ] = useState<PJItem>({
        pid: 0,
        pname: "",
        pdetails: "",
        psize: 0,
        pperiod: "",
        pmm: "",
        wizard: 0
    })
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        const { startDate: s, endDate: e } = splitPperiod(pj.pperiod);
        setStartDate(s);
        setEndDate(e);
    }, [pj.pperiod]);

    // const s_no = 1
    const s_no = getUnivId()

    const readPermission = usePermissionGuard(props.params.id, s_no, {leader: 1}, false)

    const handleSubmit = async() => {
        setIsLoading(true)
        const data: ccp = {
            pid: props.params.id,
            univ_id: s_no,
            msg: log,
            ver: 0
        }
        try{
            const response = await axios.post("https://cd-api.chals.kim/api/ccp/export", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
            setExportModalOpen(false)
            setLog("")
        }catch(err){

        }finally{
            setIsLoading(false)
        }
    }

    const loadLogList = async() => {
        const data: ccp = {
            pid: props.params.id,
            univ_id: s_no,
            msg: '',
            ver: 0
        }
        try{
            const response = await axios.post<cppPayload>("https://cd-api.chals.kim/api/ccp/load_history", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
            setLogList(response.data.PAYLOAD)
        }catch(err){}
    }

    const defaultProject: PJItem = {
        pid: 0,
        pname: "",
        pdetails: "",
        psize: 0,
        pperiod: "",
        pmm: "",
        wizard: 0
      }

    const loadProject = async() => {
        try{
            const responseType = await axios.post<returnPJ>("https://cd-api.chals.kim/api/project/load", { univ_id: s_no }, {headers:{Authorization: process.env.SECRET_API_KEY}});
            const tmpPJ = responseType.data.PAYLOADS.find(item => item.pid === Number(props.params.id)) || defaultProject
            setPJ(tmpPJ)
        }catch(err){}
    }

    const pageList = ['수정 및 삭제', 'import / export']

    useEffect(() => {
        if(page === 0){
            loadProject()
        }
        if(page === 1){
            loadLogList()
        }
    }, [page])

    const handleEditPJ = (e: React.FormEvent) => {
        e.preventDefault();
        const combinedPperiod = `${startDate}-${endDate}`;
        setPJ({ ...pj, pperiod: combinedPperiod });
        postPJ()
    };

    const postPJ = async() => {
        try{
            const response = await axios.post("https://cd-api.chals.kim/api/project/edit", pj, {headers:{Authorization: process.env.SECRET_API_KEY}});
            alert("수정 완료!")
        }catch(err){
            alert("오류!\n다시 확인해주세요.")
        }
    }

    const handleImport = async() => {
        setIsLoading(true)
        const data = {
            pid: selectedLog?.p_no,
            univ_id: selectedLog?.s_no,
            msg: selectedLog?.msg,
            ver: selectedLog?.ver
        }
        try{
            if(selectedLog){
                const response = await axios.post("https://cd-api.chals.kim/api/ccp/import", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
                setImportModalOpen(false)
                alert("Import 완료!")
                router.push(`/project-main/${props.params.id}/main`)
            }else{
                
                alert("오류 발생")
            }
        }catch(err){

        }finally{
            setIsLoading(false)
        }
    }

    if(readPermission === null){
        return (
          <div>Loading...</div>
        )
      }
      if(!readPermission){
        router.push(`/project-main/${props.params.id}/main`);
        alert("프로젝트 관리자만 접근 가능합니다.")
        return null
      }

    return(
        <div>
            {/*메인 헤더*/}
            <MainHeader pid = {props.params.id}/>

            {/*body*/}
            <div style={{display: 'flex'}}> 

                {/*왼쪽 사이드*/}
                <MainSide pid = {props.params.id}/>

                {/*메인 페이지*/}
                <div style={{height: 'calc(100vh - 105px)', width: 'calc(90% - 200px)', display: 'flex', flexDirection: 'column', margin: '0', float: 'left'}}>
                    <div style={{display: 'flex', width: '70%', margin: '5% auto', marginBottom: '0px'}}>
                        {pageList.map((menu, index) => (
                            <div key={index} style={{
                                position: "relative",
                                minWidth: "120px",
                                height: "36px",
                                backgroundColor: "#fff",
                                border: "1px solid #d1d5db",
                                borderBottom: 'none',
                                borderRadius: "12px 12px 0 0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                flex: "0 0 auto",
                                padding: "0 12px",
                                transition: "all 0.3s ease-in-out",                    
                            }}>
                                <button onClick={() => setPage(index)} style={{
                                    width: "100%",
                                    height: "100%",
                                    border: 'none',
                                    fontWeight: (page === index) ? "bold" : "normal",
                                    color: (page === index) ? "#2563eb" : "#000",
                                    backgroundColor: "transparent",
                                    fontSize: '15px',
                                    cursor: "pointer",
                                    }}>
                                    {menu}
                                </button>
                            </div>
                        ))}
                    </div>
                    {(() => {
                        switch (page) {
                            case 0:
                                return (
                                    <div style={{height: '100%', overflowY: 'auto'}}>
                                        <div style={{width: '70%', display: 'flex', flexDirection: 'column', margin: '0 auto', marginTop: '30px'}}>
                                            <span style={{fontSize: '40px'}}>프로젝트 수정</span>
                                            <form onSubmit={handleEditPJ} style={{marginTop: '10px'}}>
                                                <div style={{ marginBottom: '15px' }}>
                                                    <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>프로젝트 이름:</label>
                                                    <input
                                                        type="text"
                                                        value={pj.pname}
                                                        onChange={(e) => setPJ({ ...pj, pname: e.target.value})}
                                                        required
                                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                                    />
                                                </div>
                                                <div style={{ marginBottom: '15px' }}>
                                                    <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>프로젝트 설명:</label>
                                                    <textarea
                                                        value={pj.pdetails}
                                                        onChange={(e) => setPJ({ ...pj, pdetails: e.target.value})}
                                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', resize: 'vertical' }}
                                                    ></textarea>
                                                </div>
                                                <div style={{display: 'flex'}}>
                                                    <div style={{ marginBottom: '15px', width: '45%', marginRight: '10%' }}>
                                                        <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>인원:</label>
                                                        <input
                                                            type="number"
                                                            value={pj.psize}
                                                            onChange={(e) => setPJ({ ...pj, psize: Number(e.target.value)})}
                                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                                        />
                                                    </div>
                                                    <div style={{ marginBottom: '15px', width: '45%' }}>
                                                        <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>개발 방법론:</label>
                                                        <input
                                                            type="number"
                                                            value={pj.psize}
                                                            onChange={(e) => setPJ({ ...pj, psize: Number(e.target.value)})}
                                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div style={{display: 'flex'}}>
                                                    <div style={{ marginBottom: '15px', width: '45%', marginRight: '10%' }}>
                                                        <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>시작일:</label>
                                                        <input
                                                            type="date"
                                                            value={startDate}
                                                            onChange={(e) => setStartDate(e.target.value)}
                                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                                        />
                                                    </div>
                                                    <div style={{ marginBottom: '15px', width: '45%', }}>
                                                        <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>마감일:</label>
                                                        <input
                                                            type="date"
                                                            value={endDate}
                                                            onChange={(e) => setEndDate(e.target.value)}
                                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                                        />
                                                    </div>
                                                </div>
                                                <button type='submit' style={{width: '50px', padding: '10px', margin: '5px', marginRight: '0',border: 'none', cursor: 'pointer', color: '#ffffff', backgroundColor: '#4CAF50'}}>
                                                    수정
                                                </button>
                                            </form>
                                        </div>
                                        <PJDelBtn pid = {props.params.id}/>
                                    </div>
                                )
                            case 1:
                                return (
                                    <div style={{width: '70%', minHeight: '700px',margin: '0 auto', display: 'flex', flexDirection: 'column', marginBottom: '0', overflowY: 'auto', marginTop: '30px'}}>
                                        {/**export 버튼 */}
                                        <div style={{position: 'relative', width: '100%', minHeight: '40px',border: '0px solid #000', borderRadius: '3px', backgroundColor: 'lightgray', }}>
                                            <button onClick={() => setExportModalOpen(true)} style={{position: 'absolute', right: '0', backgroundColor: 'lightgreen', padding: '5px 10px', borderRadius: '8px'}}>
                                                export 16
                                            </button>
                                            <Modal isOpen={isExportModalOpen} closeModal={() => setExportModalOpen(false)}>
                                                <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
                                                    <span style={{fontSize: '22px', paddingBottom: '10px'}}>프로젝트 Export</span>
                                                    <div style={{display: 'flex'}}>
                                                        <input
                                                            style={{width: '85%', border: '1px solid #000', padding: '5px'}}
                                                            placeholder='설명 및 변경사항을 입력해주세요.'
                                                            type='text'
                                                            onChange={(e) => setLog(e.target.value)}
                                                            value={log}
                                                        />
                                                        <button 
                                                        onClick={handleSubmit} 
                                                        disabled={isLoading}
                                                        style={{padding: '5px 10px', backgroundColor: isLoading ? '#ccc' : 'lightgreen', marginLeft: 'auto', cursor: isLoading ? 'not-allowed' : 'pointer'}}
                                                        >
                                                            확인
                                                        </button>
                                                    </div>
                                                </div>
                                            </Modal>
                                        </div>
                                        {/**import 리스트 및 버튼 */}
                                        <div style={{width: '92%', display: 'flex', flexDirection: 'column', paddingLeft: '8%', paddingTop: '20px'}}>
                                            {logList
                                                .filter((log) => log.ver !== -1)
                                                .map((log, index) => (
                                                    <div key={index} style={{marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start',}}>
                                                        <button 
                                                        onClick={() => {
                                                            setSelectedLog(log)
                                                            setImportModalOpen(true)
                                                        }}
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'flex-start',
                                                            alignSelf: 'flex-start',
                                                            backgroundColor: 'transparent',
                                                            border: 'none',
                                                            padding: 0,
                                                            cursor: 'pointer', // 선택 시 커서 변경
                                                        }}>
                                                            <span style={{fontWeight: 'bold', display: 'inline-block', textAlign: 'left' }}>{`ver.${log.ver} | ${log.msg}`}</span>
                                                            <span style={{display: 'inline-block', textAlign: 'left' }}>{log.date}</span>
                                                        </button>
                                                    </div>
                                                    
                                                ))}
                                                {isImportModalOpen && selectedLog && (
                                                    <Modal isOpen={isImportModalOpen} closeModal={() => { setImportModalOpen(false); setSelectedLog(null); }}>
                                                    <div style={{ padding: "10px 30px" }}>
                                                        <h3 style={modalTitleStyle}>수정 내역</h3>
                                                        <div style={{ display: "flex", flexDirection: "column", paddingLeft: "20px" }}>
                                                            <div style={modalFieldStyle}>
                                                                <strong>버전: </strong>
                                                                {selectedLog.ver}
                                                            </div>
                                                            <div style={modalFieldStyle}>
                                                                <strong>수정자: </strong>
                                                                {selectedLog.s_no}
                                                            </div>
                                                            <div style={modalFieldStyle}>
                                                                <strong>수정 날짜: </strong>
                                                                {selectedLog.date}
                                                            </div>
                                                            <div style={modalFieldStyle}>
                                                                <strong>수정 사항: </strong>
                                                                {selectedLog.msg}
                                                            </div>
                                                            <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                                                                <button 
                                                                onClick={handleImport}
                                                                disabled={isLoading}
                                                                style={{backgroundColor: isLoading ? '#ccc' : 'lightgreen', padding: '5px 10px', borderRadius: '8px', cursor: isLoading ? 'not-allowed' : 'pointer'}}
                                                                >
                                                                    import
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    </Modal>
                                                )}
                                        </div>
                                    </div>
                                )
                            default:
                                return (
                                    <div>default</div>
                                )
                        }
                    })()}
                    
                </div>
            </div>
        </div>
    )
}
  
  const modalTitleStyle: CSSProperties = {
    marginBottom: "15px",
    marginTop: '15px',
    fontSize: "30px",
    fontWeight: "bold",
  };
  
  const modalFieldStyle: CSSProperties = {
    marginBottom: "10px",
    fontSize: "16px",
  };