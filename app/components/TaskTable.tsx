'use client'
import { useState, useEffect } from "react"
import axios from "axios"
import Pagenation from "./pagenation"
import MsBox from '@/app/json/msBox.json'
import styles from '@/app/css/DivTable.module.css'
import { AddTask, ConfigTask } from "@/app/components/Modal";
import { limitTitle } from "../util/string"
import { getUnivId } from '@/app/util/storage'
import usePermissionGuard from '@/app/util/usePermissionGuard'
import { useRouter } from "next/navigation"
import useSessionGuard from "../util/checkAccount"

type taskType = {
    p_no: number
    s_no: number
    w_checked: boolean
    w_end: string
    w_name: string
    w_no: number
    w_person: string
    w_start: string
}
type returnTask = {
    "RESULT_CODE": number
    "RESULT_MSG": string
    "PAYLOADS": taskType[]
}
type postTaskPayload = {
    pid: number
    univ_id: number
}

const TaskTable = ({page, p_id}: {page: number, p_id: number}) => {
    const router = useRouter();
    const [data, setData] = useState<taskType[]>([]);
    const s_no = getUnivId()
    const readPermission = usePermissionGuard(p_id, s_no, {leader: 1, task: [1, 2]}, false);
    const writePermission = usePermissionGuard(p_id, s_no, {leader: 1, task: 1}, false);
    const session = useSessionGuard();
    useEffect(() => {
        loadTask();
    }, []);

    

    {/**페이지네이션에 사용할 변수 */}
    const itemsPerPage = 10; // 한 페이지당 표시할 글 수
    const currentData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage); 
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage); // ( 총 페이지 / 페이지당 표시할 글 )

    const loadTask = async() => {
        const data: postTaskPayload = {pid: p_id, univ_id: 0};
        try{
            const response = await axios.post<returnTask>("https://cd-api.chals.kim/api/task/load_all", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
            const sortedData = response.data.PAYLOADS.sort((a, b) => {
                const dateA = new Date(a.w_end).getTime();
                const dateB = new Date(b.w_end).getTime();
                return dateB - dateA;
            })
            setData(sortedData);
        }catch(err){

        }
    }

    if(readPermission === null || session === null){
        return <div>Loading...</div>
    }
    if(!readPermission && session === 1){
        router.push(`/project-main/${p_id}/main`)
        alert("권한이 없습니다.")
        return null
    }

    const tf = (data: number) => {
        if(data === 0){
            return false;
        }else{
            return true;
        }
    }

    return (
        <div style={{margin: '5% auto', width: '70%', height: '100%'}}>
            <div style={{height: '100%', width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column'}}>
                {!writePermission ? (<div></div>):(<div style={{margin: '15px 0 auto', marginLeft: 'auto', textAlign: 'center'}}><AddTask p_id={p_id}/></div>)}
                <h1>{MsBox.task.tTitle.value}</h1>
                <div style={{width: '100%', height: '100%'}}>

                    {/**테이블 헤드 */}
                    <div className={styles.row} style={{backgroundColor: '#dfdfdf', fontWeight: 'bold', display: 'flex', border: '1px solid #000000', height: '9%'}}>
                        <div className={styles.cell} style={{width: '34%'}}>{MsBox.task.tname.value}</div>
                        <div className={styles.cell} style={{width: '14%'}}>{MsBox.task.tperson.value}</div>
                        <div className={styles.cell} style={{width: '14%'}}>{MsBox.task.tstart.value}</div>
                        <div className={styles.cell} style={{width: '14%'}}>{MsBox.task.tend.value}</div>
                        <div className={styles.cell} style={{width: '10%'}}>{MsBox.task.tfinish.value}</div>
                        <div className={styles.endCell} style={{width: '14%'}}>{MsBox.task.tconfig.value}</div>
                    </div>

                    {/**테이블 데이터 */}
                    {currentData.map((item: taskType) => (
                        <div key={item.w_no} className={styles.row} style={{display: 'flex', border: '1px solid #000000', borderTop: '0', height: '9%'}}>
                            <div className={styles.cell} style={{width: '34%', height: '100%'}}>{limitTitle(item.w_name, 30)}</div>
                            <div className={styles.cell} style={{width: '14%', height: '100%'}}>{item.w_person}</div>
                            <div className={styles.cell} style={{width: '14%', height: '100%'}}>{item.w_start}</div>
                            <div className={styles.cell} style={{width: '14%', height: '100%'}}>{item.w_end}</div>
                            <div className={styles.cell} style={{width: '10%', height: '100%'}}>{item.w_checked ? '완료' : '진행 중'}</div>
                            <div className={styles.endCell} style={{width: '14%'}}>{!writePermission ? (<div>권한 없음</div>):(<ConfigTask data={item} p_id={p_id}/>)}</div>
                        </div>
                    ))}
                </div>
                <div style={{height: '50px'}}></div>
                
                <Pagenation currentPage={page} totalPages={totalPages} basePath={`/project-main/${p_id}/task`} />
            </div>
        </div>
    );
}
export default TaskTable;