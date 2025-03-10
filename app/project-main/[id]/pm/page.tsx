'use client'
import LLMManagement from '@/app/components/LLMManagement'
import MainHeader from '@/app/components/MainHeader'
import MainSide from '@/app/components/MainSide'
import PJDelBtn from '@/app/components/ProjectDeleteBtn'
import { getUnivId } from '@/app/util/storage'
import usePermissionGuard from '@/app/util/usePermissionGuard'
import { useState } from 'react'


export default function ProjectManage(props: any){
    const s_no = getUnivId()

    usePermissionGuard(props.params.id, s_no, {leader: 1}, true)


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
                    <LLMManagement pid = {props.params.id}/>
                    <PJDelBtn pid = {props.params.id}/>
                </div>
            </div>
        </div>
    )
}