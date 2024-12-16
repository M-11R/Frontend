"use client";

import Image from 'next/image'
import ico from '../img/logo.png'
import mb from '@/app/json/msBox.json'
import Link from 'next/link';

const jinchek = (a: number) =>{
    return (<div style={{position: 'relative', right: '0px', top: '0px'}}>
        <span>{mb.header.jinchuk.value}{a}</span>
        <div style={{width: '800px', height: '30px', border: '1px solid #000'}}>
            <div style={{ width: a+'%', height: '100%', backgroundColor: 'green' }}></div>
        </div>
      </div>);
};

const MainHeader = ({pid}: {pid:  number}) =>(
    <div style={{ margin: '0px 100px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '90%', borderBottom: 'solid' }}>
            <Link href='/'><Image src={ico} alt="Left Image" style={{ width: '100px', height: '100px', bottom: '0' }} /></Link>
            {/* 테스트용 페이지 이름 */}
            <div style={{position: 'relative', right: '0px', top: '20px'}}>
              {jinchek(30)}
            </div>
      </div>
);

export default MainHeader;