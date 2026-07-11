-- ============================================================
-- DETAIL_LIST — 세부권한 선택 모달용 마스터 목록
-- 접속: localhost:1521/FREEPDB1  사용자: phy182
-- ============================================================

-- DROP TABLE DETAIL_LIST CASCADE CONSTRAINTS;

CREATE TABLE DETAIL_LIST (
    DETAIL_AUTH   VARCHAR2(100)   NOT NULL,
    DETAIL_NM     VARCHAR2(100)   NOT NULL,
    CONSTRAINT PK_DETAIL_LIST PRIMARY KEY (DETAIL_AUTH, DETAIL_NM)
);
