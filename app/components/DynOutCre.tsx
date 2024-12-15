//미사용



'use client'

import { useState } from "react"
import styles from '@/app/css/DynOutCom.module.css'
import { getUserId } from "@/app/util/storage"
import axios from "axios"

export const EtcOutput = () => {
    const [tmpfile, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]){
            setFile(e.target.files[0]);
        }
    }

    const handleUpload = async() => {
        if(!tmpfile){
            alert('파일을 선택해주세요.');
            return;
        }
        const formData = new FormData();
        formData.append('file', tmpfile);

        try{
            const response = await axios.post("https://google.com", formData);
            console.log('success');
        }catch(err){
            console.log(err);
        }
    }

    return (
        <table className={styles.outTable}>
            <colgroup>
                <col style={{width: `20%`}}/>
                <col style={{width: `cal(100 - 20)%`}}/>
            </colgroup>
            <tbody>
                <tr>
                    <td colSpan={2}>
                        <input
                            type="file"
                            onChange={handleFileChange}
                        ></input>
                    </td>
                </tr>
                <tr style={{borderBottom: '0'}}>
                    <td colSpan={2} style={{borderBottom: '0'}}>
                        <div style={{margin: 'auto', float: 'right'}}>
                            <button onClick={handleUpload}>파일 업로드</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}