import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
    providedIn: 'root'
})
export class PhoneAppointListService {
    phoneappForm: FormGroup;
    myFilterform: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _httpClient1: HttpClient,
        private _formBuilder: UntypedFormBuilder
    ) {
       
        this.myFilterform = this.filterForm();
        this.phoneappForm=this.filterForm();
    }

    filterForm(): FormGroup {
        return this._formBuilder.group({
            FirstName: ['', [
                Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
            ]],
            LastName: ['', [
                Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
            ]],
            DoctorId: '',
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
        });
    }

    

    createphoneForm(): FormGroup {
        return this._formBuilder.group({
            phoneAppId: [1],
            appDate: [(new Date()).toISOString()],
            appTime: [(new Date()).toISOString()],
            // seqNo: '',
           firstName: ['', [
                Validators.required,
                Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
            ]],
            middleName: [''],
            lastName: ['', [
                Validators.required,
                Validators.pattern("^[A-Za-z () ]*[a-zA-z() ]*$"),
            ]],
            address: [''],
            mobileNo: ['', [Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
            phAppDate: [(new Date()).toISOString()],
            phAppTime: [""],
            departmentId: ['', Validators.required],
            doctorId:['', Validators.required],
            addedBy: 1,
            updatedBy: 1,
            regNo: ["0"],

        });
    }



    public getPhoenappschdulelist() {
        return this._httpClient1.post("Generic/GetByProc?procName=Rtrv_ScheduledPhoneApp", {})
    }
    public getDoctorsByDepartment(deptId) {
        return this._httpClient.GetData("VisitDetail/DeptDoctorList?DeptId="+deptId)
    }


    // new Api
    public phoneMasterSave(Param: any) {
        return this._httpClient.PostData("PhoneAppointment2/InsertSP", Param);

    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("PhoneApp", m_data);
    }


    public phoneMasterCancle(Param: any) {
        debugger
      return this._httpClient.PostData("PhoneAppointment2/Cancel", Param);
      }

    public getMaster(mode, Id) {
        return this._httpClient.GetData("Dropdown/GetBindDropDown?mode=" + mode + "&Id=" + Id);
    }

    public getRegistraionById(Id) {
        return this._httpClient.GetData("OutPatient/" + Id);
    }
}
