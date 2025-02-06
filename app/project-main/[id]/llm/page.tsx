
import LLMManagement from '@/app/components/LLMManagement'
import MainHeader from '@/app/components/MainHeader'
import MainSide from '@/app/components/MainSide'



export default function Grade(props: any){
    

    return(
        <div>
            {/*메인 헤더*/}
            <MainHeader pid = {props.params.id}/>

            {/*body*/}
            <div style={{display: 'flex'}}> 

                {/*왼쪽 사이드*/}
                <MainSide pid = {props.params.id}/>

                {/*메인 페이지*/}
                <div style={{height: 'calc(100vh - 105px)', width: 'calc(90% - 200px)', border: '1px solid #000000', display: 'flex', flexDirection: 'column', margin: '0', float: 'left'}}>
                    <LLMManagement pid = {props.params.id}/>
                </div>
            </div>
        </div>
    )
}