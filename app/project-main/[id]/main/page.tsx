import MainHeader from "../../../components/MainHeader"
import MainSide from "../../../components/MainSide"
import json from '../../../json/test.json'

export default function Main(props: any){
    return (
        <div>
            {/*메인 헤더*/}
            <MainHeader name = {props.params.id}/> 

            {/*body*/}
            <div style={{display: 'flex'}}> 

                {/*왼쪽 사이드 name = {props.params.id}*/}
                <MainSide qwe = {props.params.id}/>

                {/*메인 페이지*/}
                <div style={{height: 'calc(100vh - 105px)', width: 'calc(90% - 200px)', border: '1px solid #000000', display: 'flex', flexDirection: 'column', margin: '0', float: 'left'}}>

                    {/*페이지 위 : 진척도*/}
                    <div style={{height: '40%', width: '90%', border: '2px solid #000000', borderRadius: '20px', margin: '50px auto'}}>
                        <div style={{margin: '20px auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                            {json.score.map((item) => (
                                <div key={item.Sid} style={{margin: '50px 100px auto', marginBottom: '50px'}}>
                                    <div style={{fontSize: '40px'}}>{item.Sname} : {item.Sscore}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/*페이지 아래*/}
                    <div style={{height: '45%', width: '100%', margin: '0 60px auto', display: 'flex'}}>
                        {/*아래 왼쪽 : Todo List*/}
                        <div style={{height: '100%', width: '30%', border: '2px solid #000000', borderRadius: '20px', display: 'flex', flexDirection: 'column'}}>
                            {/*제목과 밑선*/}
                            <div style={{marginTop: '10px', marginLeft: '10px', fontSize: '25px'}}>Todo List</div>
                            <div style={{borderBottom: '2px solid #000000'}}></div>

                            {/*Todo 내용*/}
                            {json.test2.map((item) => (
                                <div key={item.Tid} style={{margin: '5px 10px'}}>
                                    <div>마감 기한 : {item.Tdate}</div>
                                    <div>내용 : {item.Tstring}</div>
                                </div>
                            ))}
                        </div>
                        {/*빈 공간*/}
                        <div style={{height: '100%', width: '5%'}}></div>

                        {/*아래 오른쪽 : 캘린더 계획*/}
                        <div style={{height: '100%', width: '55%', border: '2px solid #000000', borderRadius: '20px'}}>캘린더</div>
                    </div>
                </div>
            </div>
        </div>
    )
}