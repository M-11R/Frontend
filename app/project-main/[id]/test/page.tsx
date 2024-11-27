'use client'
import {useState, useEffect} from 'react'
import { getToken, getUserId, getUnivId, setUnivId, setToken } from '@/app/util/storage';

export default function test(){
    const [id, setId] = useState<string | null>(null);
    const [tk, settk] = useState<string | null>(null);
    const [hak, setHak] = useState<string | null>(null);
    const [text, setText] = useState("test 2");


    useEffect(() => {
        console.log("storage test 1");
        const tmpid = getUserId();
        const tmpt = getToken();
        const tmph = getUnivId();
        setText("test 3");
        if(tmpid && tmpt && tmph){
            setId(tmpid);
            settk(tmpt);
            setHak(tmph);
        }else{
            console.log("undefined");
        }
    })

    const funGT = () => {
        console.log(getToken);
    }

    const funST = (tmp: string) => {
        setToken(tmp);
    }

    return(
        <div suppressHydrationWarning>
            <div>
                {id}{tk}{hak}
            </div>
            <div>
                {text}
            </div>
        </div>
    )
}