
import MainHeader from "@/app/components/MainHeader"
import MainSide from "@/app/components/MainSide"
import Library from "@/app/json/library.json"
import styles from '@/app/css/DynOutCom.module.css'
import LibraryDownloadBtn from "@/app/components/LibraryDownload"

export default function Output(props: any){
    const validKeys = ["summary", "report", "reqspec", "testcase", "meeting_minutes"] as const;
    type ValidKey = typeof validKeys[number];
    const libraryType = props.params.librarytype;
    if (validKeys.includes(libraryType)) {
        const fileData = Library[libraryType as ValidKey];
        // fileData를 사용하여 화면 렌더링 처리
        return(
            <div>
                {/*메인 헤더*/}
                <MainHeader pid = {props.params.id}/>
    
                {/*body*/}
                <div style={{display: 'flex'}}> 
    
                    {/*왼쪽 사이드*/}
                    <MainSide pid = {props.params.id}/>
    
                    {/*메인 페이지*/}
                    <div style={{height: 'calc(100vh - 105px)', width: 'calc(90% - 200px)', border: '1px solid #000000', display: 'flex', margin: '0', alignContent: 'center'}}>
                        <div style={{margin: '100px auto', width: '55%'}}>
                        <table className={styles.outTable}>
                            <colgroup>
                                <col style={{width: `20%`}}/>
                                <col style={{width: `cal(100 - 20)%`}}/>
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th>제목</th>
                                    <td>{fileData.name}</td>
                                </tr>
                                <tr>
                                    <th>다운로드</th>
                                    <td><LibraryDownloadBtn link={fileData.name} /></td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </div>
        )
      } else {
        // 잘못된 경로 처리
        return <div>해당 자료를 찾을 수 없습니다.</div>;
      }
    
}