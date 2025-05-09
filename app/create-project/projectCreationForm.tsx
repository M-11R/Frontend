// projectCreationForm.tsx
"use client";
import React, { useState } from 'react';

interface ProjectCreationFormProps {
    onCreate: (name: string, description: string, startDate: string, endDate: string, members: number, profId: number) => void;
}

const ProjectCreationForm: React.FC<ProjectCreationFormProps> = ({ onCreate }) => {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [members, setMembers] = useState<number>(0);
    const [showForm, setShowForm] = useState(false);
    const [profId, setProfId] = useState<number | "">('');
    const [subject, setSubject] = useState<number | "">('');
    const [page, setPage] = useState(0);

    const handleCreateClick = () => {
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (projectName.trim()) {
            onCreate(projectName.trim(), projectDescription.trim(), startDate, endDate, Number(members), Number(profId));
            setProjectName('');
            setProjectDescription('');
            setStartDate('');
            setEndDate('');
            setMembers(0);
            setShowForm(false);
        }
    };

    const handlehide = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false)
    }

    const handleUpPage = () => {
        if(page < 2){
            const tmpPage = page
            setPage(tmpPage+1)
        }
    }

    const handleDownPage = () => {
        if(page > 0){
            const tmpPage = page
            setPage(tmpPage-1)
        }
    }

    return (
        <div className="create-project-container" style={{ padding: '20px', maxWidth: '600px', margin: '40px auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '12px', backgroundColor: '#f9f9f9' }}>
            {!showForm ? (
                <button onClick={handleCreateClick} style={{ position: 'fixed', bottom: '20px', left: '20px', padding: '15px 25px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', cursor: 'pointer' }}>프로젝트 생성</button>
            ) : (() => {
                switch(page){
                    case 0:
                        return (
                                <form onSubmit={handleSubmit} style={{ padding: '30px', borderRadius: '12px', backgroundColor: '#ffffff' }}>
                                    <button onClick={handlehide} style={{ bottom: '20px', left: '20px', padding: '15px 25px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', cursor: 'pointer' }}>X</button>
                                    <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>프로젝트 개설</h2>
                                    
                                    <div style={{ marginBottom: '15px' }}>
                                        <label htmlFor="projectName" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>프로젝트 이름:</label>
                                        <input
                                            type="text"
                                            id="projectName"
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label htmlFor="projectDescription" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>프로젝트 설명:</label>
                                        <textarea
                                            id="projectDescription"
                                            value={projectDescription}
                                            onChange={(e) => setProjectDescription(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', resize: 'vertical' }}
                                        ></textarea>
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label htmlFor="members" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>교수 번호:</label>
                                        <input
                                            type="number"
                                            id="prof_id"
                                            value={profId}
                                            onChange={(e) => setProfId(Number(e.target.value))}
                                            required
                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label htmlFor="subject" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>학과 번호:</label>
                                        <input
                                            type="number"
                                            id="subject"
                                            value={subject}
                                            onChange={(e) => setSubject(Number(e.target.value))}
                                            required
                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label htmlFor="startDate" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>시작일:</label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label htmlFor="endDate" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>마감일:</label>
                                        <input
                                            type="date"
                                            id="endDate"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                    <button type="submit" style={{ padding: '12px 25px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>개설</button>
                                    <button onClick={handleUpPage}>다음 페이지</button>
                                </form>
                                
                        )
                    case 1:
                        return (
                            <button onClick={handleDownPage}></button>
                        )
                    default:
                        return (
                            <div>Loading...</div>
                        );
                }
            })()
            }
        </div>
    );
};

export default ProjectCreationForm;
