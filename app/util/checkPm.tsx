
import axios from "axios"

type returnType = {
    RESULT_CODE: number
    RESULT_MSG: permission
}
export type permission = {
    p_no: number
    s_no: number
    leader: number
    ro: number
    user: number
    wbs: number
    od: number
    mm: number
    ut: number
    rs: number
    rp: number
    om: number
    task: number
    llm: number
}

export const CheckPm = async(p_no: number, univ_no: number) => {
    const data = {
        pid: p_no,
        univ_id: univ_no
    }
    const tmpData = {
        p_no: 0,
        s_no: 0,
        leader: 0,
        ro: 0,
        user: 0,
        wbs: 0,
        od: 0,
        mm: 0,
        ut: 0,
        rs: 0,
        rp: 0,
        om: 0,
        task: 0,
        llm: 0
    }
    try{
        const response = await axios.post<returnType>("https://cd-api.chals.kim/api/pm/load_one", data, {headers:{Authorization: process.env.SECRET_API_KEY}});
        return (response.data.RESULT_MSG)
    }catch(err){
        return (tmpData)
    }
}