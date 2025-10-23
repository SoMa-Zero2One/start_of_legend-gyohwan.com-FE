# Zustand와 React 리렌더링 메커니즘

## 목차
1. [React의 리렌더링 기본 원리](#react의-리렌더링-기본-원리)
2. [Zustand의 구독 메커니즘](#zustand의-구독-메커니즘)
3. [전체 구독 vs Selector 비교](#전체-구독-vs-selector-비교)
4. [실전 최적화 가이드](#실전-최적화-가이드)
5. [FAQ](#faq)

---

## React의 리렌더링 기본 원리

### 1. 참조 동등성 (Reference Equality)

React는 **참조 동등성(===)** 으로 변경을 감지합니다.

```typescript
// React의 useState 예시
const [state, setState] = useState({ name: 'John', age: 25 });

// 이렇게 하면?
setState({ name: 'John', age: 25 });

// React는 이렇게 비교:
const oldState = { name: 'John', age: 25 };
const newState = { name: 'John', age: 25 };

oldState === newState  // false! (다른 객체 참조)
// → 리렌더링 발생!
```

**핵심**: 값이 같아도 **새로운 객체면 리렌더링**

### 2. 불변성 (Immutability)

React는 불변성을 기반으로 동작합니다:

```typescript
// ❌ 잘못된 방식 (불변성 위반)
const state = { user: 'John' };
state.user = 'Jane';  // 기존 객체 수정
// React가 변경을 감지 못함!

// ✅ 올바른 방식 (불변성 유지)
const state = { user: 'John' };
const newState = { ...state, user: 'Jane' };  // 새 객체 생성
// React가 변경 감지 가능!
```

---

## Zustand의 구독 메커니즘

### 1. Zustand 내부 구현 (단순화 버전)

```typescript
// Zustand 핵심 코드 (단순화)
function create(createState) {
  let state = createState(setState);
  const listeners = new Set();

  // 상태 업데이트 함수
  function setState(partial) {
    const newState = { ...state, ...partial };  // 새 객체 생성!
    state = newState;

    // 모든 리스너에게 알림
    listeners.forEach(listener => listener(state));
  }

  // 리스너 등록
  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  // React Hook
  function useStore(selector) {
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
      return subscribe((newState) => {
        // 여기가 핵심!
        if (selector) {
          // Selector가 있으면
          const newValue = selector(newState);
          const oldValue = selector(state);

          if (newValue !== oldValue) {  // 참조 비교
            forceUpdate();  // 리렌더링!
          }
        } else {
          // Selector 없으면 무조건 리렌더링!
          forceUpdate();
        }
      });
    }, []);

    return selector ? selector(state) : state;
  }

  return useStore;
}
```

### 2. 구독 방식

Zustand는 **store 전체를 하나의 구독 단위**로 봅니다:

```typescript
const listeners = new Set();

// set() 호출 시:
function set(partial) {
  state = { ...state, ...partial };  // 새 state 객체 생성

  // 모든 리스너에게 "state 바뀌었어!" 알림
  listeners.forEach(listener => listener(state));
}

// 전체 구독한 컴포넌트:
listeners.add((newState) => {
  // selector 없으면 무조건 리렌더링!
  forceUpdate();
});

// Selector 사용한 컴포넌트:
listeners.add((newState) => {
  const newValue = selector(newState);
  if (newValue !== oldValue) {  // 비교 후 다르면
    forceUpdate();
  }
});
```

---

## 전체 구독 vs Selector 비교

### 1. 전체 구독 (useAuthStore())

```typescript
const { user, isLoading, fetchUser } = useAuthStore();

// 내부 동작:
useStore()  // selector 없음!
// ↓
// subscribe((newState) => {
//   forceUpdate();  // 항상 리렌더링!
// })
```

**동작 시나리오**:
```typescript
// authStore 변경:
set({ user: newUser })      // → 모든 구독자 리렌더링 ✅
set({ isLoading: false })   // → 모든 구독자 리렌더링 ✅
set({ isLoggedIn: true })   // → 모든 구독자 리렌더링 ✅

// 심지어 fetchUser만 쓰는 컴포넌트도 리렌더링!
```

### 2. Selector 구독 (useAuthStore(state => state.fetchUser))

```typescript
const fetchUser = useAuthStore((state) => state.fetchUser);

// 내부 동작:
useStore((state) => state.fetchUser)
// ↓
// subscribe((newState) => {
//   const newValue = newState.fetchUser;
//   const oldValue = oldState.fetchUser;
//
//   if (newValue !== oldValue) {  // 함수 참조 비교
//     forceUpdate();
//   }
// })
```

**동작 시나리오**:
```typescript
// authStore 변경:
set({ user: newUser })      // → fetchUser 안 바뀜 → 리렌더링 ❌
set({ isLoading: false })   // → fetchUser 안 바뀜 → 리렌더링 ❌
set({ isLoggedIn: true })   // → fetchUser 안 바뀜 → 리렌더링 ❌

// fetchUser는 store 생성 시 한 번만 만들어지고 절대 안 바뀜!
```

### 3. 구체적인 예시

```typescript
// authStore 상태 변화
const state1 = {
  user: null,
  isLoading: true,
  fetchUser: () => {}  // 함수 A
};

// fetchUser() 호출 후
const state2 = {
  user: { name: "홍길동" },  // 변경됨 ✅
  isLoading: false,            // 변경됨 ✅
  fetchUser: () => {}          // 함수 A (동일!) ✅
};

// 전체 구독 컴포넌트
const { fetchUser } = useAuthStore();
// state1 !== state2  // true (다른 객체)
// → 리렌더링 발생! ❌ (fetchUser만 쓰는데 왜?)

// Selector 컴포넌트
const fetchUser = useAuthStore((state) => state.fetchUser);
// state1.fetchUser === state2.fetchUser  // true (같은 함수!)
// → 리렌더링 안 함! ✅
```

---

## 실전 최적화 가이드

### 1. 언제 전체 구독을 써도 괜찮은가?

```typescript
// ✅ 여러 값을 사용하는 경우
const { user, isLoading, isLoggedIn } = useAuthStore();

if (isLoading) return <Loading />;
if (!isLoggedIn) return <Login />;
return <div>{user.name}</div>;
```

**이유**: 세 값 모두 사용하므로 어차피 리렌더링 필요

### 2. 언제 Selector를 써야 하는가?

```typescript
// ✅ 함수만 사용하는 경우
const fetchUser = useAuthStore((state) => state.fetchUser);

// ✅ 특정 값 하나만 사용하는 경우
const user = useAuthStore((state) => state.user);

// ✅ 큰 store에서 일부만 사용하는 경우
const theme = useAppStore((state) => state.theme);
// store에 100개 값이 있지만 theme만 필요
```

### 3. 여러 값을 Selector로 가져오기

```typescript
import { shallow } from 'zustand/shallow';

// ❌ 문제: 매번 새 객체 생성 → 항상 리렌더링
const { user, isLoading } = useAuthStore((state) => ({
  user: state.user,
  isLoading: state.isLoading,
}));

// ✅ 해결: shallow 비교 사용
const { user, isLoading } = useAuthStore(
  (state) => ({
    user: state.user,
    isLoading: state.isLoading,
  }),
  shallow  // 객체의 값들을 얕게 비교
);
```

### 4. 실무 가이드라인

```typescript
// 👶 소규모 프로젝트 / 프로토타입
const { user, isLoading, fetchUser } = useAuthStore();
// → 편하게 개발

// 🏢 중대형 프로젝트
const user = useAuthStore((state) => state.user);
const fetchUser = useAuthStore((state) => state.fetchUser);
// → 성능 중요

// 🚀 최적화 필요
const { user, isLoading } = useAuthStore(
  (state) => ({ user: state.user, isLoading: state.isLoading }),
  shallow
);
```

---

## FAQ

### Q1: 왜 다른 값이 바뀌는데 fetchUser만 쓰는 컴포넌트가 리렌더링되나요?

**A**: Zustand는 기본적으로 **store 전체를 구독**합니다.

```typescript
const { fetchUser } = useAuthStore();

// 이는 내부적으로:
// "store에 무슨 변경이든 일어나면 알려줘"
// user 변경 → 알림 → 리렌더링 ❌ (필요 없는데!)
// isLoading 변경 → 알림 → 리렌더링 ❌ (필요 없는데!)
```

Selector를 사용하면:
```typescript
const fetchUser = useAuthStore((state) => state.fetchUser);

// 내부적으로:
// "fetchUser가 바뀔 때만 알려줘"
// user 변경 → fetchUser 비교 → 같음 → 리렌더링 안 함 ✅
```

### Q2: fetchUser는 언제 바뀌나요?

**A**: Store가 다시 생성될 때만 바뀝니다.

```typescript
export const useAuthStore = create<AuthStore>((set) => ({
  fetchUser: async () => { ... },  // 한 번만 생성
}));

// 이 함수는:
// - 앱 시작 시 한 번 생성
// - 이후 절대 안 바뀜
// - 앱 재시작하거나 페이지 새로고침할 때만 다시 생성
```

### Q3: 왜 Zustand는 기본을 selector로 안 하나요?

**A**: 개발자 경험(DX)과 편의성 때문입니다.

```typescript
// ✅ 편함 - 초보자 친화적
const { user, isLoading, fetchUser } = useAuthStore();

// ❌ 귀찮음 - 매번 selector 작성
const user = useAuthStore(state => state.user);
const isLoading = useAuthStore(state => state.isLoading);
const fetchUser = useAuthStore(state => state.fetchUser);
```

**Zustand 철학**: "일단 쉽게 시작하고, 필요하면 최적화하자"

### Q4: 언제 최적화해야 하나요?

**A**: 다음 경우에 최적화를 고려하세요:

1. **성능 프로파일링으로 문제 발견**
   - React DevTools로 불필요한 리렌더링 확인

2. **큰 store 사용 (10개 이상의 값)**
   - 많은 값 중 일부만 사용하는 경우

3. **자주 변경되는 값**
   - 1초에 여러 번 업데이트되는 경우

4. **함수만 사용하는 컴포넌트**
   - fetchUser, logout 같은 함수만 쓰는 경우

### Q5: Zustand vs Redux vs Jotai?

| 특징 | Zustand | Redux | Jotai |
|------|---------|-------|-------|
| 보일러플레이트 | 매우 적음 | 많음 | 적음 |
| 학습 곡선 | 쉬움 | 어려움 | 중간 |
| 번들 크기 | ~1KB | ~6KB | ~3KB |
| 최적화 | 선택적 (필요시) | 강제 | 기본 제공 |
| 사용법 | Hook | Provider + Hook | Atom + Hook |
| 철학 | 유연성 | 엄격성 | 원자성 |

---

## 실제 측정 예시

### 1. 리렌더링 카운트 측정

```typescript
export default function LoginForm() {
  const renderCount = useRef(0);
  renderCount.current++;
  console.log('LoginForm 렌더링 횟수:', renderCount.current);

  // 방법 1: 전체 구독
  const { fetchUser } = useAuthStore();

  // 방법 2: Selector
  // const fetchUser = useAuthStore((state) => state.fetchUser);

  // ...
}
```

**테스트 시나리오**:
1. 로그인 페이지 열기 → 렌더링 1회
2. 다른 탭에서 로그인 (user 업데이트)
3. 콘솔 확인

**결과**:
- 방법 1: "렌더링 횟수: 2" ❌ (불필요한 리렌더링)
- 방법 2: "렌더링 횟수: 1" ✅ (리렌더링 안 됨)

### 2. 성능 영향 측정

```typescript
// 10번 user 업데이트 시뮬레이션
for (let i = 0; i < 10; i++) {
  useAuthStore.getState().fetchUser();
}

// 결과:
// - 방법 1 (전체 구독): 11번 렌더링 (초기 1회 + 업데이트 10회)
// - 방법 2 (Selector): 1번 렌더링 (초기 1회만)
```

---

## 참고 자료

- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [React 리렌더링 가이드](https://react.dev/learn/render-and-commit)
- [React 성능 최적화](https://react.dev/learn/keeping-components-pure)

---

## 마무리

### 핵심 요약

1. **React는 참조 동등성(===)으로 변경 감지**
   - 새 객체 = 리렌더링

2. **Zustand는 store 전체를 구독 단위로 관리**
   - 전체 구독 = 모든 변경에 리렌더링
   - Selector = 선택한 값만 비교하여 리렌더링

3. **함수는 절대 안 바뀜**
   - Store 생성 시 한 번만 생성
   - Selector 사용 시 영원히 리렌더링 안 됨

4. **최적화는 필요할 때만**
   - 작은 프로젝트: 전체 구독 OK
   - 성능 문제 발견 시: Selector 사용
   - 함수만 사용: 항상 Selector 권장

### 실용적인 가이드

```typescript
// 🎯 권장 패턴
// 여러 값 사용 → 전체 구독
const { user, isLoading, isLoggedIn } = useAuthStore();

// 함수만 사용 → Selector
const fetchUser = useAuthStore((state) => state.fetchUser);

// 하나만 사용 → Selector
const user = useAuthStore((state) => state.user);

// 성능 중요 + 여러 값 → Selector + shallow
import { shallow } from 'zustand/shallow';
const { user, isLoading } = useAuthStore(
  (state) => ({ user: state.user, isLoading: state.isLoading }),
  shallow
);
```
