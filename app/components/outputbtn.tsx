import Link from "next/link";

type OutputType = {
    display: string | number
    link: string
    id: string
}
//style={{width: '100%', height: '100%', border: '0', backgroundColor: 'transparent', display: 'block', textAlign: 'center', lineHeight: '100%'}}
const outputbtn = ({display, link, id}: OutputType) => {

    return(
        <div>
            {display}
        </div>
    );
};

export default outputbtn;