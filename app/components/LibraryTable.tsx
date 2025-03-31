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
        border: "1px solid #e5e7eb"
      }}
    >
      {/* 테이블 헤더 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr",
          backgroundColor: "#f1f5f9",
          color: "#334155",
          fontWeight: 600,
          padding: "14px 20px",
          fontSize: "16px",
          borderBottom: "1px solid #e5e7eb"
        }}
      >
        <div style={{ textAlign: "center" }}>번</div>
        <div>제목</div>
      </div>

      {/* 테이블 행 */}
      {libraryList.map((item, index) => (
        <div
          key={item.key}
          style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr",
            padding: "14px 20px",
            fontSize: "15px",
            backgroundColor: index % 2 === 0 ? "#fff" : "#f9fafb",
            borderBottom: "1px solid #f1f5f9",
            transition: "background 0.2s",
            cursor: "pointer",
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
          <div>
            <Link
              href={`/project-main/${pid}/library/${item.type}`}
              style={{
                color: "#22c55e",
                textDecoration: "none",
                fontWeight: 500,
                wordBreak: "break-all",
              }}
            >
              {item.name}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LibraryTable;
