# B002 Oracle DB 설정 가이드

## 테이블 구조 (2테이블)

```
TB_B002_AUTH_EXCEL          TB_B002_AUTH_EXCEL_DETAIL
─────────────────          ─────────────────────────
AUTH_SEQ (PK)              DETAIL_ID (PK)
EMP_NAME, EMP_NO           DETAIL_NM
DEPT_NAME, AUTH_NAME       DETAIL_AUTH
AUTH_GRANT, USE_YN         DETAIL_USE_YN
DETAIL_ID ─────────────────► DETAIL_ID
```

## 조회 SQL (백엔드와 동일)

```sql
SELECT a.*, b.*
FROM TB_B002_AUTH_EXCEL a
INNER JOIN TB_B002_AUTH_EXCEL_DETAIL b ON a.DETAIL_ID = b.DETAIL_ID;
```

## SQL 실행 순서

1. `b002_auth_ddl.sql`
2. `b002_auth_insert.sql`

## Spring Boot 실행

```cmd
set ORACLE_PASSWORD=admin
cd backend
mvnw.cmd spring-boot:run
```

## API

| API | 설명 |
|-----|------|
| GET `/api/b002/search?departmentCode=` | JOIN 조회 → 그리드용 플랫 데이터 |
| GET `/api/b002/options/departments` | 부서 목록 |
