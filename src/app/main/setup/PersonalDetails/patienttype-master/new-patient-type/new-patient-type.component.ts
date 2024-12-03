import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PatienttypeMasterService } from '../patienttype-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-patient-type',
  templateUrl: './new-patient-type.component.html',
  styleUrls: ['./new-patient-type.component.scss']
})
export class NewPatientTypeComponent implements OnInit {

  patienttypeForm: FormGroup;
  constructor(
      public _PatienttypeMasterService: PatienttypeMasterService,
      public dialogRef: MatDialogRef<NewPatientTypeComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.patienttypeForm = this._PatienttypeMasterService.createPatientTypeForm();
      var m_data = {
        patientTypeId: this.data?.patientTypeId,
        patientType: this.data?.patientType.trim(),
        isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.patienttypeForm.patchValue(m_data);
  }
  onSubmit() {
      if (this.patienttypeForm.valid) {
          this._PatienttypeMasterService.patienttypeMasterSave(this.patienttypeForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
//     if (this.personalFormGroup.valid) {

//         console.log(this.personalFormGroup.get('PrefixId').value)
//         // if(this.personalFormGroup.invalid){
//         //     this.toastr.warning('please check from is invalid', 'Warning !', {
//         //         toastClass: 'tostr-tost custom-toast-warning',
//         //       });
//         //       return;
//         // } else {
//         // if(!isNaN(this.vDepartmentid.Departmentid) && !isNaN(this.vDoctorId.DoctorId)){
//         if (this.RegID == 0) {
//             debugger
//             var m_data = {
//                 "regID": 0,
//                 "regDate": this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || this.dateTimeObj.date,
//                 "regTime": this.dateTimeObj.time,//this.datePipe.transform(this.dateTimeObj.time, 'hh:mm:ss'),// this.dateTimeObj.time,// this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",
//                 "prefixId": this.personalFormGroup.get('PrefixId').value,
//                 "firstName": this.personalFormGroup.get("FirstName").value || "",
//                 "middleName": this.personalFormGroup.get("MiddleName").value || "",
//                 "lastName": this.personalFormGroup.get("LastName").value || "",
//                 "address": this.personalFormGroup.get("Address").value || "",
//                 "city": this.cityName,// this.personalFormGroup.get('CityId').value.text || '',
//                 "pinNo": '0',// this._registerService.mySaveForm.get("PinNo").value || "0",
//                 "dateOfBirth": "2021-03-31T12:27:24.771Z",// this.datePipe.transform(this.registerObj.DateofBirth, "MM-dd-yyyy"),// this.registerObj.DateofBirth || "2021-03-31",
//                 "age": (this.personalFormGroup.get("AgeYear")?.value || "0").toString(),
//                 "genderID": this.personalFormGroup.get('GenderId').value || 0,
//                 "phoneNo": this.personalFormGroup.get("PhoneNo").value || "0",
//                 "mobileNo": this.personalFormGroup.get("MobileNo").value || "0",
//                 "addedBy": 1,// this.accountService.currentUserValue.user.id,
//                 "updatedBy": 1,//this.accountService.currentUserValue.user.id,
//                 "ageYear": (this.personalFormGroup.get("AgeYear")?.value || "0").toString(),// this._registerService.mySaveForm.get("AgeYear").value.trim() || "%",
//                 "ageMonth": (this.personalFormGroup.get("AgeMonth").value || "").toString(),
//                 "ageDay": (this.personalFormGroup.get("AgeDay").value || "").toString(),
//                 "countryId": 1,// this.personalFormGroup.get('CountryId').value,
//                 "stateId": this.personalFormGroup.get('StateId').value,
//                 "cityId": this.personalFormGroup.get('CityId').value,
//                 "maritalStatusId": this.personalFormGroup.get('MaritalStatusId').value ? this.personalFormGroup.get('MaritalStatusId').value : 0,
//                 "isCharity": false,//Boolean(JSON.parse(this.personalFormGroup.get("IsCharity").value)) || "0",
//                 "religionId": this.personalFormGroup.get('ReligionId').value ? this.personalFormGroup.get('ReligionId').value : 0,
//                 "areaId": this.personalFormGroup.get('AreaId').value ? this.personalFormGroup.get('AreaId').value : 0,
//                 "isSeniorCitizen": false,
//                 "aadharcardno": this.personalFormGroup.get('AadharCardNo').value ? this.personalFormGroup.get('AadharCardNo').value : 0,
//                 "pancardno": "",// this.personalFormGroup.get('PanCardNo').value.toString()  ? this.personalFormGroup.get('PanCardNo').value.toString()  : 0,
//                 "Photo": ''
//             }
//             debugger
//             console.log(m_data);

//             this._registerService.RegstrationtSave(m_data).subscribe((response) => {
//                 this.toastr.success(response.message);
//                 this.onClear(true);
//             }, (error) => {
//                 this.toastr.error(error.message);
//             });
//         } else {
//             var m_data1 = {
//                 "regID": this.RegID,
//                 "regDate": this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || this.dateTimeObj.date,
//                 "regTime": this.dateTimeObj.time,//this.datePipe.transform(this.dateTimeObj.time, 'hh:mm:ss'),// this.dateTimeObj.time,// this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",
//                 "prefixId": this.PrefixId,// this.personalFormGroup.get('PrefixId').value.value,
//                 "firstName": this.personalFormGroup.get("FirstName").value || "",
//                 "middleName": this.personalFormGroup.get("MiddleName").value || "",
//                 "lastName": this.personalFormGroup.get("LastName").value || "",
//                 "address": this.personalFormGroup.get("Address").value || "",
//                 "city": this.cityName,// this.personalFormGroup.get('CityId').value.text || '',
//                 "pinNo": '0',// this._registerService.mySaveForm.get("PinNo").value || "0",
//                 "dateOfBirth": "2021-03-31T12:27:24.771Z",// this.datePipe.transform(this.registerObj.DateofBirth, "MM-dd-yyyy"),// this.registerObj.DateofBirth || "2021-03-31",
//                 "age": this.personalFormGroup.get("AgeYear").value.toString() || "0",
//                 "genderID": this.genderId,// this.personalFormGroup.get('GenderId').value.value || 0,
//                 "phoneNo": this.personalFormGroup.get("PhoneNo").value || "0",
//                 "mobileNo": this.personalFormGroup.get("MobileNo").value || "0",
//                 "addedBy": 1,// this.accountService.currentUserValue.user.id,
//                 //  "updatedBy": 1,//this.accountService.currentUserValue.user.id,
//                 "ageYear": this.personalFormGroup.get("AgeYear").value.toString() || "0",// this._registerService.mySaveForm.get("AgeYear").value.trim() || "%",
//                 "ageMonth": this.personalFormGroup.get("AgeMonth").value.toString() || "",
//                 "ageDay": this.personalFormGroup.get("AgeDay").value.toString() || "",
//                 "countryId": this.PrefixId,// this.personalFormGroup.get('CountryId').value.value,
//                 "stateId": this.stateId,// this.personalFormGroup.get('StateId').value.value,
//                 "cityId": this.cityId,//this.personalFormGroup.get('CityId').value.value,
//                 "maritalStatusId": this.mstausId,// this.personalFormGroup.get('MaritalStatusId').value ? this.personalFormGroup.get('MaritalStatusId').value.value : 0,
//                 "isCharity": false,//Boolean(JSON.parse(this.personalFormGroup.get("IsCharity").value)) || "0",
//                 "religionId": this.regilionId,//this.personalFormGroup.get('ReligionId').value ? this.personalFormGroup.get('ReligionId').value.value : 0,
//                 "areaId": this.areaId,//// this.personalFormGroup.get('AreaId').value ? this.personalFormGroup.get('AreaId').value.AreaId : 0,
//                 "isSeniorCitizen": false,
//                 "aadharcardno": this.personalFormGroup.get('AadharCardNo').value ? this.personalFormGroup.get('AadharCardNo').value : 0,
//                 "pancardno": "",// this.personalFormGroup.get('PanCardNo').value.toString()  ? this.personalFormGroup.get('PanCardNo').value.toString()  : 0,
//                 "Photo": ''

//             }
//             console.log(m_data);

//             this._registerService.Regstrationtupdate(m_data1).subscribe((response) => {
//                 this.toastr.success(response.message);
//                 this.onClear(true);
//             }, (error) => {
//                 this.toastr.error(error.message);
//             });
//         }
//     }
//     // }
// }
}

  onClear(val: boolean) {
      this.patienttypeForm.reset();
      this.dialogRef.close(val);
  }
}
