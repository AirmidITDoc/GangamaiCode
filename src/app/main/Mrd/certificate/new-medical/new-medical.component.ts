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
  vCertificateNo: any;
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
  isDoctor1Selected: boolean = false;
  isDoctor2Selected: boolean = false;
  selectedDoctor1: string = '';
  selectedDoctor2: string = '';
  vAccidentDateTime: any;
  date: any;
  vAgeInjuries: any;
  vCauseInjuries: any;

  DoctorList1: any = [];
  optionsDoctor1: any[] = [];
  filteredOptionsDoctor1: Observable<string[]>;
  DoctorList2: any = [];
  optionsDoctor2: any[] = [];
  filteredOptionsDoctor2: Observable<string[]>;
  vAccidentDetails: any;
  vDocId: any;
  datePart: any;
  timePart: any;

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
      this.registerObj1 = this.data.PatObj;
      console.log("Medical legal case:", this.registerObj1)
      if (this.registerObj1.OP_IP_Type === 1) {
        // Fetch IP-specific information
        console.log("IIIIIIIIIIIIIPPPPPPPPP:", this.registerObj1.OP_IP_Type);
        this.vWardName = this.registerObj1.RoomName;
        this.vBedNo = this.registerObj1.BedName;
        this.vGenderName = this.registerObj1.GenderName;
        this.vPatientName = this.registerObj1.PatientName;
        this.vAgeYear = this.registerObj1.AgeYear;
        this.RegId = this.registerObj1.RegID;
        this.vAdmissionID = this.registerObj1.OP_IP_Id
        this.vAge = this.registerObj1.AgeYear;
        this.vRegNo = this.registerObj1.RegNo;
        this.vIPDNo = this.registerObj1.IPDNo;
        this.vCompanyName = this.registerObj1.CompanyName;
        this.vTariffName = this.registerObj1.TariffName;
        this.vOP_IP_MobileNo = this.registerObj1.MobileNo;
        this.vDepartmentName = this.registerObj1.DepartmentName;
        this.vSelectedOption = 'IP';
        this.vCertificateNo = this.registerObj1.CertificateNo;
        this.vAgeInjuries = this.registerObj1.AgeofInjuries;
        this.vCauseInjuries = this.registerObj1.CauseofInjuries;
        this.vDocId = this.registerObj1.DocId;
        this.vAccidentDetails = this.registerObj1.Details_Injuries;
        this.vDoctorName = this.registerObj1.PatientDoctorName;

        this.selectedDepartment = this.registerObj1.ConsentDeptId;
        this.selectedDoctor = this.registerObj1.TreatingDoctorId;
        this.selectedDoctor1 = this.registerObj1.TreatingDoctorId1;
        this.selectedDoctor2 = this.registerObj1.TreatingDoctorId2;

        this.getDepartmentList();
        this.setAccidentDateTime();
      } else if (this.registerObj1.OP_IP_Type === 0) {
        // Fetch OP-specific information
        console.log("OOOOOOOPPPPPPPPP:", this.registerObj1.OP_IP_Type);
        this.vWardName = this.registerObj1.RoomName;
        this.vBedNo = this.registerObj1.BedName;
        this.vGenderName = this.registerObj1.GenderName;
        this.vPatientName = this.registerObj1.PatientName;
        this.vAgeYear = this.registerObj1.AgeYear;
        this.RegId = this.registerObj1.RegID;
        // this.vvisi = this.registerObj1.OP_IP_Id
        this.vAdmissionID = this.registerObj1.OP_IP_Id
        this.vAge = this.registerObj1.Age;
        this.vRegNo = this.registerObj1.RegNo;
        this.vOPDNo = this.registerObj1.IPDNo;
        this.vCompanyName = this.registerObj1.CompanyName;
        this.vTariffName = this.registerObj1.TariffName;
        this.vOP_IP_MobileNo = this.registerObj1.MobileNo;
        this.vDoctorName = this.registerObj1.PatientDoctorName;
        this.vDepartmentName = this.registerObj1.DepartmentName;
        this.vSelectedOption = 'OP';
        this.vCertificateNo = this.registerObj1.CertificateNo;
        this.vAgeInjuries = this.registerObj1.AgeofInjuries;
        this.vCauseInjuries = this.registerObj1.CauseofInjuries;
        this.vDocId = this.registerObj1.DocId;
        this.vAccidentDetails = this.registerObj1.Details_Injuries;

        this.selectedDepartment = this.registerObj1.ConsentDeptId;
        this.selectedDoctor = this.registerObj1.TreatingDoctorId;
        this.selectedDoctor1 = this.registerObj1.TreatingDoctorId1;
        this.selectedDoctor2 = this.registerObj1.TreatingDoctorId2;

        this.getDepartmentList();
        this.setAccidentDateTime();
      }
    }
    this.getDepartmentList();
    this.getDoctorList1();
    this.getDoctorList2();
    this.setAccidentDateTime();
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

  setAccidentDateTime() {
    debugger
    if (this.registerObj1.Accident_Date && this.registerObj1.Accident_Time) {
      let datePart = this.registerObj1.Accident_Date.split("T")[0]; // Extract "YYYY-MM-DD"
      let timePart = this.registerObj1.Accident_Time.split("T")[1].slice(0, 5); // Extract "HH:MM"
      this.vAccidentDateTime = `${datePart}T${timePart}`;
    }
  }

  onDateChange(event: any) {
    // Capture the selected date and time
    const selectedDateTime = event.target.value;
    console.log('Selected Date and Time:', selectedDateTime);

    // Optionally, you can extract date and time separately
    this.datePart = selectedDateTime.split('T')[0]; // 'YYYY-MM-DD'
    this.timePart = selectedDateTime.split('T')[1]; // 'HH:MM'
    console.log('Date:', this.datePart);
    console.log('Time:', this.timePart);
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
    debugger
    this._MrdService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.optionsDep = this.DepartmentList.slice();
      this.filteredOptionsDep = this._MrdService.MedicalForm.get('Departmentid').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
      );
      if (this.registerObj) {
        debugger
        const DValue = this.DepartmentList.filter(item => item.DepartmentName == this.registerObj1.DepartmentName);
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
          const dVaule = this.DoctorList.filter(item => item.DoctorId == this.registerObj1.AdmDoctor)
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
        debugger
        const DValue = this.DoctorList1.filter(item => item.DoctorId == this.registerObj1.TreatingDoctorId1);
        console.log("DoctorId1:", DValue)
        this._MrdService.MedicalForm.get('DoctorId1').setValue(DValue[0]);
        this._MrdService.MedicalForm.updateValueAndValidity();
        return;
      }
    });
  }
  private _filterDoctor1(value: any): string[] {    
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
        debugger
        const DValue = this.DoctorList2.filter(item => item.DoctorId == this.registerObj1.TreatingDoctorId2);
        console.log("DoctorId2:", DValue)
        this._MrdService.MedicalForm.get('DoctorId2').setValue(DValue[0]);
        this._MrdService.MedicalForm.updateValueAndValidity();
        return;
      }
    });
  }
  private _filterDoctor2(value: any): string[] {
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
    //   if (!this._MrdService.MedicalForm.get('RegID')?.value && !this.registerObj1?.RegId) {
    //     this.toastr.warning('Please Select Patient', 'Warning!', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return;
    // }
    if (this.selectedDepartment == '' || this.selectedDepartment == null || this.selectedDepartment == undefined) {
      this.toastr.warning('Please select Department ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._MrdService.MedicalForm.get('Departmentid').value) {
      if (!this.DepartmentList.find(item => item.DepartmentName == this._MrdService.MedicalForm.get('Departmentid').value.DepartmentName)) {
        this.toastr.warning('Please select Valid Department Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    if (this.selectedDoctor == '' || this.selectedDoctor == null || this.selectedDoctor == undefined) {
      this.toastr.warning('Please select Admitted Doctor ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._MrdService.MedicalForm.get('DoctorId').value) {
      if (!this.DoctorList.find(item => item.DoctorId == this._MrdService.MedicalForm.get('DoctorId').value.DoctorId)) {
        this.toastr.warning('Please select Valid Doctor Name 1', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    if (this.selectedDoctor1 == '' || this.selectedDoctor1 == null || this.selectedDoctor1 == undefined) {
      this.toastr.warning('Please select Doctor 1 ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._MrdService.MedicalForm.get('DoctorId1').value) {
      if (!this.DoctorList1.find(item => item.DoctorId == this._MrdService.MedicalForm.get('DoctorId1').value.DoctorId)) {
        this.toastr.warning('Please select Valid Doctor Name 1', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    if (this.selectedDoctor2 == '' || this.selectedDoctor2 == null || this.selectedDoctor2 == undefined) {
      this.toastr.warning('Please select Doctor 2 ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._MrdService.MedicalForm.get('DoctorId2').value) {
      if (!this.DoctorList2.find(item => item.DoctorId == this._MrdService.MedicalForm.get('DoctorId2').value.DoctorId)) {
        this.toastr.warning('Please select Valid Doctor Name 2', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    if (this.vAccidentDateTime == '' || this.vAccidentDateTime == null || this.vAccidentDateTime == undefined) {
      this.toastr.warning('Please select Date and Time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vCertificateNo == '' || this.vCertificateNo == null || this.vCertificateNo == undefined) {
      this.toastr.warning('Please Enter CertificateNo', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vAgeInjuries == '' || this.vAgeInjuries == null || this.vAgeInjuries == undefined) {
      this.toastr.warning('Please Enter Age of Injuries', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vCauseInjuries == '' || this.vCauseInjuries == null || this.vCauseInjuries == undefined) {
      this.toastr.warning('Please Enter Cause of Injuries', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vAccidentDetails == '' || this.vAccidentDetails == null || this.vAccidentDetails == undefined) {
      this.toastr.warning('Please Enter Accident Details', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    Swal.fire({
      title: 'Do you want to Save the Medical Legal Case Recode ',
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
debugger
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    let opip_Type;
    if (this._MrdService.MedicalForm.get('PatientType').value == 'IP') {
      opip_Type = 1;
    }
    else {
      opip_Type = 0;
    }
    if (!this.vDocId) {

      let insertMrdMedicolegalCertificate = {
        "mlcDate": formattedDate,
        "mlcTime": formattedTime,
        "certificateNo": this._MrdService.MedicalForm.get("CertificateNo").value || 0,
        "op_IP_ID": this.vOPIP_ID,
        "op_IP_Type": opip_Type,
        "accidentDate": this.datePart,
        "accidentTime": this.timePart,
        "details_Injuries": this._MrdService.MedicalForm.get("AccidentDetails").value || 0,
        "ageofInjuries": this._MrdService.MedicalForm.get("AgeInjuries").value || 0,
        "causeofInjuries": this._MrdService.MedicalForm.get("CauseInjuries").value || 0,
        "treatingDoctorId": this._MrdService.MedicalForm.get("DoctorId").value.DoctorId || 0,
        "treatingDoctorId1": this._MrdService.MedicalForm.get("DoctorId1").value.DoctorId || 0,
        "treatingDoctorId2": this._MrdService.MedicalForm.get("DoctorId2").value.DoctorId || 0,
        "createdBy": this._loggedService.currentUserValue.user.id,
        "docId": 0
      }

      let submitData = {
        "insertMrdMedicolegalCertificate": insertMrdMedicolegalCertificate
      }
      console.log("insertJson:", submitData);

      this._MrdService.medicalRecordInsert(submitData).subscribe(response => {
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

      let updateMrdMedicolegalCertificate = {
        "docId": this.vDocId,
        "mlcDate": formattedDate,
        "mlcTime": formattedTime,
        "certificateNo": this._MrdService.MedicalForm.get("CertificateNo").value || 0,
        "op_IP_ID": this.vAdmissionID,
        "op_IP_Type": opip_Type,
        "accidentDate": this.registerObj1.Accident_Date,
        "accidentTime": this.registerObj1.Accident_Time,
        "details_Injuries": this._MrdService.MedicalForm.get("AccidentDetails").value || 0,
        "ageofInjuries": this._MrdService.MedicalForm.get("AgeInjuries").value || 0,
        "causeofInjuries": this._MrdService.MedicalForm.get("CauseInjuries").value || 0,
        "treatingDoctorId": this._MrdService.MedicalForm.get("DoctorId").value.DoctorId || 0,
        "treatingDoctorId1": this._MrdService.MedicalForm.get("DoctorId1").value.DoctorId || 0,
        "treatingDoctorId2": this._MrdService.MedicalForm.get("DoctorId2").value.DoctorId || 0,
        "modifiedBy": this._loggedService.currentUserValue.user.id,

      }

      let updateData = {
        "updateMrdMedicolegalCertificate": updateMrdMedicolegalCertificate
      }

      console.log("UpdateJson:", updateData);

      this._MrdService.medicalRecordUpdate(updateData).subscribe(response => {
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

  onClose() {
    this._MrdService.MedicalForm.reset()
    this.dialogRef.close();
  }

}
