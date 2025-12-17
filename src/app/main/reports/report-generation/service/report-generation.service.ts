import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class ReportService {
    userForm: FormGroup;
    constructor(
        public _formBuilder: UntypedFormBuilder,
        public _httpClient: HttpClient,
        public _httpClient1: ApiCaller
    ) {
        this.userForm = this.createUserFormGroup();
    }

    CreateReport() {
        return this._formBuilder.group({
            reportId: 0,
            ReportName: "",
        });
    }
    createUserFormGroup() {
        var date = new Date();
        date.setDate(date.getDate() - 7);
        return this._formBuilder.group({
            // StartDate: [date.toISOString()],
            StartDate: [new Date().toISOString()],
            EndDate: [new Date().toISOString()],
            UserId: [""],
            DoctorId: [""],
            RefDoctorId:[""],
            ServiceId: [""],
            DepartmentId: [""],
            CashCounterId: [""],
            GroupId: [""],
            ClassId: [""],
            WardId: [""],
            dischargeTypeId: [""],
            CompanyId: [""],
            StoreId: [""],
            FromStoreId: [""],
            ToStoreId: [""],
            SupplierId: [""],
            PaymentId: [""],
            DrugTypeId: [""],
            ItemId: [""],
            CreditId:[""],
            paymentId:[""],
            OPIPType: ["2"],
            type:["0"],
            expCategoryId:[""],
            expHeadId:[""]
            // 
        });
    }

    initializeFormGroup() {
        this.CreateReport();
    }

    public getAllReporConfig(Param) {
        return this._httpClient1.PostData("Report/NewList", Param);
        // return this._httpClient1.PostData("Report/ReportList", Param);
    }
    public getReportView(Param) {
        return this._httpClient1.PostData("Report/NewViewReport", Param);
    }
    public getExcelReport(Param) {
        return this._httpClient1.downloadFile("Report/NewExportExcelReport", Param,1,"Report.xlsx");
    }
}
