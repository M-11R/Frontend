'use client'
import MainHeader from '@/app/components/MainHeader'
import MainSide from '@/app/components/MainSide'
import { useState } from 'react'
import styles from '@/app/css/DynOutCom.module.css'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { getUnivId } from '@/app/util/storage'

type returnType = {
    "RESULT_CODE": number,
    "RESULT_MSG": string,
    "PAYLOADS": {
        "file_unique_id": any,
        "file_name": any,
        "file_path": any,
    }
}

export default function Create(props: any) {
    const [tmpfile, setFile] = useState<File | null>(null);

    const router = useRouter();

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
        const tmppid:number = props.params.id;
        const tmpunivid = getUnivId();
        const formData = new FormData();
        formData.append('file', tmpfile);
        formData.append('pid', tmppid.toString());
        formData.append('univ_id', tmpunivid.toString());

        try{
            const response = await axios.post<returnType>("https://cd-api.chals.kim/api/output/otherdoc_add", formData, {headers:{Authorization: process.env.SECRET_API_KEY}})
            if (response.data.RESULT_CODE === 200){
                router.push(`/project-main/${props.params.id}/outputManagement`);
            }
        }catch(err){
            console.log(tmpfile.name);
            console.log(tmppid);
            console.log(tmpunivid);
            alert("파일 업로드 실패")
        }
    }
    return (
        <div>
            <MainHeader pid = {props.params.id}/>

            <div style={{display: 'flex'}}>
                <MainSide pid = {props.params.id}/>

                <div style={{height: 'calc(100vh - 105px)', width: 'calc(90% - 200px)', border: '1px solid #000000', display: 'flex', flexDirection: 'column', margin: '0', float: 'left'}}>
                    <div style={{margin: '5% auto', width: '70%', height: '100%'}}>
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
                                        <button onClick={handleUpload}>업로드 </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </div>
    );
}