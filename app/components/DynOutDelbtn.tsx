'use client'

import axios from "axios";
import MsBox from '@/app/json/msBox.json'
import { useRouter } from "next/router";
import { useEffect } from "react";

type delData = {
    oid: number
    type: string
}

const handleDelbtn = (data: delData, pid: number) => {
    const postData = {doc_s_no: data.oid}

    useEffect(() => {
        handlePost();
    })

    const handlePost = async() => {
        try{
            switch(data.type){
                case MsBox.outType.etc.value:
                    const formData = new FormData();
                    formData.append('file_unique_id', data.oid.toString());
                    const responseEtc = await axios.post("https://cd-api.chals.kim/api/output/otherdoc_delete", formData, {headers:{Authorization: process.env.SECRET_API_KEY}});
                    return;
                case MsBox.outType.overview.value:
                    const responseOvr = await axios.post("https://cd-api.chals.kim/api/output/sum_doc_delete", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
                    return;
                case MsBox.outType.testcase.value:
                    const responseTest = await axios.post("https://cd-api.chals.kim/api/output/testcase_delete", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
                    return;
                case MsBox.outType.request.value:
                    const responseReq = await axios.post("https://cd-api.chals.kim/api/output/reqspec_delete", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
                    return;
                case MsBox.outType.minutes.value:
                    const responseMm = await axios.post("https://cd-api.chals.kim/api/output/mm_delete", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
                    return;
                case MsBox.outType.report.value:
                    const responseRep = await axios.post("https://cd-api.chals.kim/api/output/report_delete", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
                    return;
            }
        }catch(err){}
        finally{
        }
    }
}

const OutDelbtn = ({data, pid}: {data: delData, pid: number}) => {
    return (
        <button onClick={() => handleDelbtn(data, pid)}>Del</button>
    );
}

export default OutDelbtn;