'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import todojson from '@/app/json/test.json'
import msBox from '@/app/json/msBox.json'
import { getUserId, getToken, getUnivId } from '../util/storage';
import axios from 'axios';

type returnType = {
    "RESULT_CODE": number
    "RESULT_MSG": string
    "PAYLOADS": payload[]
}
type payload = {
    "univ_id": number
    "role": string
    "name": string
    "permission": string
}
const MainSide = ({pid}: {pid: number}) => {
    const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
    const [selectedButton, setSelectedButton] = useState<{ index: number; subIndex: number | null } | null>(null);
    const router = useRouter();

    useEffect(() => {
        // const checkPage = todojson.pjlist.some((pjlist) => pjlist.Pname === qwe);
        // if (!checkPage){
        //     console.log("404 Not found page : ", qwe)
        //     router.push('/');
        //     return;
        // }
        // checkUser();
        if (pid === undefined){
            
        }
    }, [pid, router]);

    const subMenu = [[msBox.subMenu.main.value, null, null, null, null, null],
                      [msBox.subMenu.wbs.value, msBox.subMenu.usermanage.value, null, null, null, null],
                      [msBox.subMenu.overview.value, msBox.subMenu.minutes.value, msBox.subMenu.test.value, msBox.subMenu.srs.value, msBox.subMenu.report.value, msBox.subMenu.etc.value],
                      [msBox.subMenu.outmanage.value, null, null, null, null, null],
                      [msBox.subMenu.task.value, null, null, null, null, null]];

    const mainMenu = [msBox.mainMenu.main.value, msBox.mainMenu.pjmanage.value, msBox.mainMenu.outcreate.value, msBox.mainMenu.outmanage.value, msBox.mainMenu.taskmanage.value];
    const routDefault = `/project-main/${pid}/main`
    const routMenu = [[`/project-main/${pid}/main`, '/', '/', '/', '/', '/'],
                        [`/project-main/${pid}/wbsmanager`, `/project-main/${pid}/project-management/user`, '/', '/', '/', '/'],
                        [`/project-main/${pid}/overview`,`/project-main/${pid}/minutes`,`/project-main/${pid}/servicetest`,`/project-main/${pid}/Requirements`,`/project-main/${pid}/Report`, `/project-main/${pid}/output/create`],
                        [`/project-main/${pid}/outputManagement`, '/', '/', '/', '/', '/'],
                        [`/project-main/${pid}/task`, '/', '/', '/', '/', '/']];

    const handleToggle = (index: number) => {
        setVisibleIndex(visibleIndex === index ? null : index);
        setSelectedButton({ index, subIndex: null });
        
    };

    const gotoMenu = (index: number, subIndex: number) => {
        router.push(routMenu[index][subIndex]);
    };

    const checkUser = async() => {
        const secData = {user_id: getUserId(), token: getToken()}
        const userData = {pid: pid}
        const tmpUnivId = getUnivId();
        const [bool, setBool] = useState(false);
        if(getUserId === null || getToken() === null || tmpUnivId === null){
            router.push('/');
            return;
        }
        try{ // 세션 확인
            const response = await axios.post("https://cd-api.chals.kim/api/acc/checksession", secData, {headers:{Authorization: process.env.SECRET_API_KEY}});
            try{ // 유저 확인
                const response = await axios.post<returnType>("https://cd-api.chals.kim/api/project/checkuser", userData, {headers:{Authorization: process.env.SECRET_API_KEY}});
                response.data.PAYLOADS.forEach((item) => {
                    if(item.univ_id === tmpUnivId){
                        setBool(true);
                    }
                })
                if(bool === false){
                    router.push('/')
                }
            }catch(err){

            }
        }catch(err){
            router.push('/');
            alert("로그아웃 후 다시 로그인 해주세요.")
        }
    }
    return (
        <div style={{marginLeft: '100px', display: 'relative', justifyContent: 'center', alignItems: 'center', width: '200px', backgroundColor: '#D3D3D3', height: 'calc(100vh - 105px)'}}>
            {/*미니 Todo List*/}
            <div style={{height: '150px', width: '99%', backgroundColor: '#F9D984', border: '1px solid #000000', fontSize: '15px'}}>
                <span>To-Do List</span>
                <div style={{height: 'calc(100% - 20px)', position: 'relative'}}>
                    {todojson.test.map((item) => (
                        <div key={item.Tid} style={{position: 'absolute', bottom: '5px'}}>
                            <div>마감 기한 : {item.Tdate}</div>
                            <div>{item.Tstring}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/*메뉴 바*/}
            {[0, 1, 2, 3, 4].map((index: number) => (
                <div key={index} style={{ margin: '0' }}>
                    <button 
                        onClick={() => handleToggle(index)} 
                        style={{ 
                            padding: '10px', width: '100%', border: '1px solid #000000',
                            backgroundColor: selectedButton?.index === index && selectedButton?.subIndex === null ? '#6F5FFF' : '#ffffff',
                            color: selectedButton?.index === index && selectedButton?.subIndex === null ? '#ffffff' : '#000000', 
                            fontSize: '15px' }}>
                        {mainMenu[index]}
                    </button>
                    {visibleIndex === index && (
                        <div style={{ margin: '0px 0 0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column', backgroundColor: '#E9E9E9', width: '99%', border: '1px solid #000000'}}>
                            {[0, 1, 2, 3, 4, 5].map((subIndex) => (
                                subMenu[index][subIndex] !== null && (
                                    <div key={subIndex} style={{width: '100%', borderBottom: '1px solid #000000'}}>
                                        <button onClick={() => gotoMenu(index, subIndex)} style={{margin: '0px 0 0', width: '100%', height: '40px', fontSize: '15px', border: '0'}}>
                                            {subMenu[index][subIndex]}
                                        </button>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MainSide