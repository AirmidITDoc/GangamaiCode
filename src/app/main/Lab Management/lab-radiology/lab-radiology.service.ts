import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class LabRadiologyService {

    myformSearch: FormGroup;
    myform: FormGroup;

    constructor(public _httpClient: HttpClient, public _httpClient1: ApiCaller,
        private _formBuilder: UntypedFormBuilder, private accountService: AuthenticationService, private _FormvalidationserviceService: FormvalidationserviceService,
    ) {
        this.myformSearch = this.filterForm();
        this.myform = this.createRadiologytemplateForm();
    }

    filterForm(): FormGroup {
        return this._formBuilder.group({
            RegNoSearch: [],
            FirstNameSearch: [''],
            LastNameSearch: [''],
            PatientTypeSearch: ['3'],
            StatusSearch: ['0'],
            TestStatusSearch: ['0'],
            CategoryId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            GroupId: [0],
            start: [new Date().toISOString()],
            end: [new Date().toISOString()],
        });
    }

    createReportlogForm(): FormGroup {
        return this._formBuilder.group({
            logId: [0],
            opipid: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            opiptype: [4],
            logTypeId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            logTypeName: ['', [Validators.required]]
        });
    }

    createRadiologytemplateForm(): FormGroup {
        return this._formBuilder.group({
            TemplateId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            TemplateName: [''],
            TemplateDesc: [''],
            // RadReportID: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            // ReportDate:[(new Date()).toISOString()],
            // ReportTime:[(new Date()).toISOString()],
            // IsCompleted: ['false'],
            // IsPrinted: ['flase'],
            // RadResultDr1: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            // RadResultDr2:  [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            // RadResultDr3:  [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            suggestionNotes: [''],
            // AdmVisitDoctorID: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            // RefDoctorID: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            ResultEntry: ['', Validators.required],
            // Suggatationnote:[''],
            DoctorId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            // IsDeleted: ['false'],
            // AddedBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            // UpdatedBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            // AddedByName: ['']
        });
    }


    public updatelabourMaster(employee) {
        return this._httpClient1.PutData("Radiology/RadiologyOutsourceUpdate/" + employee.radReportId, employee);
    }
    public RadiologyUpdate(Param: any) {
        return this._httpClient1.PutData("Radiology/RadiologyUpdate/" + Param.radReportId, Param)

    }

    public gettemplateId(Id) {
        return this._httpClient1.GetData("RadiologyTemplate/" + Id);
    }

    public getRadTemplateById(Id) {
        // debugger
        return this._httpClient1.GetData("RadiologyTemplate/RadReportId/" + Id);
    }

    public RadioReportverifyMaster(employee) {
        return this._httpClient1.PostData("Radiology/Verify", employee);
    }

    public updateRadioReportOutscourceMaster(employee) {
        return this._httpClient.post("Radiology/RadiologyTemplateMasterUpdate", employee);
    }

    populateForm(employee) {
        this.myform.patchValue(employee);
    }

    public getPushToRIS(param) {
        return this._httpClient1.PostData("Ris/radiology-order", param);
    }

    public getTestList(employee) {
        return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathResultEntryList_Test_Dtls1", employee)
    }

    public getRadiologyTempReport(RadReportId, OP_IP_Type) {
        return this._httpClient.get("Radiology/view-RadiologyTemplateReport?RadReportId=" + RadReportId + "&OP_IP_Type=" + OP_IP_Type)

    }
    getTemplateCombo() {
        return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RadioTemplateMasterForCombo", {})
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient1.PostData("PhoneApp", m_data);
    }

    public getReportView(Param) {
        return this._httpClient1.PostData("Report/ViewReportFromDB", Param);
    }
    public getReportLog(employee) {
        return this._httpClient1.PostData("ReportLog", employee)
    }
}
