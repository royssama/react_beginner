package com.company.reactbeginner.dto;

import java.util.ArrayList;
import java.util.List;

public class B002DetailSyncRequest {

    private String empNo;
    private String empName;
    private String dept;
    private String authName;
    private String authGrant;
    private String useYn;
    private String parentDetailId;
    private List<DetailListItemDto> selectedDetails = new ArrayList<DetailListItemDto>();

    public String getEmpNo() {
        return empNo;
    }

    public void setEmpNo(String empNo) {
        this.empNo = empNo;
    }

    public String getEmpName() {
        return empName;
    }

    public void setEmpName(String empName) {
        this.empName = empName;
    }

    public String getDept() {
        return dept;
    }

    public void setDept(String dept) {
        this.dept = dept;
    }

    public String getAuthName() {
        return authName;
    }

    public void setAuthName(String authName) {
        this.authName = authName;
    }

    public String getAuthGrant() {
        return authGrant;
    }

    public void setAuthGrant(String authGrant) {
        this.authGrant = authGrant;
    }

    public String getUseYn() {
        return useYn;
    }

    public void setUseYn(String useYn) {
        this.useYn = useYn;
    }

    public String getParentDetailId() {
        return parentDetailId;
    }

    public void setParentDetailId(String parentDetailId) {
        this.parentDetailId = parentDetailId;
    }

    public List<DetailListItemDto> getSelectedDetails() {
        return selectedDetails;
    }

    public void setSelectedDetails(List<DetailListItemDto> selectedDetails) {
        this.selectedDetails = selectedDetails;
    }
}
