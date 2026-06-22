package com.company.reactbeginner.dto;

public class GridRowDto {

    private String id;
    private String week;
    private String departmentName;
    private String sectionName;
    private String categoryName;
    private String statusName;
    private String typeName;
    private String title;
    private int amount;

    public GridRowDto() {
    }

    public GridRowDto(String id, String week, String departmentName, String sectionName,
                      String categoryName, String statusName, String typeName, String title, int amount) {
        this.id = id;
        this.week = week;
        this.departmentName = departmentName;
        this.sectionName = sectionName;
        this.categoryName = categoryName;
        this.statusName = statusName;
        this.typeName = typeName;
        this.title = title;
        this.amount = amount;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getWeek() {
        return week;
    }

    public void setWeek(String week) {
        this.week = week;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getSectionName() {
        return sectionName;
    }

    public void setSectionName(String sectionName) {
        this.sectionName = sectionName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getStatusName() {
        return statusName;
    }

    public void setStatusName(String statusName) {
        this.statusName = statusName;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }
}
