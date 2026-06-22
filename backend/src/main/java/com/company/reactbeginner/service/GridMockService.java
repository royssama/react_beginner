package com.company.reactbeginner.service;

import com.company.reactbeginner.dto.CodeNameDto;
import com.company.reactbeginner.dto.GridRowDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GridMockService {

    public List<CodeNameDto> getDepartments(String week) {
        if ("202627".equals(week)) {
            return Arrays.asList(
                    new CodeNameDto("D01", "영업부"),
                    new CodeNameDto("D02", "개발부"),
                    new CodeNameDto("D03", "인사부")
            );
        }
        return Arrays.asList(
                new CodeNameDto("D01", "영업부"),
                new CodeNameDto("D02", "개발부")
        );
    }

    public List<CodeNameDto> getSections(String week, String departmentCode) {
        List<CodeNameDto> sections = new ArrayList<>();
        sections.add(new CodeNameDto("ALL", "전체"));

        if ("D01".equals(departmentCode)) {
            sections.add(new CodeNameDto("S01", "국내영업팀"));
            sections.add(new CodeNameDto("S02", "해외영업팀"));
        } else if ("D02".equals(departmentCode)) {
            sections.add(new CodeNameDto("S03", "프론트엔드팀"));
            sections.add(new CodeNameDto("S04", "백엔드팀"));
        } else if ("D03".equals(departmentCode)) {
            sections.add(new CodeNameDto("S05", "채용팀"));
        } else {
            sections.add(new CodeNameDto("S99", "공통팀"));
        }

        return sections;
    }

    public List<CodeNameDto> getCategories() {
        return Arrays.asList(
                new CodeNameDto("C01", "일반"),
                new CodeNameDto("C02", "긴급"),
                new CodeNameDto("C03", "보류"),
                new CodeNameDto("C04", "완료")
        );
    }

    public List<CodeNameDto> getStatuses() {
        return Arrays.asList(
                new CodeNameDto("ST01", "진행중"),
                new CodeNameDto("ST02", "마감")
        );
    }

    public List<CodeNameDto> getTypes() {
        return Arrays.asList(
                new CodeNameDto("T01", "유형A"),
                new CodeNameDto("T02", "유형B"),
                new CodeNameDto("T03", "유형C"),
                new CodeNameDto("T04", "유형D")
        );
    }

    public List<GridRowDto> searchGrid(String week, String departmentCode, String sectionCode,
                                       List<String> categoryCodes, String statusCode, List<String> typeCodes) {
        List<GridRowDto> allRows = buildAllRows(week);

        return allRows.stream()
                .filter(row -> isBlank(departmentCode)
                        || row.getDepartmentName().equals(mapDepartmentName(departmentCode)))
                .filter(row -> isBlank(sectionCode) || "ALL".equals(sectionCode)
                        || row.getSectionName().equals(mapSectionName(sectionCode)))
                .filter(row -> categoryCodes == null || categoryCodes.isEmpty()
                        || categoryCodes.stream().anyMatch(code -> row.getCategoryName().equals(mapCategoryName(code))))
                .filter(row -> isBlank(statusCode)
                        || row.getStatusName().equals(mapStatusName(statusCode)))
                .filter(row -> typeCodes == null || typeCodes.isEmpty()
                        || typeCodes.stream().anyMatch(code -> row.getTypeName().equals(mapTypeName(code))))
                .collect(Collectors.toList());
    }

    private List<GridRowDto> buildAllRows(String week) {
        List<GridRowDto> rows = new ArrayList<>();

        String[] salesSections = {"국내영업팀", "해외영업팀"};
        String[] categories = {"일반", "긴급", "보류", "완료"};
        String[] types = {"유형A", "유형B", "유형C", "유형D"};
        String[] salesTitles = {
                "주간 보고서 작성", "신규 고객 상담", "견적서 발송", "계약서 검토",
                "매출 실적 집계", "거래처 방문 일정", "제안서 작성", "고객 만족도 조사",
                "분기 목표 수립", "예산안 검토", "팀 회의록 작성", "해외 거래처 미팅",
                "국내 대리점 교육", "프로모션 기획", "영업 일정 공유", "수주 현황 점검",
                "고객 클레임 대응", "신제품 설명회", "경쟁사 분석", "주간 KPI 리뷰"
        };
        int[] salesAmounts = {
                120000, 80000, 150000, 420000, 95000, 210000, 175000, 125000,
                200000, 160000, 140000, 350000, 90000, 110000, 70000, 185000,
                65000, 230000, 55000, 98000
        };

        for (int i = 0; i < salesTitles.length; i++) {
            rows.add(new GridRowDto(
                    String.valueOf(i + 1),
                    week,
                    "영업부",
                    salesSections[i % salesSections.length],
                    categories[i % categories.length],
                    "진행중",
                    types[i % types.length],
                    salesTitles[i],
                    salesAmounts[i]
            ));
        }

        rows.add(new GridRowDto("21", week, "영업부", "해외영업팀", "긴급", "마감", "유형B", "해외 거래처 미팅", 350000));
        rows.add(new GridRowDto("22", week, "개발부", "프론트엔드팀", "보류", "진행중", "유형C", "AG Grid 화면 개발", 0));
        rows.add(new GridRowDto("23", week, "개발부", "백엔드팀", "완료", "마감", "유형D", "API 목 데이터 구성", 280000));
        rows.add(new GridRowDto("24", week, "인사부", "채용팀", "일반", "진행중", "유형A", "신입 채용 공고", 50000));

        return rows;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String mapDepartmentName(String code) {
        if ("D01".equals(code)) return "영업부";
        if ("D02".equals(code)) return "개발부";
        if ("D03".equals(code)) return "인사부";
        return "";
    }

    private String mapSectionName(String code) {
        if ("S01".equals(code)) return "국내영업팀";
        if ("S02".equals(code)) return "해외영업팀";
        if ("S03".equals(code)) return "프론트엔드팀";
        if ("S04".equals(code)) return "백엔드팀";
        if ("S05".equals(code)) return "채용팀";
        if ("S99".equals(code)) return "공통팀";
        return "";
    }

    private String mapCategoryName(String code) {
        if ("C01".equals(code)) return "일반";
        if ("C02".equals(code)) return "긴급";
        if ("C03".equals(code)) return "보류";
        if ("C04".equals(code)) return "완료";
        return "";
    }

    private String mapStatusName(String code) {
        if ("ST01".equals(code)) return "진행중";
        if ("ST02".equals(code)) return "마감";
        return "";
    }

    private String mapTypeName(String code) {
        if ("T01".equals(code)) return "유형A";
        if ("T02".equals(code)) return "유형B";
        if ("T03".equals(code)) return "유형C";
        if ("T04".equals(code)) return "유형D";
        return "";
    }
}
