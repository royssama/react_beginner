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
                .filter(row -> matchesDepartment(row, departmentCode))
                .filter(row -> isBlank(sectionCode) || "ALL".equals(sectionCode)
                        || row.getLocation().equals(mapSectionToLocation(sectionCode)))
                .filter(row -> categoryCodes == null || categoryCodes.isEmpty()
                        || categoryCodes.stream().anyMatch(code -> row.getPartner().contains(mapCategoryKeyword(code))))
                .filter(row -> matchesStatus(row, statusCode))
                .filter(row -> typeCodes == null || typeCodes.isEmpty()
                        || typeCodes.stream().anyMatch(code -> row.getCompany().contains(mapTypeKeyword(code))))
                .collect(Collectors.toList());
    }

    private List<GridRowDto> buildAllRows(String week) {
        List<GridRowDto> rows = new ArrayList<>();

        rows.add(new GridRowDto("1", week, "aa회사", "제조업", "(주)한국부품", "김영업", "수원", 1, 2, 3, 21, 22, 23));
        rows.add(new GridRowDto("2", week, "bb회사", "유통업", "(주)글로벌파트", "이마케", "용인", 11, 22, 33, 211, 222, 233));
        rows.add(new GridRowDto("3", week, "cc회사", "IT서비스", "(주)테크협력", "박개발", "안산", 111, 222, 333, 2111, 2222, 2333));
        rows.add(new GridRowDto("4", week, "dd회사", "제조업", "(주)정밀기계", "최생산", "수원", 5, 15, 25, 51, 52, 53));
        rows.add(new GridRowDto("5", week, "ee회사", "건설업", "(주)토건협력", "정현장", "용인", 8, 18, 28, 81, 82, 83));
        rows.add(new GridRowDto("6", week, "ff회사", "유통업", "(주)물류센터", "한물류", "안산", 12, 24, 36, 121, 122, 123));
        rows.add(new GridRowDto("7", week, "gg회사", "IT서비스", "(주)소프트웨어", "오코딩", "판교", 20, 30, 40, 201, 202, 203));
        rows.add(new GridRowDto("8", week, "hh회사", "제조업", "(주)전자부품", "윤품질", "수원", 3, 6, 9, 31, 32, 33));
        rows.add(new GridRowDto("9", week, "ii회사", "화학업", "(주)케미칼", "임연구", "안산", 7, 14, 21, 71, 72, 73));
        rows.add(new GridRowDto("10", week, "jj회사", "유통업", "(주)리테일", "서판매", "용인", 9, 19, 29, 91, 92, 93));
        rows.add(new GridRowDto("11", week, "kk회사", "제조업", "(주)자동차부품", "강조립", "화성", 4, 8, 12, 41, 42, 43));
        rows.add(new GridRowDto("12", week, "ll회사", "IT서비스", "(주)클라우드", "문인프라", "판교", 15, 25, 35, 151, 152, 153));
        rows.add(new GridRowDto("13", week, "mm회사", "건설업", "(주)플랜트", "양설계", "안산", 6, 16, 26, 61, 62, 63));
        rows.add(new GridRowDto("14", week, "nn회사", "제조업", "(주)금속가공", "조가공", "수원", 2, 4, 6, 21, 24, 26));
        rows.add(new GridRowDto("15", week, "oo회사", "유통업", "(주)도매상", "배유통", "용인", 10, 20, 30, 101, 102, 103));
        rows.add(new GridRowDto("16", week, "pp회사", "IT서비스", "(주)데이터랩", "송분석", "판교", 18, 28, 38, 181, 182, 183));
        rows.add(new GridRowDto("17", week, "qq회사", "화학업", "(주)바이오", "유실험", "안산", 13, 23, 33, 131, 132, 133));
        rows.add(new GridRowDto("18", week, "rr회사", "제조업", "(주)섬유", "홍직조", "수원", 14, 24, 34, 141, 142, 143));
        rows.add(new GridRowDto("19", week, "ss회사", "건설업", "(주)인프라", "남토목", "화성", 16, 26, 36, 161, 162, 163));
        rows.add(new GridRowDto("20", week, "tt회사", "유통업", "(주)이커머스", "권온라인", "용인", 17, 27, 37, 171, 172, 173));

        return rows;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private boolean matchesDepartment(GridRowDto row, String departmentCode) {
        if (isBlank(departmentCode)) {
            return true;
        }
        String industry = mapDepartmentToIndustry(departmentCode);
        if (industry == null) {
            return true;
        }
        return row.getIndustry().equals(industry);
    }

    private String mapDepartmentToIndustry(String code) {
        if ("D01".equals(code)) return null;
        if ("D02".equals(code)) return "IT서비스";
        if ("D03".equals(code)) return "유통업";
        return "";
    }

    private String mapSectionToLocation(String code) {
        if ("S01".equals(code)) return "수원";
        if ("S02".equals(code)) return "용인";
        if ("S03".equals(code)) return "판교";
        if ("S04".equals(code)) return "안산";
        if ("S05".equals(code)) return "화성";
        return "";
    }

    private String mapCategoryKeyword(String code) {
        if ("C01".equals(code)) return "한국";
        if ("C02".equals(code)) return "글로벌";
        if ("C03".equals(code)) return "테크";
        if ("C04".equals(code)) return "정밀";
        return "";
    }

    private boolean matchesStatus(GridRowDto row, String statusCode) {
        if (isBlank(statusCode)) {
            return true;
        }
        String keyword = mapStatusKeyword(statusCode);
        if (keyword == null) {
            return true;
        }
        return row.getManager().contains(keyword);
    }

    private String mapStatusKeyword(String code) {
        if ("ST01".equals(code)) return null;
        if ("ST02".equals(code)) return "이";
        return "";
    }

    private String mapTypeKeyword(String code) {
        if ("T01".equals(code)) return "aa";
        if ("T02".equals(code)) return "bb";
        if ("T03".equals(code)) return "cc";
        if ("T04".equals(code)) return "dd";
        return "";
    }
}
