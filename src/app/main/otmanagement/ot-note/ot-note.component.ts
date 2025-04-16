import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { OPIPPatientModel } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';
import Swal from 'sweetalert2';
import { OTReservationDetail } from '../ot-reservation/ot-reservation.component';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { OTManagementServiceService } from '../ot-management-service.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatTableDataSource } from '@angular/material/table';
import { debug } from 'console';
import { element } from 'protractor';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ot-note',
  templateUrl: './ot-note.component.html',
  styleUrls: ['./ot-note.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OTNoteComponent implements OnInit {
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
    this.vDescription = e.target.innerHTML;
  }

  displayedColumns = [
    'DoctorId',
    'DoctorName',
    'Amount'
  ];

  personalFormGroup: FormGroup; 
  registerObj = new OPIPPatientModel({}); 
  registerObj1 = new OTReservationDetail({});
  
  PatientListfilteredOptionsIP: any;
  PatientListfilteredOptionsOP: any;
  isRegIdSelected: boolean = false;
  vSelectedOption: any = '';
  vPatientName: any = '';
  vAgeYear: any = '';
  vAge: any = '';
  vGenderName: any = '';
  vDepartmentName: any = '';
  vOP_IP_MobileNo: any = '';
  vDoctorName: any = '';
  vTariffName: any = '';
  vCompanyName: any = '';
  vWardName: any = '';
  vBedNo: any = '';
  RegId: any = '';
  vAdmissionID: any = '';
  vRegNo: any = '';
  vIPDNo: any = '';
  vOPIP_ID: any = '';
  OP_IPType: any = 2;
  vOPDNo: any = '';
  vDescription = "Incision:<br><br>OperativeDiagnosis:<br><br>OperativeFindings:<br><br>OperativeProcedure:<br><br>ExtraProPerformed:<br><br>ClosureTechnique:<br><br>PostOpertiveInstru:<br><br>DetSpecimenForLab:"

  vDoctor: any;
  isDoctorSelected: boolean = false;
  filteredOptionsDoctorsearch: any;
  noOptionFound: boolean = false;
  screenFromString = 'otBooking-form';
  selectedDoctor: any;
  sIsLoading: string = '';
  isLoading = true; 
  isSurgerySelected: boolean = false;
  filteredOptionsSurgery: Observable<string[]>;
  optionsSurgery: any[] = [];
  SurgeryList: any = []; 
  DoctorList1: any = [];
  optionsSurgeon1: any[] = [];
  filteredOptionsSurgeon1: Observable<string[]>;
  isSurgeon1Selected: boolean = false; 
  isSurgeon2Selected: boolean = false;
  optionsSurgeon2: any[] = [];
  selectedDoctor2: any;
  filteredOptionsSurgeon2: Observable<string[]>;
  DoctorList2: any = []; 
  filteredAnesthDoctor1: Observable<string[]>;
  optionsAnesthDoctor1: any[] = [];
  selectedAnestheticsDr: any;
  isAnestheticsDr1Selected: boolean = false;
  Anesthestishdoclist2: any = [];
  filteredAnesthDoctor2: Observable<string[]>;
  optionsAnesthDoctor2: any[] = [];
  selectedAnestheticsDr2: any;
  isAnestheticsDr2Selected: boolean = false;
  Anesthestishdoclist1: any = [];
  Anesthestishdoclist3: any = [];
  filteredAnesthDoctor3: Observable<string[]>;
  optionsAnesthDoctor3: any[] = [];
  isAnestheticsDr3Selected: boolean = false; 
  options = [];
  filteredOptions: any; 


  dataSource = new MatTableDataSource<OTNoteDetail>();

  constructor(
    public _OtManagementService: OTManagementServiceService,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    //  public dialogRef: MatDialogRef<OTNoteComponent>,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
  ) { }
  data:any
  ngOnInit(): void { 
    this.personalFormGroup = this._OtManagementService.createOtNoteForm();
    this.vSelectedOption = this.OP_IPType === true ? 'IP' : 'OP';

    if (this.advanceDataStored.storage) {
      debugger
      this.registerObj1 = this.advanceDataStored.storage; 
      console.log(this.registerObj1);
      this.vWardName = this.registerObj1.RoomName;
      this.vBedNo = this.registerObj1.BedName;
      this.vGenderName = this.registerObj1.GenderName;
      this.vPatientName = this.registerObj1.PatientName;
      this.vAgeYear = this.registerObj1.AgeYear;
      this.RegId = this.registerObj1.RegID;
      this.vAdmissionID = this.registerObj1.AdmissionID
      this.vAge = this.registerObj1.AgeYear;
      this.vRegNo = this.registerObj1.RegNo;
      this.vIPDNo = this.registerObj1.OPDNo;
      this.vCompanyName = this.registerObj1.CompanyName;
      this.vTariffName = this.registerObj1.TariffName;
      this.vOP_IP_MobileNo = this.registerObj1.MobileNo;
      this.vDoctorName = this.registerObj1.DoctorName;
      this.vDepartmentName = this.registerObj1.DepartmentName;
      this.vOPIP_ID = this.registerObj1.OP_IP_ID;

      if (this.registerObj1.OP_IP_Type === true) { 
        this.vSelectedOption = 'IP'; 
      } else if (this.registerObj1.OP_IP_Type === false) { 
        this.vSelectedOption = 'OP'; 
      }
    }
    this.getDoctorNameCombobox();
    this.getSurgeryList();
    this.getDoctorList();
    this.getDoctorList1();
    this.getAnesthestishDoctorList1();
    this.getAnesthestishDoctorList2();
    this.getAnesthestishDoctorList3();
  }
  onChangePatientType(event) {

    this.personalFormGroup.get('RegID').reset();
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
        "Keyword": `${this.personalFormGroup.get('RegID').value}%`
      }
      if (this.personalFormGroup.get('PatientType').value == 'OP') {
  
        if (this.personalFormGroup.get('RegID').value.length >= 1) {
          this._OtManagementService.getPatientVisitedListSearch(m_data).subscribe(resData => {
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
      } else if (this.personalFormGroup.get('PatientType').value == 'IP') {
  
        if (this.personalFormGroup.get('RegID').value.length >= 1) {
          this._OtManagementService.getAdmittedPatientList(m_data).subscribe(resData => {
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
      this.vOPIP_ID = obj.VisitId
      this.vAge = obj.Age;
      this.vRegNo = obj.RegNo;
      this.vOPDNo = obj.OPDNo;
      this.vCompanyName = obj.CompanyName;
      this.vTariffName = obj.TariffName;
      this.vOP_IP_MobileNo = obj.MobileNo;
      this.vDoctorName = obj.DoctorName;
      this.vDepartmentName = obj.DepartmentName; 
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
    this.vOPIP_ID = '';
    this.vAge = '';
    this.vRegNo='';
    this.vOPDNo = '';
    this.vCompanyName = '';
    this.vTariffName = '';
    this.vOP_IP_MobileNo = '';
    this.vDoctorName = '';
    this.vDepartmentName = ''; 
    this.vIPDNo = '';
  } 

  getSurgeryList() {
    this._OtManagementService.getSurgeryCombo().subscribe(data => {
      this.SurgeryList = data;
      this.optionsSurgery = this.SurgeryList.slice();
      this.filteredOptionsSurgery = this.personalFormGroup.get('SurgeryId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this.Surgery(value) : this.SurgeryList.slice()),
      );
      if (this.data) {
        const DValue = this.SurgeryList.filter(item => item.SurgeryName == this.registerObj1.Surgeryname);
        console.log("SurgeryId:", DValue)
        this.personalFormGroup.get('SurgeryId').setValue(DValue[0]);
        this.personalFormGroup.updateValueAndValidity();
        return;
      }
    });
  }
  private Surgery(value: any): string[] {
    if (value) {
      const filterValue = value && value.SurgeryName ? value.SurgeryName.toLowerCase() : value.toLowerCase();
      return this.optionsSurgery.filter(option => option.SurgeryName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextautoSurgery(option) {
    return option && option.SurgeryName ? option.SurgeryName : '';
  }
  getDoctorList() {
    this._OtManagementService.getDoctorMaster().subscribe(data => {
      this.DoctorList1 = data;
      this.optionsSurgeon1 = this.DoctorList1.slice();
      this.filteredOptionsSurgeon1 = this.personalFormGroup.get('DoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDoctor(value) : this.DoctorList1.slice()),
      );
      if (this.data) {
        const DValue = this.DoctorList1.filter(item => item.DoctorId == this.registerObj1.SurgeonId);
        console.log("DoctorId:", DValue)
        this.personalFormGroup.get('DoctorId').setValue(DValue[0]);
        this.personalFormGroup.updateValueAndValidity();
        return;
      }
    });
  }
  private _filterDoctor(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.optionsSurgeon1.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextSurgeonId1(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }
  // surgeon doctor 2 start 
  getDoctorList1() { 
    this._OtManagementService.getDoctorMaster1Combo().subscribe(data => {
      this.DoctorList2 = data;
      this.optionsSurgeon2 = this.DoctorList2.slice();
      this.filteredOptionsSurgeon2 = this.personalFormGroup.get('DoctorId1').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDoctor2(value) : this.DoctorList2.slice()),
      );
      if (this.data) {

        const DValue = this.DoctorList2.filter(item => item.DoctorId == this.registerObj1.SurgeonId);
        console.log("DoctorId2:", DValue)
        this.personalFormGroup.get('DoctorId1').setValue(DValue[0]);
        this.personalFormGroup.updateValueAndValidity();
        return;
      }
    });
  }
  private _filterDoctor2(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsSurgeon2.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextSurgeonId2(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }
  // AnestheticsDr 1 start 
  getAnesthestishDoctorList1() { 
    this._OtManagementService.getAnesthestishDoctorCombo().subscribe(data => {
      this.Anesthestishdoclist1 = data;
      this.optionsAnesthDoctor1 = this.Anesthestishdoclist1.slice();
      this.filteredAnesthDoctor1 = this.personalFormGroup.get('AnestheticsDr').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterAnesthDoctor1(value) : this.Anesthestishdoclist1.slice()),
      );
      if (this.data) { 
        const DValue = this.Anesthestishdoclist1.filter(item => item.DoctorId == this.registerObj1.AnestheticsDr);
        console.log("AnestheticsDr:", DValue)
        this.personalFormGroup.get('AnestheticsDr').setValue(DValue[0]);
        this.personalFormGroup.updateValueAndValidity();
        return;
      }
    });
  }
  private _filterAnesthDoctor1(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsAnesthDoctor1.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextAnesthDoctor1(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }
  // AnestheticsDr 2 start 
  getAnesthestishDoctorList2() {

    this._OtManagementService.getAnesthestishDoctorCombo().subscribe(data => {
      this.Anesthestishdoclist2 = data;
      this.optionsAnesthDoctor2 = this.Anesthestishdoclist2.slice();
      this.filteredAnesthDoctor2 = this.personalFormGroup.get('AnestheticsDr1').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterAnesthDoctor2(value) : this.Anesthestishdoclist2.slice()),
      );
      if (this.data) { 
        const DValue = this.Anesthestishdoclist2.filter(item => item.DoctorId == this.registerObj1.AnestheticsDr1);
        console.log("AnestheticsDr1:", DValue)
        this.personalFormGroup.get('AnestheticsDr1').setValue(DValue[0]);
        this.personalFormGroup.updateValueAndValidity();
        return;
      }
    });
  }
  private _filterAnesthDoctor2(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsAnesthDoctor2.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextAnesthDoctor2(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }

  getAnesthestishDoctorList3() { 
    this._OtManagementService.getAnesthestishDoctorCombo().subscribe(data => {
      this.Anesthestishdoclist3 = data;
      this.optionsAnesthDoctor3 = this.Anesthestishdoclist3.slice();
      this.filteredAnesthDoctor3 = this.personalFormGroup.get('AnestheticsDr3').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterAnesthDoctor3(value) : this.Anesthestishdoclist3.slice()),
      );
      if (this.data) { 
        const DValue = this.Anesthestishdoclist3.filter(item => item.DoctorId == this.registerObj1.AnestheticsDr1);
        console.log("AnestheticsDr3:", DValue)
        this.personalFormGroup.get('AnestheticsDr3').setValue(DValue[0]);
        this.personalFormGroup.updateValueAndValidity();
        return;
      }
    });
  }
  private _filterAnesthDoctor3(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsAnesthDoctor3.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextAnesthDoctor3(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }

  addDoctor() {
    debugger
    if (this.selectedDoctor) {
      // Add the selected doctor to the data source
      this.dataSource.data.push({
        DoctorId: this.selectedDoctor.DoctorId,
        DoctorName: this.selectedDoctor.Doctorname,
        Amount: 0
      });
      this.dataSource._updateChangeSubscription(); // Update the data source
      this.clearSelection(); // Clear the selection after adding
    }
  }
  clearSelection() {
    this.personalFormGroup.get('DoctorId').setValue('');
    this.selectedDoctor = null;
  }

  onSubmit() { 
    if (this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select patient Name ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.personalFormGroup.get('SurgeryId').value) {
      if (!this.SurgeryList.find(item => item.SurgeryName == this.personalFormGroup.get('SurgeryId').value.SurgeryName)) {
        this.toastr.warning('Please select Valid Surgery Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    } 
    if (this.personalFormGroup.get('DoctorId').value) {
      if (!this.DoctorList1.find(item => item.Doctorname == this.personalFormGroup.get('DoctorId').value.Doctorname)) {
        this.toastr.warning('Please select Valid Surgeon Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }  
    if (this.personalFormGroup.get('DoctorId1').value) {
      if (!this.DoctorList2.find(item => item.Doctorname == this.personalFormGroup.get('DoctorId1').value.Doctorname)) {
        this.toastr.warning('Please select Valid Surgeon Name 2', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.personalFormGroup.get('AnestheticsDr').value) {
      if (!this.Anesthestishdoclist1.find(item => item.DoctorName == this.personalFormGroup.get('AnestheticsDr').value.DoctorName)) {
        this.toastr.warning('Please select Valid AnestheticsDr Name ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }  
    if (this.personalFormGroup.get('AnestheticsDr1').value) {
      if (!this.Anesthestishdoclist2.find(item => item.DoctorName == this.personalFormGroup.get('AnestheticsDr1').value.DoctorName)) {
        this.toastr.warning('Please select Valid AnestheticsDr Name ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }  
    if (this.personalFormGroup.get('AnestheticsDr3').value) {
      if (!this.Anesthestishdoclist3.find(item => item.DoctorName == this.personalFormGroup.get('AnestheticsDr3').value.DoctorName)) {
        this.toastr.warning('Please select Valid AnestheticsDr Name ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }  

    Swal.fire({
      title: 'Do you want to Save the OT Note ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save it!"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.OnSave()
      }
    })
  }
  OnSave() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    let row, IncisionNew, OPeDignosis, OperFinding, OperProcuder, Extperformed, Closertech, PostOperat, DetSpecLab
    let discription = this.vDescription
    let ID = discription.split('<br><br>')
    ID.forEach(element => {
      row = element.split(':')
      if (row[0] == 'Incision') {
        IncisionNew = row[1]
        console.log(IncisionNew)
      }
      if (row[0] == 'OperativeDiagnosis') {
        OPeDignosis = row[1]
        console.log(OPeDignosis)
      }
      if (row[0] == 'OperativeFindings') {
        OperFinding = row[1]
        console.log(OperFinding)
      }
      if (row[0] == 'OperativeProcedure') {
        OperProcuder = row[1]
        console.log(OperProcuder)
      }
      if (row[0] == 'ExtraProPerformed') {
        Extperformed = row[1]
        console.log(Extperformed)
      }
      if (row[0] == 'ClosureTechnique') {
        Closertech = row[1]
        console.log(Closertech)
      }
      if (row[0] == 'PostOpertiveInstru') {
        PostOperat = row[1]
        console.log(PostOperat)
      }
      if (row[0] == 'DetSpecimenForLab') {
        DetSpecLab = row[1]
        console.log(DetSpecLab)
      }
      //console.log(row)  
    })
    
    let SurgeryName = ''
    if(this.personalFormGroup.get('SurgeryId').value)
      SurgeryName = this.personalFormGroup.get('SurgeryId').value.SurgeryName

    let SurgeonId = 0
    if(this.personalFormGroup.get('DoctorId').value)
      SurgeonId = this.personalFormGroup.get('DoctorId').value.DoctorId

    let SurgeonId1 = 0
    if(this.personalFormGroup.get('DoctorId1').value)
      SurgeonId1 = this.personalFormGroup.get('DoctorId1').value.SurgeryName

    let AnestheticsDr = 0
    if(this.personalFormGroup.get('AnestheticsDr').value)
      AnestheticsDr = this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').value.DoctorId

    let AnestheticsDr1 = 0
    if(this.personalFormGroup.get('AnestheticsDr1').value)
      AnestheticsDr1 = this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').value.DoctorId

    let AnestheticsDr3 = 0
    if(this.personalFormGroup.get('AnestheticsDr3').value)
      AnestheticsDr3 = this._OtManagementService.otreservationFormGroup.get('AnestheticsDr3').value.DoctorId


    let otBookingID = this.registerObj1.OTBookingID;
    if (!otBookingID) {
      var m_data = {
        "otNoteTemplateInsert": {
          "otTemplateName": "string",
          "otDate": formattedDate,
          "otTime": formattedTime,
          "surgeryName": SurgeryName || '',
          "surgeonID": SurgeonId || 0,
          "surgeonID1": SurgeonId1  || 0,
          "assistant": this.personalFormGroup.get('assistant').value || '',
          "anesthetishID": AnestheticsDr,
          "anesthetishID1":AnestheticsDr1,
          "anesthetishID2": AnestheticsDr3,
          "anesthetishType": "string",
          "incision": IncisionNew || '',
          "operativeDiagnosis": OPeDignosis || '',
          "operativeFindings": OperFinding || '',
          "operativeProcedure": OperProcuder || '',
          "extraProPerformed": Extperformed || '',
          "closureTechnique": Closertech || '',
          "postOpertiveInstru": PostOperat || '',
          "detSpecimenForLab": DetSpecLab || '',
          "addedby": this.accountService.currentUserValue.user.id,
          "surgeryType": "string",
          "fromTime": formattedDate,
          "toTime": formattedTime,
          "otReservationId": 0,
          "bloodLoss": this.personalFormGroup.get('BloodLoss').value || '',
          "surgeryID": 0,
          "sorubNurse": this.personalFormGroup.get('sorubNurse').value || '',
          "histopathology": this.personalFormGroup.get('histopathology').value || '',
          "bostOPOrders": this.personalFormGroup.get('bostOPOrders').value || '',
          "anestTypeId": 0,
          "siteDescID": 0,
          "complicationMode": this.personalFormGroup.get('complicationMode').value || '',
          "serviceId": 0,
          "procedureId": 0,
          "otNoteTempId": 0
        },
      }
      console.log(m_data);
      this._OtManagementService.InsertOTNotes(m_data).subscribe(response => {
        if (response) {
          this._OtManagementService
          Swal.fire('Congratulations !', 'OT Note  Data save Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this.onClose();
            }
          });
        } else {
          Swal.fire('Error !', 'Ot Note Data  not saved', 'error');
        }
      });
    }
    else {
      debugger;
      var m_data1 = {
        "otNoteTemplateUpdate": {
          "otGenSurId": 0,
          "otDate": formattedDate,
          "otTime": formattedTime,
          "surgeryName": SurgeryName || '',
          "surgeonID": SurgeonId || 0,
          "surgeonID1": SurgeonId1  || 0,
          "assistant": this.personalFormGroup.get('assistant').value || '',
          "anesthetishID": AnestheticsDr,
          "anesthetishID1":AnestheticsDr1,
          "anesthetishID2": AnestheticsDr3,
          "anesthetishType": "string",
          "incision": IncisionNew || '',
          "operativeDiagnosis": OPeDignosis || '',
          "operativeFindings": OperFinding || '',
          "operativeProcedure": OperProcuder || '',
          "extraProPerformed": Extperformed || '',
          "closureTechnique": Closertech || '',
          "postOpertiveInstru": PostOperat || '',
          "detSpecimenForLab": DetSpecLab || '',
          "updatedBy": this.accountService.currentUserValue.user.id,
          "surgeryType": "string",
          "fromTime": formattedDate,
          "toTime": formattedTime,
          "bloodLoss": this.personalFormGroup.get('BloodLoss').value || '',
          "surgeryID": 0,
          "sorubNurse": this.personalFormGroup.get('sorubNurse').value || '',
          "histopathology": this.personalFormGroup.get('histopathology').value || '',
          "bostOPOrders": this.personalFormGroup.get('bostOPOrders').value || '',
          "anestTypeId": 0,
          "siteDescID": 0,
          "otTemplateName": "string",
          "complicationMode": this.personalFormGroup.get('complicationMode').value || '',
          "serviceId": 0,
          "procedureId": 0,
          "otNoteTempId": 0
        }
      }
      console.log(m_data1);
      this._OtManagementService.UpdateOTNotes(m_data1).subscribe(response => {
        if (response) {
          Swal.fire('Congratulations !', 'OT NOTE Data Updated Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
         this.onClose();
            }
          });
        } else {
          Swal.fire('Error !', 'OT Note Data  not saved', 'error');
        }

      });
    }

  }

  onClose() {
    this.dataSource.data = [];
    this.personalFormGroup.reset();
    // this.dialogRef.close(); 
    this._matDialog.closeAll();
    this.personalFormGroup.get('PatientType').setValue('IP')
    this.personalFormGroup.get('Description').setValue( "Incision:<br><br>OperativeDiagnosis:<br><br>OperativeFindings:<br><br>OperativeProcedure:<br><br>ExtraProPerformed:<br><br>ClosureTechnique:<br><br>PostOpertiveInstru:<br><br>DetSpecimenForLab:")
    this.vDescription = "Incision:<br><br>OperativeDiagnosis:<br><br>OperativeFindings:<br><br>OperativeProcedure:<br><br>ExtraProPerformed:<br><br>ClosureTechnique:<br><br>PostOpertiveInstru:<br><br>DetSpecimenForLab:"

  }

  //Doctor list 
  getDoctorNameCombobox() {
    debugger
    var vdata = {
      "@Keywords": `${this.personalFormGroup.get('DoctorId').value}%`
    }
    console.log(vdata)
    this._OtManagementService.getDoctorMasterComboList(vdata).subscribe(data => {
      this.filteredOptionsDoctorsearch = data;
      console.log(this.filteredOptionsDoctorsearch)
      if (this.filteredOptionsDoctorsearch.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
  onDoctorSelect(option) {
    debugger
    console.log("selectedDoctorOption:", option)
    this.selectedDoctor = option;
  }
  getOptionTextDoctor(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  onAmountChange(contact: any, amount: number) {
    contact.Amount = amount;
  }
}
export class OTNoteDetail {
  DoctorId: any;
  DoctorName: any;
  Amount: any;
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(OTNoteDetail) {
    {
      this.DoctorId = OTNoteDetail.DoctorId || '',
        this.DoctorName = OTNoteDetail.DoctorName || ''
      this.Amount = OTNoteDetail.Amount || ''
    }
  }
}

