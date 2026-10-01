# Nexacro Grid vs AG Grid 기능 비교표

## 전체 기능 비교

| 기능 카테고리 | 기능 | Nexacro Grid | AG Grid Community (무료) | AG Grid Enterprise (유료) |
|--------------|------|:------------:|:------------------------:|:-------------------------:|
| **데이터 바인딩** | Dataset 바인딩 | ✅ | ✅ | ✅ |
| | 양방향 데이터 동기화 | ✅ | ✅ | ✅ |
| | Server-Side Data Model | ✅ (트랜잭션 기반) | ✅ (기본) | ✅ (고급) |
| **그리드 구조** | Head/Body/Summary Band | ✅ | ✅ | ✅ |
| | Multi-Line Row (한 레코드 여러 줄) | ✅ | ❌ | ❌ |
| | 다중 포맷 지원 | ✅ | ❌ | ❌ |
| | Column Headers | ✅ | ✅ | ✅ |
| | Column Groups | ✅ | ✅ | ✅ |
| **컬럼 관리** | 컬럼 크기 조절 | ✅ | ✅ | ✅ |
| | 컬럼 이동 | ✅ | ✅ | ✅ |
| | 컬럼 고정 (Pinning) | ✅ | ✅ | ✅ |
| | 가로 스크롤 컬럼 고정 | ✅ (setFixedColumn) | ✅ | ✅ |
| | 컬럼 Spanning | ✅ | ✅ | ✅ |
| | 컬럼 자동 생성 | ✅ (createFormat) | ✅ | ✅ |
| | 계산 컬럼 (Calculated Columns) | ✅ (expr 속성) | ❌ | ✅ |
| **셀 표현** | Text/Edit | ✅ | ✅ | ✅ |
| | Combo/Dropdown | ✅ | ✅ | ✅ |
| | CheckBox | ✅ | ✅ | ✅ |
| | Date Picker | ✅ | ✅ | ✅ |
| | Image | ✅ | ✅ | ✅ |
| | Button | ✅ | ✅ | ✅ |
| | ProgressBar | ✅ | ✅ | ✅ |
| | Sparklines | ❌ | ❌ | ✅ |
| | 커스텀 컴포넌트 | ✅ | ✅ | ✅ |
| **셀 편집** | 인라인 편집 | ✅ | ✅ | ✅ |
| | Full Row Editing | ✅ | ✅ | ✅ |
| | 셀 속성 동적 제어 | ✅ (setCellProperty) | ✅ | ✅ |
| | 편집 타입별 설정 | ✅ (edittype) | ✅ | ✅ |
| | Auto Select on Edit | ✅ | ✅ | ✅ |
| **정렬** | 단일 컬럼 정렬 | ✅ | ✅ | ✅ |
| | 다중 컬럼 정렬 | ✅ | ✅ | ✅ |
| | 커스텀 정렬 | ✅ | ✅ | ✅ |
| **필터링** | 텍스트 필터 | ✅ (Dataset filter) | ✅ | ✅ |
| | 숫자 필터 | ✅ | ✅ | ✅ |
| | 날짜 필터 | ✅ | ✅ | ✅ |
| | Quick Filter | ✅ | ✅ | ✅ |
| | Set Filter (목록 선택) | ✅ | ❌ | ✅ |
| | Multi Filter | ❌ | ❌ | ✅ |
| | Advanced Filter (수식 기반) | ✅ (filterstr) | ❌ | ✅ |
| | External Filter | ✅ | ✅ | ✅ |
| **선택 기능** | Row 선택 | ✅ | ✅ | ✅ |
| | Multi Row 선택 | ✅ (selecttype) | ✅ | ✅ |
| | Cell 선택 | ✅ | ✅ | ✅ |
| | Range Selection | ✅ (multiarea) | ❌ | ✅ |
| **그룹핑/집계** | Row Grouping | ✅ (Grouping/Outlineview) | ❌ | ✅ |
| | 소계 (Subtotal) | ✅ | ❌ | ✅ |
| | 합계/평균/최대/최소 연산 | ✅ (Summary Band) | ❌ | ✅ |
| | Aggregation | ✅ (expr) | ❌ | ✅ |
| | Pivoting | ❌ | ❌ | ✅ |
| **트리 구조** | Tree Data | ✅ (displaytype=tree) | ❌ | ✅ |
| | Tree Checkbox | ✅ (treeusecheckbox) | ❌ | ✅ |
| | Expand/Collapse | ✅ | ❌ | ✅ |
| **Master/Detail** | 마스터/디테일 뷰 | ❌ (별도 구현 필요) | ❌ | ✅ |
| **스크롤/페이징** | Pagination | ✅ (별도 구현) | ✅ | ✅ |
| | Infinite Scrolling | ✅ (Smart Scroll) | ✅ | ✅ |
| | Row/Column Virtualization | ✅ | ✅ | ✅ |
| | Smart Scroll (fastvscrolltype) | ✅ | ✅ | ✅ |
| **셀 병합** | 수직 병합 | ✅ (suppressaliginor) | ✅ (rowSpan) | ✅ |
| | 수평 병합 | ✅ | ✅ (colSpan) | ✅ |
| **클립보드** | 복사 (Ctrl+C) | ✅ | ✅ | ✅ |
| | 붙여넣기 (Ctrl+V) | ✅ | ❌ | ✅ |
| | Grid 간 복사/붙여넣기 | ✅ | ❌ | ✅ |
| | Excel-like 클립보드 동작 | ✅ | ❌ | ✅ |
| **Export/Import** | CSV Export | ✅ | ✅ | ✅ |
| | Excel Export | ✅ (별도 API) | ❌ | ✅ |
| | Excel Import | ✅ | ❌ | ❌ |
| **차트 연동** | Integrated Charts | ❌ | ❌ | ✅ (Bundle) |
| | Sparklines | ❌ | ❌ | ✅ |
| **검색** | Find (검색 기능) | ✅ (findRow/findRowExpr) | ❌ | ✅ |
| **수식** | Formula Editor | ❌ | ❌ | ✅ |
| | Cell 수식 (expr) | ✅ | ❌ | ✅ |
| **테마/스타일링** | Built-in Themes | ✅ | ✅ | ✅ |
| | CSS Customization | ✅ | ✅ | ✅ |
| | Theming API | ✅ | ✅ | ✅ |
| **접근성** | ARIA 지원 | ✅ | ✅ | ✅ |
| | 키보드 네비게이션 | ✅ | ✅ | ✅ |
| | 접근성 개선 기능 | ✅ (createrowstype 등) | ✅ | ✅ |
| **UI 패널** | Tool Panels | ❌ | ❌ | ✅ |
| | Context Menu (컨텍스트 메뉴) | ❌ (별도 구현) | ❌ | ✅ |
| | Column Menu | ❌ (별도 구현) | ❌ | ✅ |
| | Sidebar | ❌ | ❌ | ✅ |
| **Drag & Drop** | Row Drag & Drop | ✅ | ✅ | ✅ |
| | Column Drag & Drop | ✅ | ✅ | ✅ |
| **AI 기능** | AI Toolkit | ❌ | ❌ | ✅ |
| | MCP Server | ❌ | ✅ | ✅ |
| **프레임워크 지원** | React | ❌ | ✅ | ✅ |
| | Angular | ❌ | ✅ | ✅ |
| | Vue | ❌ | ✅ | ✅ |
| | Vanilla JavaScript | ❌ | ✅ | ✅ |
| | Nexacro Platform | ✅ | ❌ | ❌ |
| **라이선스** | 무료 버전 | ❌ (상용) | ✅ (MIT) | ❌ |
| | 상용 라이선스 | ✅ | ❌ | ✅ |
| **기술 지원** | 공식 기술 지원 | ✅ | ❌ | ✅ |

---

## 주요 차이점 요약

| 항목 | Nexacro Grid | AG Grid |
|------|--------------|---------|
| **플랫폼** | Nexacro 플랫폼 전용 (독자 생태계) | 범용 JavaScript 라이브러리 |
| **데이터 관리** | Dataset 컴포넌트와 1:1 바인딩 | 다양한 데이터 소스 직접 연결 |
| **Band 구조** | Head/Body/Summary 3단 구조 기본 제공 | Header/Body 기본, Footer 별도 설정 |
| **Multi-Line Row** | 한 레코드를 여러 줄로 표현 가능 | 지원 안함 |
| **다중 포맷** | 런타임에 포맷 전환 가능 | 컬럼 정의 변경으로 대응 |
| **트리 구조** | 기본 제공 (displaytype="tree") | Enterprise 전용 |
| **Pivoting** | 미지원 | Enterprise 전용 |
| **통합 차트** | 미지원 | Enterprise Bundle 전용 |
| **AI 기능** | 미지원 | Enterprise 전용 (AI Toolkit) |
| **프레임워크** | Nexacro 전용 | React, Angular, Vue, JavaScript |
| **가격** | 상용 라이선스 | Community(무료) / Enterprise(유료) |
