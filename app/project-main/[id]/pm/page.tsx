'use client'
import LLMManagement from '@/app/components/LLMManagement'
import MainHeader from '@/app/components/MainHeader'
import MainSide from '@/app/components/MainSide'
import PJDelBtn from '@/app/components/ProjectDeleteBtn'
import { getUnivId } from '@/app/util/storage'
import usePermissionGuard from '@/app/util/usePermissionGuard'
import { useState, useEffect } from 'react'


export default function ProjectManage(props: any){
    const s_no = getUnivId()
    const [page, setPage] = useState(0);

    usePermissionGuard(props.params.id, s_no, {leader: 1}, true)

    const pageList = ['수정 및 삭제', 'import / export']

    useEffect(() => {
        if(page === 1){

        }
    }, [page])

    

    return(
        <div>
            {/*메인 헤더*/}
            <MainHeader pid = {props.params.id}/>

            {/*body*/}
            <div style={{display: 'flex'}}> 

                {/*왼쪽 사이드*/}
                <MainSide pid = {props.params.id}/>

                {/*메인 페이지*/}
                <div style={{height: 'calc(100vh - 105px)', width: 'calc(90% - 200px)', display: 'flex', flexDirection: 'column', margin: '0', float: 'left'}}>
                    <div style={{display: 'flex', width: '70%', margin: '5% auto', marginBottom: '0px'}}>
                        {pageList.map((menu, index) => (
                            <div key={index} style={{
                                position: "relative",
                                minWidth: "120px",
                                height: "36px",
                                backgroundColor: "#fff",
                                border: "1px solid #d1d5db",
                                borderBottom: 'none',
                                borderRadius: "12px 12px 0 0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                flex: "0 0 auto",
                                padding: "0 12px",
                                transition: "all 0.3s ease-in-out",
                                // fontWeight: (page === index) ? "bold" : "normal",
                                // color: (page === index) ? "#2563eb" : "#000"
                            }}>
                                <button onClick={() => setPage(index)} style={{
                                    border: 'none',
                                    fontWeight: (page === index) ? "bold" : "normal",
                                    color: (page === index) ? "#2563eb" : "#000",
                                    backgroundColor: "#fff",
                                    fontSize: '15px'
                                    }}>
                                    {menu}
                                </button>
                            </div>
                        ))}
                    </div>
                    {(() => {
                        switch (page) {
                            case 0:
                                return (
                                    <div><PJDelBtn pid = {props.params.id}/></div>
                                )
                            case 1:
                                return (
                                    <div>2</div>
                                )
                            default:
                                return (
                                    <div>default</div>
                                )
                        }
                    })()}
                    
                </div>
            </div>
        </div>
    )
}