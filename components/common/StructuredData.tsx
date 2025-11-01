/**
 * JSON-LD 구조화 데이터를 안전하게 렌더링하는 컴포넌트
 * XSS 방지 및 타입 안전성 제공
 */
export default function StructuredData({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
