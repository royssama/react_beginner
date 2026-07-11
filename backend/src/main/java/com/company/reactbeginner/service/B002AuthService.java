package com.company.reactbeginner.service;

import com.company.reactbeginner.dto.B002AuthExcelDto;
import com.company.reactbeginner.dto.B002DetailItemDto;
import com.company.reactbeginner.dto.B002DetailSyncRequest;
import com.company.reactbeginner.dto.CodeNameDto;
import com.company.reactbeginner.dto.DetailListItemDto;
import com.company.reactbeginner.repository.B002AuthRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class B002AuthService {

    private final B002AuthRepository b002AuthRepository;

    public B002AuthService(B002AuthRepository b002AuthRepository) {
        this.b002AuthRepository = b002AuthRepository;
    }

    /**
     * B002 그리드 조회 — 부서 조건으로 t1+t2 JOIN 플랫 행 반환
     */
    public List<B002AuthExcelDto> search(String departmentCode) {
        return b002AuthRepository.findAuthExcelRows(departmentCode);
    }

    /**
     * 부서 옵션 목록 (code/name 동일)
     */
    public List<CodeNameDto> getDepartments() {
        return b002AuthRepository.findDistinctDepartments().stream()
                .map(dept -> new CodeNameDto(dept, dept))
                .collect(Collectors.toList());
    }

    /**
     * 세부권한 셀렉트 옵션 목록
     */
    public List<CodeNameDto> getDetailAuths() {
        return b002AuthRepository.findDistinctDetailAuths().stream()
                .map(auth -> new CodeNameDto(auth, auth))
                .collect(Collectors.toList());
    }

    /**
     * 세부권한 선택 모달 목록 (DETAIL_LIST)
     */
    public List<DetailListItemDto> getDetailList() {
        return b002AuthRepository.findDetailList();
    }

    /**
     * 팝업 확인 — t2만 INSERT/DELETE, t1 변경 없음
     * - t2.DETAIL_ID는 현재 그리드 행의 DETAIL_ID와 같은 값 사용
     * - 체크 키: t2.DETAIL_AUTH = t3.DETAIL_AUTH
     */
    @Transactional
    public List<B002DetailItemDto> syncRowDetails(B002DetailSyncRequest request) {
        String empNo = request.getEmpNo();
        String authName = request.getAuthName();
        String detailId = request.getParentDetailId();
        if (detailId == null || detailId.trim().isEmpty()) {
            detailId = b002AuthRepository.findParentDetailId(empNo, authName);
        }
        if (detailId == null || detailId.trim().isEmpty()) {
            throw new IllegalArgumentException("현재 행의 DETAIL_ID를 찾을 수 없습니다.");
        }
        detailId = detailId.trim();

        Set<String> selectedAuths = new HashSet<String>();
        if (request.getSelectedDetails() != null) {
            for (DetailListItemDto item : request.getSelectedDetails()) {
                if (item.getDetailAuth() != null && !item.getDetailAuth().trim().isEmpty()) {
                    selectedAuths.add(item.getDetailAuth().trim());
                }
            }
        }

        List<String> currentAuths = b002AuthRepository.findAssignedDetailAuths(empNo, authName);
        Set<String> currentSet = new HashSet<String>(currentAuths);

        for (String detailAuth : currentSet) {
            if (!selectedAuths.contains(detailAuth)) {
                b002AuthRepository.deleteDetailByIdAndAuth(detailId, detailAuth);
            }
        }

        List<B002DetailItemDto> inserted = new ArrayList<B002DetailItemDto>();
        if (request.getSelectedDetails() != null) {
            for (DetailListItemDto item : request.getSelectedDetails()) {
                String detailAuth = item.getDetailAuth() == null ? "" : item.getDetailAuth().trim();
                if (detailAuth.isEmpty() || currentSet.contains(detailAuth)) {
                    continue;
                }

                String detailNm = item.getDetailNm() == null ? detailAuth : item.getDetailNm().trim();
                b002AuthRepository.insertDetail(detailId, detailNm, detailAuth, "Y");

                B002DetailItemDto dto = new B002DetailItemDto();
                dto.setDetailId(detailId);
                dto.setDetailNm(detailNm);
                dto.setDetailAuth(detailAuth);
                dto.setDetailUseYn("Y");
                inserted.add(dto);
            }
        }

        List<B002DetailItemDto> linked = b002AuthRepository.findDetailsByEmpAndAuth(empNo, authName);
        Map<String, B002DetailItemDto> merged = new HashMap<String, B002DetailItemDto>();
        for (B002DetailItemDto item : linked) {
            merged.put(item.getDetailAuth(), item);
        }
        for (B002DetailItemDto item : inserted) {
            merged.put(item.getDetailAuth(), item);
        }

        List<B002DetailItemDto> result = new ArrayList<B002DetailItemDto>();
        for (String auth : selectedAuths) {
            if (merged.containsKey(auth)) {
                result.add(merged.get(auth));
            }
        }
        return result;
    }
}
