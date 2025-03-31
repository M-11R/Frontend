"use client";

import { CSSProperties, useState, useEffect, useRef } from "react";
import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getUnivId } from "@/app/util/storage";
import usePermissionGuard from "@/app/util/usePermissionGuard";

export default function ReportForm(props: any) {
  const [reportTitle, setReportTitle] = useState("");
  const [projectName, setProjectName] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [writer, setWriter] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [problemDefinition, setProblemDefinition] = useState("");
  const [researchGoal, setResearchGoal] = useState("");
  const [designProcess, setDesignProcess] = useState("");
  const [systemArchitecture, setSystemArchitecture] = useState("");
  const [experimentResults, setExperimentResults] = useState("");
  const [conclusion, setConclusion] = useState("");

  const router = useRouter();
  const s_no = getUnivId();
  usePermissionGuard(props.params.id, s_no, { leader: 1, rp: 1 }, true);

  const handleSave = async () => {
    const data = {
      rname: reportTitle,
      pname: projectName,
      rdate: submissionDate,
      rwriter: writer,
      pmember: teamMembers,
      pprof: "",
      presearch: `${problemDefinition}\n${researchGoal}`,
      pdesign: designProcess,
      parch: systemArchitecture,
      presult: experimentResults,
      pconc: conclusion,
      pid: props.params.id,
    };

    try {
      const response = await axios.post("https://cd-api.chals.kim/api/output/report_add", data, {
        headers: { Authorization: process.env.SECRET_API_KEY },
      });
      // router.push(`/project-main/${props.params.id}/outputManagement`);
      const tmpDoc = response.data.PAYLOADS.doc_s_no
      handleUploadFile(tmpDoc)
    } catch (err) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const [tmpfile, setFile] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleResetFile = () => {
    setFile([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setFile(Array.from(e.target.files));
    }
  };

  const handleUploadFile = async (doc_id: number) => {
    if (tmpfile.length === 0) {
        return;
    }
    const tmppid: number = props.params.id;
    const tmpunivid = getUnivId();
    const formData = new FormData();
    tmpfile.forEach((file) => {
        formData.append('files', file);
    });
    formData.append('p_no', tmppid.toString());
    formData.append('doc_no', doc_id.toString())
    formData.append('doc_type', '2')
    formData.append('univ_id', tmpunivid.toString());

    try {
        const response = await axios.post(
            'https://cd-api.chals.kim/api/output/attach_add',
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
    <div style={containerStyle}>
      <MainHeader pid={props.params.id} />
      <div style={layoutStyle}>
        <MainSide pid={props.params.id} />
        <div style={contentStyle}>
          <h2 style={titleStyle}>📑 보고서 작성 ver6</h2>

          <table style={tableStyle}>
            <tbody>
              <tr><td colSpan={4} style={sectionHeaderStyle}>📌 기본 정보</td></tr>
              <tr>
          <td style={thStyle}>보고서 제목</td>
          <td colSpan={3} style={tdStyle}>
            <input 
              type="text"
              value={reportTitle}
             onChange={(e) => setReportTitle(e.target.value)}
             style={reportTitleStyle}
           />
          </td>
        </tr>
        <tr>
         <td style={thStyle}>프로젝트 명</td>
         <td colSpan={3} style={tdStyle}>
           <input 
              type="text"
             value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              style={projectNameStyle}
           />
          </td>
        </tr>
              <tr>
                <td style={thStyle}>작성일</td>
                <td style={tdStyle}><Field type="date" value={submissionDate} setter={setSubmissionDate} /></td>
                <td style={thStyle}>작성자</td>
                <td style={tdStyle}><Field value={writer} setter={setWriter} /></td>
              </tr>

              <tr><td colSpan={4} style={sectionHeaderStyle}>📌 보고서 세부 내용</td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField label="팀원 및 지도 교수" value={teamMembers} setter={setTeamMembers} /></td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField label="문제 정의" value={problemDefinition} setter={setProblemDefinition} /></td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField label="연구 목표" value={researchGoal} setter={setResearchGoal} /></td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField label="설계 및 개발 과정" value={designProcess} setter={setDesignProcess} /></td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField label="시스템 아키텍처" value={systemArchitecture} setter={setSystemArchitecture} /></td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField label="실험 및 결과" value={experimentResults} setter={setExperimentResults} /></td></tr>
              <tr><td colSpan={4} style={tdStyle}><TextAreaField label="결론" value={conclusion} setter={setConclusion} /></td></tr>
            </tbody>
          </table>
          <div>
                    <div style={formContainerStyle}>
                      <div style={{display: 'flex', width: '100%'}}>
                        <span style={{ fontSize: '16px', color: '#6b7280', whiteSpace: 'pre-wrap', alignSelf: 'flex-start' }}>
                            {`프로젝트와 관련된 파일을 업로드하세요.\n한번에 여러개의 파일을 업로드할 수 있습니다..`}
                        </span>
                        <div style={{marginLeft: 'auto', width: '40%'}}>
                        <input type="file" multiple onChange={handleFileChange} style={fileInputStyle} ref={fileInputRef} />
                        </div>
                        
                      </div>
                        
                        <button onClick={handleResetFile} style={uploadButtonStyle}>
                            📤 제거
                        </button>
                    </div>
                </div>
          <div style={buttonContainerStyle}>
            <ActionButton label="저장" onClick={handleSave} color="#2196F3" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ✅ 스타일 정의 */
const containerStyle: CSSProperties = { display: "flex", flexDirection: "column", width: "100%" };
const layoutStyle: CSSProperties = { display: "flex", width: "100%" };
const contentStyle: CSSProperties = { padding: "20px", backgroundColor: "#fff", maxWidth: "2100px", width: "100%" };
const titleStyle: CSSProperties = { fontSize: "24px", fontWeight: "bold", color: "#4CAF50", textAlign: "center", marginBottom: "20px" };
const tableStyle: CSSProperties = { width: "100%", borderCollapse: "collapse" };
const sectionHeaderStyle: CSSProperties = { backgroundColor: "#ddd", padding: "14px", border: "1px solid black", fontWeight: "bold", textAlign: "center" };
const thStyle: CSSProperties = { backgroundColor: "#ddd", padding: "14px", border: "1px solid black", fontWeight: "bold", textAlign: "center" };
const tdStyle: CSSProperties = { padding: "18px", border: "1px solid black", textAlign: "left" };
const buttonContainerStyle: CSSProperties = { display: "flex", justifyContent: "center", marginTop: "20px" };


const reportTitleStyle: CSSProperties = {
  width: "98.5%",  // 전체 너비 사용
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  fontSize: "16px",
};

const projectNameStyle: CSSProperties = {
  width: "98.5%",  // 전체 너비 사용
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  fontSize: "16px",
};



/* ✅ 컴포넌트 정의 */
const Field = ({ value, setter, type = "text" }: { value: string; setter: (value: string) => void; type?: string }) => (
  <input type={type} value={value} onChange={(e) => setter(e.target.value)} style={{ width: "98%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />
);

const TextAreaField = ({ label, value, setter }: { label: string; value: string; setter: (value: string) => void }) => (
  <div>
    <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>{label}:</label>
    <textarea value={value} onChange={(e) => setter(e.target.value)} style={{ width: "99%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", height: "100px" }} />
  </div>
);

const ActionButton = ({ label, onClick, color }: { label: string; onClick: () => void; color: string }) => (
  <button onClick={onClick} style={{ backgroundColor: color, color: "#fff", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}>{label}</button>
);

const formContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '15px',
  width: '98%',
  // maxWidth: '800px',
  padding: '20px',
  backgroundColor: '#f3f4f6',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
} as const;

const fileInputStyle = {
  width: 'calc(100% - 22px)',
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