'use client'

import axios from "axios";
import { useEffect, useState, useRef, CSSProperties, use } from "react";
import { getUnivId } from "../util/storage";
import usePermissionGuard from "../util/usePermissionGuard";

const LLMChat = ({pid}: {pid: number}) => {
    const [messages, setMessages] = useState<string[]>(['인녕하세요. 프로젝트 진행을 도와드릴 PMS Advisor입니다.']);
    const messageBox: {[key: number]: string} = {
        0: "현재 이 프로젝트의 진행 상태를 전반적으로 분석해줘.",
        1: "현재 이 프로젝트의 진행 상황을 바탕으로, 잠재적인 리스크 요소들을 분석해줘.",
        2: "현재 이 프로젝트는 주제만 선정된 초기 단계야. 프로젝트 설명과 개발 방식을 바탕으로 다음 내용을 중심으로 간략하게 조언해줘",
        3: "현재 이 프로젝트에서 작성된 산출물(온라인 산출물과 기타 산출물)의 내용을 바탕으로, 각 산출물의 주요 구성 요소와 특징을 분석해줘.",
        4: "현재 이 프로젝트에서 작성된 산출물(온라인 산출물과 기타 산출물)의 품질을 평가해줘."
    }
    const infoBox: {[key: number]: string} = {
        0: `대학생을 위한 Project Management System(PMS)은
"기존 상용 PMS의 복잡한 기능을 대학생 눈높이에 맞춰 간소화하자"는 목표로, 2024년부터 2025년까지 1년간 남서울대학교 캡스톤 디자인 프로젝트로 개발되었습니다.

기존 PMS에 포함된 CI/CD 등 대학생 수준에서 불필요한 기능은 제거하고, 프로젝트 규모도 축소하여, 산출물 중심의 프로젝트 진행에 집중할 수 있도록 설계되었습니다.

이 PMS를 통해 대학생들은 보다 쉽고 효율적으로 프로젝트를 계획하고 관리할 수 있습니다.`,
        1: `WBS (Work Breakdown Structure)
메뉴 위치: 프로젝트 관리 > WBS 관리

[기능 개요]  
WBS는 프로젝트를 단계별로 세분화하여 구조적으로 정리할 수 있는 기능입니다.  
대학생 팀 프로젝트에서는 역할 분담, 일정 관리, 산출물 추적 등을 보다 명확하게 할 수 있도록 도와줍니다.  
PMS에서는 ‘애자일’, ‘프로토타입’, ‘기타’와 같은 다양한 프로젝트 관리 방법론에 따라 WBS를 유연하게 작성할 수 있습니다.

[주요 화면 구성 및 입력 항목 설명]  
- 대분류 / 중분류 / 소분류 / 액티비티: 작업을 단계적으로 분류할 수 있는 입력칸입니다. 예) 계획 > 프로젝트 아이디어 > 세부활동  
- 작업명: 각 작업의 제목을 입력합니다. 예) 프로젝트 수행 계획  
- 산출물: 해당 작업으로부터 생성되는 결과물을 입력합니다. 예) 프로젝트 계획서  
- 담당자: 해당 작업의 수행자 이름을 입력합니다. 여러 명 입력 가능  
- 비고: 추가적인 설명이나 참고 내용을 입력합니다.  
- 진척률: 해당 작업의 진행 정도를 숫자(%)로 입력합니다. 0~100까지 입력 가능  
- 시작일 / 마감일: 각 작업의 시작과 종료 날짜를 설정합니다.  
- 위/아래 버튼: 작성된 작업의 순서를 조정할 수 있습니다.  
- 삭제 버튼: 해당 행을 삭제합니다.
- 행 추가: 작업을 한 줄 추가합니다.  
- 저장하기: 현재 작성된 WBS 내용을 저장합니다.  
- 초기화: 모든 작업 내용을 초기 상태로 되돌립니다.

[프로젝트 관리 방법론에 따른 WBS 작성 예시]

PMS에서는 프로젝트를 어떤 방식으로 진행할지 선택할 수 있도록, ‘애자일’, ‘폭포수’, ‘기타’ 세 가지 개발 방법론을 지원합니다.  
각 방법론은 작업을 어떤 순서와 구조로 나눌지(WBS 구성)에 영향을 줍니다.  
아래는 각 방법론에 맞춰 WBS를 어떻게 작성하면 되는지를 쉽게 설명한 내용입니다.

1. 애자일 방식  
‘애자일(Agile)’은 프로젝트를 짧은 단위로 나누어 반복적으로 작업하고, 그때그때 피드백을 받아 개선해 나가는 방식입니다.  
이러한 단위를 ‘스프린트(Sprint)’라고 부르며, 보통 1~2주에 한 번씩 새로운 작업을 계획하고 수행합니다.  
WBS는 각 스프린트를 기준으로 나누어 작성하며, 유동적으로 작업 순서를 조정하고, 반복되는 구조로 구성되는 경우가 많습니다.

예시)  
- 1차 스프린트  
  → 기획 회의  
  → 기본 기능 구현  
- 2차 스프린트  
  → 피드백 반영  
  → 기능 개선 및 테스트

이 방식은 **짧은 주기로 작업과 점검을 반복**하기 때문에, 변화에 유연하게 대응하고 팀원 간 협업을 활성화할 수 있습니다.

2. 폭포수 방식  
‘폭포수(Waterfall)’는 프로젝트를 단계별로 나누고, 한 단계가 끝나야 다음 단계로 넘어가는 전통적인 개발 방식입니다.  
WBS는 처음부터 끝까지 순차적으로 구성되며, 각 단계의 작업이 명확히 정의되어 있습니다.  
이 방식은 계획과 일정이 확실한 경우, 그리고 작업 흐름이 한 번에 정해진 경우에 적합합니다.

예시)  
→ 요구사항 분석  
→ 설계  
→ 개발  
→ 테스트  
→ 최종 제출

이 방식은 **예측 가능한 일정 관리**에 유리하지만, 중간에 변경 사항이 생기면 반영이 어렵다는 단점이 있습니다.

3. 기타 방식  
‘기타’는 PMS에서 직접적으로 구조를 제공하지 않는 방식으로 프로젝트를 진행하는 경우에 선택합니다.  
예를 들어, 프로토타입(Prototype) 방식처럼 시제품을 먼저 만든 후, 사용자의 피드백을 받아 여러 차례 수정하는 반복 중심의 방식이 이에 해당합니다.  

PMS에서는 프로토타입 방식처럼 비정형적인 흐름을 직접적으로 지원하지 않기 때문에, WBS를 사용자가 자유롭게 구성해야 합니다.

예시)  
→ 아이디어 스케치  
→ 1차 시제품 제작  
→ 사용자 피드백 수집  
→ 2차 시제품 개선  
→ 최종 시제품 제작 및 보고

이 방식은 직관적으로 먼저 만들어 보고, 그 후에 수정·보완을 반복하는 프로젝트에 적합하며, 디자인이나 창작 중심의 프로젝트에서 많이 사용됩니다.

---

정리하자면,  
- 애자일은 "짧은 기간 단위로 작업을 나누어 반복하며 개선하는 방식"입니다.  
- 폭포수는 "단계별로 순차적으로 진행하는 방식"입니다.  
- 기타는 "PMS가 직접 지원하지 않는 방식(예: 프로토타입)으로 자유롭게 구성하는 방식"입니다.

각 팀은 자신들의 프로젝트 성격에 맞는 방법론을 선택하여 WBS를 작성하면 됩니다.`,
        2: `온라인 산출물  
메뉴 위치: 산출물 작성

[기능 개요]  
‘온라인 산출물’은 프로젝트 진행 과정에서 필요한 각종 문서를 PMS 안에서 직접 작성하고 저장할 수 있는 기능입니다.  
문서는 Word(docx) 형식으로 출력 가능하며 (테스트 케이스 제외), 저장된 문서는 언제든지 다시 불러와 수정할 수 있습니다.

[지원되는 산출물 목록]
아래와 같은 항목을 지원하며, 각 산출물은 정해진 양식에 따라 입력하게 됩니다.

1. 개요서  
   - 프로젝트의 전체 개요와 목표, 기술 스택, 일정, 팀 구성 등을 작성합니다.  
   - 주요 항목: 제목, 시작일, 종료일, 팀 구성 및 역할 분담, 목표, 범위, 기술 스택, 기대 성과 등

2. 회의록  
   - 회의 일시, 안건, 참석자, 회의 내용 및 결정 사항 등을 기록합니다.  
   - 주요 항목: 안건, 날짜, 책임자, 장소, 참석자 정보, 회의 내용, 회의 결과 등

3. 테스트 케이스
   - 서비스나 기능을 테스트한 결과를 기록합니다.  
   - 주요 항목: 테스트 시작일/종료일, 테스트 항목명, 통과 여부 등

4. 요구사항  
   - 시스템과 기능에 대한 요구사항을 작성합니다.  
   - 주요 항목: 시스템 요구사항, 기능 요구사항, 비기능 요구사항 및 설명과 우선순위

5. 보고서  
   - 프로젝트의 전반적인 결과를 정리한 문서입니다.  
   - 주요 항목: 문제 정의, 설계 및 개발 과정, 시스템 구조, 실험 및 결과, 결론 등

[주요 기능]  
- 각 항목은 클릭 시 입력 폼이 열리며, 작성 후 저장할 수 있습니다.  
- ‘저장’ 버튼을 누르면 입력한 내용이 자동으로 보관되며, ‘다운로드’ 버튼을 통해 docx 문서로 저장할 수 있습니다.  
- 저장된 문서는 이후에도 수정이 가능합니다.

[사용 팁]  
- 산출물 작성을 미루지 않고, 단계별로 정리해두면 프로젝트 후반에 보고서를 작성할 때 큰 도움이 됩니다.  
- 회의록과 요구사항 문서는 팀원 간의 합의 내용을 남기는 데 효과적입니다.  
- 각 문서는 Word 형식으로 제출이 가능하므로, 학교나 교수님께 보고할 때도 그대로 활용할 수 있습니다.`,
        3: `기타 산출물  
메뉴 경로: 산출물 작성 > 기타

[기능 개요]  
‘기타 산출물’은 PMS에서 공식적으로 지원하지 않는 형식의 산출물을 업로드할 수 있는 공간입니다.  
주로 문서 외 파일이나 자유 형식 자료들을 첨부하고 보관하는 데 사용됩니다.
기타 산출물로 활용할 수 있는 문서는 산출물 관리 -> 자료실에 있습니다.

[사용 목적 및 예시]  
다음과 같은 산출물 또는 파일들을 업로드할 수 있습니다.

- SOW(Statement of Work): 작업 명세서 등 별도 양식으로 작성된 문서  
- 사진 자료: 실험 사진, 회의 현장 사진 등  
- 기타 설계서: 도면, UI 설계안, 기능 흐름도 등  
- 외부 문서: 교수님 피드백 문서, 참고자료, 기타 팀 내부 자료 등

[주요 기능]  
- 파일 업로드: 사용자는 하나 이상의 파일을 선택하여 시스템에 업로드할 수 있습니다.  
- 파일 정보 저장: 파일명, 업로드 날짜 등이 자동으로 기록됩니다.  
- 파일 다운로드: 업로드된 파일은 필요할 때 언제든지 다운로드할 수 있습니다.  
- 파일 삭제: 불필요하거나 수정이 필요한 파일은 삭제할 수 있습니다.

[사용 팁]  
- 공식 산출물 외에 중요한 참고 자료나 내부 작업 파일이 있다면 이 메뉴를 적극 활용하시기 바랍니다.  
- 파일명에 내용을 요약해서 저장하면 팀원들이 쉽게 찾을 수 있습니다.`,
        4: `업무 관리  
메뉴 경로: 업무 관리

[기능 개요]  
‘업무 관리’는 프로젝트 내에서 발생하는 단기성 또는 비정형 작업을 등록하고 관리할 수 있는 기능입니다.  
‘업무 관리’ 메뉴는 WBS에 등록하기 애매하거나 소규모로 진행되는 작업들을 체계적으로 기록하고 추적하는 데 활용됩니다.

예를 들어 ‘다음 주 발표자료 만들기’, ‘회의록 작성’, ‘중간 보고 회의 준비’ 등  
정형화되지 않은 개별 업무들을 등록하여 관리할 수 있습니다.

[사용 목적 예시]  
- 중간/기말 발표자료 작성  
- 회의 자료 준비  
- 팀원 의견 수렴 회의 주최  
- 결과물 검토 및 수정 작업 등

[화면 구성 설명]

1. 업무 목록 테이블  
- 등록된 업무의 제목, 담당자, 일정, 완료 여부 등을 한눈에 확인할 수 있습니다.  
- ‘업무 수정’ 버튼을 클릭하면 해당 업무의 세부 정보 수정이 가능합니다.

2. 업무 추가  
- ‘업무 추가’ 버튼을 누르면 업무를 새로 등록할 수 있는 창이 나타납니다.  
- 입력 항목:  
  - 할일 제목  
  - 학생 선택  
  - 학번  
  - 시작일 / 종료일  
- ‘완료’ 버튼을 누르면 업무가 목록에 등록됩니다.

3. 업무 수정  
- 등록된 업무는 ‘업무 수정’ 버튼을 통해 내용 변경이 가능합니다.  
- 완료 여부는 업무를 처음 등록할 때가 아니라, 수정 화면에서만 체크할 수 있습니다.  
  (예: 작업이 끝난 뒤, ‘완료 여부’ 체크박스를 선택하여 상태를 갱신합니다.)  
- 필요 시 업무를 삭제할 수도 있습니다.

[주요 기능]  
- 업무 등록 / 수정 / 삭제  
- 담당자 지정  
- 업무 일정 관리  
- 완료 여부 설정 (※ 수정 화면에서 가능)

[사용 팁]  
- 짧은 기간 안에 수행되는 업무나, 반복되지 않는 개별 작업은 WBS보다 업무 관리 메뉴에서 관리하는 것이 더 효율적입니다.  
- 업무 완료 후에는 반드시 ‘업무 수정’에서 완료 여부를 체크하여 업무 상태를 최신으로 유지하시기 바랍니다.  
- 등록된 업무는 자동 저장되며, 추후 다시 열어볼 수 있습니다.`,
        5: `평가  
메뉴 경로: 평가

[기능 개요]  
‘평가’ 메뉴는 교수님 전용 기능으로, 프로젝트 종료 시 교수님이 학생들의 프로젝트를 항목별로 평가할 수 있도록 제공되는 기능입니다.  
학생 계정에서는 이 메뉴가 보이지 않으며, 교수님만 접근하여 평가를 입력하고 저장할 수 있습니다.

[사용 대상]  
- 교수 계정만 이용 가능  
- 학생 계정에서는 평가 메뉴가 비활성화되어 표시되지 않음

[주요 기능 설명]  
교수님은 아래 항목들을 기준으로 프로젝트를 수치화하여 평가할 수 있습니다. 각 항목은 100점 만점 기준으로 점수를 입력합니다.

- 기획 및 자료조사  
- 요구분석  
- 설계  
- 진척관리  
- 형상관리(버전)  
- 협력성(회의록)  
- 품질관리  
- 기술성  
- 발표  
- 완성도

[기능 안내]  
- 점수는 직접 입력할 수 있으며, 모든 항목 입력 후 ‘저장’ 버튼을 누르면 평가가 저장됩니다.  
- 저장된 평가는 시스템에 기록되어, 추후 확인이나 수정이 가능합니다.  
- ‘삭제’ 버튼을 누르면 현재 입력된 평가가 초기화됩니다.

[사용 팁]  
- 항목별로 점수를 입력할 때, 실제 프로젝트 결과물(산출물, 회의록, 업무 진행 상황 등)을 참고하시면 더 객관적인 평가가 가능합니다.  
- 팀 평가 외에 개인별 평가가 필요한 경우에는 별도로 수기 평가 또는 개별 메모 기능을 활용하시기 바랍니다.`,
        6: `프로젝트 관리  
메뉴 경로: 프로젝트 관리

[기능 개요]  
‘프로젝트 관리’는 프로젝트의 기본 정보 설정, 진행 상황 저장 및 복원, 삭제 기능 등을 제공하는 메뉴입니다.  
이 메뉴를 통해 프로젝트의 전체 흐름을 관리하고, 중요한 시점마다 저장하거나 과거 상태로 되돌릴 수 있습니다.

[기본 정보 수정]  
- 프로젝트 이름, 설명, 개발 방법론, 인원 수, 기간, 강의명, 담당 교수 등의 정보를 수정할 수 있습니다.  
- 모든 항목은 수정 후 ‘수정’ 버튼을 눌러 저장합니다.

[불러오기 / 저장하기 (구: 가져오기 / 내보내기)]  
이 기능은 GitHub의 커밋 기능처럼 특정 시점의 프로젝트 상태를 저장하고, 나중에 다시 불러올 수 있는 기능입니다.  
프로젝트를 진행하면서 분기점이나 중요한 변화가 있을 때 저장해두면, 다음과 같은 상황에서 유용하게 사용할 수 있습니다.

예시:  
- 실수로 산출물을 삭제했을 때  
- 개발 방향을 이전 상태로 되돌리고 싶을 때  
- 발표용 백업본을 따로 저장해두고 싶을 때  

▶ 저장하기 (프로젝트 저장하기 / 프로젝트 내보내기)  
- 현재 프로젝트의 진행 상태를 저장합니다.  
- 저장 시 변경사항에 대한 설명을 입력할 수 있으며, 저장된 시점은 ‘버전 목록’에 기록됩니다.  

▶ 불러오기  
- 저장된 이전 프로젝트 상태를 불러올 수 있습니다.  
- 원하는 버전을 선택하여 클릭하면 해당 시점으로 프로젝트가 되돌아갑니다.  
- 각 버전은 시간, 설명과 함께 나열되어 있어 관리가 용이합니다.

[프로젝트 삭제 및 복원]  
- 하단의 ‘프로젝트 삭제’ 영역에서 텍스트 박스에 "삭제하겠습니다."를 입력하고 삭제 버튼을 누르면 프로젝트가 삭제됩니다.  
- 실수로 프로젝트를 삭제했을 경우, 메인 메뉴의 ‘새로운 프로젝트’ > ‘프로젝트 복원’ 기능을 통해 최근 저장된 상태로 복원할 수 있습니다.  
  ※ 저장된 버전이 없을 경우 복원이 불가능하니, 중요한 작업 후에는 반드시 저장하기를 활용하시기 바랍니다.

[사용 팁]  
- 새로운 기능을 추가하거나 중요한 변경을 하기 전에는 반드시 저장하기(프로젝트 내보내기)를 통해 상태를 백업해두시기 바랍니다.  
- 버전별로 저장 설명을 남기면, 추후 어떤 시점에 어떤 변경이 있었는지 추적이 쉬워집니다.  
- 저장된 상태는 시간순 정렬되어 나열되며, 언제든지 되돌릴 수 있습니다.`
    }
    const [input, setInput] = useState<string>('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [nowLoading, setLoading] = useState(false);
    const s_no = getUnivId()
    const permission = usePermissionGuard(pid, s_no, {leader: 1, llm: [1, 2]}, false)

    useEffect(() => {
        if(permission !== null && permission){
            setMessages((prevMessages) => [...prevMessages, "INIT_0"]);
        }
    }, [permission])

    const handleMessageChange = (change: string) => {
        setMessages((prev) => {
            if(prev.length === 0){
                return [change];
            }
            return [...prev.slice(0, prev.length -1), change]
        })
    }
    
    function getMessageByNumber(option: number): string{
        return messageBox[option] || "";
    }

    const handleSendMessage = async(messageCode: number) => {
        if(pid === 0) return;
        if(nowLoading) return;
        setInput('');
        setLoading(true)
        handleMessageChange(getMessageByNumber(messageCode))
        try{
          const response = await axios.post("https://cd-api.chals.kim/api/llm/load_key", {pid: pid, api_key: ''}, {headers:{Authorization: process.env.SECRET_API_KEY}});
          if(response.data.RESULT_CODE !== 200){
            setMessages((prevMessages) => [...prevMessages, "API Key를 입력해주세요."]);
            setMessages((prevMessages) => [...prevMessages, "INIT_0"]); // 사용자 메시지 추가
            setLoading(false);
            return
          }
        }catch(err){}

        try{
            const response = await axios.post("https://cd-api.chals.kim/api/llm/interact", {pid: pid, prompt: "", menu: messageCode}, {headers:{Authorization: process.env.SECRET_API_KEY}});
            const tmpMessage = response.data
            setMessages((prevMessages) => [...prevMessages, tmpMessage]); // 상대방 메시지 추가
        }catch(err){
            setMessages((prevMessages) => [...prevMessages, "오류가 발생했습니다."]); // 상대방 메시지 추가
        }finally{
            setLoading(false);
            setMessages((prevMessages) => [...prevMessages, "INIT_0"]); // 사용자 메시지 추가
        }
    };

    const handleInfoMessage = (messageCode: number, text: string) => {
        handleMessageChange(`'${text}'에 대해 알려줘`)
        setMessages((prevMessages) => [...prevMessages, infoBox[messageCode]]); // 상대방 메시지 추가
        setMessages((prevMessages) => [...prevMessages, "INIT_0"]); // 사용자 메시지 추가
    }

    // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (e.key === 'Enter') handleSendMessage(); // 엔터키로 메시지 전송
    // };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                maxHeight: '100%',
                minHeight: '100%',
                border: '1px solid #ccc',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                margin: '0 auto',
            }}
        >
            {/* 채팅창 영역 */}
            <div
                ref={chatContainerRef}
                style={{
                    flex: 1,
                    padding: '10px',
                    paddingBottom: '0',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    minHeight: 'calc(100% - 70px)',
                    maxHeight: 'calc(100% - 70px)'
                }}
            >
                {messages.map((msg, index) => {
                    // 기본 스타일
                    const baseStyle: React.CSSProperties = {
                        // alignSelf: index % 2 === 0 ? "flex-start" : "flex-end",
                        alignSelf: "flex-start",
                        maxWidth: "70%",
                        padding: "10px",
                        // paddingBottom: '0px',
                        borderRadius: "10px",
                        backgroundColor: index % 2 === 0 ? "#f1f0f0" : "#daf8cb",
                        color: "#333",
                        wordWrap: "break-word",
                        whiteSpace: "pre-wrap",
                        display: "flex", 
                        flexDirection: "column" 
                    };

                    let content: React.ReactNode;

                    switch (msg) {
                        case "INIT_0":
                            content = (
                                <>
                                <span>PMS Advisor에게 묻고싶은 메뉴를 선택해주세요.</span>
                                <div style={{ marginTop: "20px" }}>
                                <ChatbotButton label="📋 프로젝트" onClick={() => handleMessageChange("INIT_1")} />
                                <ChatbotButton label="📂 산출물" onClick={() => handleMessageChange("INIT_2")} />
                                <ChatbotButton label="❔ 서비스 안내" onClick={() => handleMessageChange("INIT_3")} />

                                </div>
                                </>
                            );
                            break;
                            case "INIT_1":    
                            content = (
                              <>
                                <span>프로젝트에 관하여 어떤 도움이 필요하신가요?</span>
                                <div style={{ marginTop: "20px" }}>
                                  <ChatbotButton label="👓 프로젝트 분석 및 조언" onClick={() => handleSendMessage(0)} />
                                  <ChatbotButton label="🔍 프로젝트 리스크 분석" onClick={() => handleSendMessage(1)} />
                                  <ChatbotButton label="👍 프로젝트 초기 기획 추천" onClick={() => handleSendMessage(2)} />
                                  <ChatbotButton label="🔙 돌아가기" onClick={() => handleMessageChange("INIT_0")} />
                                </div>
                              </>
                            )
                            break;
                          
                          case "INIT_2":
                            content = (
                              <>
                                <span>산출물에 관하여 어떤 도움이 필요하신가요?</span>
                                <div style={{ marginTop: "20px" }}>
                                  <ChatbotButton label="🔍 작성된 산출물 분석" onClick={() => handleSendMessage(3)} />
                                  <ChatbotButton label="📝 산출물 품질 평가" onClick={() => handleSendMessage(4)} />
                                  <ChatbotButton label="🔙 돌아가기" onClick={() => handleMessageChange("INIT_0")} />
                                </div>
                              </>
                            )
                            break;
                          
                          case "INIT_3":
                            content = (
                              <>
                                <span></span>
                                <div style={{ marginTop: "20px" }}>
                                  <ChatbotButton label="❔ 대학생을 위한 PMS 서비스란?" onClick={() => handleInfoMessage(0, '대학생을 위한 PMS 서비스')} />
                                  <ChatbotButton label="🗂️ 각 메뉴별 안내" onClick={() => handleMessageChange("INIT_4")} />
                                  <ChatbotButton label="🔙 돌아가기" onClick={() => handleMessageChange("INIT_0")} />
                                </div>
                              </>
                            )
                            break;
                          
                          case "INIT_4":
                            content = (
                              <>
                                <span></span>
                                <div style={{ marginTop: "20px" }}>
                                  <ChatbotButton label="WBS" onClick={() => handleInfoMessage(1, "WBS")} />
                                  <ChatbotButton label="온라인 산출물" onClick={() => handleInfoMessage(2, "온라인 산출물")} />
                                  <ChatbotButton label="기타 산출물" onClick={() => handleInfoMessage(3, "기타 산출물")} />
                                </div>
                                <div style={{ marginTop: "20px" }}>
                                  <ChatbotButton label="업무 관리" onClick={() => handleInfoMessage(4, "업무 관리")} />
                                  <ChatbotButton label="평가" onClick={() => handleInfoMessage(5, "평가")} />
                                  <ChatbotButton label="프로젝트 관리" onClick={() => handleInfoMessage(6, "프로젝트 관리")} />
                                </div>
                                <div style={{ marginTop: "20px" }}>
                                  <ChatbotButton label="🔙 돌아가기" onClick={() => handleMessageChange("INIT_0")} />
                                </div>
                              </>
                            )
                            break;
                          
                        default:
                        content = msg;
                    }

                    return (
                        <div key={index} style={baseStyle}>
                        {content}
                        </div>
                    );
                    })}
            </div>

            {/* 입력창 영역 */}
            {/* <div
                style={{
                    height: '40px',
                    display: 'flex',
                    borderTop: '1px solid #ccc',
                    padding: '10px',
                    backgroundColor: '#fff',
                }}
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    // onKeyDown={handleKeyDown}
                    readOnly
                    placeholder="메시지를 입력하세요..."
                    style={{
                        flex: 1,
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        outline: 'none',
                        marginRight: '10px',
                    }}
                />
                <button
                    // onClick={handleSendMessage}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    {(nowLoading ? "로딩 중" : "확인")}
                </button>
            </div> */}
        </div>
    )
}
export default LLMChat;


const ChatbotButton = ({ label, onClick }: { label: string; onClick: () => void }) => {
    const [hovered, setHovered] = useState(false);
  
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: 'none',
          backgroundColor: hovered ? '#3182F6' : '#FFFFFF', // ✅ hover 시 파란색
          color: hovered ? '#fff' : '#333',
          borderRadius: '8px',
          padding: '8px 15px',
          margin: '3px 5px',
          cursor: 'pointer',
          minHeight: '40px',
          transition: 'all 0.3s ease',
        }}
      >
        {label}
      </button>
    );
  };
  