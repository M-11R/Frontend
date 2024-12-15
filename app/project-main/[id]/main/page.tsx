import MainHeader from "@/app/components/MainHeader"
import MainSide from "@/app/components/MainSide"
import json from '@/app/json/test.json'
import Image from "next/image"
import calendar from '@/app/img/calendar.png'
import TodoList from "@/app/components/Todo"

type wbs = {
    "Sid" : string
    "Sname" : string
    "Sscore" : number
}

export default function Main(props: any){
    const data: wbs[] = json.score
    return (
        <div>
            {/*메인 헤더*/}
            <MainHeader pid = {props.params.id}/> 

            {/*body*/}
            <div style={{display: 'flex'}}> 

                {/*왼쪽 사이드 name = {props.params.id}*/}
                <MainSide pid = {props.params.id}/>

                {/*메인 페이지*/}
                <div style={{height: 'calc(100vh - 105px)', width: 'calc(90% - 200px)', border: '1px solid #000000', display: 'flex', flexDirection: 'column', margin: '0', float: 'left'}}>

                    {/*페이지 위 : 진척도*/}
                    <div style={{height: '40%', width: '90%', border: '2px solid #000000', borderRadius: '20px', margin: '50px auto'}}>
                        <div style={{margin: 'auto', display: 'flex', flexDirection: 'column', width: '100%', height: '100%'}}>
                            {Array.from({length: Math.ceil(data.length / 3)}, (_, rowIndex) => (
                                <div key={rowIndex} style={{display: 'flex', margin: 'auto', justifyContent: 'center', width: '100%'}}>
                                    {data.slice(rowIndex * 3, rowIndex * 3 + 3).map((item, colIndex) => (
                                        <div key={colIndex} style={{margin: 'auto', fontSize: '50px', width: '300px', textAlign: 'center'}}>
                                            {item.Sname} : {item.Sscore}
                                        </div>
                                    ))}
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
                            {/* {json.test2.map((item) => (
                                <div key={item.Tid} style={{margin: '5px 10px', fontSize: '15px'}}>
                                    <div>마감 기한 : {item.Tdate}</div>
                                    <div>내용 : {item.Tstring}</div>
                                </div>
                            ))} */}
                            <TodoList p_id={props.params.id}/>
                        </div>
                        {/*빈 공간*/}
                        <div style={{height: '100%', width: '5%'}}></div>

                        {/*아래 오른쪽 : 캘린더 계획*/}
                        <div style={{height: '100%', width: '55%', border: '2px solid #000000', borderRadius: '20px', display: 'flex'}}>
                            <div style={{width: 'calc(100% - 450px)'}}></div>
                            <Image src={calendar} alt="temp Calender" style={{ width: '400px', height: '400px'}} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}