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

> **주의:** `package.json`은 `frontend` 폴더에 있습니다.  
> 프로젝트 루트에서도 `npm install` / `npm run dev` 를 사용할 수 있습니다.

### 1. 백엔드 (포트 8080)

> **Maven 설치 불필요** — `mvnw.cmd` (Maven Wrapper) 사용  
> **Java JDK 8** 필요 — JRE만 있으면 컴파일 오류가 납니다.

#### JDK 확인

```bash
javac -version
```

`javac` 명령이 없으면 **JDK**를 설치해야 합니다.  
추천: [Amazon Corretto 8 JDK](https://docs.aws.amazon.com/corretto/latest/corretto-8-ug/downloads-list.html) (Windows x64 `.msi`)

설치 후 **새 명령 프롬프트**를 열고 다시 확인하세요.

#### 백엔드 실행

```bash
cd backend
mvnw.cmd spring-boot:run
```

또는 `run-backend.bat` 더블클릭

- `mvn` 대신 **`mvnw.cmd`** 를 사용하세요 (Maven 별도 설치 불필요)
- **처음 실행 시** Maven 자동 다운로드로 1~3분 걸릴 수 있습니다

### 2. 프론트엔드 (포트 5173)

**방법 A — 프로젝트 루트에서 실행**

```bash
cd C:\projects\react_beginner
npm install
npm run dev
```

**방법 B — frontend 폴더에서 실행**

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
