package com.company.reactbeginner.dto;

public class GridRowDto {

    private String id;
    private String week;
    private String company;
    private String industry;
    private String partner;
    private String manager;
    private String location;
    private int aa_2022;
    private int aa_2023;
    private int aa_2024;
    private int bb_2022;
    private int bb_2023;
    private int bb_2024;

    public GridRowDto() {
    }

    public GridRowDto(String id, String week, String company, String industry, String partner,
                      String manager, String location,
                      int aa_2022, int aa_2023, int aa_2024,
                      int bb_2022, int bb_2023, int bb_2024) {
        this.id = id;
        this.week = week;
        this.company = company;
        this.industry = industry;
        this.partner = partner;
        this.manager = manager;
        this.location = location;
        this.aa_2022 = aa_2022;
        this.aa_2023 = aa_2023;
        this.aa_2024 = aa_2024;
        this.bb_2022 = bb_2022;
        this.bb_2023 = bb_2023;
        this.bb_2024 = bb_2024;
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

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getPartner() {
        return partner;
    }

    public void setPartner(String partner) {
        this.partner = partner;
    }

    public String getManager() {
        return manager;
    }

    public void setManager(String manager) {
        this.manager = manager;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getAa_2022() {
        return aa_2022;
    }

    public void setAa_2022(int aa_2022) {
        this.aa_2022 = aa_2022;
    }

    public int getAa_2023() {
        return aa_2023;
    }

    public void setAa_2023(int aa_2023) {
        this.aa_2023 = aa_2023;
    }

    public int getAa_2024() {
        return aa_2024;
    }

    public void setAa_2024(int aa_2024) {
        this.aa_2024 = aa_2024;
    }

    public int getBb_2022() {
        return bb_2022;
    }

    public void setBb_2022(int bb_2022) {
        this.bb_2022 = bb_2022;
    }

    public int getBb_2023() {
        return bb_2023;
    }

    public void setBb_2023(int bb_2023) {
        this.bb_2023 = bb_2023;
    }

    public int getBb_2024() {
        return bb_2024;
    }

    public void setBb_2024(int bb_2024) {
        this.bb_2024 = bb_2024;
    }
}
