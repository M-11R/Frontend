import MainHeader from '@/app/components/MainHeader';
import MainSide from '@/app/components/MainSide';



export default function outputManagement(props: any){
    return(
        <div>
            <MainHeader name = {props.params.id}/>

            <div style={{display: 'flex'}}>
                <MainSide qwe = {props.params.id}/>
            </div>
        </div>
    );
}