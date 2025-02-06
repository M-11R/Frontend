'use client';

import { useRouter } from "next/navigation";

export const usePageReload = () => {
    const router = useRouter();

    const reloadPage = () => {
        router.refresh(); // 현재 경로를 다시 호출하여 새로고침
    };

    return { reloadPage };
};