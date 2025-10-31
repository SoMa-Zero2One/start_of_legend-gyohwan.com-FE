## 📦 ISR 캐싱 및 On-demand Revalidation

홈페이지(`/`)는 **24시간마다 자동으로 재생성**되는 ISR(Incremental Static Regeneration) 캐싱이 적용되어 있습니다.

### 자동 재생성 (24시간마다)

- 첫 빌드 시 정적 페이지 생성
- 이후 24시간 동안 캐시된 HTML 제공 (초고속)
- 24시간 후 첫 요청 시 백그라운드에서 재생성

### 즉시 캐시 무효화 (On-demand Revalidation)

백엔드에서 **새로운 시즌을 등록하거나 수정한 직후**, 프론트엔드 캐시를 즉시 갱신하려면:

#### 1. API 호출을 통해 캐시 무효화

```bash
curl -X POST "https://gyohwan.com/api/revalidate?secret=YOUR_SECRET"
```

**응답 예시:**

```json
{
  "revalidated": true,
  "path": "/",
  "timestamp": "2025-01-31T12:34:56.789Z"
}
```
