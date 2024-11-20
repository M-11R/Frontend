'use client';

import { useState } from 'react';
import axios from 'axios'
import mb from '@/app/json/msBox.json'

type inputType = {
    ID: string,
    name : string,
    permision: string,
    email: string,
    role: string,
    hak: number
}

export function Modal({ isOpen, closeModal, children }: { isOpen: boolean; closeModal: () => void; children?: React.ReactNode }) {
    return (
        isOpen && (
        <div style={{position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <div style={{background: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px #000000', maxWidth: '500px', width: '100%'}}>
                <div style={{width: '100%', display: 'flex'}}><div style={{marginLeft: 'auto'}}><button onClick={closeModal} style={{fontSize: '15px'}}>{mb.modal.exitbtn.value}</button></div></div>
                {children}
            </div>
        </div>
        )
    );
}

export function UserConfigBtn({input}: {input: inputType}) {
    const [isOpen, setIsOpen] = useState(false);
    const [id, setId] = useState(input.ID);
    const [name, setName] = useState(input.name);
    const [permision, setPer] = useState(input.permision);
    const [email, setEmail] = useState(input.email);
    const [role, setRole] = useState(input.role);
    const [hak, setHak] = useState(input.hak);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const data = {
        id: id,
        name: name,
        permision: permision,
        email: email,
        role: role,
        hak: hak
    };

    const handleConfigUser = (e: React.FormEvent) => {
        e.preventDefault();
        if(id === '' || name === '' || permision === '' || email === '' || role === ''){
            alert(mb.modal.nullinfo.value)
        }else{
            postData();
            closeModal();
        }
        console.log(data);
    };

    const postData = async() => {
        try{
            const response = await axios.post("https://cd-api.chals.kim/api/test/post", data);
            console.log(response.data);
        } catch(err){
            alert('error');
        }
        
    };

    return (
        <div>
            <button onClick={openModal} style={{fontSize: '15px'}}>{mb.modal.fixinfobtn.value}</button>
            <Modal isOpen={isOpen} closeModal={closeModal}>
                <div style={{fontSize: '32px', paddingBottom: '20px'}}>{mb.modal.fixinfotitle.value}</div>
                <form onSubmit={handleConfigUser} style={{fontSize: '18px'}}>
                    <div style={{padding: '15px'}}>
                        <span style={{padding: '10px'}}>{mb.user.id.value}</span>
                        <input 
                            type="text" 
                            value={id} 
                            onChange={(e) => setId(e.target.value)}
                            placeholder={`${input.ID}`}
                            style={{width: '170px', height: '20px'}}
                        />
                    </div>
                    <div style={{padding: '15px'}}>
                        <span style={{padding: '10px'}}>{mb.user.name.value}</span>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            placeholder={`${input.name}`}
                            style={{width: '170px', height: '20px'}}
                        />
                    </div>
                    <div style={{padding: '15px'}}>
                        <span style={{padding: '10px'}}>{mb.user.per.value}</span>
                        <input 
                            type="text" 
                            value={permision} 
                            onChange={(e) => setPer(e.target.value)}
                            placeholder={`${input.permision}`}
                            style={{width: '170px', height: '20px'}}
                        />
                    </div>
                    <div style={{padding: '15px'}}>
                        <span style={{padding: '10px'}}>{mb.user.email.value}</span>
                        <input 
                            type="text" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={`${input.email}`}
                            style={{width: '170px', height: '20px'}}
                        />
                    </div>
                    <div style={{padding: '15px'}}>
                        <span style={{padding: '10px'}}>{mb.user.role.value}</span>
                        <input 
                            type="text" 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                            placeholder={`${input.role}`}
                            style={{width: '170px', height: '20px'}}
                        />
                    </div>
                    <div style={{width: '100%', display: 'flex'}}><div style={{marginLeft: 'auto'}}><button type='submit' style={{fontSize: '15px'}}>{mb.modal.configbtn.value}</button></div></div>
                </form>
            </Modal>
        </div>
    );
}

export function AddUser() {
    const [isOpen, setIsOpen] = useState(false);
    const [hak, setHak] = useState("");
    const [role, setRole] = useState("");

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const data = {
        hak: hak,
        role: role
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if(hak === "" || role === ""){
            alert(mb.modal.nullinfo.value)
            
        }else{
            postData();
            setHak("");
            setRole("");
            closeModal();
        }
    };

    const postData = async() => {
        try{
            const response = await axios.post("https://cd-api.chals.kim/api/test/post", data);
            console.log(response.data);
        } catch(err){
            alert('error');
        }
        
    };

    return (
        <div>
            <button onClick={openModal} style={{fontSize: '15px'}}>{mb.modal.adduserbtn.value}</button>
            <Modal isOpen={isOpen} closeModal={closeModal}>
                <div style={{fontSize: '32px', paddingBottom: '20px'}}>{mb.modal.addusertitle.value}</div>
                <form onSubmit={handleAddUser} style={{fontSize: '18px'}}>
                    <div style={{padding: '15px'}}>
                        <span style={{padding: '10px'}}>{mb.user.hak.value}</span>
                        <input 
                            type="text" 
                            value={hak} 
                            onChange={(e) => setHak(e.target.value)}
                            style={{width: '170px', height: '20px'}}
                        />
                    </div>
                    <div style={{padding: '15px'}}>
                        <span style={{padding: '10px'}}>{mb.user.role.value}</span>
                        <input 
                            type="text"  
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{width: '170px', height: '20px'}}
                        />
                    </div>
                    <div style={{width: '100%', display: 'flex'}}><div style={{marginLeft: 'auto'}}><button type='submit' style={{fontSize: '15px'}}>{mb.modal.configbtn.value}</button></div></div>
                </form>
                <div>test onChagne 1.15</div>
                
            </Modal>
        </div>
    );
}