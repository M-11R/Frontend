'use client'

import { useState, useEffect } from "react"
import { getUnivId } from "../util/storage"
import axios from "axios"
import styles from '@/app/css/VerticalTable.module.css'

type postType = {
    pid: string
    univ_id: number
    grade: string | null
}

const CheckGradeTable = ({pid}: {pid: number}) => {
    const [tmpGrade, setGrade] = useState('')
    const [tmpComment, setComment] = useState('')
    const [name, setName] = useState('')
    const s_no = getUnivId();
    const data: postType = {
        pid: pid.toString(),
        univ_id: s_no,
        grade: 'o'
    }
    
    useEffect(() => {
        loadData()
    },[])

    const loadData = async() => {
        try{
            const response = await axios.post("https://cd-api.chals.kim/api/grade/fetch_one", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
            const tmp = response.data.PAYLOAD.Grade
            
            const tGrade = (tmp.grade !== null ? tmp.grade : 'X')
            const tComment = (tmp.comment !== null ? tmp.comment : '')
            setGrade(tGrade)
            setComment(tComment)
        }catch(err){
            
        }
    }


    return (
        <div style={{height: '100%', width: '70%', margin: '10% auto'}}>
            <div style={{width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column'}}>
                <span style={{fontSize: '40px'}}>성적 확인</span>
                {tmpGrade.length === 0 ? (
                    <p>loading...</p>
                ) : (
                    <div style={{display: 'flex', flexDirection: 'row', border: '2px solid #000000', fontSize: '18px', padding: '10px'}}>
                        {/* 왼쪽 컬럼 */}
                        <div style={{ display: 'flex', flexDirection: 'column', flex: '1', borderRight: '1px solid #000' }}>
                            <div style={{ padding: '10px', fontWeight: 'bold' }}>학번</div>
                            <div style={{ padding: '10px', fontWeight: 'bold' }}>학점</div>
                            <div style={{ padding: '10px', fontWeight: 'bold' }}>코멘트</div>
                        </div>

                        {/* 오른쪽 데이터 */}
                        <div style={{ display: 'flex', flexDirection: 'column', flex: '3' }}>
                            <div style={{ padding: '10px' }}>{s_no}</div>
                            <div style={{ padding: '10px' }}>{tmpGrade}</div>
                            <div style={{ padding: '10px', height: '100px', overflow: 'auto' }}>{tmpComment}</div>
                        </div>
                        {/* <table style={{border: '2px solid #000000', width: '100%', fontSize: '18px'}}>
                        <thead>
                            <tr style={{height: '80px'}}>
                                <th style={{width: '30%'}}>이름</th>
                                <th style={{width: '30%'}}>학번</th>
                                <th style={{width: '30%'}}>학점</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{textAlign: 'center', height: '80px'}}>
                                <td>{}</td>
                                <td>{pid}</td>
                                <td>{tmpGrade}</td>
                            </tr>
                        </tbody>
                        </table> */}
                    </div>
                )}
            </div>
        </div>
    )
    
}

export default CheckGradeTable;