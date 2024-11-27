import MainHeader from '@/app/components/MainHeader';
import MainSide from '@/app/components/MainSide';
import Pagination from '@/app/components/pagenation'
import data from '@/app/json/udata.json'
import MsBox from '@/app/json/msBox.json'
import Link from 'next/link';

type Resource = {
    id: number,
    title: string,
    description: string,
    writer: string,
    date: string
};

export default function OutputManagement({ params, searchParams }: { params: { id: string }, searchParams: { page?: string } }) {
    const itemsPerPage = 10; // 한 페이지당 표시할 글 수
    const page = parseInt(searchParams.page || "1", 10);
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    

    // 현재 페이지 데이터 계산
    const currentData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div>
            <MainHeader name = {params.id}/>

            <div style={{display: 'flex'}}>
                <MainSide qwe = {params.id}/>

                <div style={{height: 'calc(100vh - 105px)', width: 'calc(90% - 200px)', border: '1px solid #000000', display: 'flex', flexDirection: 'column', margin: '0', float: 'left'}}>
                    <div style={{margin: '5% auto', width: '70%', height: '100%'}}>
                        <div style={{height: '100%', maxHeight: '650px', width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column'}}>
                            <h1>{MsBox.page.test.value}</h1>
                            <div style={{width: '100%', height: '100%'}}>
                                <div style={{height: '9%', width: '100%', border: '1px solid #000000', display: 'flex', backgroundColor: '#dfdfdf', fontWeight: 'bold'}}>
                                    <div style={{fontSize: '18px', alignContent: 'center', height: '100%', width: '10%', borderRight: '1px solid #000000', textAlign: 'center'}}>{MsBox.om.id.value}</div>
                                    <div style={{fontSize: '18px', alignContent: 'center', height: '100%', width: '20%', borderRight: '1px solid #000000', textAlign: 'center'}}>{MsBox.om.name.value}</div>
                                    <div style={{fontSize: '18px', alignContent: 'center', height: '100%', width: '35%', borderRight: '1px solid #000000', textAlign: 'center'}}>{MsBox.om.title.value}</div>
                                    <div style={{fontSize: '18px', alignContent: 'center', height: '100%', width: '35%', textAlign: 'center'}}>{MsBox.om.date.value}</div>
                                </div>
                                {currentData.map((item: Resource) => (
                                    <div key={item.id} style={{height: '9%', width: '100%', border: '1px solid #000000', display: 'flex'}}>
                                        <div style={{fontSize: '18px', alignContent: 'center', height: '100%', width: '10%', borderRight: '1px solid #000000', textAlign: 'center'}}>{item.id}</div>
                                        <div style={{fontSize: '18px', alignContent: 'center', height: '100%', width: '20%', borderRight: '1px solid #000000', textAlign: 'center'}}>{item.writer}</div>
                                        <div style={{fontSize: '18px', alignContent: 'center', height: '100%', width: '35%', borderRight: '1px solid #000000', textAlign: 'center'}}><Link href={`/project-main/${params.id}/output/${item.id}`}>{item.title}</Link></div>
                                        <div style={{fontSize: '18px', alignContent: 'center', height: '100%', width: '35%', textAlign: 'center'}}>{item.date}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{height: '50px'}}></div>
                            {/* 페이지네이션 컴포넌트 */}
                            <Pagination currentPage={page} totalPages={totalPages} basePath={`/project-main/${params.id}/outputManagement`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}