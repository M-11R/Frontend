'use client'

import library from "@/app/json/library.json";
import Link from "next/link";

const LibraryTable = ({ pid }: { pid: number }) => {
  const libraryList = library.list;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "880px",
        margin: "30px auto",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
        border: "1px solid #e5e7eb",
      }}
    >
      {/* 테이블 헤더 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr 140px",
          backgroundColor: "#f1f5f9",
          color: "#334155",
          fontWeight: 600,
          padding: "14px 20px",
          fontSize: "16px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div style={{ textAlign: "center" }}>번호</div>
        <div>제목</div>
        <div style={{ textAlign: "center" }}>다운로드</div>
      </div>

      {/* 테이블 행 */}
      {libraryList.map((item, index) => (
        <div
          key={item.key}
          style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr 140px",
            padding: "14px 20px",
            fontSize: "15px",
            backgroundColor: index % 2 === 0 ? "#fff" : "#f9fafb",
            borderBottom: "1px solid #f1f5f9",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#f0fdf4")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor =
              index % 2 === 0 ? "#fff" : "#f9fafb")
          }
        >
          <div
            style={{
              textAlign: "center",
              color: "#94a3b8",
              fontWeight: 500,
            }}
          >
            {index + 1}
          </div>
          <div style={{ wordBreak: "break-word" }}>{item.name}</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link
              href={`/project-main/${pid}/library/${item.type}`}
              style={{
                backgroundColor: "#22c55e",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "bold",
                textDecoration: "none",
                display: "inline-block",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#16a34a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#22c55e")
              }
            >
              📥 다운로드
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LibraryTable;
