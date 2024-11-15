'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import todojson from '../json/test.json'


const MainSide = ({qwe}: {qwe: string}) => {
    const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
    const [selectedButton, setSelectedButton] = useState<{ index: number; subIndex: number | null } | null>(null);
    const router = useRouter();

    useEffect(() => {
        console.log("asd");
        const checkPage = todojson.pjlist.some((pjlist) => pjlist.Pname === qwe);
        if (!checkPage){
            router.push('/');
        }
    }, [qwe, router]);

    const subMenu = [['메인화면', null, null],
                      ['WBS 관리', '유저 관리', null],
                      ['개요서', '회의록', '서비스 테스트'],
                      ['산출물 관리', null, null],
                      ['업무 관리', null, null]];

    const mainMenu = ['메인화면', '프로젝트 관리', '산출물 작성', '산출물 관리', '업무관리'];
    const routDefault = `/project-main/${qwe}/main`
    const routMenu = [[`/project-main/${qwe}/main`, '/', '/'],
                        [`/project-main/${qwe}/projectMg/main`, `/project-main/${qwe}/project-management/user`, '/'],
                        [routDefault, routDefault, routDefault],
                        [routDefault, '/', '/'],
                        [routDefault, '/', '/']];

    const handleToggle = (index: number) => {
        setVisibleIndex(visibleIndex === index ? null : index);
        setSelectedButton({ index, subIndex: null });
        
    };

    const gotoMenu = (index: number, subIndex: number) => {
        router.push(routMenu[index][subIndex]);
    };

    const test = () => {
        console.log("asd");
    };

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
                    <button onClick={() => handleToggle(index)} style={{ padding: '10px', width: '100%', border: '1px solid #000000',backgroundColor: selectedButton?.index === index && selectedButton?.subIndex === null ? '#6F5FFF' : '#ffffff', fontSize: '15px' }}>
                        {mainMenu[index]}
                    </button>
                    {visibleIndex === index && (
                        <div style={{ margin: '0px 0 0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column', backgroundColor: '#E9E9E9', width: '99%', border: '1px solid #000000'}}>
                            {[0, 1, 2].map((subIndex) => (
                                subMenu[index][subIndex] !== null && (
                                    <div key={subIndex} style={{width: '100%', borderBottom: '1px solid #000000'}}>
                                        <button onClick={() => gotoMenu(index, subIndex)} style={{margin: '0px 0 0', width: '100%', height: '40px', fontSize: '15px'}}>
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