import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class PhoneAppointListService {
    constructor(
        private _httpClient: ApiCaller, private _FormvalidationserviceService: FormvalidationserviceService,
        private _httpClient1: HttpClient,
        private _formBuilder: UntypedFormBuilder,
        private accountService: AuthenticationService,
    ) { }

    filterForm(): FormGroup {
        return this._formBuilder.group({
            FirstName: ['', [
                Validators.maxLength(50),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            LastName: ['', [
                Validators.maxLength(50),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            DoctorId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            fromDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            enddate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
        });
    }

    //changed by raksha date:3/6/25
    createphoneForm(): FormGroup {
        return this._formBuilder.group({
            phoneAppId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            appDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            appTime: [''],
            // // seqNo: '',
            firstName: ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(50),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            middleName: ['', [
                Validators.maxLength(50),
                Validators.pattern("^[A-Za-z/() ]*$"),
                this._FormvalidationserviceService.allowEmptyStringValidator()
            ]],
            lastName: ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(50),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            address: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.maxLength(100)]],
            mobileNo: ['', [Validators.required,
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
                this._FormvalidationserviceService.onlyNumberValidator()
            ]],
            phAppDate: ['', [Validators.required, this._FormvalidationserviceService.validDateValidator()]],
            phAppFromTime: ['',[Validators.required]],
            phAppToTime: ['',[Validators.required]],
            departmentId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            doctorId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            addedBy: [this.accountService.currentUserValue.userId, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
            updatedBy: [this.accountService.currentUserValue.userId, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
            regNo: [""],
            startTime: [''],
            endTime: ['']
        });
    }

    // public getPhoenappschdulelist() {
    //     return this._httpClient1.post("Generic/GetByProc?procName=Rtrv_ScheduledPhoneApp", {})
    // }
    public getDoctorsByDepartment(deptId) {
        return this._httpClient.GetData("VisitDetail/DeptDoctorList?DeptId=" + deptId)
    }


    // new Api
    public phoneMasterSave(Param: any) {
        return this._httpClient.PostData("PhoneAppointment2/Insert", Param);

    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("PhoneApp", m_data);
    }


    public phoneMasterCancle(Param: any) {
        return this._httpClient.DeleteData("PhoneAppointment2/Cancel?Id=" + Param.toString());
    }

    public getMaster(mode, Id) {
        return this._httpClient.GetData("Dropdown/GetBindDropDown?mode=" + mode + "&Id=" + Id);
    }

    public getRegistraionById(Id) {
        return this._httpClient.GetData("OutPatient/" + Id);
    }
    public getAppoinments(Id:number,fromDate:string,toDate:string) {
        return this._httpClient.GetData("PhoneAppointment2/get-appoinments?DocId=" + Id+"&FromDate="+fromDate+"&ToDate="+toDate);
    }
    public getDateTimeChange(m_data) {
        return this._httpClient.PutData("PhoneAppointment2/ReschedulePhoneAppointment",m_data);
    }
}
