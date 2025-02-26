'use client'
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios";
import { clearStorage, getToken } from "../storage";


type returnType = {
    "RESULT_CODE": number, 
    "RESULT_MSG": string
}
type post = {
    token: string
}

export default function SignOut(){
    const router = useRouter();

    useEffect(() => {
        const data: post = {token: getToken()}
        if(data.token === ''){
            router.push('/');
            return;
        }else{
            checksession(data);
        }
        
    }, []);

    const checksession = async(data: post) => {
        try{
            const response = await axios.post<returnType>("https://cd-api.chals.kim/api/acc/signout", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
            if(response.data.RESULT_CODE === 200){
                clearStorage();
                router.push('/');
                alert('로그아웃 되었습니다.');
            }
            router.push('/');
        }catch(err){
            router.push('/');
        }
    }
    return(<div>Loading</div>)
}