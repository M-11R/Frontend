import MainHeader from "@/app/components/MainHeader";
import MainSide from "@/app/components/MainSide";
import { AddTask } from "@/app/components/Modal";
import TaskTable from "@/app/components/TaskTable";
import MsBox from '@/app/json/msBox.json'


export default function Task({ params, searchParams }: { params: { id: number }, searchParams: { page?: string } }) {
    // const itemsPerPage = 10; // 한 페이지당 표시할 글 수
    const page = parseInt(searchParams.page || "1", 10);
    return(
        <div>
            <MainHeader pid = {params.id}/>

            <div style={{display: 'flex'}}>
                <MainSide pid = {params.id}/>

                <div style={{height: 'calc(100vh - 105px)', width: 'calc(90% - 200px)', border: '1px solid #000000', display: 'flex', flexDirection: 'column', margin: '0', float: 'left'}}>
                    <div style={{width: '100%', display: 'flex'}}>
                        
                    </div>
                    <TaskTable page={page} p_id={params.id}/>
                            
                </div>
            </div>
        </div>
    );
}