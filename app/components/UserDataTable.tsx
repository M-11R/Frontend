'use client'

import headers from '@/app/json/user.json'
import {UserConfigBtn} from './Modal';
import { useEffect, useState } from 'react';
import axios from 'axios';


type userList = {
    "univ_id": number,
    "role": string,
    "name": string,
    "permission": string
}
type returnType = {
    "RESULT_CODE": number,
    "RESULT_MSG": string,
    "PAYLOADS": userList[]
}
type pidType = {
    pid: string
}

const UserDataTable = ({p_id}: {p_id: any}) => {
    const [user, setUser] = useState<userList[]>([]);
    // const pidForm: pidType = { pid: p_id };
    const data = {
        pid: p_id
    }
    useEffect(() => {
        getUser();
    }, []);

    const getUser = async() => {
        try{
            const response = await axios.post<returnType>("https://cd-api.chals.kim/api/project/checkuser", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
            setUser(response.data.PAYLOADS);
        }catch(err){
            // console.log(err);
            console.log(data.pid);
        }
        
    }
    return (
        <table style={{border: '2px solid #000000', width: '100%', fontSize: '18px'}}>
            <thead>
                <tr style={{height: '80px'}}>
                    {headers.Header.map((Item) => 
                    <th key={Item.text} style={{width: '20%'}}>
                        {Item.text}
                    </th>)}
                </tr>
            </thead>
            <tbody>
            {user.map((Item) =>
                <tr key={Item.univ_id} style={{textAlign: 'center', height: '80px'}}>
                    <td>{Item.name}</td>
                    <td>{Item.univ_id}</td>
                    <td>{Item.role}</td>
                    <td>{Item.permission}</td>
                    <td><UserConfigBtn input = {Item} pid = {p_id}/></td>
                </tr>)}
            </tbody>
        </table>
    )
};

export default UserDataTable;