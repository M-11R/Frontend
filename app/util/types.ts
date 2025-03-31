export type listType = {
    type: string;
    displayType: string;
    title: string;
    date: string;
    file_no: number;
};
export type returnEtc = {
    RESULT_CODE: number;
    RESULT_MSG: string;
    PAYLOADS: etcType[];
};
export type etcType = {
    file_no: number;
    file_name: string;
    file_path: string;
    file_date: Date;
    s_no: number;
};
export type returnOvr = {
    RESULT_CODE: number;
    RESULT_MSG: string;
    PAYLOADS: ovrType[];
};
export type ovrType = {
    doc_s_no: number;
    doc_s_name: string;
    doc_s_overview: string;
    doc_s_goals: string;
    doc_s_range: string;
    doc_s_outcomes: string;
    doc_s_team: string;
    doc_s_stack: string;
    doc_s_start: string;
    doc_s_end: string;
    doc_s_date: Date;
};
export type returnMm = {
    RESULT_CODE: number;
    RESULT_MSG: string;
    PAYLOADS: mmType[];
};
export type mmType = {
    doc_m_no: number;
    doc_m_title: string;
    doc_m_date: Date;
    doc_m_loc: string;
    doc_m_member: string;
    doc_m_manager: string;
    doc_m_content: string;
    doc_m_result: string;
};
export type returnReq = {
    RESULT_CODE: number;
    RESULT_MSG: string;
    PAYLOADS: reqType[];
};
export type reqType = {
    doc_r_no: number;
    doc_r_f_name: string;
    doc_r_f_content: string;
    doc_r_f_priority: string;
    doc_r_nf_name: string;
    doc_r_nf_content: string;
    doc_r_nf_priority: string;
    doc_r_s_name: string;
    doc_r_s_content: string;
    doc_r_date: Date;
};
export type returnTest = {
    RESULT_CODE: number;
    RESULT_MSG: string;
    PAYLOADS: testType[];
};
export type testType = {
    doc_t_no: number;
    doc_t_group1: string;
    doc_t_name: string;
    doc_t_start: Date;
    doc_t_end: Date;
    doc_t_pass: boolean;
};
export type returnReport = {
    RESULT_CODE: number;
    RESULT_MSG: string;
    PAYLOADS: reportType[];
};
export type reportType = {
    doc_rep_no: number;
    doc_rep_name: string;
    doc_rep_writer: string;
    doc_rep_date: Date;
    doc_rep_pname: string;
    doc_rep_member: string;
    doc_rep_professor: string;
    doc_rep_research: string;
    doc_rep_design: string;
    doc_rep_arch: string;
    doc_rep_result: string;
    doc_rep_conclusion: string;
};