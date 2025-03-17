'use client'
import { getToken, getUserId } from "@/app/util/storage";
import axios from "axios";
import { useEffect } from "react";
import LLMManagement from "@/app/components/LLMManagement";


export default function Test(props: any) {
    
    
    

    return(
        <div style={{width: '100%', height: '100%'}}>
            <div style={{width: '100%', minHeight: '500px', border: '1px solid #000'}}>asd</div>
            <div style={{width: '50%', border: '1px solid #000'}}>asdasdasdqweqwe123123123ased</div>
            {/* <LLMManagement pid={props.params.id} /> */}
            
        </div>
        
    );
}