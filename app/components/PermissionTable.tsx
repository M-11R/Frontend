'use client'

import { useState } from "react";

type permissionList = {
    pid: number
    univ_id: number
    user: number
    wbs: number
    od: number
    mm: number
    ut: number
    rs: number
    rp: number
    om: number
    task: number
    llm: number
}

const PermissionTable = ({pid}: {pid: number}) => {
    const [permissions, setPermissions] = useState<Record<string, number>>({
        'WBS': 0,
        '개요서': 0,
        '회의록': 0,
        '테스트케이스': 0,
        '요구사항 명세서': 0,
        '보고서': 0,
        '기타 산출물': 0,
        '업무': 0,
        "LLM": 0
    })
    const permissionLable: Record<number, string> = {
        0: '권한 없음',
        1: '읽기',
        2: '읽기 + 쓰기'
    };
    const handleClick = (key: string) => {
        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            [key]: (prevPermissions[key] + 1) % 3,
        }));
    };
    
}
export default PermissionTable;