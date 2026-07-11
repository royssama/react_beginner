package com.company.reactbeginner.dto;

public class DetailListItemDto {

    private String detailAuth;
    private String detailNm;

    public DetailListItemDto() {
    }

    public DetailListItemDto(String detailAuth, String detailNm) {
        this.detailAuth = detailAuth;
        this.detailNm = detailNm;
    }

    public String getDetailAuth() {
        return detailAuth;
    }

    public void setDetailAuth(String detailAuth) {
        this.detailAuth = detailAuth;
    }

    public String getDetailNm() {
        return detailNm;
    }

    public void setDetailNm(String detailNm) {
        this.detailNm = detailNm;
    }
}
