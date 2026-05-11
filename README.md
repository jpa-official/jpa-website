# JUNGLIM PLANNING ADVISORY ©2026

미니멀 블랙 & 화이트 + 레드 액센트 톤의 스튜디오 포트폴리오 웹사이트. 모션 그래픽과 인터랙션을 추가하여 제작되었습니다.

## ✅ 구현 완료된 기능

### 메인 페이지 (index.html)
1. **인트로 로더** — jpa. 로고 이미지 페이드 인 + 0→100% 진행률 카운터
2. **헤더** — 좌측 jpa. 로고(78px) + 우측 네비게이션 (ABOUT / SERVICES / PROJECTS / CONTACT), 스크롤 시 자동 숨김/표시
3. **Hero 섹션** — "JUNGLIM PLANNING ADVISORY ©2026" 단어 단위 마스크 리빌, 스크롤 패럴럭스
4. **SERVICES 섹션** — 호버 시 검은 배경 슬라이드 업 + 흰색 글씨 반전
5. **PROJECTS 섹션** — 2열 그리드 카드 + MORE PROJECTS 텍스트 링크
6. **CONTACT 섹션** — Address(네이버 지도 슬리퍼맨션 연결), Email, Phone, SEND MESSAGE 버튼
7. **Footer** — 메가 타이틀 좌→우 슬라이드 인

### ABOUT 페이지 (about.html)
1. **Hero** — "TAILORED / SPACE / SOLUTION." 단어 단위 리빌 + 한글 부제
2. **01 VALUE** — 유무형의 가치 실현 인트로
3. **02 PHILOSOPHY** — Space & People / Tailored Perspective / Brand × Space / Creator Collective
4. **03 JUNGLIM'S FIRST CIC** — 1200+ / 290+ / 1120+ / 300+ 숫자 카운터 (IntersectionObserver, ease-out cubic)
5. **04 INTEGRATED SOLUTION** — Planning → Experience → Design-Build → Operation 4단계 플로우 (인트로 문단의 핵심 키워드 레드 강조)
6. **CTA** — SEND MESSAGE 버튼 (Contact 섹션으로 이동)

### PROJECTS 페이지 (projects.html) — 신규
1. **Hero** — "SELECTED WORKS & PROJECTS." 마스크 리빌
2. **STATS 그리드** — Projects 수 / Typologies / Period / Scope (호버 시 검정 반전)
3. **필터 바** — ALL · Mixed-Use · Housing · Senior · Office · Retail · Industrial · R&D · Public (각 카운트 자동 집계, 활성 시 레드 #F02032 배경)
4. **프로젝트 테이블** — N° / PROJECT / DESCRIPTION / CATEGORY 컬럼, 행 호버 시 검정 배경 슬라이드 업 + 좌측 padding 이동 + 화살표 페이드인
5. **상세 페이지 링크** — 각 행 클릭 시 `project.html?id=<id>`로 이동
6. **CTA** — SEND MESSAGE 버튼

### PROJECT DETAIL 페이지 (project.html) — 신규 (동적)
1. **URL 파라미터 기반** — `project.html?id=gwanghwa169` 형식으로 단일 페이지가 모든 프로젝트 상세를 렌더링
2. **Hero** — `← ALL PROJECTS` 백 링크 / CATEGORY · YEAR 메타 / 프로젝트명(영) / 프로젝트명(한) / 요약
3. **META 그리드** — CATEGORY / LOCATION / YEAR / CLIENT 4셀
4. **01 SCOPE OF WORK** — pill 형태 스코프 태그 리스트 (호버 시 레드 배경)
5. **02 OVERVIEW** — 본문 단락 (첫 단락의 첫 글자 레드 드롭캡)
6. **PREV / NEXT 네비게이션** — 이전/다음 프로젝트로 순환 이동 (호버 시 검정 슬라이드 업 반전)
7. **404** — 잘못된 id 접근 시 PROJECT NOT FOUND 폴백 화면
8. **CTA** — SEND MESSAGE 버튼

## 🗺️ 사이트 구조 (라우트 & 파라미터)

| Path | 설명 |
|------|------|
| `/index.html` | 메인 페이지 |
| `/index.html#services` | 서비스 섹션 앵커 |
| `/index.html#contact` | 컨택트 섹션 앵커 |
| `/about.html` | ABOUT 페이지 |
| `/projects.html` | 프로젝트 인덱스 (필터/카운트 포함) |
| `/project.html?id=<projectId>` | 프로젝트 상세 페이지 (동적) |

### 사용 가능한 `id` 값 (16개)
`gwanghwa169`, `tea-the-han`, `yonsei-wonju`, `sejong-center`, `loft-one-ground`, `odyssey-village`, `innocean-hq`, `sfc-oled-community`, `sfc-oled-storage`, `sfc-biopark`, `seoul-station-it`, `la-venice-c4-1bl`, `cheonan-cultural`, `hanwha-hotel-resort`, `courtyard-marriott-pyeongtaek`

## 📁 파일 구조

```
index.html              메인 페이지
about.html              ABOUT 페이지
projects.html           프로젝트 인덱스 페이지 (신규)
project.html            프로젝트 상세 페이지 (동적, URL param 기반) (신규)
css/
  ├── style.css         공통 스타일 (헤더/푸터/Hero/Services/Projects/Contact)
  ├── about.css         ABOUT 페이지 스타일
  ├── projects.css      PROJECTS 인덱스 스타일 (신규)
  └── project-detail.css 프로젝트 상세 페이지 스타일 (신규)
js/
  ├── main.js           공통 인터랙션 (로더, 헤더, 리빌 등)
  ├── about.js          ABOUT 페이지 (숫자 카운터)
  ├── projects-data.js  프로젝트 데이터셋 (window.PROJECTS) (신규)
  ├── projects.js       PROJECTS 인덱스 필터/렌더 (신규)
  └── project-detail.js 프로젝트 상세 URL param 렌더러 (신규)
images/
  └── jpa-logo.png      jpa. 로고 (filter: invert(1)로 흰색 처리)
README.md
```

## 📚 데이터 모델 — `window.PROJECTS`

`js/projects-data.js`에 정의된 프로젝트 데이터 배열입니다. 신규 프로젝트 추가 시 동일 형태의 객체만 push하면 `projects.html` / `project.html` 양쪽에 자동 반영됩니다.

```js
{
  id: 'gwanghwa169',                     // URL param용 고유 ID (kebab-case)
  name: 'Gwanghwa169',                   // 영문명
  nameKo: '광화문169',                   // 한글명
  desc: '광화문169 공간경험 및 공간환경설계', // 인덱스 테이블 표기용 짧은 설명
  category: 'Mixed-use',                 // ENUM: Mixed-use | Housing | Senior | Office | Retail | Industrial | R&D | Public
  location: '서울 종로구 광화문',
  year: '2025',
  client: 'Confidential',
  scope: ['공간경험 설계', '공간환경 설계', '브랜드 전략'], // 스코프 태그
  summary: '...',                        // Hero 요약 한 문장
  body: ['...', '...']                   // 본문 단락 배열
}
```

## 🎨 디자인 토큰

- **컬러**: `#0a0a0a` (Black), `#ffffff` (White), `#F02032` (Accent — Red)
- **폰트**: 영문 Switzer (Semi-Bold 600, Fontshare), 한글 Pretendard Variable (jsDelivr)
- **이징**: `cubic-bezier(0.77, 0, 0.175, 1)` (mask reveal), `ease-out cubic` (counter)
- **인터랙션 패턴**: 검정 배경 슬라이드 업 + 흰색 텍스트 반전, 레드 액센트 호버

## 🔗 외부 연결

- **네이버 지도**: Address 클릭 시 `map.naver.com` "슬리퍼맨션" 검색 결과 새 탭 열림
- **이메일**: `mailto:official@jpa.company`
- **전화**: `tel:+82270885487`

## 🛠 사용 기술
- Vanilla HTML5 / CSS3 / JavaScript (ES6+)
- Fontshare CDN (Switzer)
- jsDelivr CDN (Pretendard Variable)
- IntersectionObserver API (스크롤 기반 리빌, 카운터, 스태거 애니메이션)
- URLSearchParams API (상세 페이지 동적 라우팅)

## 🚧 아직 구현되지 않은 기능
- 각 프로젝트 상세 페이지의 **실제 이미지 갤러리** (현재는 텍스트 기반)
- 실제 SEND MESSAGE 폼 (현재는 mailto 링크 / Contact 섹션 이동)
- 다국어(EN/KR) 토글
- 다크/라이트 테마 토글
- 프로젝트 검색(키워드) 기능

## ▶️ 다음 개발 단계 추천
1. **이미지 갤러리** — `projects-data.js`의 각 프로젝트에 `images: [...]` 필드 추가 후 `project.html`에 갤러리 섹션 삽입
2. **태그 기반 다중 필터** — 현재 단일 카테고리 → scope 배열 기반 다중 태그 필터로 확장
3. RESTful Table API를 활용한 Contact 수집 폼 구현
4. PROJECTS 인덱스에 정렬(연도/카테고리) 및 검색 기능 추가
5. 상세 페이지에 관련 프로젝트(Related Works) 섹션 추가 — 같은 카테고리 기준 3개 추천

## 🚀 배포
배포는 상단 **Publish 탭**에서 원클릭으로 진행해주세요.
