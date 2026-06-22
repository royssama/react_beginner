# React Beginner Study Project

회사 소스 구조를 기반으로 한 Spring Boot + React 학습 프로젝트입니다.

## 구조

```
react_beginner/
├── backend/          # Spring Boot API (목 데이터)
├── frontend/         # React + AG Grid
└── docs/
    └── B001_제작_프롬프트.md
```

## 실행 방법

### 1. 백엔드 (포트 8080)

```bash
cd backend
mvn spring-boot:run
```

### 2. 프론트엔드 (포트 5173)

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 http://localhost:5173 접속

- **B001 화면**: AG Grid 조회 화면 (조회 버튼 클릭 시 목록 로드)
- **React 학습**: Hooks, 배열 메서드, 이벤트, 비동기 학습 예제

## API 엔드포인트

| API | 설명 |
|-----|------|
| GET `/api/grid/options/departments?week=` | 2번 필터 (부서) |
| GET `/api/grid/options/sections?week=&departmentCode=` | 3번 필터 (팀, 전체 포함) |
| GET `/api/grid/options/categories` | 4번 필터 (다중선택) |
| GET `/api/grid/options/statuses` | 5번 필터 (라디오) |
| GET `/api/grid/options/types` | 6번 필터 (체크박스) |
| GET `/api/grid/search` | 그리드 데이터 조회 |

## 주차 코드 형식

- `YYYYWW` (예: 2026년 6월 29일 → `202627`)
- 화면 로드 시 오늘 날짜의 주차가 자동 선택됩니다.

## 프론트엔드 패키지 구조

```
src/
├── api/B001Api.js
├── components/SearchPanel.jsx, GridPanel.jsx
├── hooks/useSearch.js, useGrid.js
├── pages/B001Page.jsx, StudyPage.jsx
└── utils/axiosUtil.js, weekUtil.js
```
