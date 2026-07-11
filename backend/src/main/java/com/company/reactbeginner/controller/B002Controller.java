package com.company.reactbeginner.controller;

import com.company.reactbeginner.dto.B002AuthExcelDto;
import com.company.reactbeginner.dto.B002DetailItemDto;
import com.company.reactbeginner.dto.B002DetailSyncRequest;
import com.company.reactbeginner.service.B002AuthService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/b002")
public class B002Controller {

    private final B002AuthService b002AuthService;

    public B002Controller(B002AuthService b002AuthService) {
        this.b002AuthService = b002AuthService;
    }

    /**
     * B002 그리드 조회 — DB 플랫 행 목록 반환
     * 프론트에서 buildAuthGridRows()로 사번+권한 단위 그룹핑
     */
    @GetMapping("/search")
    public Map<String, Object> search(@RequestParam(required = false) String departmentCode) {
        List<B002AuthExcelDto> rows = b002AuthService.search(departmentCode);

        Map<String, Object> result = new HashMap<String, Object>();
        result.put("success", true);
        result.put("data", rows);
        result.put("totalCount", rows.size());
        return result;
    }

    /**
     * B002 부서 옵션 조회 (TB_B002_AUTH_EXCEL DISTINCT DEPT_NAME)
     */
    @GetMapping("/options/departments")
    public Map<String, Object> getDepartments() {
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("success", true);
        result.put("data", b002AuthService.getDepartments());
        return result;
    }

    /**
     * B002 세부권한 셀렉트 옵션 (TB_B002_AUTH_EXCEL_DETAIL DISTINCT DETAIL_AUTH)
     */
    @GetMapping("/options/detail-auths")
    public Map<String, Object> getDetailAuths() {
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("success", true);
        result.put("data", b002AuthService.getDetailAuths());
        return result;
    }

    /**
     * 세부권한 선택 모달 목록 (DETAIL_LIST)
     */
    @GetMapping("/options/detail-list")
    public Map<String, Object> getDetailList() {
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("success", true);
        result.put("data", b002AuthService.getDetailList());
        return result;
    }

    /**
     * 팝업 확인 시 t2만 INSERT/DELETE (t1 변경 없음)
     */
    @PostMapping("/details/sync")
    public Map<String, Object> syncRowDetails(@RequestBody B002DetailSyncRequest request) {
        List<B002DetailItemDto> details = b002AuthService.syncRowDetails(request);

        Map<String, Object> result = new HashMap<String, Object>();
        result.put("success", true);
        result.put("data", details);
        return result;
    }
}
