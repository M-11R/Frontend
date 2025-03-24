'use client'

import MainHeader from '@/app/components/MainHeader'
import MainSide from '@/app/components/MainSide'
import { CSSProperties, useEffect, useState } from 'react'
import axios from 'axios'
import { getToken, getUserId } from '@/app/util/storage'
import { useRouter } from 'next/navigation'

type checklist = {
    plan: number
    require: number
    design: number
    progress: number
    scm: number
    cooperation: number
    quality: number
    tech: number
    presentation: number
    completion: number
    pid: number
}

type BackendGrade = {
    p_no: number;
    g_plan: number;
    g_require: number;
    g_design: number;
    g_progress: number;
    g_scm: number;
    g_cooperation: number;
    g_quality: number;
    g_tech: number;
    g_presentation: number;
    g_completion: number;
  };

  function transformGradeData(data: BackendGrade): checklist {
    return {
      plan: data.g_plan,
      require: data.g_require,
      design: data.g_design,
      progress: data.g_progress,
      scm: data.g_scm,
      cooperation: data.g_cooperation,
      quality: data.g_quality,
      tech: data.g_tech,
      presentation: data.g_presentation,
      completion: data.g_completion,
      pid: data.p_no,
    };
  }

export default function Grade(props: any){
    const [grade, setGrade] = useState<checklist>({
        plan: 0,
        require: 0,
        design: 0,
        progress: 0,
        scm: 0,
        cooperation: 0,
        quality: 0,
        tech: 0,
        presentation: 0,
        completion: 0,
        pid: props.params.id
    })
    const router = useRouter()
    useEffect(() => {
        const checkProf = async() => {
            const id = getUserId()
            const token = getToken()
            try{
                const responseProf = await axios.post("https://cd-api.chals.kim/api/prof/checksession", {user_id: id, token: token}, { headers: { Authorization: process.env.SECRET_API_KEY } });
            }catch(err){
                router.push(`/project-main/${props.params.id}/main`)
                alert("정상적이지 않는 접근입니다.")
            }
        }
        const loadGrade = async() => {
            const data = {
                plan: 0,
                require: 0,
                design: 0,
                progress: 0,
                scm: 0,
                cooperation: 0,
                quality: 0,
                tech: 0,
                presentation: 0,
                completion: 0,
                pid: props.params.id
            }
            try{
                const response = await axios.post("https://cd-api.chals.kim/api/grade/load", data, { headers: { Authorization: process.env.SECRET_API_KEY } });
                if(response.data.PAYLOAD.Result !== null){
                    const transformed = transformGradeData(response.data.PAYLOAD.Result);
                    setGrade(transformed)
                }
            }catch(err){}
        }
        checkProf()
        loadGrade()
    }, [])

    const handleSave = async() => {
        try{
            const response = await axios.post("https://cd-api.chals.kim/api/grade/assign", grade, { headers: { Authorization: process.env.SECRET_API_KEY } });
            alert("저장이 완료되었습니다.")
        }catch(err){
            try{
                const response = await axios.post("https://cd-api.chals.kim/api/grade/edit", grade, { headers: { Authorization: process.env.SECRET_API_KEY } });
            }catch(err){
                alert("저장이 완료되었습니다.")
            }
        }
    }

    const handleDelete = async() => {
        if(window.confirm("삭제하시겠습니까?")){
            try{
                const response = await axios.post("https://cd-api.chals.kim/api/grade/delete", grade, { headers: { Authorization: process.env.SECRET_API_KEY } });
                alert("삭제가 완료되었습니다.")
            }catch(err){
                alert("삭제 시 오류가 발생했습니다")
            }
        }
        
    }
    return(
        <div>
            {/*메인 헤더*/}
            <MainHeader pid = {props.params.id}/>

            {/*body*/}
            <div style={{display: 'flex'}}> 

                {/*왼쪽 사이드*/}
                <MainSide pid = {props.params.id}/>

                {/*메인 페이지*/}
                <div style={{height: 'calc(100vh - 105px)', width: 'calc(100% - 200px)', display: 'flex', flexDirection: 'column', margin: '0', float: 'left', overflowY: 'auto'}}>
                    <span style={{marginLeft: '15%', fontSize: '32px', paddingTop: '5%', paddingBottom: '10px'}}>프로젝트 평가</span>
                    <div style={{marginLeft: '15%', width: '60%', height: '85%', border: '1px solid #000', display: 'flex', borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",}}>
                        <div style={{flex: 3, borderRight: '1px solid #000', width: '20%', paddingLeft: '10%', paddingRight: '5%', gap: '10px',display: 'flex', flexDirection: 'column', paddingTop: '5%'}}>
                            <div style={{display: 'flex'}}>
                                <div style={divStyle}>기획 및 자료조사</div>
                                <div style={divStyle}>
                                    <input
                                        type='number'
                                        style={inputStyle}
                                        value={grade.plan}
                                        min={0}
                                        max={100}
                                        onChange={(e) => setGrade({ ...grade, plan: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div style={{display: 'flex'}}>
                                <div style={divStyle}>요구분석</div>
                                <div style={divStyle}>
                                    <input
                                        type='number'
                                        style={inputStyle}
                                        value={grade.require}
                                        min={0}
                                        max={100}
                                        onChange={(e) => setGrade({ ...grade, require: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div style={{display: 'flex'}}>
                                <div style={divStyle}>설계</div>
                                <div style={divStyle}>
                                    <input
                                        type='number'
                                        style={inputStyle}
                                        value={grade.design}
                                        min={0}
                                        max={100}
                                        onChange={(e) => setGrade({ ...grade, design: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div style={{display: 'flex'}}>
                                <div style={divStyle}>진척관리</div>
                                <div style={divStyle}>
                                    <input
                                        type='number'
                                        style={inputStyle}
                                        value={grade.progress}
                                        min={0}
                                        max={100}
                                        onChange={(e) => setGrade({ ...grade, progress: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div style={{display: 'flex'}}>
                                <div style={divStyle}>형상관리(버전)</div>
                                <div style={divStyle}>
                                    <input
                                        type='number'
                                        style={inputStyle}
                                        value={grade.scm}
                                        min={0}
                                        max={100}
                                        onChange={(e) => setGrade({ ...grade, scm: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div style={{display: 'flex'}}>
                                <div style={divStyle}>협력성(회의록)</div>
                                <div style={divStyle}>
                                    <input
                                        type='number'
                                        style={inputStyle}
                                        value={grade.cooperation}
                                        min={0}
                                        max={100}
                                        onChange={(e) => setGrade({ ...grade, cooperation: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div style={{display: 'flex'}}>
                                <div style={divStyle}>품질관리</div>
                                <div style={divStyle}>
                                    <input
                                        type='number'
                                        style={inputStyle}
                                        value={grade.quality}
                                        min={0}
                                        max={100}
                                        onChange={(e) => setGrade({ ...grade, quality: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div style={{display: 'flex'}}>
                                <div style={divStyle}>기술성</div>
                                <div style={divStyle}>
                                    <input
                                        type='number'
                                        style={inputStyle}
                                        value={grade.tech}
                                        min={0}
                                        max={100}
                                        onChange={(e) => setGrade({ ...grade, tech: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div style={{display: 'flex'}}>
                                <div style={divStyle}>발표</div>
                                <div style={divStyle}>
                                    <input
                                        type='number'
                                        style={inputStyle}
                                        value={grade.presentation}
                                        min={0}
                                        max={100}
                                        onChange={(e) => setGrade({ ...grade, presentation: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div style={{display: 'flex'}}>
                                <div style={divStyle}>완성도</div>
                                <div style={divStyle}>
                                    <input
                                        type='number'
                                        style={inputStyle}
                                        value={grade.completion}
                                        min={0}
                                        max={100}
                                        onChange={(e) => setGrade({ ...grade, completion: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{flex: 1, borderRight: '1px solid #000', width: '20%', paddingLeft: '10%', paddingRight: '5%', gap: '10px',display: 'flex', flexDirection: 'column', paddingTop: '5%'}}>
                            <button onClick={handleSave}>저장</button>
                            <button onClick={handleDelete}>삭제</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const divStyle: CSSProperties = {
    flex: 1,
    fontSize: '20px'
}

const inputStyle: CSSProperties = {
    width: '100%',
    height: '100%'
}