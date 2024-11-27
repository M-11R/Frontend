'use client'

import React from "react";
import Link from "next/link";

type PaginationProps = {
    currentPage: number,
    totalPages: number,
    basePath: string
};

const Pagenation = ({ currentPage, totalPages, basePath }: PaginationProps) => {
    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <Link href={`${basePath}?page=${currentPage - 1}`}>
                <button disabled={currentPage === 1}>이전</button>
            </Link>
            {Array.from({ length: totalPages }, (_, index) => (
                <Link key={index} href={`${basePath}?page=${index + 1}`}>
                    <button style={{margin: "0 5px",fontWeight: currentPage === index + 1 ? "bold" : "normal", border: '0', backgroundColor: 'transparent', fontSize: '15px'}}>
                        {index + 1}
                    </button>
                </Link>
            ))}
            <Link href={`${basePath}?page=${currentPage + 1}`}>
                <button disabled={currentPage === totalPages} style={{fontSize: '12px'}}>다음</button>
            </Link>
        </div>
    );
};

export default Pagenation