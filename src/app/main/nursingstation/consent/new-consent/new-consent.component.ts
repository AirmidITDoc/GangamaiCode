import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { fuseAnimations } from '@fuse/animations';
import { ConsentService } from '../consent.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-new-consent',
  templateUrl: './new-consent.component.html',
  styleUrls: ['./new-consent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewConsentComponent implements OnInit {

  vSelectedOption: any = 'OP';
  isRegIdSelected: boolean = false;
  vTemplateDesc: any;
  DepartmentList: any = [];
  TemplateList: any = [];
  PatientName: any;
  vOPDNo: any;
  Gender: any;
  Age: any;
  patientsource: any;
  CompanyName: any;
  TarrifName: any;
  DoctorName: any;
  vConditionOP: boolean = false;
  vConditionIP: boolean = false;
  OP_IP_Id: any = 0;
  OP_IPType: any = 2;
  RegId: any;
  registerObj1: any;
  filteredOptions: any;
  noOptionFound: boolean = false;
  PatientListfilteredOptionsIP: any;
  PatientListfilteredOptionsOP: any;
  vWardName: any;
  vBedNo: any;
  vPatientName: any;
  vGenderName: any;
  vAgeYear: any;
  vAge: any;
  vRegNo: any;
  vCompanyName: any;
  vTariffName: any;
  vOP_IP_MobileNo: any;
  vDoctorName: any;
  GendercmbList: any = [];
  optionsGender: any[] = [];
  selectedType: any = '';
  vOtReqOPD: any;
  vOtReqIPD: any;
  vDepartmentName: any;
  vIPDNo: any;
  vSiteDescId: any;
  vSurgeryCategoryId: any;
  vSurgeryId: any;
  vAdmissionID: any;
  registerObj: any;
  isDepartmentSelected: boolean = false;
  filteredOptionsDep: Observable<string[]>;
  optionsDep: any[] = [];

  editorConfig: AngularEditorConfig = {
    // color:true,
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '15rem',
    translate: 'yes',
    placeholder: 'Enter text here...',
    enableToolbar: true,
    showToolbar: true,

  };
  onBlur(e: any) {
    this.vTemplateDesc = e.target.innerHTML;
  }

  constructor(
    public _ConsentService: ConsentService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewConsentComponent>,
    public _matDialog: MatDialog,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getDepartmentList();

    this.vSelectedOption = this.OP_IPType === 1 ? 'IP' : 'OP';

    this.vOtReqOPD = this._loggedService.currentUserValue.user.pharOPOpt;
    this.vOtReqIPD = this._loggedService.currentUserValue.user.pharIPOpt;

    if (this.vOtReqIPD == true) {
      if (this.vOtReqOPD == false) {
        this.vSelectedOption = 'IP';
        this._ConsentService.myform.get('MobileNo').clearValidators();
        this._ConsentService.myform.get('PatientName').clearValidators();
        this._ConsentService.myform.get('MobileNo').updateValueAndValidity();
        this._ConsentService.myform.get('PatientName').updateValueAndValidity();
      }
    } else {
      this.vConditionIP = true
    }
    if (this.vOtReqOPD == true) {
      if (this.vOtReqIPD == false) {
        this.vSelectedOption = 'OP';
        this._ConsentService.myform.get('MobileNo').clearValidators();
        this._ConsentService.myform.get('PatientName').clearValidators();
        this._ConsentService.myform.get('MobileNo').updateValueAndValidity();
        this._ConsentService.myform.get('PatientName').updateValueAndValidity();
      }
    } else {
      this.vConditionOP = true
    }
  }

  onChangePatientType(event) {

    this._ConsentService.myform.get('RegID').reset();
    if (event.value == 'OP') {
      this.PatientInformReset();
      this.OP_IPType = 0;
      this.RegId = "";
      this._ConsentService.myform.get('MobileNo').reset();
      this._ConsentService.myform.get('PatientName').reset();
      this._ConsentService.myform.get('MobileNo').clearValidators();
      this._ConsentService.myform.get('PatientName').clearValidators();
      this._ConsentService.myform.get('MobileNo').updateValueAndValidity();
      this._ConsentService.myform.get('PatientName').updateValueAndValidity();
    }
    else if (event.value == 'IP') {
      this.PatientInformReset();
      this.OP_IPType = 1;
      this.RegId = "";
      this._ConsentService.myform.get('MobileNo').reset();
      this._ConsentService.myform.get('PatientName').reset();
      this._ConsentService.myform.get('MobileNo').clearValidators();
      this._ConsentService.myform.get('PatientName').clearValidators();
      this._ConsentService.myform.get('MobileNo').updateValueAndValidity();
      this._ConsentService.myform.get('PatientName').updateValueAndValidity();
    } else {
      this._ConsentService.myform.get('MobileNo').reset();
      this._ConsentService.myform.get('MobileNo').setValidators([Validators.required]);
      this._ConsentService.myform.get('MobileNo').enable();
      this._ConsentService.myform.get('PatientName').reset();
      this._ConsentService.myform.get('PatientName').setValidators([Validators.required]);
      this._ConsentService.myform.get('PatientName').enable();
      this._ConsentService.myform.updateValueAndValidity();
      this.OP_IPType = 2;
    }
  }

  getSearchList() {
    var m_data = {
      "Keyword": `${this._ConsentService.myform.get('RegID').value}%`
    }
    if (this._ConsentService.myform.get('PatientType').value == 'OP') {

      if (this._ConsentService.myform.get('RegID').value.length >= 1) {
        this._ConsentService.getPatientVisitedListSearch(m_data).subscribe(resData => {
          this.filteredOptions = resData;
          this.PatientListfilteredOptionsOP = resData;
          console.log(resData);
          if (this.filteredOptions.length == 0) {
            this.noOptionFound = true;
          } else {
            this.noOptionFound = false;
          }
        });
      }
    } else if (this._ConsentService.myform.get('PatientType').value == 'IP') {

      if (this._ConsentService.myform.get('RegID').value.length >= 1) {
        this._ConsentService.getAdmittedPatientList(m_data).subscribe(resData => {
          this.filteredOptions = resData;
          // console.log(resData);
          this.PatientListfilteredOptionsIP = resData;
          if (this.filteredOptions.length == 0) {
            this.noOptionFound = true;
          } else {
            this.noOptionFound = false;
          }
        });
      }
    }
    this.PatientInformReset();
  }


  getSelectedObjOP(obj) {
    console.log("AdmittedListOP:", obj)
    this.registerObj = obj;
    this.vWardName = obj.RoomName;
    this.vBedNo = obj.BedName;
    this.vGenderName = obj.GenderName;
    this.vPatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
    this.vAgeYear = obj.AgeYear;
    this.RegId = obj.RegID;
    this.vAdmissionID = obj.AdmissionID
    this.vAge = obj.Age;
    this.vRegNo = obj.RegNo;
    this.vOPDNo = obj.OPDNo;
    this.vCompanyName = obj.CompanyName;
    this.vTariffName = obj.TariffName;
    this.vOP_IP_MobileNo = obj.MobileNo;
    this.vDoctorName = obj.DoctorName;
    this.vDepartmentName = obj.DepartmentName;
    this.getDepartmentList();
  }

  getSelectedObjRegIP(obj) {
    let IsDischarged = 0;
    IsDischarged = obj.IsDischarged
    if (IsDischarged == 1) {
      Swal.fire('Selected Patient is already discharged');
      this.RegId = ''
    }
    else {
      console.log("AdmittedListIP:", obj)
      this.registerObj = obj;
      this.vPatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
      this.RegId = obj.RegID;
      this.OP_IP_Id = this.registerObj.AdmissionID;
      this.vIPDNo = obj.IPDNo;
      this.vRegNo = obj.RegNo;
      this.vDoctorName = obj.DoctorName;
      this.vTariffName = obj.TariffName
      this.vCompanyName = obj.CompanyName;
      this.vAgeYear = obj.AgeYear;
      this.vOP_IP_MobileNo = obj.MobileNo;
      this.vDepartmentName = obj.DepartmentName;
      this.vAge = obj.Age;
      this.vGenderName = obj.GenderName;
      this.getDepartmentList();
    }
  }

  getOptionTextIPObj(option) {
    return option && option.FirstName + " " + option.LastName;
  }
  getOptionTextOPObj(option) {
    return option && option.FirstName + " " + option.LastName;
  }

  PatientInformReset() {
    this.vWardName = '';
    this.vBedNo = '';
    this.vGenderName = '';
    this.vPatientName = '';
    this.vAgeYear = '';
    this.RegId = '';
    this.vAdmissionID = '';
    this.vAge = '';
    this.vRegNo
    this.vOPDNo = '';
    this.vCompanyName = '';
    this.vTariffName = '';
    this.vOP_IP_MobileNo = '';
    this.vDoctorName = '';
    this.vDepartmentName = '';
    this.OP_IP_Id = '';
    this.vIPDNo = '';
  }

  onSubmit() {

  }

  private _filterDep(value: any): string[] {
    if (value) {
      const filterValue = value && value.DepartmentName ? value.DepartmentName.toLowerCase() : value.toLowerCase();
      // this.isDepartmentSelected = false;
      return this.optionsDep.filter(option => option.DepartmentName.toLowerCase().includes(filterValue));
    }

  }

  getDepartmentList() {
    debugger
    this._ConsentService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.optionsDep = this.DepartmentList.slice();
      this.filteredOptionsDep = this._ConsentService.myform.get('Department').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
      );
      if (this.registerObj) {

        const DValue = this.DepartmentList.filter(item => item.DepartmentName == this.registerObj.DepartmentName);
        console.log("Department:", DValue)
        this._ConsentService.myform.get('Department').setValue(DValue[0]);
        this._ConsentService.myform.updateValueAndValidity();
        return;
      }
    });
  }
  getOptionTextDep(option) {

    return option && option.DepartmentName ? option.DepartmentName : '';
  }

  onClose() {
    this._ConsentService.myform.reset();
    this.dialogRef.close();
  }
  onClear() {
    this._ConsentService.myform.reset();
  }

}
export class OPIPMasterList {

  RegId: number;
  PatientName: any;
  Age: any;
  MobileNo: any;
  DoctorName: any;
  PatienSource: any;
  RegDate: any;

  constructor(OPIPMasterList) {
    {

      this.RegId = OPIPMasterList.RegId || 0;
      this.PatientName = OPIPMasterList.FirstName + ' ' + OPIPMasterList.MiddleName + ' ' + OPIPMasterList.LastName || 0;
      this.Age = OPIPMasterList.Age || 0;
      this.MobileNo = OPIPMasterList.MobileNo || 0;
      this.DoctorName = OPIPMasterList.DoctorName || 0;
      this.PatienSource = OPIPMasterList.PatienSource || 0;
      this.RegDate = OPIPMasterList.RegDate || 0;

    }
  }
}