import MainHeader from '@/app/components/MainHeader'
import MainSide from '@/app/components/MainSide'
import MsBox from '@/app/json/msBox.json'
import { OutputEtc } from '@/app/components/DynOutCom'
import data from '@/app/json/udata.json'

type outData = {
    id: number;
    writer: string;
    title: string;
    date: string;
    type: number;
    description: string;
}

const DynamicOutput = ({value, pjid}: {value: number, pjid: string}) => {
    const Udata = data;
    const item = Udata.find((item) => item.id === Number(value));

    switch(item?.type){
        case 0:
        case 1:
            return <OutputEtc data={item} pjid={pjid}/>
        case 2:
        case 3:
        default:
            return <div>Error : {item?.type}</div>
    }
}

export default function Output(props: any){

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
                        <DynamicOutput value={props.params.outId} pjid={props.params.id}/>
                    </div>
                </div>
            </div>
        </div>
    )
}