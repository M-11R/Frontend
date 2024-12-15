import { getToken, getUnivId, getUserId } from "@/app/util/storage"
import axios from "axios"

type checkType = {
    user_id: string,
    token: string
}

type returnType = {
    "RESULT_CODE": number, 
    "RESULT_MSG": string
}
//미사용
export const CheckSession = async({data}: {data: checkType}) => {
    try{
        const response = await axios.post<returnType>("https://cd-api.chals.kim/api/acc/checksession", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
        return response.data.RESULT_CODE
    }catch(err){
        console.log(err);
        return 0
    };
}

export const checkNull = (jsonData: Record<string, any>) => {
    for(const value of Object.values(jsonData)){
        if(value === ''){
            return false;
        }else{
            return true;
        }
    }
}