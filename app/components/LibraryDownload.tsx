'use client'

const LibraryDownloadBtn = ({link}: {link: string}) => {
    const tmpLink = link
    const handleClick = () => {
        try{
            const fileUrl = `/library/${tmpLink}`;
            const link = document.createElement("a");
            link.href = fileUrl;
            link.download = tmpLink
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }catch(err){}
    }
    return(
        <button onClick={() => handleClick()}>다운로드</button>
    )
}

export default LibraryDownloadBtn;