'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckPm } from '@/app/util/checkPm'

export type Permission = {
  p_no: number;
  s_no: number;
  leader: number;
  ro: number;
  user: number;
  wbs: number;
  od: number;
  mm: number;
  ut: number;
  rs: number;
  rp: number;
  om: number;
  task: number;
  llm: number;
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