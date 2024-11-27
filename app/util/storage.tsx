
const STORAGE_KEY = {
    TOKEN: "token",
    USER_ID: "userId",
    UNIVID: "univId"
};

export const setToken = (token: string) => {
    if(typeof window !== 'undefined'){localStorage.setItem(STORAGE_KEY.TOKEN, token);}
};

export const getToken = (): string => {
    if(typeof window !== 'undefined'){return localStorage.getItem(STORAGE_KEY.TOKEN) ?? '';}
    return '';
};

export const removeToken = () => {
    if(typeof window !== 'undefined'){localStorage.removeItem(STORAGE_KEY.TOKEN);}
};

export const setUserId = (userId: string) => {
    if(typeof window !== 'undefined'){localStorage.setItem(STORAGE_KEY.USER_ID, userId);}
};

export const getUserId = (): string => {
    if(typeof window !== 'undefined'){return localStorage.getItem(STORAGE_KEY.USER_ID) ?? '';}
    return '';
};

export const removeUserId = () => {
    if(typeof window !== 'undefined'){localStorage.removeItem(STORAGE_KEY.USER_ID);}
};

export const setUnivId = (univId: number) => {
    if(typeof window !== 'undefined'){localStorage.setItem(STORAGE_KEY.UNIVID, univId.toString());}
};

export const getUnivId = (): number => {
    if(typeof window !== 'undefined'){return Number(localStorage.getItem(STORAGE_KEY.UNIVID)) ?? 0;}
    return 0;
};

export const removeUnivId = () => {
    if(typeof window !== 'undefined'){localStorage.removeItem(STORAGE_KEY.UNIVID);}
};

export const clearStorage = () => {
    removeUnivId();
    removeUserId();
    removeToken();
}