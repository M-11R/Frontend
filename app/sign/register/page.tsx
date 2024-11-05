'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'

export default function Signup() {
    const [name, setName] = useState('');
    const [hak, setHak] = useState('');
    const [email, setEmail] = useState('');
    const [id, setID] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRePassword] = useState('');

    const router = useRouter();

    const data = {
        name: name,
        hak: hak,
        email: email,
        id: id,
        password: password
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        if(passwordSame(password, repassword)){
            postData();
        }else{
            alert("비밀번호가 다릅니다.")
        }
    };

    const passwordSame = (a: string, b: string) => {
        return (a == b);
    }

    const postData = async() => {
        try{
            const response = await axios.post("https://cd-api.chals.kim/api/test/post", data);
            console.log(response.data);
        } catch(err){
            alert('error test 3');
        }
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
                <h1 style={{ textAlign: 'center' }}>회원가입</h1>
                <form onSubmit={handleSignup}>
                    <div style={{ margin: '10px 30px', padding: '10px' }}>
                        <label htmlFor="name" style={{ display: 'block' }}>이름</label>
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
                        <label htmlFor="name" style={{ display: 'block' }}>학번</label>
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
                        <label htmlFor="name" style={{ display: 'block' }}>이메일</label>
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
                        <label htmlFor="name" style={{ display: 'block' }}>아이디</label>
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
                        <label htmlFor="password" style={{ display: 'block' }}>비밀번호</label>
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
                        <label htmlFor="password" style={{ display: 'block' }}>비밀번호 재입력</label>
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
                        <button onClick={gotoSignUp} style={{ padding: '10px', width: '25%' }}>첫 페이지</button>
                        <button type="submit" style={{ width: '25%', padding: '10px' }}>회원가입</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
