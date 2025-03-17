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

export default function Create(props: any) {
    const [tmpfile, setFile] = useState<File[]>([]);
    const router = useRouter();
    const s_no = getUnivId();
    usePermissionGuard(props.params.id, s_no, {leader: 1, om: 1}, true)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (!tmpfile) {
            alert('📂 파일을 선택해주세요.');
            return;
        }
        const tmppid: number = props.params.id;
        const tmpunivid = getUnivId();
        const formData = new FormData();
        tmpfile.forEach((file) => {
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
        } catch (err) {
            alert('❌ 파일 업로드 실패');
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
                        <p style={{ fontSize: '16px', color: '#6b7280', whiteSpace: 'pre-wrap' }}>
                            {`프로젝트와 관련된 파일을 업로드하세요.\n한번에 여러개의 파일을 업로드할 수 있습니다.\n*주의* 파일을 묶어야 한다면 압축해서 올려주세요!`}
                        </p>
                        <input type="file" multiple onChange={handleFileChange} style={fileInputStyle} />
                        <button onClick={handleUpload} style={uploadButtonStyle}>
                            📤 업로드
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/*  공통 스타일 적용 */
const pageContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: "auto",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: '#f9fafb',
} as const;

const flexRowStyle = {
    display: 'flex',
    flex: 1,
    minHeight: 'calc(100vh - 90px)'
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

const titleStyle = {
    fontSize: '24px',
    color: '#4CAF50',
    marginBottom: '20px',
    borderBottom: '2px solid #4CAF50',
    paddingBottom: '10px',
} as const;

const formContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    backgroundColor: '#f3f4f6',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
} as const;

const fileInputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#fff',
} as const;

const uploadButtonStyle = {
    padding: '12px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
} as const;
