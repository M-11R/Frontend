'use client'
import {useState, useEffect} from 'react'

export default function test(){
    const [id, setId] = useState<string | null>(null);
    const [tk, settk] = useState<string | null>(null);


    useEffect(() => {
        const tmpid = localStorage.getItem("userId");
        const tmpt = localStorage.getItem("token");
        if(tmpid || tmpt){
            setId(tmpid);
            settk(tmpt);
        }
    })

    return(
        <div>
            <div>
                {id}{tk}
            </div>
            <div>
                test
            </div>
        </div>
    )
}