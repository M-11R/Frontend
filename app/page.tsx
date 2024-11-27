import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        backgroundImage: "url('/background.jpg')", // 배경 이미지 추가
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#333",  // 글씨 색상을 좀 더 부드러운 회색으로 설정
        textAlign: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* 헤더 영역 */}
      <header style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        display: "flex",
        gap: "15px",
      }}>
          <Link href="/util/SignOut" legacyBehavior>
            <a style={{ fontSize: "1em", color: "#0070f3", textDecoration: "none", fontWeight: "bold" }}>로그아웃</a>
          </Link>
          <Link href="/sign/signIn" legacyBehavior>
            <a style={{ fontSize: "1em", color: "#0070f3", textDecoration: "none", fontWeight: "bold" }}>로그인</a>
          </Link>
          {/* <div style={{border: '1px solid #000000', width: '200px', height: '50px'}}><SignBtn /></div> */}
        </header>

      {/* 메인 콘텐츠 */}
      <main style={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        maxWidth: "600px",
      }}>
        <h1 style={{ fontSize: "3em", marginBottom: "20px", color: "#0070f3" }}>Capstone Design</h1>
        <p style={{ fontSize: "1.25em", lineHeight: "1.6" }}>
           [대학생 프로젝트 매니저]를 목표로 합니다. 다양한 기능과 경험을 통해 사용자가 원하는 목표를 달성할 수 있도록 돕는 웹 애플리케이션입니다.
        </p>
        <Link href="/create-project" legacyBehavior>
  <a style={{
    marginTop: "20px",
    display: "inline-block",
    padding: "10px 20px",
    fontSize: "1.1em",
    backgroundColor: "#0070f3",
    color: "white",
    borderRadius: "5px",
    textDecoration: "none",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease"
  }}>프로젝트 시작하기</a>
</Link>




      </main>
    </div>
  );
}
