"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'
import mb from '@/app/json/msBox.json'

export default function Signup() {
    const [name, setName] = useState('');
    const [hak, setHak] = useState('');
    const [email, setEmail] = useState('');
    const [id, setID] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRePassword] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    

    const router = useRouter();

    const data = {
        name: name,
        hak: hak,
        email: email,
        id: id,
        password: password
    };

    useEffect(() => {
        const tmpId = localStorage.getItem("userId");
        const tmpTk = localStorage.getItem("token");
        if(tmpId || tmpTk){
            router.push('/');
        }else{
            setUserId(tmpId);
            setToken(tmpTk);
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
            const response = await axios.post("https://cd-api.chals.kim/api/test/post", data);
            console.log(response.data);
        } catch(err){
            alert('error test 3');
        }
        localStorage.setItem("userId", data.id)
        localStorage.setItem("token", "1234")
        infoClear();
        router.push('/')
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
                            onChange={(e) => setHak(e.target.value)}
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

