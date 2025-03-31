'use client'

import headers from '@/app/json/user.json'
import { UserConfigBtn } from './Modal';
import { useEffect, useState } from 'react';
import axios from 'axios';

type userList = {
  univ_id: number,
  role: string,
  name: string,
  permission: string
}

type returnType = {
  RESULT_CODE: number,
  RESULT_MSG: string,
  PAYLOADS: userList[]
}

const UserDataTable = ({ p_id }: { p_id: any }) => {
  const [user, setUser] = useState<userList[]>([]);

  const data = { pid: p_id }

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const response = await axios.post<returnType>(
        "https://cd-api.chals.kim/api/project/checkuser",
        data,
        {
          headers: { Authorization: process.env.SECRET_API_KEY }
        }
      );
      setUser(response.data.PAYLOADS);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <table style={{
      border: '2px solid #ddd',  // 부드러운 경계선
      width: '100%',
      fontSize: '16px',
      borderCollapse: 'collapse',
      backgroundColor: '#f7f8fa', // 배경에 맞는 부드러운 색상
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // 그림자 효과로 입체감 추가
    }}>
      <thead style={{
        backgroundColor: '#4CAF50', // 메인 색상에 맞는 배경
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        height: '60px',
      }}>
        <tr>
          {headers.Header.map((Item) => (
            <th key={Item.text} style={{
              padding: '12px 16px',
              border: '1px solid #ddd',
              textTransform: 'uppercase',
              fontSize: '16px',
              backgroundColor: '#388E3C', // 헤더 배경을 더 짙은 색상
              letterSpacing: '1px',
            }}>
              {Item.text}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {user.map((Item) => (
          <tr key={Item.univ_id} style={{
            textAlign: 'center',
            height: '60px',
            borderBottom: '1px solid #ddd',
            backgroundColor: Item.permission ? '#e8f5e9' : '#ffffff',  // 배경에 맞는 색상 설정
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f1f1'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = Item.permission ? '#e8f5e9' : '#ffffff'}>
            
            <td>{Item.name}</td>
            <td>{Item.univ_id}</td>
            <td>{Item.role}</td>
            <td>
              <span style={{
                display: 'inline-block',
                padding: '5px 12px',
                borderRadius: '12px',
                background: Item.permission ? 'linear-gradient(135deg, #FF8A00, #FF4500)' : 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // 버튼 그림자
              }}>
                {Item.permission ? '팀장' : '팀원'}
              </span>
            </td>
            <td>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <UserConfigBtn input={Item} pid={p_id} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
    
    
  )
}

export default UserDataTable;


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

type pidType = {
    pid: string
}