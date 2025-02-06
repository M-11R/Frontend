'use client'

import library from "@/app/json/library.json";
import Link from "next/link";

const LibraryTable = ({pid}: {pid: number}) => {
    const libraryList = library.list
    return (
        <div
          style={{
            margin: "5% auto",
            width: "70%",
            maxWidth: "1000px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "#f9f9f9",
            }}
          >
            {/* 테이블 헤더 */}
              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  borderRight: "1px solid #ddd",
                  padding: "10px",
                }}
              >
                제목
              </div>
            </div>
    
            {/* 테이블 데이터 */}
            {libraryList.map((item) => (
              <div
                key={item.key}
                style={{
                  display: "flex",
                  height: "50px",
                  alignItems: "center",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    borderRight: "1px solid #ddd",
                    padding: "10px",
                    color: "#555",
                  }}
                >
                  {item.key + 1}
                </div>
                <div
                  style={{
                    flex: 4,
                    textAlign: "center",
                    borderRight: "1px solid #ddd",
                    padding: "10px",
                    color: "#4CAF50",
                  }}
                >
                  <Link href={`/project-main/${pid}/library/${item.type}`}>
                    {item.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
    )
}

export default LibraryTable;