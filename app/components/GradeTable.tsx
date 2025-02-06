'use client'

import axios from "axios";
import { useState, useEffect } from "react";
import { getUnivId } from "../util/storage";
import { usePageReload } from "../util/reloadPage";
import { GradeModal } from "./Modal";

type userList = {
    p_no: number
    p_name: string
    s_no: number
    s_name: string
    grade: string
    comment: string
}
type postType = {
    pid: string
    univ_id: number
    grade: string | null
}

const GradeTable = ({pid}: {pid: number}) => {
    const [user, setUser] = useState<userList[]>([]);

    useEffect(() => {
        getUser();
    }, [])

    const getUser = async() => {
        const data: postType = {
            pid: pid.toString(),
            univ_id: getUnivId(),
            grade: 'o'
        };
        try{
            const response = await axios.post("https://cd-api.chals.kim/api/grade/fetch_project", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
            const tmp = response.data.PAYLOAD.Grade;
            setUser(tmp);
        }catch(err){
            console.log(err);
        }
    }

    // const fixData = (data: tmpList[]): userList[] => {
    //     return data.map((Item) => {
    //         return {
    //             p_no: Item.p_no,
    //             p_name: Item.p_name,
    //             s_no: Item.s_no,
    //             s_name: Item.s_name,
    //             grade: Item.grade || 'o'
    //         }
    //     })
    // }

    const handleGradeChange = (s_no: number, p_no: number, grade: string) => {
        const data: postType = {
            pid: p_no.toString(),
            univ_id: s_no,
            grade: grade || null
        }
        updateGrade(data)
        setUser(prevUser => 
            prevUser.map((Item) => 
                Item.s_no === s_no ? {...Item, grade: grade || ''} : Item)
        )
    }

    const updateGrade = async(data: postType) => {
        const postData = data
        try{
            const response = await axios.post("https://cd-api.chals.kim/api/grade/assign", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
        }catch(err){}
    }

    const handleGradeDelete = (s_no: number, p_no: number) => {
        const data: postType = {
            pid: p_no.toString(),
            univ_id: s_no,
            grade: 'o'
        }
        deleteGrade(data)
        setUser(prevUser => 
            prevUser.map((Item) => 
                Item.s_no === s_no ? {...Item, grade: ''} : Item)
        )
    }

    const deleteGrade = async(data: postType) => {
        const postData = data
        try{
            const response = await axios.post("https://cd-api.chals.kim/api/grade/delete", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
        }catch(err){}
    }

    return(
        <div style={{height: '100%', width: '70%', margin: '10% auto'}}>
            <div style={{width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column'}}>
                <span style={{fontSize: '40px'}}>학생 평가</span>
                {user.length === 0 ? (
                    <p>loading....</p>
                ):(
                    <table style={{border: '2px solid #000000', width: '100%', fontSize: '18px'}}>
                        <thead>
                            <tr style={{height: '80px'}}>
                                <th style={{width: '20%'}}>이름</th>
                                <th style={{width: '20%'}}>학번</th>
                                <th style={{width: '20%'}}>학점</th>
                                <th style={{width: '20%'}}>학점 설정</th>
                                <th style={{width: '20%'}}>초기화</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.map((Item) => 
                                <tr key={Item.s_no} style={{textAlign: 'center', height: '80px'}}>
                                    <td>{Item.s_name}</td>
                                    <td>{Item.s_no}</td>
                                    <td>{Item.grade || '미설정'}</td>
                                    {/* <td>
                                        <select
                                            value={Item.grade || ''}
                                            onChange={(e) => handleGradeChange(Item.s_no, Item.p_no, e.target.value)}
                                            style={{width: '100px', padding: '5px', fontSize: '16px'}}
                                        >
                                            <option value=''>--</option>
                                            <option value='A'>A+</option>
                                            <option value='A'>A</option>
                                            <option value='B'>B+</option>
                                            <option value='B'>B</option>
                                            <option value='C'>C+</option>
                                            <option value='C'>C</option>
                                            <option value='D'>D+</option>
                                            <option value='D'>D</option>
                                            <option value='F'>F</option>
                                        </select>
                                    </td> */}
                                    <td>
                                        <GradeModal p_id={pid} name={Item.s_name} univ_id={Item.s_no} grade={Item.grade} comment={Item.comment}/>
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => handleGradeDelete(Item.s_no, Item.p_no)}
                                            style={{width: '100px', padding: '5px', fontSize: '16px'}}
                                        >학점 초기화
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
                
            </div>
        </div>
    )
}

export default GradeTable;