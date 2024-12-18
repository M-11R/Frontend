'use client';

import { useState, useEffect } from 'react';
import axios from 'axios'
import mb from '@/app/json/msBox.json'
import { getUnivId } from '@/app/util/storage';
import { useRouter } from 'next/navigation';

type inputType = {
    "univ_id": number,
    "role": string,
    "permission": string
}
type addUserType  ={
    pid: number
    univ_id: number
    role: string
}
type pmType = {
    pid: number,
    univ_id: number
}
type returnType = {
    "RESULT_CODE": number,
    "RESULT_MSG": string
}
type taskType = {
    tname: string
    tperson: string
    tstart: string
    tend: string
    pid: number
    univ_id: number
}
type Student = {
    id: string;
    name: string;
};
type userList = {
    "univ_id": number,
    "role": string,
    "name": string,
    "permission": string
}
type returnUserType = {
    "RESULT_CODE": number,
    "RESULT_MSG": string,
    "PAYLOADS": userList[]
}
type inputTaskType = {
    p_no: number
    s_no: number
    w_checked: boolean
    w_end: string
    w_name: string
    w_no: number
    w_person: string
    w_start: string
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

export function UserConfigBtn({input, pid}: {input: inputType, pid: number}) {
    const [isOpen, setIsOpen] = useState(false);
    const [permision, setPer] = useState(input.permission);
    const [role, setRole] = useState(input.role);
    const [hak, setHak] = useState(input.univ_id);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const data = {
        univ_id: hak,
        pid: pid,
        role: role
    };

    useEffect(() => {
        if(isOpen === true){
            checkPm();
        }
    }, [isOpen])

    const checkPm = async() => {
        const postData: pmType = {
            pid: pid,
            univ_id: getUnivId()
        }
        try{
            const response = await axios.post<returnType>("https://cd-api.chals.kim/api/project/checkpm", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
            if(response.data.RESULT_CODE !== 200){
                closeModal();
                alert("권한이 없습니다.");
            }
        }catch(err){
            closeModal();
            alert("권한이 없습니다.");
        }
    }

    const handleConfigUser = (e: React.FormEvent) => {
        e.preventDefault();
        if(permision === '' || role === ''){
            alert(mb.modal.nullinfo.value)
        }else{
            postData();
            closeModal();
        }
        console.log(data);
    };

    const postData = async() => {
        try{
            const response = await axios.post("https://cd-api.chals.kim/api/project/edituser", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
            
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
                        <span style={{padding: '10px'}}>{mb.user.per.value}</span>
                        <input 
                            type="text" 
                            value={permision} 
                            onChange={(e) => setPer(e.target.value)}
                            placeholder={`${input.permission}`}
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

export function AddUser({p_id}: {p_id: number}) {
    const [isOpen, setIsOpen] = useState(false);
    const [hak, setHak] = useState(0);
    const [role, setRole] = useState("");

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const data:addUserType = {
        pid: p_id,
        univ_id: hak,
        role: role
    };

    useEffect(() => {
        if(isOpen === true){
            checkPm();
        }
    }, [isOpen])

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if(hak === 0 || role === ""){
            alert(mb.modal.nullinfo.value)
            
        }else{
            postData();
            setHak(0);
            setRole("");
            closeModal();
        }
    };

    const postData = async() => {
        try{
            const response = await axios.post<returnType>("https://cd-api.chals.kim/api/project/adduser", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
        } catch(err){
            alert('error');
        }
        
    };

    const checkPm = async() => {
        const postData: pmType = {
            pid: p_id,
            univ_id: getUnivId()
        }
        try{
            const response = await axios.post<returnType>("https://cd-api.chals.kim/api/project/checkpm", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
            if(response.data.RESULT_CODE !== 200){
                closeModal();
                alert("권한이 없습니다.");
            }
        }catch(err){
            closeModal();
            alert("권한이 없습니다.");
        }
    }

    return (
        <div>
            <button onClick={openModal} style={{fontSize: '15px'}}>{mb.modal.adduserbtn.value}</button>
            <Modal isOpen={isOpen} closeModal={closeModal}>
                <div style={{fontSize: '32px', paddingBottom: '20px'}}>{mb.modal.addusertitle.value}</div>
                <form onSubmit={handleAddUser} style={{fontSize: '18px'}}>
                    <div style={{padding: '15px'}}>
                        <span style={{padding: '10px'}}>{mb.user.hak.value}</span>
                        <input 
                            type="number" 
                            value={hak} 
                            onChange={(e) => setHak(e.target.valueAsNumber)}
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
                
            </Modal>
        </div>
    );
}

export function AddTask({p_id}: {p_id: number}){
    const [selectedStudent, setSelectedStudent] = useState<userList | null>(null);
    const [user, setUser] = useState<userList[]>([]);
    const [taskName, setTName] = useState("");
    const [name, setName] = useState("");
    const [startDate, setStart] = useState("");
    const [endDate, setEnd] = useState("");
    const [hak, setHak] = useState(0);
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const tmpData: taskType = {
        tname: taskName,
        tperson: name,
        tstart: startDate,
        tend: endDate,
        pid: p_id,
        univ_id: hak
    }

    useEffect(() => {
        getData();
    }, [])

    const fixDate = (date: string) => {
        const rawValue = date;
        const formatted = rawValue.replace(/-/g, '').slice(2);
        return formatted;
    }
    
    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if(startDate === "" || endDate === "" || taskName === "" || hak === 0){
            alert(mb.modal.nullinfo.value)
            
        }else{
            postData();
            setTName("")
            setStart("")
            setEnd("")
            setHak(0)
            setName("")
            closeModal();
            
            router.refresh();
        }
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const student = user.find((item) => item.name === event.target.value);
        if (student) {
            setSelectedStudent(student);
            setName(student.name)
            setHak(student.univ_id)
        }
    };

    const postData = async() => {
        const data = tmpData;
        // data.tstart = fixDate(tmpData.tstart);
        // data.tend = fixDate(tmpData.tend);
        try{
            const response = await axios.post<returnType>("https://cd-api.chals.kim/api/task/add", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
        } catch(err){
            alert('error');
        }
        
    };

    const getData = async() => {
        try{
            const response = await axios.post<returnUserType>("https://cd-api.chals.kim/api/project/checkuser", {pid: p_id}, {headers:{Authorization: process.env.SECRET_API_KEY}});
            setUser(response.data.PAYLOADS);
        }catch(err){

        }
    }

    return(
        <div>
            <button onClick={openModal} style={{fontSize: '15px'}}>{mb.task.tBtn.value}</button>
            <Modal isOpen={isOpen} closeModal={closeModal}>
                <div style={{fontSize: '32px', paddingBottom: '20px'}}>업무 추가</div>
                <form onSubmit={handleAddTask} style={{fontSize: '18px'}}>
                    <div style={{padding: '15px'}}>
                        <span style={{padding: '10px'}}>할일 제목</span>
                        <input 
                            type="text" 
                            value={taskName} 
                            onChange={(e) => setTName(e.target.value)}
                            style={{width: '170px', height: '20px'}}
                        />
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <label htmlFor="student-select" style={{padding: '10px', marginLeft: 'auto'}}>학생 선택 </label>
                        <select
                            id="student-select"
                            onChange={handleSelectChange}
                            style={{ display: "block", width: "170px", margin: "10px 0", padding: "5px", marginRight: 'auto'}}
                        >
                            <option value="">이름을 선택하세요</option>
                            {user.map((student) => (
                                <option key={student.name} value={student.name}>
                                    {student.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <label htmlFor="student-id" style={{padding: '10px', marginLeft: 'auto'}}>학번:</label>
                        <input
                            type="text"
                            id="student-id"
                            value={hak || ""}
                            readOnly
                            style={{ display: "block", width: "170px", margin: "10px 0", padding: "5px", marginRight: 'auto' }}
                        />
                    </div>
                    <div style={{padding: '15px'}}>
                        <span style={{padding: '10px'}}>시작일</span>
                        <input 
                            type="date"  
                            value={startDate}
                            onChange={(e) => setStart(e.target.value)}
                            style={{width: '170px', height: '20px'}}
                        />
                    </div>
                    <div style={{padding: '15px'}}>
                        <span style={{padding: '10px'}}>종료일</span>
                        <input 
                            type="date"  
                            value={endDate}
                            onChange={(e) => setEnd(e.target.value)}
                            style={{width: '170px', height: '20px'}}
                        />
                    </div>
                    <div style={{width: '100%', display: 'flex'}}><div style={{marginLeft: 'auto'}}><button type='submit' style={{fontSize: '15px'}}>{mb.modal.configbtn.value}</button></div></div>
                </form>
                
            </Modal>
        </div>
    );
}

export function ConfigTask({data, p_id}: {data: inputTaskType, p_id: number}){
    const [selectedStudent, setSelectedStudent] = useState<userList | null>(null);
    const [user, setUser] = useState<userList[]>([]);
    const [taskName, setTaskName] = useState(data.w_name);
    const [taskId, setTaskId] = useState(data.w_no);
    const [person, setPerson] = useState(data.w_person);
    const [start, setStart] = useState(data.w_start);
    const [end, setEnd] = useState(data.w_end);
    const [finish, setFinish] = useState(data.w_checked);
    const [univId, setUnivId] = useState(data.s_no);
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    // const router = useRouter();
    type postType = {
        tname: string
        tperson: string
        tstart: string
        tend: string
        tfinish: boolean
        univ_id: number
        tid: number
    }
    useEffect(() => {
        getData();
    },[])
    const fixDate = (date: string) => {
        const rawValue = date;
        const formatted = rawValue.replace(/-/g, '').slice(2);
        return formatted;
    }
    const postData: postType = {
        tname: taskName,
        tperson: person,
        tstart: start,
        tend: end,
        tfinish: finish,
        univ_id: univId,
        tid: taskId
    }
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const student = user.find((item) => item.name === event.target.value);
        if (student) {
            setSelectedStudent(student);
            setPerson(student.name)
            setUnivId(student.univ_id)
        }
    };
    const handleFixTask = (e: React.FormEvent) => {
        e.preventDefault();
        if(start === "" || end === "" || taskName === "" || univId === 0){
            alert(mb.modal.nullinfo.value)
        }else(
            fixTask()
            
        )
    };
    const fixTask = async() => {
        try{
            const response = await axios.post<postType>("https://cd-api.chals.kim/api/task/edit", postData, {headers:{Authorization: process.env.SECRET_API_KEY}});
        }catch(err){

        }finally{
            closeModal();
            // router.replace(router.asPath)
        }
    }
    const getData = async() => {
        try{
            const response = await axios.post<returnUserType>("https://cd-api.chals.kim/api/project/checkuser", {pid: p_id}, {headers:{Authorization: process.env.SECRET_API_KEY}});
            setUser(response.data.PAYLOADS);
        }catch(err){

        }
    }
    return(
        <div>
            <button onClick={openModal} style={{fontSize: '15px', border: '0', background: '0'}}>업무 수정</button>
            <Modal isOpen={isOpen} closeModal={closeModal}>
                <div style={{fontSize: '32px', paddingBottom: '20px'}}>업무 수정.</div>
                <form onSubmit={handleFixTask} style={{fontSize: '18px'}}>
                    <div style={{padding: '15px'}}>
                        <span style={{padding: '10px'}}>할일 제목</span>
                        <input 
                            type="text" 
                            value={taskName} 
                            onChange={(e) => setTaskName(e.target.value)}
                            style={{width: '170px', height: '20px'}}
                        />
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <label htmlFor="student-select" style={{padding: '10px', marginLeft: 'auto'}}>학생 선택 </label>
                        <select
                            id="student-select"
                            onChange={handleSelectChange}
                            style={{ display: "block", width: "170px", margin: "10px 0", padding: "5px", marginRight: 'auto'}}
                        >
                            <option value="">이름을 선택하세요</option>
                            {user.map((student) => (
                                <option key={student.name} value={student.name}>
                                    {student.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <label htmlFor="student-id" style={{padding: '10px', marginLeft: 'auto'}}>학번:</label>
                        <input
                            type="text"
                            id="student-id"
                            value={univId || ""}
                            readOnly
                            style={{ display: "block", width: "170px", margin: "10px 0", padding: "5px", marginRight: 'auto' }}
                        />
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <label htmlFor="student-id" style={{padding: '10px', marginLeft: 'auto'}}>이름:</label>
                        <input
                            type="text"
                            id="student-name"
                            value={person || ""}
                            readOnly
                            style={{ display: "block", width: "170px", margin: "10px 0", padding: "5px", marginRight: 'auto' }}
                        />
                    </div>
                    <div style={{padding: '15px'}}>
                        <span style={{padding: '10px'}}>시작일</span>
                        <input 
                            type="date"  
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            style={{width: '170px', height: '20px'}}
                        />
                    </div>
                    <div style={{padding: '15px'}}>
                        <span style={{padding: '10px'}}>종료일</span>
                        <input 
                            type="date"  
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            style={{width: '170px', height: '20px'}}
                        />
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <label htmlFor="student-select" style={{padding: '10px', marginLeft: 'auto'}}>완료 여부</label>
                        <input
                            type="checkbox"
                            id="checkbox"
                            checked={finish}
                            onChange={(e) => setFinish(e.target.checked)}
                        />
                    </div>
                    <div style={{width: '100%', display: 'flex'}}><div style={{marginLeft: 'auto'}}><button type='submit' style={{fontSize: '15px'}}>{mb.modal.configbtn.value}</button></div></div>
                </form>
                
            </Modal>
        </div>
    );
}