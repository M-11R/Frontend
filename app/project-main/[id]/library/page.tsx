
import MainHeader from "@/app/components/MainHeader"
import MainSide from "@/app/components/MainSide"
import libraryList from "@/app/json/library.json"
import LibraryTable from "@/app/components/LibraryTable";

export default function library({ params, searchParams }: { params: { id: number }; searchParams: { page?: string } }){
    const page = parseInt(searchParams.page || '1', 10);
    const data = libraryList.list;
    const itemsPerPage = 10; // 한 페이지당 표시할 글 수
    const currentData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return(
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: "'Roboto', sans-serif", backgroundColor: '#f9fafb', overflow: 'hidden' }}>
            <MainHeader pid={params.id} />

            <div style={{ display: 'flex', flex: 1, overflowY: 'auto' }}>
                <MainSide pid={params.id} />

                <div
                    style={{
                        width: '100%',
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        margin: '20px',
                        marginBottom: '0px',
                        padding: '20px',
                    }}
                >
                    <h1 style={{ fontSize: '24px', color: '#4CAF50', marginBottom: '20px', borderBottom: '2px solid #4CAF50', paddingBottom: '10px' }}>
                        자료실
                    </h1>

                    <div
                        style={{
                            marginBottom: '20px',
                            padding: '15px',
                            borderRadius: '10px',
                            backgroundColor: '#f3f4f6',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <p style={{ fontSize: '16px', color: '#6b7280' }}>
                            제공된 자료를 다운받아 사용할 수 있습니다.
                        </p>
                    </div>

                    
                    <LibraryTable pid={params.id} />

                </div>
            </div>
        </div>
    )
}