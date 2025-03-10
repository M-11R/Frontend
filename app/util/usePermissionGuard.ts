'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckPm } from '@/app/util/checkPm'

export type Permission = {
  p_no: number;
  s_no: number;
  leader: number;
  ro: number; // read only(미사용)
  user: number;
  wbs: number; // wbs
  od: number; // 개요서
  mm: number; // 회의록
  ut: number; // 테스트케이스
  rs: number; // 요구사항 명세서
  rp: number; // 보고서
  om: number; // 기타 산출물
  task: number; // 업무
  llm: number; // LLM
};

export type PermissionRequirements = {
  [K in keyof Permission]?: number | number[];
};

export default function usePermissionGuard(
  p_no: number,
  univ_no: number,
  requiredPermissions: PermissionRequirements,
  route: boolean
): boolean | null {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const result: Permission = await CheckPm(p_no, univ_no);

        const conditionMet = Object.entries(requiredPermissions).some(
          ([key, requiredValue]) => {
            const resultValue = (result as any)[key];
            if (Array.isArray(requiredValue)) {
              return requiredValue.includes(resultValue);
            }
            return resultValue === requiredValue;
          }
        );

        if (!conditionMet) {
          if(route){
            alert('권한이 없습니다.')
            router.push(`/project-main/${p_no}/main`);
          }else{
            setHasPermission(false);
          }
        }else{
          setHasPermission(true);
        }
      } catch (error) {
        console.error('권한 체크 에러:', error);
        if(route){
          router.push(`/project-main/${p_no}/main`);
        }else{
          setHasPermission(false);
        }
        
      }
    };

    checkPermissions();
  }, []);

  return hasPermission;
}