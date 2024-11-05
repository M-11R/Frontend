import MainHeader from "../../../components/MainHeader"
import MainSide from "../../../components/MainSide"


export default function userManagement(){
    return (
        <div>
            {/*메인 헤더*/}
            <MainHeader />

            {/*body*/}
            <div style={{display: 'flex'}}> 

                {/*왼쪽 사이드*/}
                <MainSide />

                {/*메인 페이지*/}
                <div style={{height: 'calc(100vh - 105px)', width: '(90% - 300px)', border: '1px solid #000000', display: 'flex', flexDirection: 'column', margin: '0 100px 0', marginLeft: '0'}}>

                </div>
            </div>
        </div>
    );
}