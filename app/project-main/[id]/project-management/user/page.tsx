import MainHeader from "../../../../components/MainHeader"
import MainSide from "../../../../components/MainSide"
import DataTable from "@/app/components/DataTable";

export default function userManagement(props: any){
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
                    <div style={{margin: '10% auto', height: '100%', width: '70%'}}>
                        <span style={{fontSize: '40px'}}>유저 목록</span>
                        <DataTable />
                    </div>
                </div>
            </div>
        </div>
    );
}