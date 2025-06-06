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
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-new-consent',
  templateUrl: './new-consent.component.html',
  styleUrls: ['./new-consent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewConsentComponent implements OnInit {

  vSelectedOption: any = 'IP';
  isRegIdSelected: boolean = false;
  vConsentText: any;
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
  OP_IPType: any = 0;
  RegId: any;
  registerObj1: any;
  filteredOptions: any;
  noOptionFound: boolean = false;
  isButtonDisabled: boolean = false;
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
  vAdmissionID: any;
  vConsentName: any
  registerObj: any;
  isDepartmentSelected: boolean = false;
  isTemplateSelected: boolean = false;
  filteredOptionsDep: Observable<string[]>;
  optionsDep: any[] = [];
  selectedDepartment: string = '';
  selectedTemplate: string = '';
  vConsentId: any;
  vTemplateId: any;
  vVisited: any;
  Vopipid: any;
  optionsTemp: any[] = [];
  filteredOptionsTemp: Observable<string[]>;

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
    this.vConsentText = e.target.innerHTML;
  }

  constructor(
    public _ConsentService: ConsentService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewConsentComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getDepartmentList();
    this.vSelectedOption = this.OP_IPType === 1 ? 'IP' : 'OP';


    if (this.data) {
      debugger
      this.registerObj1 = this.data.Obj;
      console.log("Consent RegisterObj:", this.registerObj1)

      if (this.registerObj1.OPIPType === 1) {
        // Fetch IP-specific information
        console.log("IIIIIIIIIIIIIPPPPPPPPP:", this.registerObj1.OPIPType);
        this.vWardName = this.registerObj1.RoomName;
        this.vBedNo = this.registerObj1.BedName;
        this.vGenderName = this.registerObj1.GenderName;
        // this.vPatientName = this.registerObj1.FirstName + ' ' +this.registerObj1.MiddleName+ ' ' + this.registerObj1.LastName;
        this.vPatientName = this.registerObj1.PatientName;
        this.vAgeYear = this.registerObj1.AgeYear;
        this.RegId = this.registerObj1.RegID;
        this.vAdmissionID = this.registerObj1.OPIPID
        this.vAge = this.registerObj1.AgeYear;
        this.vRegNo = this.registerObj1.RegNo;
        this.vIPDNo = this.registerObj1.IPDNo;
        this.vCompanyName = this.registerObj1.CompanyName;
        this.vTariffName = this.registerObj1.TariffName;
        this.vOP_IP_MobileNo = this.registerObj1.MobileNo;
        this.vDepartmentName = this.registerObj1.DepartmentName;
        this.vSelectedOption = 'IP';
        this.vConsentName = this.registerObj1.ConsentName;
        this.vConsentId = this.registerObj1.ConsentId;
        this.vConsentText = this.registerObj1.ConsentText;
        this.vDoctorName = this.registerObj1.DoctorName;

        this.selectedDepartment = this.registerObj1.ConsentDeptId;
        this.selectedTemplate = this.registerObj1.ConsentTempId;
        this.vTemplateId = this.registerObj1.ConsentTempId

        // this.getSiteList();
        this.getDepartmentList();
      } else if (this.registerObj1.OPIPType === 0) {
        // Fetch OP-specific information
        console.log("OOOOOOOPPPPPPPPP:", this.registerObj1.OPIPType);
        this.vWardName = this.registerObj1.RoomName;
        this.vBedNo = this.registerObj1.BedName;
        this.vGenderName = this.registerObj1.GenderName;
        this.vPatientName = this.registerObj1.PatientName;
        this.vAgeYear = this.registerObj1.AgeYear;
        this.RegId = this.registerObj1.RegID;
        this.vVisited = this.registerObj1.OPIPID
        this.vAdmissionID = this.registerObj1.OPIPID
        this.vAge = this.registerObj1.Age;
        this.vRegNo = this.registerObj1.RegNo;
        this.vOPDNo = this.registerObj1.OPDNo;
        this.vCompanyName = this.registerObj1.CompanyName;
        this.vTariffName = this.registerObj1.TariffName;
        this.vOP_IP_MobileNo = this.registerObj1.MobileNo;
        this.vDoctorName = this.registerObj1.DoctorName;
        this.vDepartmentName = this.registerObj1.DepartmentName;
        this.vSelectedOption = 'OP';
        this.vConsentName = this.registerObj1.ConsentName;
        this.vConsentId = this.registerObj1.ConsentId;
        this.vConsentText = this.registerObj1.ConsentText;

        this.selectedDepartment = this.registerObj1.ConsentDeptId;
        this.selectedTemplate = this.registerObj1.ConsentTempId;
        this.vTemplateId = this.registerObj1.ConsentTempId

        // this.getSiteList();
        this.getDepartmentList();
      }


      this.isButtonDisabled = true
    }

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
    }
    else if (event.value == 'IP') {
      this.PatientInformReset();
      this.OP_IPType = 1;
      this.RegId = "";
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
    this.vAdmissionID = obj.VisitId
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
      this.vAdmissionID = obj.AdmissionID;
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
    this.vRegNo = '';
    this.vOPDNo = '';
    this.vCompanyName = '';
    this.vTariffName = '';
    this.vOP_IP_MobileNo = '';
    this.vDoctorName = '';
    this.vDepartmentName = '';
    this.OP_IP_Id = '';
    this.vIPDNo = '';
  }

  selectedTemplateOption: any;

  onTemplateSelect(option: any) {
    debugger
    console.log("selectedTemplateOption:", option)

    this.selectedTemplateOption = option.ConsentDesc;

  }

  addTemplateDescription() {
    this.isButtonDisabled = false
    debugger
    if (this.vRegNo == '' || this.vRegNo== null || this.vRegNo == undefined || this.vRegNo == 0) {
      this.toastr.warning('Please select patient ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    
    if (this.selectedDepartment == '' || this.selectedDepartment == null || this.selectedDepartment == undefined) {
      this.toastr.warning('Please select Department ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._ConsentService.myform.get('Department').value) {
      if (!this.DepartmentList.find(item => item.DepartmentName == this._ConsentService.myform.get('Department').value.DepartmentName)) {
        this.toastr.warning('Please select Valid Department Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.selectedTemplate == '' || this.selectedTemplate == null || this.selectedTemplate == undefined) {
      this.toastr.warning('Please enter select Template ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._ConsentService.myform.get('Template').value) {
      if (!this.TemplateList.find(item => item.ConsentId == this._ConsentService.myform.get('Template').value.ConsentId)) {
        this.toastr.warning('Please select Valid Template Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    this.vConsentText = this.selectedTemplateOption || '';
    this.selectedTemplateOption = '';
  }

  onSave() {
    if (this.selectedDepartment == '' || this.selectedDepartment == null || this.selectedDepartment == undefined) {
      this.toastr.warning('Please select Department ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._ConsentService.myform.get('Department').value) {
      if (!this.DepartmentList.find(item => item.DepartmentName == this._ConsentService.myform.get('Department').value.DepartmentName)) {
        this.toastr.warning('Please select Valid Department Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.selectedTemplate == '' || this.selectedTemplate == null || this.selectedTemplate == undefined) {
      this.toastr.warning('Please enter select Template ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._ConsentService.myform.get('Template').value) {
      if (!this.TemplateList.find(item => item.ConsentId == this._ConsentService.myform.get('Template').value.ConsentId)) {
        this.toastr.warning('Please select Valid Template Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    Swal.fire({
      title: 'Do you want to Save the Consent Recode ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save it!",
      cancelButtonText: "No, Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        this.onSubmit();
      }
    });

  }

  onSubmit() {

    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    let opip_Type;
    if (this._ConsentService.myform.get('PatientType').value == 'IP') {
      opip_Type = 1;
    }
    else {
      opip_Type = 0;
    }
    if (!this.vConsentId) {
debugger
      let saveTConsentInformationparams = {
        "consentId": 0,
        "consentDate": formattedDate,
        "consentTime": formattedTime,
        "opipid": this.vAdmissionID,
        "opipType": opip_Type,
        "consentDeptId": this._ConsentService.myform.get("Department").value.DepartmentId || 0,
        "consentTempId": this._ConsentService.myform.get("Template").value.ConsentId || 0,
        "consentName": this._ConsentService.myform.get("Template").value.ConsentName || 0,
        "consentText": this._ConsentService.myform.get("ConsentText").value || 0,
        "createdBy": this._loggedService.currentUserValue.user.id,
      }

      let submitData = {
        "saveTConsentInformationparams": saveTConsentInformationparams
      }
      console.log("insertJson:", submitData);

      this._ConsentService.NursingConsentInsert(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
    else {

      let updateTConsentInformationparams = {
        "consentId": this.vConsentId,
        "consentDate": formattedDate,
        "consentTime": formattedTime,
        "opipid": this.vAdmissionID,
        "opipType": opip_Type,
        "consentDeptId": this.registerObj1.ConsentDeptId || 0,
        "consentTempId": this.registerObj1.ConsentTempId || 0,
        "consentName": this.registerObj1.ConsentName || 0,
        "consentText": this._ConsentService.myform.get("ConsentText").value || 0,
        "modifiedBy": this._loggedService.currentUserValue.user.id,
      }

      let updateData = {
        "updateTConsentInformationparams": updateTConsentInformationparams
      }

      console.log("UpdateJson:", updateData);

      this._ConsentService.NursingConsentUpdate(updateData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }

  }

  private _filterDep(value: any): string[] {
    if (value) {
      const filterValue = value && value.DepartmentName ? value.DepartmentName.toLowerCase() : value.toLowerCase();
      // this.isDepartmentSelected = false;
      return this.optionsDep.filter(option => option.DepartmentName.toLowerCase().includes(filterValue));
    }
  }

  onDepartmentSelected(event: MatAutocompleteSelectedEvent) {
    debugger
    const selectedDepartment = event.option.value;
    if (selectedDepartment) {
      this.OnChangeTemplateList(selectedDepartment);
    }
  }
  

  getDepartmentList() {
debugger
    const DepControl = this._ConsentService.myform.get('Department');
    DepControl.setValue('');
    const templateControl = this._ConsentService.myform.get('Template');
    templateControl.setValue(''); // Clear Template control
    this.TemplateList = []; // Clear Template list
    this.filteredOptionsTemp = null; // Clear Template filtered options

    this._ConsentService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.optionsDep = this.DepartmentList.slice();
      this.filteredOptionsDep = this._ConsentService.myform.get('Department').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
      );
      if (this.data) {
        const DValue = this.DepartmentList.filter(item => item.DepartmentName == this.registerObj1.DepartmentName);
        console.log("Department:", DValue)
        this._ConsentService.myform.get('Department').setValue(DValue[0]);
        this._ConsentService.myform.updateValueAndValidity();
        this.OnChangeTemplateList(DValue[0]);
        return;
      }
    });
  }

  getOptionTextDep(option) {
    return option && option.DepartmentName ? option.DepartmentName : '';
  }

  OnChangeTemplateList(departmentObj) {
    debugger
    console.log(departmentObj)

    const templateControl = this._ConsentService.myform.get('Template');

    templateControl.setValue('');
    this.TemplateList = [];
    this.filteredOptionsTemp = null;
    this.isDepartmentSelected = true;

    var vdata = {
      "DepartmentId": departmentObj.DepartmentId
    }

    this.isDepartmentSelected = true;
    this._ConsentService.getTemplateMasterCombo(vdata).subscribe(
      data => {
        this.TemplateList = data;
        console.log(this.TemplateList)
        this.optionsTemp = this.TemplateList.slice();
        this.filteredOptionsTemp = this._ConsentService.myform.get('Template').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterTemp(value) : this.TemplateList.slice()),
        );
        if (this.registerObj1) {
          debugger
          const dVaule = this.TemplateList.filter(item => item.ConsentName == this.registerObj1.ConsentName)
          this._ConsentService.myform.get('Template').setValue(dVaule[0])
        }
        console.log("doctor ndfkdf:", this._ConsentService.myform.get('Template').value)
      })
  }

  private _filterTemp(value: any): string[] {

    if (value) {
      const filterValue = value && value.ConsentName ? value.ConsentName.toLowerCase() : value.toLowerCase();
      this.isTemplateSelected = false;
      return this.optionsTemp.filter(option => option.ConsentName.toLowerCase().includes(filterValue));
    }

  }

  getOptionTextTemp(option) {

    return option && option.ConsentName ? option.ConsentName : '';
  }

  onClose() {
    this._ConsentService.myform.reset({
      start: this._ConsentService.myform.get('start')?.value,
      end: this._ConsentService.myform.get('end')?.value,
      Language: '1',
      IsIPOrOP:'2',
      PatientType: ['IP']
    });
    this.dialogRef.close();
  }
  onClear() {
    this._ConsentService.myform.reset({ Language: '1' });
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