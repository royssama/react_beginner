package com.company.reactbeginner.repository;

import com.company.reactbeginner.dto.B002AuthExcelDto;
import com.company.reactbeginner.dto.B002DetailItemDto;
import com.company.reactbeginner.dto.DetailListItemDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class B002AuthRepository {

    private final JdbcTemplate jdbcTemplate;

    public B002AuthRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final RowMapper<B002AuthExcelDto> ROW_MAPPER = new RowMapper<B002AuthExcelDto>() {
        @Override
        public B002AuthExcelDto mapRow(ResultSet rs, int rowNum) throws SQLException {
            B002AuthExcelDto dto = new B002AuthExcelDto();
            dto.setName(rs.getString("EMP_NAME"));
            dto.setEmpNo(rs.getString("EMP_NO"));
            dto.setDept(rs.getString("DEPT_NAME"));
            dto.setAuthName(rs.getString("AUTH_NAME"));
            dto.setAuthGrant(rs.getString("AUTH_GRANT"));
            dto.setUseYn(rs.getString("USE_YN"));
            dto.setDetailId(rs.getString("DETAIL_ID"));
            dto.setDetailNm(rs.getString("DETAIL_NM"));
            dto.setDetailAuth(rs.getString("DETAIL_AUTH"));
            dto.setDetailUseYn(rs.getString("DETAIL_USE_YN"));
            return dto;
        }
    };

    /**
     * t1 + t2 JOIN: t1.DETAIL_ID = t2.DETAIL_ID
     */
    public List<B002AuthExcelDto> findAuthExcelRows(String deptName) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT a.AUTH_SEQ, ");
        sql.append("       a.EMP_NAME, a.EMP_NO, a.DEPT_NAME, a.AUTH_NAME, ");
        sql.append("       a.AUTH_GRANT, a.USE_YN, a.DETAIL_ID, ");
        sql.append("       b.DETAIL_NM, b.DETAIL_AUTH, b.DETAIL_USE_YN ");
        sql.append("FROM TB_B002_AUTH_EXCEL a ");
        sql.append("INNER JOIN TB_B002_AUTH_EXCEL_DETAIL b ON a.DETAIL_ID = b.DETAIL_ID ");

        List<Object> params = new ArrayList<Object>();
        if (deptName != null && !deptName.trim().isEmpty()) {
            sql.append("WHERE a.DEPT_NAME = ? ");
            params.add(deptName.trim());
        }

        sql.append("ORDER BY a.EMP_NO, a.AUTH_NAME, a.AUTH_SEQ");

        return jdbcTemplate.query(sql.toString(), params.toArray(), ROW_MAPPER);
    }

    /**
     * 부서 DISTINCT 목록 조회
     */
    public List<String> findDistinctDepartments() {
        return jdbcTemplate.query(
                "SELECT DISTINCT DEPT_NAME FROM TB_B002_AUTH_EXCEL ORDER BY DEPT_NAME",
                (rs, rowNum) -> rs.getString("DEPT_NAME")
        );
    }

    /**
     * 세부권한 DISTINCT 목록 조회
     */
    public List<String> findDistinctDetailAuths() {
        return jdbcTemplate.query(
                "SELECT DISTINCT DETAIL_AUTH FROM TB_B002_AUTH_EXCEL_DETAIL ORDER BY DETAIL_AUTH",
                (rs, rowNum) -> rs.getString("DETAIL_AUTH")
        );
    }

    /**
     * DETAIL_LIST 전체 조회 (모달 체크 목록)
     */
    public List<DetailListItemDto> findDetailList() {
        return jdbcTemplate.query(
                "SELECT DETAIL_AUTH, DETAIL_NM FROM DETAIL_LIST ORDER BY DETAIL_AUTH, DETAIL_NM",
                (rs, rowNum) -> new DetailListItemDto(
                        rs.getString("DETAIL_AUTH"),
                        rs.getString("DETAIL_NM")
                )
        );
    }

    /**
     * 사번+권한이름 기준 현재 등록된 DETAIL_AUTH 목록
     */
    public List<String> findAssignedDetailAuths(String empNo, String authName) {
        return jdbcTemplate.query(
                "SELECT b.DETAIL_AUTH "
                        + "FROM TB_B002_AUTH_EXCEL a "
                        + "INNER JOIN TB_B002_AUTH_EXCEL_DETAIL b ON a.DETAIL_ID = b.DETAIL_ID "
                        + "WHERE a.EMP_NO = ? AND a.AUTH_NAME = ? "
                        + "ORDER BY b.DETAIL_AUTH",
                new Object[]{empNo, authName},
                (rs, rowNum) -> rs.getString("DETAIL_AUTH")
        );
    }

    /**
     * 사번+권한이름 기준 t2 세부권한 목록 조회
     */
    public List<B002DetailItemDto> findDetailsByEmpAndAuth(String empNo, String authName) {
        return jdbcTemplate.query(
                "SELECT b.DETAIL_ID, b.DETAIL_NM, b.DETAIL_AUTH, b.DETAIL_USE_YN "
                        + "FROM TB_B002_AUTH_EXCEL a "
                        + "INNER JOIN TB_B002_AUTH_EXCEL_DETAIL b ON a.DETAIL_ID = b.DETAIL_ID "
                        + "WHERE a.EMP_NO = ? AND a.AUTH_NAME = ? "
                        + "ORDER BY b.DETAIL_AUTH",
                new Object[]{empNo, authName},
                (rs, rowNum) -> {
                    B002DetailItemDto dto = new B002DetailItemDto();
                    dto.setDetailId(rs.getString("DETAIL_ID"));
                    dto.setDetailNm(rs.getString("DETAIL_NM"));
                    dto.setDetailAuth(rs.getString("DETAIL_AUTH"));
                    dto.setDetailUseYn(rs.getString("DETAIL_USE_YN"));
                    return dto;
                }
        );
    }

    /**
     * DETAIL_AUTH로 t2 DETAIL_ID 조회
     */
    public String findDetailIdByAuth(String detailAuth) {
        List<String> ids = jdbcTemplate.query(
                "SELECT DETAIL_ID FROM TB_B002_AUTH_EXCEL_DETAIL WHERE DETAIL_AUTH = ?",
                new Object[]{detailAuth},
                (rs, rowNum) -> rs.getString("DETAIL_ID")
        );
        return ids.isEmpty() ? null : ids.get(0);
    }

    /**
     * 사번+권한+DETAIL_AUTH로 t2 DETAIL_ID 조회
     */
    public String findDetailIdByEmpAuthAndDetailAuth(String empNo, String authName, String detailAuth) {
        List<String> ids = jdbcTemplate.query(
                "SELECT b.DETAIL_ID "
                        + "FROM TB_B002_AUTH_EXCEL a "
                        + "INNER JOIN TB_B002_AUTH_EXCEL_DETAIL b ON a.DETAIL_ID = b.DETAIL_ID "
                        + "WHERE a.EMP_NO = ? AND a.AUTH_NAME = ? AND b.DETAIL_AUTH = ?",
                new Object[]{empNo, authName, detailAuth},
                (rs, rowNum) -> rs.getString("DETAIL_ID")
        );
        return ids.isEmpty() ? null : ids.get(0);
    }

    /**
     * 사번+권한이름 기준 t1 DETAIL_ID 조회 (MIN)
     */
    public String findParentDetailId(String empNo, String authName) {
        List<String> ids = jdbcTemplate.query(
                "SELECT MIN(DETAIL_ID) FROM TB_B002_AUTH_EXCEL WHERE EMP_NO = ? AND AUTH_NAME = ?",
                new Object[]{empNo, authName},
                (rs, rowNum) -> rs.getString(1)
        );
        return ids.isEmpty() ? null : ids.get(0);
    }

    /**
     * 신규 DETAIL_ID 채번 (D001 형식)
     */
    public String generateNextDetailId() {
        Integer next = jdbcTemplate.queryForObject(
                "SELECT NVL(MAX(TO_NUMBER(SUBSTR(DETAIL_ID, 2))), 0) + 1 "
                        + "FROM TB_B002_AUTH_EXCEL_DETAIL "
                        + "WHERE DETAIL_ID LIKE 'D%'",
                Integer.class
        );
        return String.format("D%03d", next);
    }

    /**
     * t2 INSERT — DETAIL_ID는 t1과 동일 값 사용
     */
    public void insertDetail(String detailId, String detailNm, String detailAuth, String detailUseYn) {
        jdbcTemplate.update(
                "INSERT INTO TB_B002_AUTH_EXCEL_DETAIL (DETAIL_ID, DETAIL_NM, DETAIL_AUTH, DETAIL_USE_YN) "
                        + "VALUES (?, ?, ?, ?)",
                detailId, detailNm, detailAuth, detailUseYn
        );
    }

    /**
     * t2 DELETE — DETAIL_ID 기준
     */
    public void deleteDetailById(String detailId) {
        jdbcTemplate.update(
                "DELETE FROM TB_B002_AUTH_EXCEL_DETAIL WHERE DETAIL_ID = ?",
                detailId
        );
    }

    /**
     * t2 DELETE — DETAIL_ID + DETAIL_AUTH 기준 (팝업 해제 시)
     */
    public void deleteDetailByIdAndAuth(String detailId, String detailAuth) {
        jdbcTemplate.update(
                "DELETE FROM TB_B002_AUTH_EXCEL_DETAIL WHERE DETAIL_ID = ? AND DETAIL_AUTH = ?",
                detailId, detailAuth
        );
    }

    /**
     * t1에서 DETAIL_ID 사용 건수 조회
     */
    public int countAuthExcelByDetailId(String detailId) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM TB_B002_AUTH_EXCEL WHERE DETAIL_ID = ?",
                new Object[]{detailId},
                Integer.class
        );
        return count == null ? 0 : count.intValue();
    }

    /**
     * t1 DELETE — 사번+권한+DETAIL_ID 기준
     */
    public void deleteAuthExcelByEmpAuthDetail(String empNo, String authName, String detailId) {
        jdbcTemplate.update(
                "DELETE FROM TB_B002_AUTH_EXCEL WHERE EMP_NO = ? AND AUTH_NAME = ? AND DETAIL_ID = ?",
                empNo, authName, detailId
        );
    }

    /**
     * t1 INSERT
     */
    public void insertAuthExcel(String empName, String empNo, String dept, String authName,
                                String authGrant, String useYn, String detailId) {
        jdbcTemplate.update(
                "INSERT INTO TB_B002_AUTH_EXCEL "
                        + "(AUTH_SEQ, EMP_NAME, EMP_NO, DEPT_NAME, AUTH_NAME, AUTH_GRANT, USE_YN, DETAIL_ID) "
                        + "VALUES (SEQ_B002_AUTH_EXCEL.NEXTVAL, ?, ?, ?, ?, ?, ?, ?)",
                empName, empNo, dept, authName, authGrant, useYn, detailId
        );
    }
}
