'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import MainHeader from '@/app/components/MainHeader';
import MainSide from '@/app/components/MainSide';
import { getUnivId } from '@/app/util/storage';
import usePermissionGuard from "@/app/util/usePermissionGuard";

type returnType = {
  RESULT_CODE: number;
  RESULT_MSG: string;
  PAYLOADS: {
    file_unique_id: any;
    file_name: any;
    file_path: any;
  };
};

interface CreateProps {
  params: { id: number };
}

export default function Create(props: CreateProps) {
  const [tmpfile, setFile] = useState<File[]>([]);
  const router = useRouter();
  const s_no = getUnivId();
  usePermissionGuard(props.params.id, s_no, { leader: 1, om: 1 }, true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (tmpfile.length === 0) {
      alert('📂 파일을 선택해주세요.');
      return;
    }
    const tmppid: number = props.params.id;
    const tmpunivid = getUnivId();
    const formData = new FormData();
    tmpfile.forEach((file: File) => {
      formData.append('files', file);
    });
    formData.append('pid', tmppid.toString());
    formData.append('univ_id', tmpunivid.toString());

    try {
      const response = await axios.post<returnType>(
        'https://cd-api.chals.kim/api/output/otherdoc_add',
        formData,
        { headers: { Authorization: process.env.SECRET_API_KEY } }
      );

      if (response.data.RESULT_CODE === 200) {
        router.push(`/project-main/${props.params.id}/outputManagement`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`❌ 업로드 실패: ${err.message}`);
      } else if (err && (err as { response?: { data: { RESULT_MSG: string } } }).response) {
        alert(`❌ 업로드 실패: ${(err as { response: { data: { RESULT_MSG: string } } }).response.data.RESULT_MSG}`);
      } else {
        alert('❌ 파일 업로드 실패');
      }
    }
  };

  return (
    <div style={pageContainerStyle}>
      <MainHeader pid={props.params.id} />

      <div style={flexRowStyle}>
        <MainSide pid={props.params.id} />

        <div style={contentContainerStyle}>
          <h1 style={titleStyle}>📄 파일 업로드</h1>

          <div style={formContainerStyle}>
            <p style={descriptionTextStyle}>
              {`프로젝트와 관련된 파일을 업로드하세요.\n한번에 여러개의 파일을 업로드할 수 있습니다.\n*주의* 파일을 묶어야 한다면 압축해서 올려주세요!`}
            </p>

            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={fileInputStyle}
            />

            {/* ✅ 선택된 파일 목록 표시 영역 */}
            {tmpfile.length > 0 && (
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '10px',
                  maxHeight: '160px',
                  overflowY: 'auto',
                }}
              >
                <ul style={{ margin: 0, padding: 0, listStyleType: 'none' }}>
                  {tmpfile.map((file, index) => (
                    <li
                      key={index}
                      style={{
                        fontSize: '14px',
                        padding: '8px 10px',
                        color: '#374151',
                        backgroundColor: '#f3f4f6',
                        marginBottom: '6px',
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>
                        📎 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                      <button
                        onClick={() =>
                          setFile(prev => prev.filter((_, i) => i !== index))
                        }
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          cursor: 'pointer',
                        }}
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button onClick={handleUpload} style={uploadButtonStyle}>
              📤 업로드
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 공통 스타일 정의 */
const pageContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: 'auto',
  fontFamily: "'Roboto', sans-serif",
  backgroundColor: '#f9fafb',
} as const;

const flexRowStyle = {
  display: 'flex',
  flex: 1,
  minHeight: 'calc(100vh - 90px)',
} as const;

const contentContainerStyle = {
  width: 'calc(100% - 200px)',
  maxHeight: 'calc(100vh - 90px)',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  margin: '20px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
} as const;

const formContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  width: '100%',
  maxWidth: '480px',
  padding: '30px',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid #e5e7eb',
} as const;

const titleStyle = {
  fontSize: '28px',
  color: '#10B981',
  marginBottom: '16px',
  borderBottom: '3px solid #10B981',
  paddingBottom: '10px',
  fontWeight: 'bold',
} as const;

const descriptionTextStyle = {
  fontSize: '15px',
  color: '#4b5563',
  whiteSpace: 'pre-wrap',
  lineHeight: '1.6',
  textAlign: 'center' as 'center',
  fontWeight: '400',
};

const fileInputStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '15px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  backgroundColor: '#f9fafb',
  cursor: 'pointer',
  transition: 'border 0.2s ease-in-out',
} as const;

const uploadButtonStyle = {
  padding: '12px 20px',
  backgroundColor: '#10B981',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  width: '100%',
  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  transition: 'all 0.25s ease-in-out',
} as const;

const customFileLabelStyle = {
    display: 'inline-block',
    padding: '10px 16px',
    backgroundColor: '#10B981',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '8px',
  } as const;
  