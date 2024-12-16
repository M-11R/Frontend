'use client'

import axios from "axios";
import { getUnivId } from "../util/storage";
import { useState, useEffect } from "react";
import { limitTitle } from "../util/string";

type returnTask = {
    "RESULT_CODE": number
    "RESULT_MSG": string
    "PAYLOADS": taskType[]
}
type taskType = {
    "tid": number
    "tname": string
    "tperson": string
    "tstart": string
    "tend": string
    "tfinish": boolean
}
type postTaskPayload = {
    pid: number
    univ_id: number
}

const TodoList = ({p_id}: {p_id: number}) => {
    const [data, setData] = useState<taskType[]>([]);
    const tmpUnivId: number = getUnivId();
    useEffect(() => {
        loadTask();
    },[])

    const loadTask = async() => {
        const postData: postTaskPayload = {pid: p_id, univ_id: tmpUnivId};
        try{
            const response = await axios.post<returnTask>("https://cd-api.chals.kim/api/task/load", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
            const sortedData = response.data.PAYLOADS.sort((a, b) => {
                const dateA = new Date(a.tend).getTime();
                const dateB = new Date(b.tend).getTime();
                return dateA - dateB;
            })
            const sliceData: taskType[] = sortedData.slice(0, 5);
            setData([...sliceData]);
        }catch(err){}
    }

    return(
        <div>
            {data.length > 0 ? (
                data.map((item: taskType) => (
                    <div>
                        <div key={item.tid} style={{margin: '10px 10px', fontSize: '15px'}}>
                            <div>마감 기한 : {item.tend}</div>
                            <div>내용 : {limitTitle(item.tname, 15)}</div>
                        </div>
                    </div>
                )
            )) : (
                <div></div>
            )}
        </div>
    );
}
export default TodoList;