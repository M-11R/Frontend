import MainHeader from '@/app/components/MainHeader'
import MainSide from '@/app/components/MainSide'
import MsBox from '@/app/json/msBox.json'
import { OutputEtc, OutputOvr, OutputMm, OutputTest, OutputReq } from '@/app/components/DynOutCom'

const DynamicOutput = ({type, oid, pid}: {type: string, oid: number, pid: number}) => {
    // const item = Udata.find((item) => item.id === Number(value));

    switch(type){
        case MsBox.outType.etc.value:
            return <OutputEtc oid={oid} pid={pid}/>
        case MsBox.outType.overview.value:
            return <OutputOvr oid={oid} pid={pid}/>
        case MsBox.outType.testcase.value:
            return <OutputTest oid={oid} pid={pid}/>
        case MsBox.outType.request.value:
            return <OutputReq oid={oid} pid={pid}/>
        case MsBox.outType.minutes.value:
            return <OutputMm oid={oid} pid={pid}/>
        case MsBox.outType.report.value:
        default:
            return <div>Error : {type}</div>
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
                        <DynamicOutput type={props.params.outtype} oid={props.params.outid} pid={props.params.id}/>
                    </div>
                </div>
            </div>
        </div>
    )
}