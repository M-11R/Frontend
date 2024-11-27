import styles from '@/app/css/DynOutCom.module.css'
import DynOutDelbtn from '@/app/components/DynOutDelbtn'

type etc = {
    id: number;
    writer: string;
    title: string;
    date: string;
    type: number;
    description: string;
}

export const OutputEtc = ({data, pjid}: {data: etc, pjid: string}) => (
    <table className={styles.outTable}>
        <colgroup>
            <col style={{width: `20%`}}/>
            <col style={{width: `cal(100 - 20)%`}}/>
        </colgroup>
        <tbody>
            <tr>
                <th>제목</th>
                <td>{data.title}</td>
            </tr>
            <tr>
                <th>작성자</th>
                <td>{data.writer}</td>
            </tr>
            <tr>
                <th>게시일</th>
                <td>{data.date}</td>
            </tr>
            <tr>
                <td colSpan={2}>
                    <div>
                        <a href='https://google.com' target='_blank' rel='noopener noreferror' style={{textDecoration: 'none', fontSize: '15px'}}>
                            {data.title}
                        </a>
                    </div>
                </td>
            </tr>
            <tr style={{borderBottom: '0'}}>
                <td colSpan={2} style={{borderBottom: '0'}}>
                    <div style={{margin: 'auto', float: 'right'}}>
                        <div style={{float: 'right'}}><DynOutDelbtn data={{pjid: pjid, outid: data.id}}/></div>
                    </div>
                </td>
            </tr>
        </tbody>
        
    </table>
);