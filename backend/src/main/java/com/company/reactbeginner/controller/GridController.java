package com.company.reactbeginner.controller;

import com.company.reactbeginner.dto.CodeNameDto;
import com.company.reactbeginner.dto.GridRowDto;
import com.company.reactbeginner.service.GridMockService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/grid")
public class GridController {

    private final GridMockService gridMockService;

    public GridController(GridMockService gridMockService) {
        this.gridMockService = gridMockService;
    }

    @GetMapping("/options/departments")
    public Map<String, Object> getDepartments(@RequestParam String week) {
        return success(gridMockService.getDepartments(week));
    }

    @GetMapping("/options/sections")
    public Map<String, Object> getSections(@RequestParam String week,
                                           @RequestParam String departmentCode) {
        return success(gridMockService.getSections(week, departmentCode));
    }

    @GetMapping("/options/categories")
    public Map<String, Object> getCategories() {
        return success(gridMockService.getCategories());
    }

    @GetMapping("/options/statuses")
    public Map<String, Object> getStatuses() {
        return success(gridMockService.getStatuses());
    }

    @GetMapping("/options/types")
    public Map<String, Object> getTypes() {
        return success(gridMockService.getTypes());
    }

    @GetMapping("/search")
    public Map<String, Object> search(@RequestParam String week,
                                      @RequestParam(required = false) String departmentCode,
                                      @RequestParam(required = false) String sectionCode,
                                      @RequestParam(required = false) String categoryCodes,
                                      @RequestParam(required = false) String statusCode,
                                      @RequestParam(required = false) String typeCodes) {
        List<String> categoryCodeList = parseCsv(categoryCodes);
        List<String> typeCodeList = parseCsv(typeCodes);

        List<GridRowDto> rows = gridMockService.searchGrid(
                week, departmentCode, sectionCode, categoryCodeList, statusCode, typeCodeList
        );

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("data", rows);
        result.put("totalCount", rows.size());
        return result;
    }

    private List<String> parseCsv(String value) {
        if (value == null || value.isBlank()) {
            return List.of();
        }
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private Map<String, Object> success(List<CodeNameDto> list) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("data", list);
        return result;
    }
}
