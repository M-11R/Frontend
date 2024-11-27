'use client'
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios";
import { clearStorage, getToken } from "../storage";


type returnType = {
    "RESULT_CODE": number, 
    "RESULT_MSG": string
}


export default function SignOut(){
    const router = useRouter();

    useEffect(() => {
        const data: string = getToken();
        checksession(data);
    }, []);

    const checksession = async(data: string) => {
        try{
            const response = await axios.post<returnType>("https://cd-api.chals.kim/api/acc/signout", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
            if(response.data.RESULT_CODE === 200){
                clearStorage();
                router.push('/');
                alert('로그아웃 되었습니다.');
            }
            console.log(data);
            router.push('/');
        }catch(err){
            router.push('/');
            alert(err);
        }
    }
    return(<div>Loading...</div>)
}