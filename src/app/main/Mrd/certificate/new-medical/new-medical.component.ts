import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OPIPPatientModel } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { MatSelect } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MrdService } from '../../mrd.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-new-medical',
  templateUrl: './new-medical.component.html',
  styleUrls: ['./new-medical.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewMedicalComponent implements OnInit {

  screenFromString = '';
  dateTimeObj: any;
  OP_IPType: any = 2;
  vWardName: any;
  vBedNo: any;
  vGenderName: any;
  vPatientName: any;
  vAgeYear: any;
  RegId: any;
  vAdmissionID: any;
  vOPIP_ID: any;
  vAge: any;
  vRegNo: any;
  vOPDNo: any;
  vCompanyName: any;
  vTariffName: any;
  vOP_IP_MobileNo: any;
  vDoctorName: any;
  vDepartmentName: any;
  OP_IP_Id: any;
  vIPDNo: any;
  vConditionOP: boolean = false;
  vConditionIP: boolean = false;
  isRegIdSelected: boolean = false;
  PatientListfilteredOptionsIP: any;
  PatientListfilteredOptionsOP: any;
  filteredOptions: any;
  noOptionFound: boolean = false;
  registerObj: any;
  vSelectedOption: any = 'OP';
  registerObj1: any;
  vMLCNo: any;
  vNameAuthority: any;
  vBuckleNo: any;
  vPoliceStation: any;
  vCertificateNo:any;
  selectedDepartment: string = '';
  selectedDoctor: string = '';
  isDepartmentSelected: boolean = false;
  isDoctorSelected: boolean = false;
  optionsDep: any[] = [];
  optionsDoc: any[] = [];
  filteredOptionsDep: Observable<string[]>;
  filteredOptionsDoc: Observable<string[]>;
  DepartmentList: any = [];
  DoctorList: any = [];
  isDoctor1Selected:boolean = false;
  isDoctor2Selected:boolean = false;
  selectedDoctor1: string = '';
  selectedDoctor2: string = '';
  vAccidentDateTime:any;
  date:any;
  vAgeInjuries:any;
  vCauseInjuries:any;

  DoctorList1: any = [];
  optionsDoctor1: any[] = [];
  filteredOptionsDoctor1: Observable<string[]>;
  DoctorList2: any = [];
  optionsDoctor2: any[] = [];
  filteredOptionsDoctor2: Observable<string[]>;
  vAccidentDetails:any;

  constructor(
    public _MrdService: MrdService,
    private formBuilder: FormBuilder,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewMedicalComponent>,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    private router: Router) { }

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
        this.vAccidentDetails = e.target.innerHTML;
      }
      
  ngOnInit(): void {
    this.vSelectedOption = this.OP_IPType === 1 ? 'IP' : 'OP';
    if (this.data) {
      debugger
      this.registerObj1 = this.data.Obj;
    }
    this.getDepartmentList();
    this.getDoctorList1();
    this.getDoctorList2();
  }

  onChangePatientType(event) {
    this._MrdService.MedicalForm.get('RegID').reset();
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

  onDateChange(event: any) {
    // Capture the selected date and time
    const selectedDateTime = event.target.value;
    console.log('Selected Date and Time:', selectedDateTime);
    
    // Optionally, you can extract date and time separately
    const datePart = selectedDateTime.split('T')[0]; // 'YYYY-MM-DD'
    const timePart = selectedDateTime.split('T')[1]; // 'HH:MM'

    console.log('Date:', datePart);
    console.log('Time:', timePart);
  }

  PatientInformReset() {
    this.vWardName = '';
    this.vBedNo = '';
    this.vGenderName = '';
    this.vPatientName = '';
    this.vAgeYear = '';
    this.RegId = '';
    this.vAdmissionID = '';
    this.vOPIP_ID = '';
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

  getSearchList() {
    var m_data = {
      "Keyword": `${this._MrdService.MedicalForm.get('RegID').value}%`
    }
    if (this._MrdService.MedicalForm.get('PatientType').value == 'OP') {

      if (this._MrdService.MedicalForm.get('RegID').value.length >= 1) {
        this._MrdService.getPatientVisitedListSearch(m_data).subscribe(resData => {
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
    } else if (this._MrdService.MedicalForm.get('PatientType').value == 'IP') {

      if (this._MrdService.MedicalForm.get('RegID').value.length >= 1) {
        this._MrdService.getAdmittedPatientList(m_data).subscribe(resData => {
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

  getOptionTextOPObj(option) {
    return option && option.FirstName + " " + option.LastName;
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
    this.vOPIP_ID = obj.VisitId
    this.vAge = obj.Age;
    this.vRegNo = obj.RegNo;
    this.vOPDNo = obj.OPDNo;
    this.vCompanyName = obj.CompanyName;
    this.vTariffName = obj.TariffName;
    this.vOP_IP_MobileNo = obj.MobileNo;
    this.vDoctorName = obj.DoctorName;
    this.vDepartmentName = obj.DepartmentName;
    this.getDepartmentList();
    this.getDoctorList1();
    this.getDoctorList2();
  }

  getOptionTextIPObj(option) {
    return option && option.FirstName + " " + option.LastName;
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
      this.vOPIP_ID = this.registerObj.AdmissionID;
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
      this.getDoctorList1();
      this.getDoctorList2();
    }
  }

  getDateTime(dateTimeObj) {
    console.log('dateTimeObj ==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
  // department dropdown
  onDepartmentSelected(event: MatAutocompleteSelectedEvent) {
    debugger
    const selectedDepartment = event.option.value;
    if (selectedDepartment) {
      this.OnChangeDoctorList(selectedDepartment);
    }
  }
  getOptionTextDep(option) {
    return option && option.DepartmentName ? option.DepartmentName : '';
  }
  private _filterDep(value: any): string[] {
    if (value) {
      const filterValue = value && value.DepartmentName ? value.DepartmentName.toLowerCase() : value.toLowerCase();
      return this.optionsDep.filter(option => option.DepartmentName.toLowerCase().includes(filterValue));
    }
  }

  getDepartmentList() {
    this._MrdService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.optionsDep = this.DepartmentList.slice();
      this.filteredOptionsDep = this._MrdService.MedicalForm.get('Departmentid').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
      );
      if (this.registerObj) {

        const DValue = this.DepartmentList.filter(item => item.DepartmentName == this.registerObj.DepartmentName);
        console.log("Departmentid:", DValue)
        this._MrdService.MedicalForm.get('Departmentid').setValue(DValue[0]);
        this._MrdService.MedicalForm.updateValueAndValidity();
        this.OnChangeDoctorList(DValue[0]);
        return;
      }
    });
  }
  // department dropdown end

  // doctor dropdown
  onDoctorSelect(option: any) {
    debugger
    console.log("selectedDoctorOption:", option)
  }
  getOptionTextDoc(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }

  DepartmentId: any = 0;
  OnChangeDoctorList(departmentObj) {
    debugger
    console.log(departmentObj)
    this.DepartmentId = departmentObj.DepartmentId;
    this._MrdService.MedicalForm.get('DoctorId').reset();
    var vdata = {
      "Id": this.DepartmentId
    }

    this.isDepartmentSelected = true;
    this._MrdService.getDoctorMasterCombo(vdata).subscribe(
      data => {
        this.DoctorList = data;

        this.optionsDoc = this.DoctorList.slice();
        this.filteredOptionsDoc = this._MrdService.MedicalForm.get('DoctorId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
        );
        if (this.registerObj) {
          debugger
          const dVaule = this.DoctorList.filter(item => item.DoctorId == this.registerObj.ConsultantDocId)
          this._MrdService.MedicalForm.get('DoctorId').setValue(dVaule[0])
        }
        console.log("doctor ndfkdf:", this._MrdService.MedicalForm.get('DoctorId').value)
      })
  }
  private _filterDoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      this.isDoctorSelected = false;
      return this.optionsDoc.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }
  }
// doctor dropdown end

// doctor 1 dropdown start
getDoctorList1() {
    debugger
  this._MrdService.getDoctorMaster().subscribe(data => {
    this.DoctorList1 = data;
    this.optionsDoctor1 = this.DoctorList1.slice();
    this.filteredOptionsDoctor1 = this._MrdService.MedicalForm.get('DoctorId1').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._filterDoctor1(value) : this.DoctorList1.slice()),
    );
    if (this.data) {
      
      const DValue = this.DoctorList1.filter(item => item.DoctorId == this.registerObj1.DoctorId);
      console.log("DoctorId1:", DValue)
      this._MrdService.MedicalForm.get('DoctorId1').setValue(DValue[0]);
      this._MrdService.MedicalForm.updateValueAndValidity();
      return;
    }
  });
}
private _filterDoctor1(value: any): string[] {
  debugger
  if (value) {
    const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
    return this.optionsDoctor1.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
  }
}
getOptionTextDoctorId1(option) {
  return option && option.Doctorname ? option.Doctorname : '';
}
// doctor 1 dropdown end

// doctor 2 dropdown start
getDoctorList2() {
  debugger
this._MrdService.getDoctorMaster1Combo().subscribe(data => {
  this.DoctorList2 = data;
  this.optionsDoctor2 = this.DoctorList2.slice();
  this.filteredOptionsDoctor2 = this._MrdService.MedicalForm.get('DoctorId2').valueChanges.pipe(
    startWith(''),
    map(value => value ? this._filterDoctor2(value) : this.DoctorList2.slice()),
  );
  if (this.data) {
    
    const DValue = this.DoctorList2.filter(item => item.DoctorId == this.registerObj1.DoctorId);
    console.log("DoctorId2:", DValue)
    this._MrdService.MedicalForm.get('DoctorId2').setValue(DValue[0]);
    this._MrdService.MedicalForm.updateValueAndValidity();
    return;
  }
});
}
private _filterDoctor2(value: any): string[] {
  debugger
if (value) {
  const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
  return this.optionsDoctor2.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
}
}
getOptionTextDoctorId2(option) {
return option && option.DoctorName ? option.DoctorName : '';
}
// doctor 2 dropdown end
  onSave() {

  }
  onClose() {
    this._MrdService.MedicalForm.reset()
    this.dialogRef.close();
  }

}
