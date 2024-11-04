'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { json } from 'stream/consumers';

const MainSide = () => {
    const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
    const [selectedButton, setSelectedButton] = useState<{ index: number; subIndex: number | null } | null>(null);


    const router = useRouter();

    const subMenu = [['메인화면', null, null],
                      ['WBS 관리', '유저 관리', null],
                      ['개요서', '회의록', '서비스 테스트'],
                      ['산출물 관리', null, null],
                      ['업무 관리', null, null]];

    const mainMenu = ['메인화면', '프로젝트 관리', '산출물 작성', '산출물 관리', '업무관리'];

    const handleToggle = (index: number) => {
        setVisibleIndex(visibleIndex === index ? null : index);
        setSelectedButton({ index, subIndex: null });
    };

    const gotoMenu = (index: number, subIndex: number) => {
        return console.log(subMenu[index][subIndex]);
        setSelectedButton({ index, subIndex: null });
    };

    

    return (
        <div style={{margin: '0px 100px 0', display: 'relative', justifyContent: 'center', alignItems: 'center', width: '200px', backgroundColor: '#D3D3D3', height: 'calc(100vh - 105px)'}}>
            {[0, 1, 2, 3, 4].map((index: number) => (
                <div key={index} style={{ margin: '0' }}>
                    <button onClick={() => handleToggle(index)} style={{ padding: '10px', width: '100%', border: '1px solid #000000',backgroundColor: selectedButton?.index === index && selectedButton?.subIndex === null ? '#6F5FFF' : '#ffffff' }}>
                        {mainMenu[index]}
                    </button>
                    {visibleIndex === index && (
                        <div style={{ margin: '0px 0 0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column', backgroundColor: '#E9E9E9', width: '99%', border: '1px solid #000000'}}>
                            {[0, 1, 2].map((subIndex) => (
                                subMenu[index][subIndex] !== null && (
                                    <div key={subIndex} style={{width: '100%', borderBottom: '1px solid #000000'}}>
                                        <button onClick={() => gotoMenu(index, subIndex)} style={{margin: '0px 0 0', width: '100%', height: '40px'}}>
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