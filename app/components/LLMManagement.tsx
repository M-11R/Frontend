'use client'

import axios from "axios";
import { useEffect, useState } from "react";
import { getUnivId } from '@/app/util/storage'
import usePermissionGuard from '@/app/util/usePermissionGuard'

const LLMManagement = ({pid}: {pid: number}) => {
    const [api, setApi] = useState('');
    const [isKey, setIsKey] = useState(false);
    const s_no = getUnivId()
    usePermissionGuard(pid, s_no, {leader: 1, llm: [1, 2]}, true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async() => {
        const data = {pid: pid, api_key: ''}
        try{
            const response = await axios.post("https://cd-api.chals.kim/api/llm/load_key", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
            const code = response.data.RESULT_CODE
            if(code === 200){
                const tmp = response.data.RESULT_MSG
                setApi(tmp)
                setIsKey(true)
            }
        }catch(err){}
    }
    
    const handlePostApi = async() => {
        if(!api.trim()){
            alert('API Key를 입력해주세요.')
            return;
        }

        const data = {pid: pid, api_key: api}
        if(isKey === true){
            try{
                const response = await axios.post("https://cd-api.chals.kim/api/llm/edit_key", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
                alert('저장이 완료되었습니다.')
            }catch(err){}
        }else{
            try{
                const response = await axios.post("https://cd-api.chals.kim/api/llm/add_key", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
                alert('저장이 완료되었습니다.')
            }catch(err){}
        }
        
    }

    return(
        <div style={{height: '100%', width: '70%', margin: '10% auto'}}>
            <div style={{width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column'}}>
                <span style={{fontSize: '40px'}}>LLM API Key 설정</span>
                <div style={{display: 'flex'}}>
                    <input
                        type='text'
                        value={api}
                        onChange={(e) => setApi(e.target.value)}
                        placeholder="API Key를 입력해주세요."
                        style={{width: '80%', padding: '10px', margin: '5px'}}
                    />
                    <button
                        onClick={handlePostApi}
                        style={{width: '50px', padding: '10px', margin: '5px', border: 'none', cursor: 'pointer', color: '#ffffff', backgroundColor: '#4caf50'}}
                    >저장</button>
                </div>
            </div>
        </div>
    )
}

export default LLMManagement;