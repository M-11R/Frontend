'use client'

import axios from "axios";

type delData = {
    pjid: string;
    outid: number;
}

const handleDelbtn = async(data: delData) => {
    try{
        const response = await axios.post(
            "https://cd-api.chals.kim/api/test/post",
            data, 
            {headers:{Authorization: process.env.SECRET_API_KEY}}
        );
        console.log("Delete : ", response);
    }catch (err){
        console.log(err);
    }
}

const OutDelbtn = ({data}: {data: delData}) => {
    return (
        <button onClick={() => handleDelbtn(data)}>삭제</button>
    );
}

export default OutDelbtn;