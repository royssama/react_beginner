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
            return List.of(
                    new CodeNameDto("D01", "영업부"),
                    new CodeNameDto("D02", "개발부"),
                    new CodeNameDto("D03", "인사부")
            );
        }
        return List.of(
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
        return List.of(
                new CodeNameDto("C01", "일반"),
                new CodeNameDto("C02", "긴급"),
                new CodeNameDto("C03", "보류"),
                new CodeNameDto("C04", "완료")
        );
    }

    public List<CodeNameDto> getStatuses() {
        return List.of(
                new CodeNameDto("ST01", "진행중"),
                new CodeNameDto("ST02", "마감")
        );
    }

    public List<CodeNameDto> getTypes() {
        return List.of(
                new CodeNameDto("T01", "유형A"),
                new CodeNameDto("T02", "유형B"),
                new CodeNameDto("T03", "유형C"),
                new CodeNameDto("T04", "유형D")
        );
    }

    public List<GridRowDto> searchGrid(String week, String departmentCode, String sectionCode,
                                       List<String> categoryCodes, String statusCode, List<String> typeCodes) {
        List<GridRowDto> allRows = List.of(
                new GridRowDto("1", week, "영업부", "국내영업팀", "일반", "진행중", "유형A", "주간 보고서 작성", 120000),
                new GridRowDto("2", week, "영업부", "해외영업팀", "긴급", "마감", "유형B", "해외 거래처 미팅", 350000),
                new GridRowDto("3", week, "개발부", "프론트엔드팀", "보류", "진행중", "유형C", "AG Grid 화면 개발", 0),
                new GridRowDto("4", week, "개발부", "백엔드팀", "완료", "마감", "유형D", "API 목 데이터 구성", 280000),
                new GridRowDto("5", week, "인사부", "채용팀", "일반", "진행중", "유형A", "신입 채용 공고", 50000)
        );

        return allRows.stream()
                .filter(row -> departmentCode == null || departmentCode.isBlank()
                        || row.getDepartmentName().equals(mapDepartmentName(departmentCode)))
                .filter(row -> sectionCode == null || sectionCode.isBlank() || "ALL".equals(sectionCode)
                        || row.getSectionName().equals(mapSectionName(sectionCode)))
                .filter(row -> categoryCodes == null || categoryCodes.isEmpty()
                        || categoryCodes.stream().anyMatch(code -> row.getCategoryName().equals(mapCategoryName(code))))
                .filter(row -> statusCode == null || statusCode.isBlank()
                        || row.getStatusName().equals(mapStatusName(statusCode)))
                .filter(row -> typeCodes == null || typeCodes.isEmpty()
                        || typeCodes.stream().anyMatch(code -> row.getTypeName().equals(mapTypeName(code))))
                .collect(Collectors.toList());
    }

    private String mapDepartmentName(String code) {
        return switch (code) {
            case "D01" -> "영업부";
            case "D02" -> "개발부";
            case "D03" -> "인사부";
            default -> "";
        };
    }

    private String mapSectionName(String code) {
        return switch (code) {
            case "S01" -> "국내영업팀";
            case "S02" -> "해외영업팀";
            case "S03" -> "프론트엔드팀";
            case "S04" -> "백엔드팀";
            case "S05" -> "채용팀";
            case "S99" -> "공통팀";
            default -> "";
        };
    }

    private String mapCategoryName(String code) {
        return switch (code) {
            case "C01" -> "일반";
            case "C02" -> "긴급";
            case "C03" -> "보류";
            case "C04" -> "완료";
            default -> "";
        };
    }

    private String mapStatusName(String code) {
        return switch (code) {
            case "ST01" -> "진행중";
            case "ST02" -> "마감";
            default -> "";
        };
    }

    private String mapTypeName(String code) {
        return switch (code) {
            case "T01" -> "유형A";
            case "T02" -> "유형B";
            case "T03" -> "유형C";
            case "T04" -> "유형D";
            default -> "";
        };
    }
}
