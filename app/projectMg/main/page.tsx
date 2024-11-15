import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import { useEffect } from "react";

interface WbsManagementPageProps {
    params: {
        id: string;
    };
}

export default function WbsManagementPage(props: WbsManagementPageProps) {
    return (
        <div>
            {/* 메인 헤더 */}
            <MainHeader name={props.params.id} />

            {/* body */}
            <div style={{ display: 'flex' }}>
                {/* 왼쪽 사이드 */}
                <MainSide qwe={props.params.id} />

                {/* 메인 페이지 */}
                <div style={{ height: 'calc(100vh - 105px)', width: 'calc(90% - 200px)', border: '1px solid #000000', display: 'flex', flexDirection: 'column', margin: '0', float: 'left' }}>
                    <div style={{ margin: '10% auto', height: '100%', width: '70%' }}>
                        <span style={{ fontSize: '40px' }}>WBS 관리</span>
                        <p>WBS 관리 페이지에 오신 것을 환영합니다!</p>
                        {/* 추가적인 WBS 관리,  추가 틀 */}
                    </div>
                </div>
            </div>
        </div>
    );
}
