'use client'

import { useRouter } from "next/navigation"
import { getUnivId, getToken, getUserId } from "./storage"
import { useEffect, useState } from "react"
import axios from "axios"

export default function useSessionGuard(): number | null{ // kickReverse -> true: 세션 안 맞으면 퇴출 / false: 세션 맞으면 퇴출
    const router = useRouter();
    const [sessionValid, setSessionValid] = useState<number | null>(null);
    useEffect(() => {
        const checkSession = async() => {
            const id = getUserId();
            const token = getToken();
            let valid = 0
            try{
                const responseStudent = await axios.post("https://cd-api.chals.kim/api/acc/checksession", {user_id: id, token: token}, { headers: { Authorization: process.env.SECRET_API_KEY } });
                if(responseStudent.data.RESULT_CODE === 200){
                    valid = 1
                }
            }catch(err){
                try{
                    const responseProf = await axios.post("https://cd-api.chals.kim/api/prof/checksession", {user_id: id, token: token}, { headers: { Authorization: process.env.SECRET_API_KEY } });
                    if(responseProf.data.RESULT_CODE === 200){
                        valid = 2
                    }
                }catch(err){}
            }
            setSessionValid(valid)
        }
        checkSession()
        
    }, [])

    return sessionValid
}