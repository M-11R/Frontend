'use client'
import { getToken, getUserId } from "@/app/util/storage";
import axios from "axios";
import { useEffect } from "react";

type taskType = {
    "tid": number
    "tname": string
    "tperson": string
    "tstart": string
    "tend": string
    "tfinish": boolean
}
type returnTask = {
    "RESULT_CODE": number
    "RESULT_MSG": string
    "PAYLOADS": taskType[]
}

export default function Test() {
    
    
    useEffect(() => {
        loadTask();
    })

    const loadTask = async() => {
        const data = {pid: 33560, univ_id: 0};
        try{
            const response = await axios.post<returnTask>("https://cd-api.chals.kim/api/task/load_all", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
            const sortedData = response.data.PAYLOADS.sort((a, b) => {
                const dateA = new Date(a.tend).getTime();
                const dateB = new Date(b.tend).getTime();
                return dateB - dateA;
            })
            
            console.log(response.data.PAYLOADS)
        }catch(err){

        }
    }

    return(
        <div>
            Loading...
            
        </div>
        
    );
}