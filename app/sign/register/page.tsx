"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'
import mb from '@/app/json/msBox.json'
import { setToken, getToken, setUnivId, getUnivId, setUserId, getUserId } from '@/app/util/storage';

type postType = {
    "RESULT_CODE": number, 
    "RESULT_MSG": string, 
    "PAYLOADS": {
        "Token": string
        "Univ_ID": number}
}

export default function Signup() {
    const [name, setName] = useState('');
    const [hak, setHak] = useState<string | number>('');
    const [email, setEmail] = useState('');
    const [id, setID] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRePassword] = useState('');
    const [department, setDepartment] = useState(10);
    
    

    const router = useRouter();

    const data = {
        name: name,
        univ_id: hak,
        email: email,
        id: id,
        pw: password,
        department: department
    };

    useEffect(() => {
        console.log("test 4");
        const tmpId = getUserId();
        const tmpTk = getToken();
        if(tmpId || tmpTk){
            router.push('/');
            console.log(getToken())
            console.log(getUserId())
        }
    }, []);

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        if(passwordSame(password, repassword)){
            postData();
        }else{
            alert(mb.register.wrongpass.value)
        }
    };

    const passwordSame = (a: string, b: string) => {
        return (a == b);
    };

    const postData = async() => {
        try{
            const response = await axios.post<postType>("https://cd-api.chals.kim/api/acc/signup", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
            console.log(response.data);
            if(response.data.RESULT_CODE === 200){
                setToken(response.data.PAYLOADS.Token);
                setUserId(id);
                setUnivId(Number(hak));
                infoClear();
                router.push('/')
            }else{
                console.error("Error: ", response.data.RESULT_MSG);
            }
        } catch(err){
            console.error("API 요청 실패: ", err);
        }
        
    };

    const gotoSignUp = () => {
        router.push('/sign/signUp');
    };

    const infoClear = () => {
        setName('');
        setHak('');
        setEmail('');
        setID('');
        setPassword('');
        setRePassword('');
    }
    
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ width: '400px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
                <div style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold' }}>{mb.register.title.value}</div>
                <form onSubmit={handleSignup}>
                    <div style={{ margin: '10px 30px', padding: '10px' }}>
                        <label htmlFor="name" style={{ display: 'block', fontSize: '15px' }}>{mb.user.name.value}</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ width: '90%', padding: '6px' }}
                        />
                    </div>
                    <div style={{ margin: '10px 30px', padding: '10px' }}>
                        <label htmlFor="name" style={{ display: 'block', fontSize: '15px' }}>{mb.user.hak.value}</label>
                        <input
                            type="number"
                            id="hak"
                            value={hak}
                            onChange={(e) => setHak(e.target.valueAsNumber)}
                            required
                            style={{ width: '90%', padding: '6px' }}
                        />
                    </div>
                    <div style={{ margin: '10px 30px', padding: '10px' }}>
                        <label htmlFor="name" style={{ display: 'block', fontSize: '15px' }}>{mb.user.email.value}</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '90%', padding: '6px' }}
                        />
                    </div>
                    <div style={{ margin: '10px 30px', padding: '10px' }}>
                        <label htmlFor="name" style={{ display: 'block', fontSize: '15px' }}>{mb.user.id.value}</label>
                        <input
                            type="text"
                            id="id"
                            value={id}
                            onChange={(e) => setID(e.target.value)}
                            required
                            style={{ width: '90%', padding: '6px' }}
                        />
                    </div>
                    <div style={{ margin: '10px 30px', padding: '10px' }}>
                        <label htmlFor="password" style={{ display: 'block', fontSize: '15px' }}>{mb.user.password.value}</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '90%', padding: '6px' }}
                        />
                    </div>
                    <div style={{ margin: '10px 30px', padding: '10px' }}>
                        <label htmlFor="password" style={{ display: 'block', fontSize: '15px' }}>{mb.register['re-password'].value}</label>
                        <input
                            type="password"
                            id="repassword"
                            value={repassword}
                            onChange={(e) => setRePassword(e.target.value)}
                            required
                            style={{ width: '90%', padding: '6px' }}
                        />
                    </div>
                    <div style={{ textAlign: 'right', marginRight: '50px' }}>
                        <button onClick={gotoSignUp} style={{ padding: '10px', width: '25%' }}>{mb.register['start-page'].value}</button>
                        <button type="submit" style={{ width: '25%', padding: '10px' }}>{mb.register.registerbtn.value}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

