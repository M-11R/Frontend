'use client'

import axios from "axios";
import MsBox from '@/app/json/msBox.json'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type delData = {
    oid: number
    type: string
}
const handleDelbtn = async(data: delData, pid: number): Promise<boolean> => {
    const postData = {doc_s_no: data.oid}
    
        try{
            switch(data.type){
                case MsBox.outType.etc.value:
                    const formData = new FormData();
                    formData.append('file_unique_id', data.oid.toString());
                    const responseEtc = await axios.post("https://cd-api.chals.kim/api/output/otherdoc_delete", formData, {headers:{Authorization: process.env.SECRET_API_KEY}});
                    break;
                case MsBox.outType.overview.value:
                    const responseOvr = await axios.post("https://cd-api.chals.kim/api/output/sum_doc_delete", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
                    break;
                case MsBox.outType.testcase.value:
                    const responseTest = await axios.post("https://cd-api.chals.kim/api/output/testcase_delete", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
                    break;
                case MsBox.outType.request.value:
                    const responseReq = await axios.post("https://cd-api.chals.kim/api/output/reqspec_delete", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
                    break;
                case MsBox.outType.minutes.value:
                    const responseMm = await axios.post("https://cd-api.chals.kim/api/output/mm_delete", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
                    break;
                case MsBox.outType.report.value:
                    const responseRep = await axios.post("https://cd-api.chals.kim/api/output/report_delete", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
                    break;
            }
            return true;
        }catch(err){
            return false;
        }
}

const OutDelbtn = ({data, pid}: {data: delData, pid: number}) => {
    const router = useRouter()
    
    const handleClick = async() => {
        const success = await handleDelbtn(data, pid);
        if(success){
            console.log('delete success');
            router.push(`/project-main/${pid}/outputManagement`)
        }else{
            console.log('error')
        }
    }
    return (
        <button onClick={() => handleClick()}>삭제</button>
    );
}

export default OutDelbtn;