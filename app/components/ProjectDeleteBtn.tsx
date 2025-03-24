'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { getUnivId } from "../util/storage"

const PJDelBtn = ({pid}: {pid: number}) => {
    const [text, setText] = useState('');
    const router = useRouter();
    const deleteText = "삭제하겠습니다."
    const s_no = getUnivId()

    const handleDelete = async() => {
        const data = {pid: pid, univ_id: s_no}
        if(text !== deleteText){
            alert("삭제 텍스트가 일치하지 않습니다.")
            return
        }
        if(!window.confirm("정말로 삭제하시겠습니까?")) return
        try{
            const response = await axios.post("https://cd-api.chals.kim/api/project/delete", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
            router.push('/');
            alert("삭제가 완료되었습니다.");
        }catch(err){}
    }

    return (
        <div style={{width: '70%', margin: '5% auto', marginBottom: '0', display: 'flex', }}>
            <div style={{width: '70%', display: 'flex', flexDirection: 'column',}}>
                <span style={{fontSize: '40px'}}>프로젝트 삭제</span>
                <div style={{width: 'calc(100% - 37px)', border: '1px solid #000', whiteSpace: "pre-wrap", margin: '5px', padding: '15px'}}>
                    <span>{`프로젝트를 삭제하시겠습니까?\n삭제할려면 "`}</span>
                    <span style={{color: 'red'}}>{deleteText}</span>
                    <span>{`"라고 입력 후 버튼을 눌러주세요. `}</span>
                </div>
                <div style={{display: 'flex'}}>
                    <input
                        type='text'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="텍스트를 입력해주세요."
                        style={{width: 'calc(100% - 45px)', padding: '10px', margin: '5px'}}
                    />
                    <button
                            onClick={handleDelete}
                            style={{width: '50px', padding: '10px', margin: '5px', marginRight: '0',border: 'none', cursor: 'pointer', color: '#ffffff', backgroundColor: '#FF4D4D'}}
                    >삭제</button>
                </div>
            </div>
            
        </div>
    )
}

export default PJDelBtn