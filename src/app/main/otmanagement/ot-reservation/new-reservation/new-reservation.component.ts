import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OPIPPatientModel } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';
import { OTReservationDetail } from '../ot-reservation.component';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { OTManagementServiceService } from '../../ot-management-service.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Router } from '@angular/router';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { OTNoteComponent } from '../../ot-note/ot-note.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { GetOTRequetComponent } from '../get-otrequet/get-otrequet.component';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-reservation',
  templateUrl: './new-reservation.component.html',
  styleUrls: ['./new-reservation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewReservationComponent implements OnInit {


  personalFormGroup: FormGroup;
  isRegIdSelected: Boolean = false;
  submitted = false;
  now = Date.now();
  isRegSearchDisabled: boolean = true;
  newRegSelected: any = 'registration';
  selectedAdvanceObj: OPIPPatientModel;
  msg: any = [];
  DoctorList1: any = [];
  DoctorList2: any = [];
  Doctor1List: any = [];
  Doctor2List: any = [];
  SurgeryList: any = [];
  OTtableList: any = [];
  Anesthestishdoclist1: any = [];
  Anesthestishdoclist2: any = [];
  Today: Date = new Date();
  registerObj = new OPIPPatientModel({});
  isLoading: string = '';
  Prefix: any;
  OPDate: any;
  ID: any;
  registerObj1 = new OTReservationDetail({});

  IsPathRad: any;
  PatientName: any = '';
  OPIP: any = '';
  Bedname: any = '';
  wardname: any = '';
  classname: any = '';
  tariffname: any = '';
  AgeYear: any = '';
  Age: any = '';
  ipno: any = '';
  patienttype: any = '';
  Adm_Vit_ID: any = 0;
  public dateValue: Date = new Date();
  options = [];
  myForm: FormGroup;
  filteredOptions: any;
  noOptionFound: boolean = false;
  RegId: any;
  vAdmissionID: any;
  PatientListfilteredOptions: any;

  vGenderName: any;
  vRegNo: any;
  vOPDNo: any;
  vCompanyName: any;
  vOP_IP_MobileNo: any;
  vDoctorName: any;
  GendercmbList: any = [];
  optionsGender: any[] = [];
  vSelectedOption: any = 'OP';
  selectedType: any = '';
  vOtReqOPD: any;
  vOtReqIPD: any;
  vDepartmentName: any;
  vIPDNo: any;
  vConditionOP: boolean = false;
  vConditionIP: boolean = false;
  OP_IP_Id: any = 0;
  OP_IPType: any = 2;
  vWardName: any;
  vBedNo: any;
  vPatientName: any;
  vAgeYear: any;
  vAge: any;
  vTariffName: any;
  vSiteDescId: any;
  vSurgeryId: any;
  vDocName: any;
  vDepName: any;
  PatientListfilteredOptionsIP: any;
  PatientListfilteredOptionsOP: any;
  vOPIP_ID: any;
  vAnesthType:any;
  vOtRequestId:any;

  isSurgerySelected: boolean = false;
  filteredOptionsSurgery: Observable<string[]>;
  optionsSurgery: any[] = [];

  selectedDoctor1: any;
  optionsSurgeon1: any[] = [];
  filteredOptionsSurgeon1: Observable<string[]>;
  isSurgeon1Selected: boolean = false;

  isSurgeon2Selected: boolean = false;
  optionsSurgeon2: any[] = [];
  selectedDoctor2: any;
  filteredOptionsSurgeon2: Observable<string[]>;

  filteredAnesthDoctor1: Observable<string[]>;
  optionsAnesthDoctor1: any[] = [];
  selectedAnestheticsDr: any;
  isAnestheticsDr1Selected: boolean = false;

  filteredAnesthDoctor2: Observable<string[]>;
  optionsAnesthDoctor2: any[] = [];
  selectedAnestheticsDr2: any;
  isAnestheticsDr2Selected: boolean = false;

  filteredOtTable: Observable<string[]>;
  optionsOtTable: any[] = [];
  selectedOtTable: string = '';
  isOtTableSelected: boolean = false;

  screenFromString = 'otBooking-form';

  selectedPrefixId: any;

  matDialogRef: any;

  //doctortwo filter
  public doctortwoFilterCtrl: FormControl = new FormControl();
  public filteredDoctortwo: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();

  constructor(
    public _OtManagementService: OTManagementServiceService,
    private formBuilder: FormBuilder,
    private _loggedService: AuthenticationService,
    // public notification: NotificationServiceService,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewReservationComponent>,
    // public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    private router: Router) { }


  ngOnInit(): void {

    console.log(this.data)
    this.personalFormGroup = this.createOtCathlabForm();

    this.vSelectedOption = this.OP_IPType === true ? 'IP' : 'OP';

    if (this.data) {
debugger
      this.registerObj1 = this.data.Obj;

      // ip and op edit
      if (this.registerObj1.OP_IP_Type === true) {
        // Fetch IP-specific information
        console.log("IIIIIIIIIIIIIPPPPPPPPP:", this.registerObj1);
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
        this.vSelectedOption = 'IP';
        this.vSiteDescId = this.registerObj1.SiteDescId;
        this.vSurgeryId = this.registerObj1.Surgeryname;
        this.vOPIP_ID=this.registerObj1.OP_IP_ID;
        this.selectedDoctor1=this.registerObj1.SurgeonId;
        this.selectedDoctor2=this.registerObj1.SurgeonId1;
        this.selectedAnestheticsDr=this.registerObj1.AnestheticsDr;        
        this.selectedAnestheticsDr2=this.registerObj1.AnestheticsDr1;
        this.vAnesthType=this.registerObj1.AnesthType;
        this.vOtRequestId=this.registerObj1.OTRequestId;

        this.setDropdownObjs1();
        this.getSurgeryList();
        this.getDoctorList();
        this.getDoctorList1();
        this.getOttableList();
        this.getDoctor2List();
        this.getAnesthestishDoctorList1();
        this.getAnesthestishDoctorList2();
      } else if (this.registerObj1.OP_IP_Type === false) {
        // Fetch OP-specific information
        console.log("OOOOOOOPPPPPPPPP:", this.registerObj1);
        this.vWardName = this.registerObj1.RoomName;
        this.vBedNo = this.registerObj1.BedName;
        this.vGenderName = this.registerObj1.GenderName;
        this.vPatientName = this.registerObj1.PatientName;
        this.vAgeYear = this.registerObj1.AgeYear;
        this.RegId = this.registerObj1.RegID;
        this.vAdmissionID = this.registerObj1.AdmissionID
        this.vAge = this.registerObj1.AgeYear;
        this.vRegNo = this.registerObj1.RegNo;
        this.vOPDNo = this.registerObj1.OPDNo;
        this.vCompanyName = this.registerObj1.CompanyName;
        this.vTariffName = this.registerObj1.TariffName;
        this.vOP_IP_MobileNo = this.registerObj1.MobileNo;
        this.vDoctorName = this.registerObj1.DoctorName;
        this.vDepartmentName = this.registerObj1.DepartmentName;
        this.vSelectedOption = 'OP';
        this.vSiteDescId = this.registerObj1.SiteDescId
        this.vSurgeryId = this.registerObj1.Surgeryname;
        this.vOPIP_ID=this.registerObj1.OP_IP_ID;
        this.selectedDoctor1=this.registerObj1.SurgeonId;
        this.selectedDoctor2=this.registerObj1.SurgeonId1;
        this.selectedAnestheticsDr=this.registerObj1.AnestheticsDr;        
        this.selectedAnestheticsDr2=this.registerObj1.AnestheticsDr1;
        this.vAnesthType=this.registerObj1.AnesthType;
        this.vOtRequestId=this.registerObj1.OTRequestId;

        this.setDropdownObjs1();
        this.getSurgeryList();
        this.getDoctorList();
        this.getDoctorList1();
        this.getOttableList();
        this.getDoctor2List();
        this.getAnesthestishDoctorList1();
        this.getAnesthestishDoctorList2();
      }

      console.log(this.registerObj1);

      this.setDropdownObjs1();
    }

    this.getSurgeryList();
    this.getDoctorList();
    this.getDoctorList1();
    this.getOttableList();
    this.getDoctor2List();
    this.getAnesthestishDoctorList1();
    this.getAnesthestishDoctorList2();
    // this.addEmptyRow();

    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      this.PatientName = this.selectedAdvanceObj.PatientName;
      this.OPIP = this.selectedAdvanceObj.IP_OP_Number;
      this.AgeYear = this.selectedAdvanceObj.AgeYear;
      this.classname = this.selectedAdvanceObj.ClassName;
      this.tariffname = this.selectedAdvanceObj.TariffName;
      this.ipno = this.selectedAdvanceObj.IPNumber;
      this.Bedname = this.selectedAdvanceObj.Bedname;
      this.wardname = this.selectedAdvanceObj.WardId;
      this.Adm_Vit_ID = this.selectedAdvanceObj.OP_IP_ID;
    }
    console.log(this.selectedAdvanceObj);

    this.doctortwoFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctortwo();
      });


    setTimeout(function () {

      let element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
      element.click();

    }, 1000);

    this.vOtReqOPD = this._loggedService.currentUserValue.user.pharOPOpt;
    this.vOtReqIPD = this._loggedService.currentUserValue.user.pharIPOpt;

    if (this.vOtReqIPD == true) {
      if (this.vOtReqOPD == false) {
        this.vSelectedOption = 'IP';
        this._OtManagementService.otreservationFormGroup.get('MobileNo').clearValidators();
        this._OtManagementService.otreservationFormGroup.get('PatientName').clearValidators();
        this._OtManagementService.otreservationFormGroup.get('MobileNo').updateValueAndValidity();
        this._OtManagementService.otreservationFormGroup.get('PatientName').updateValueAndValidity();
      }
    } else {
      this.vConditionIP = true
    }
    if (this.vOtReqOPD == true) {
      if (this.vOtReqIPD == false) {
        this.vSelectedOption = 'OP';
        this._OtManagementService.otreservationFormGroup.get('MobileNo').clearValidators();
        this._OtManagementService.otreservationFormGroup.get('PatientName').clearValidators();
        this._OtManagementService.otreservationFormGroup.get('MobileNo').updateValueAndValidity();
        this._OtManagementService.otreservationFormGroup.get('PatientName').updateValueAndValidity();
      }
    } else {
      this.vConditionOP = true
    }

  }

  onChangePatientType(event) {
    this._OtManagementService.otreservationFormGroup.get('RegID').reset();
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
  getOptionTextIPObj(option) {
    return option && option.FirstName + " " + option.LastName;
  }
  getOptionTextOPObj(option) {
    return option && option.FirstName + " " + option.LastName;
  }

  getSearchList() {
    var m_data = {
      "Keyword": `${this._OtManagementService.otreservationFormGroup.get('RegID').value}%`
    }
    if (this._OtManagementService.otreservationFormGroup.get('PatientType').value == 'OP') {

      if (this._OtManagementService.otreservationFormGroup.get('RegID').value.length >= 1) {
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
    } else if (this._OtManagementService.otreservationFormGroup.get('PatientType').value == 'IP') {

      if (this._OtManagementService.otreservationFormGroup.get('RegID').value.length >= 1) {
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
    this.vOPIP_ID = '';
  }

  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.PatientName + ' (' + option.RegID + ')';
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

    this.vOPIP_ID = obj.VisitId

    this.getSurgeryList();
    this.getDoctorList();
    this.getDoctorList1();
    this.getOttableList();
    this.getDoctor2List();
    this.getAnesthestishDoctorList1();
    this.getAnesthestishDoctorList2();
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
      this.vOPIP_ID = this.registerObj.AdmissionID;
    }
    this.getSurgeryList();
    this.getDoctorList();
    this.getDoctorList1();
    this.getOttableList();
    this.getDoctor2List();
    this.getAnesthestishDoctorList1();
    this.getAnesthestishDoctorList2();
  }

  closeDialog() {
    this.dialogRef.close();
    this.personalFormGroup.reset({
      start: new Date(),
      end: new Date(),
    });
  }
  createOtCathlabForm() {
    return this.formBuilder.group({
      OTCathLabBokingID: '',
      TranDate: [new Date().toISOString()],
      TranTime: [new Date().toISOString()],
      OP_IP_ID: '',
      OP_IP_Type: '',
      OPDate: [new Date().toISOString()],
      OPTime: [new Date().toISOString()],
      SurgeryId: '',
      Duration: '',
      OTTableId: '',
      SurgeonId: '',
      SurgeonId1: ' ',
      AnestheticsDr: '',
      AnestheticsDr1: '',
      Surgeryname: '',
      ProcedureId: '',
      AnesthType: '',
      UnBooking: '',
      Instruction: '',
      IsAddedBy: '',
      OTBookingID: '',

    });
  }

  setDropdownObjs1() {
    
    this._OtManagementService.populateFormpersonal(this.registerObj1);

    console.log(this.DoctorList1);
    console.log(this.OTtableList);
    console.log(this.Anesthestishdoclist1);
    console.log(this.Anesthestishdoclist2);

    const toSurgeonId1 = this.DoctorList1.find(c => c.DoctorId == this.registerObj1.SurgeonId);
    this._OtManagementService.otreservationFormGroup.get('SurgeonId').setValue(toSurgeonId1);

    const toOTTableId = this.OTtableList.find(c => c.OTTableId == this.registerObj1.OTTableID);
    this._OtManagementService.otreservationFormGroup.get('OTTableId').setValue(toOTTableId);

    const toSelectAnestheticsDr = this.Anesthestishdoclist1.find(c => c.DoctorId == this.registerObj1.AnestheticsDr);
    this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').setValue(toSelectAnestheticsDr);

    const toSelectAnestheticsDr1 = this.Anesthestishdoclist2.find(c => c.Anesthestishdoclist2 == this.registerObj1.AnestheticsDr1);
    this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').setValue(toSelectAnestheticsDr1);

    this.personalFormGroup.updateValueAndValidity();


  }

  // surgury dropdown
  getSurgeryList() {
    
    this._OtManagementService.getSurgeryCombo().subscribe(data => {
      this.SurgeryList = data;
      this.optionsSurgery = this.SurgeryList.slice();
      this.filteredOptionsSurgery = this._OtManagementService.otreservationFormGroup.get('SurgeryId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this.Surgery(value) : this.SurgeryList.slice()),
      );
      if (this.data) {
        
        const DValue = this.SurgeryList.filter(item => item.SurgeryName == this.registerObj1.Surgeryname);
        console.log("SurgeryId:", DValue)
        this._OtManagementService.otreservationFormGroup.get('SurgeryId').setValue(DValue[0]);
        this._OtManagementService.otreservationFormGroup.updateValueAndValidity();
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
  // end dropdown

  // doctorone filter code  
  private filterDoctortwo() {

    if (!this.Doctor2List) {
      return;
    }
    // get the search keyword
    let search = this.doctortwoFilterCtrl.value;
    if (!search) {
      this.filteredDoctortwo.next(this.Doctor2List.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDoctortwo.next(
      this.Doctor2List.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );
  }

  ngOnDestroys() {
    // this.isAlive = false;
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj ==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  // OtTable start 
  getOttableList() {
    
    this._OtManagementService.getOTtableCombo().subscribe(data => {
      this.OTtableList = data;
      this.optionsOtTable = this.OTtableList.slice();
      this.filteredOtTable = this._OtManagementService.otreservationFormGroup.get('OTTableId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterOTtable(value) : this.OTtableList.slice()),
      );
      if (this.data) {
        
        const DValue = this.OTtableList.filter(item => item.OTTableName == this.registerObj1.OTTableName);
        console.log("OTTableId:", DValue)
        this._OtManagementService.otreservationFormGroup.get('OTTableId').setValue(DValue[0]);
        this._OtManagementService.otreservationFormGroup.updateValueAndValidity();
        return;
      }
    });
  }
  private _filterOTtable(value: any): string[] {
    if (value) {
      const filterValue = value && value.OTTableName ? value.OTTableName.toLowerCase() : value.toLowerCase();
      return this.optionsOtTable.filter(option => option.OTTableName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextOTtable(option) {
    return option && option.OTTableName ? option.OTTableName : '';
  }
  // OtTable end

  // AnestheticsDr 1 start 
  getAnesthestishDoctorList1() {
    
    this._OtManagementService.getAnesthestishDoctorCombo().subscribe(data => {
      this.Anesthestishdoclist1 = data;
      this.optionsAnesthDoctor1 = this.Anesthestishdoclist1.slice();
      this.filteredAnesthDoctor1 = this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterAnesthDoctor1(value) : this.Anesthestishdoclist1.slice()),
      );
      if (this.data) {
        
        const DValue = this.Anesthestishdoclist1.filter(item => item.DoctorId == this.registerObj1.AnestheticsDr);
        console.log("AnestheticsDr:", DValue)
        this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').setValue(DValue[0]);
        this._OtManagementService.otreservationFormGroup.updateValueAndValidity();
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
  // AnestheticsDr 1 end

  // AnestheticsDr 2 start 
  getAnesthestishDoctorList2() {
    
    this._OtManagementService.getAnesthestishDoctorCombo().subscribe(data => {
      this.Anesthestishdoclist2 = data;
      this.optionsAnesthDoctor2 = this.Anesthestishdoclist2.slice();
      this.filteredAnesthDoctor2 = this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterAnesthDoctor2(value) : this.Anesthestishdoclist2.slice()),
      );
      if (this.data) {
        
        const DValue = this.Anesthestishdoclist2.filter(item => item.DoctorId == this.registerObj1.AnestheticsDr1);
        console.log("AnestheticsDr1:", DValue)
        this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').setValue(DValue[0]);
        this._OtManagementService.otreservationFormGroup.updateValueAndValidity();
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
  // AnestheticsDr 2 end

  // surgeon doctor 1 start 
  getDoctorList() {
    
    this._OtManagementService.getDoctorMaster().subscribe(data => {
      this.DoctorList1 = data;
      this.optionsSurgeon1 = this.DoctorList1.slice();
      this.filteredOptionsSurgeon1 = this._OtManagementService.otreservationFormGroup.get('DoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDoctor(value) : this.DoctorList1.slice()),
      );
      if (this.data) {
        
        const DValue = this.DoctorList1.filter(item => item.DoctorId == this.registerObj1.SurgeonId);
        console.log("DoctorId:", DValue)
        this._OtManagementService.otreservationFormGroup.get('DoctorId').setValue(DValue[0]);
        this._OtManagementService.otreservationFormGroup.updateValueAndValidity();
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
  // surgeon doctor end

  // surgeon doctor 2 start 
  getDoctorList1() {
    
    this._OtManagementService.getDoctorMaster1Combo().subscribe(data => {
      this.DoctorList2 = data;
      this.optionsSurgeon2 = this.DoctorList2.slice();
      this.filteredOptionsSurgeon2 = this._OtManagementService.otreservationFormGroup.get('DoctorId1').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDoctor2(value) : this.DoctorList2.slice()),
      );
      if (this.data) {
        
        const DValue = this.DoctorList2.filter(item => item.DoctorId == this.registerObj1.SurgeonId);
        console.log("DoctorId2:", DValue)
        this._OtManagementService.otreservationFormGroup.get('DoctorId1').setValue(DValue[0]);
        this._OtManagementService.otreservationFormGroup.updateValueAndValidity();
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
  // surgeon doctor end

  getDoctor2List() {
    this._OtManagementService.getDoctorMaster2Combo().subscribe(data => {
      this.Doctor2List = data;
      this.filteredDoctortwo.next(this.Doctor2List.slice())
    })
  }

  getOTRequest() {
    const dialogRef = this._matDialog.open(GetOTRequetComponent,
      {
        maxWidth: '70%',
        height: '70%',
        width: '100%',
      });
    dialogRef.afterClosed().subscribe(result => {
      debugger
      console.log('The dialog was closed - Insert Action', result);
      this.vSelectedOption = this.OP_IPType === 1 ? 'IP' : 'OP';
      if (result.OP_IP_Type === 1) {
        // Fetch IP-specific information
        console.log("IIIIIIIIIIIIIPPPPPPPPP:",result);
        this.vWardName = result.RoomName;
        this.vBedNo = result.BedName;
        this.vGenderName = result.GenderName;
        this.vPatientName = result.PatientName;
        this.vAgeYear = result.AgeYear;
        this.RegId = result.RegID;
        this.vAdmissionID = result.AdmissionID
        this.vAge = result.AgeYear;
        this.vRegNo = result.RegNo;
        this.vIPDNo = result.OPDNo;
        this.vCompanyName = result.CompanyName;
        this.vTariffName = result.TariffName;
        this.vOP_IP_MobileNo = result.MobileNo;
        this.vDoctorName = result.DoctorName;
        this.vDepartmentName = result.DepartmentName;
        this.vSelectedOption = 'IP';
        this.vSiteDescId = result.SiteDescId;
        this.vSurgeryId = result.Surgeryname;
        this.vOPIP_ID=result.OP_IP_Id;
        this.selectedDoctor1=result.SurgeonId;
        this.selectedDoctor2=result.SurgeonId1;
        this.selectedAnestheticsDr=result.AnestheticsDr;        
        this.selectedAnestheticsDr2=result.AnestheticsDr1;
        this.vAnesthType=result.AnesthType;
        this.vOtRequestId=result.OTRequestId;

        this.setDropdownObjs1();
        this.getDoctorList1();
        this.getOttableList();
        this.getDoctor2List();
        this.getAnesthestishDoctorList1();
        this.getAnesthestishDoctorList2();

      } else if (result.OP_IP_Type === 0) {
        // Fetch OP-specific information
        console.log("OOOOOOOPPPPPPPPP:", result);
        this.vWardName = result.RoomName;
        this.vBedNo = result.BedName;
        this.vGenderName = result.GenderName;
        this.vPatientName = result.PatientName;
        this.vAgeYear = result.AgeYear;
        this.RegId = result.RegID;
        this.vAdmissionID = result.AdmissionID
        this.vAge = result.AgeYear;
        this.vRegNo = result.RegNo;
        this.vOPDNo = result.OPDNo;
        this.vCompanyName = result.CompanyName;
        this.vTariffName = result.TariffName;
        this.vOP_IP_MobileNo = result.MobileNo;
        this.vDoctorName = result.DoctorName;
        this.vDepartmentName = result.DepartmentName;
        this.vSelectedOption = 'OP';
        this.vSiteDescId = result.SiteDescId
        this.vSurgeryId = result.Surgeryname;
        this.vOPIP_ID=result.OP_IP_Id;
        this.selectedDoctor1=result.SurgeonId;
        this.selectedDoctor2=result.SurgeonId1;
        this.selectedAnestheticsDr=result.AnestheticsDr;        
        this.selectedAnestheticsDr2=result.AnestheticsDr1;
        this.vAnesthType=result.AnesthType;
        this.vOtRequestId=result.OTRequestId;

        this.setDropdownObjs1();
        this.getDoctorList1();
        this.getOttableList();
        this.getDoctor2List();
        this.getAnesthestishDoctorList1();
        this.getAnesthestishDoctorList2();
      }

      this.getSurgeryList();
      this.getDoctorList();

      if (result) {
        // Filter and set SurgeryId
        const surgeryValue = this.SurgeryList.find(item => item.SurgeryId == result.SurgeryId);
        if (surgeryValue) {
          console.log("SurgeryId:", surgeryValue);
          this._OtManagementService.otreservationFormGroup.get('SurgeryId').setValue(surgeryValue);
          this._OtManagementService.otreservationFormGroup.updateValueAndValidity();
        }
        // Filter and set DoctorId
        const doctorValue = this.DoctorList1.find(item => item.DoctorId == result.SurgeonId);
        if (doctorValue) {
          console.log("DoctorId:", doctorValue);
          this._OtManagementService.otreservationFormGroup.get('DoctorId').setValue(doctorValue);
          this._OtManagementService.otreservationFormGroup.updateValueAndValidity();
        }
      }

    });
  }

  searchPatientList() {
    // const dialogRef = this._matDialog.open(IPPatientsearchComponent,
    //   {
    //     maxWidth: "90%",
    //     height: "530px !important ", width: '100%',
    //   });

    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log('The dialog was closed - Insert Action', result);
    //   if (result) {
    //     console.log(result);
    //     this.registerObj = result as OPIPPatientModel;
    //     if (result) {
    //       this.PatientName = this.registerObj.PatientName;
    //       this.OPIP = this.registerObj.IP_OP_Number;
    //       this.AgeYear = this.registerObj.AgeYear;
    //       this.classname = this.registerObj.ClassName;
    //       this.tariffname = this.registerObj.TariffName;
    //       this.ipno = this.registerObj.IPNumber;
    //       this.Bedname = this.registerObj.Bedname;
    //       this.wardname = this.registerObj.WardId;
    //       this.Adm_Vit_ID = this.registerObj.Adm_Vit_ID;
    //     }
    //   }
    //   // console.log(this.registerObj);
    // });
  }

  onClose() {
    this._OtManagementService.otreservationFormGroup.reset({
      start: new Date(),
      end: new Date(),
    });
    this.dialogRef.close();
  }

    onSave() {
      if (this.vSurgeryId == '' || this.vSurgeryId == null || this.vSurgeryId == undefined) {
        this.toastr.warning('Please select Surgery ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if (this._OtManagementService.otreservationFormGroup.get('SurgeryId').value) {
        if (!this.SurgeryList.find(item => item.SurgeryName == this._OtManagementService.otreservationFormGroup.get('SurgeryId').value.SurgeryName)) {
          this.toastr.warning('Please select Valid Surgery Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      }

      if (this.selectedDoctor1 == '' || this.selectedDoctor1 == null || this.selectedDoctor1 == undefined) {
        this.toastr.warning('Please select Surgeon 1 ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if (this._OtManagementService.otreservationFormGroup.get('DoctorId').value) {
        if (!this.DoctorList1.find(item => item.Doctorname == this._OtManagementService.otreservationFormGroup.get('DoctorId').value.Doctorname)) {
          this.toastr.warning('Please select Valid Surgeon Name 1', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      }

      if (this.selectedDoctor2 == '' || this.selectedDoctor2 == null || this.selectedDoctor2 == undefined) {
        this.toastr.warning('Please select Surgeon 2 ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if (this._OtManagementService.otreservationFormGroup.get('DoctorId1').value) {
        if (!this.DoctorList2.find(item => item.DoctorName == this._OtManagementService.otreservationFormGroup.get('DoctorId1').value.DoctorName)) {
          this.toastr.warning('Please select Valid Surgeon Name 2', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      }
  
      if (this.selectedAnestheticsDr == '' || this.selectedAnestheticsDr == null || this.selectedAnestheticsDr == undefined) {
        this.toastr.warning('Please select AnestheticsDr 1 ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if (this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').value) {
        if (!this.Anesthestishdoclist1.find(item => item.DoctorName == this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').value.DoctorName)) {
          this.toastr.warning('Please select Valid AnestheticsDr Name 1', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      }

      if (this.selectedAnestheticsDr2 == '' || this.selectedAnestheticsDr2 == null || this.selectedAnestheticsDr2 == undefined) {
        this.toastr.warning('Please select AnestheticsDr 2 ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if (this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').value) {
        if (!this.Anesthestishdoclist2.find(item => item.DoctorName == this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').value.DoctorName)) {
          this.toastr.warning('Please select Valid AnestheticsDr Name 2', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      } 

      if (this.selectedOtTable == '' || this.selectedOtTable == null || this.selectedOtTable == undefined) {
        this.toastr.warning('Please select OtTable ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if (this._OtManagementService.otreservationFormGroup.get('OTTableId').value) {
        if (!this.OTtableList.find(item => item.OTTableName == this._OtManagementService.otreservationFormGroup.get('OTTableId').value.OTTableName)) {
          this.toastr.warning('Please select Valid OtTable Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      } 

      if (this.vAnesthType == '' || this.vAnesthType == null || this.vAnesthType == undefined) {
        this.toastr.warning('Please enter Anesthetics Type  ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
        
      Swal.fire({
        title: 'Do you want to Save the OtReservation Recode ',
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
    debugger;
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    let opip_Type;
    if (this._OtManagementService.otreservationFormGroup.get('PatientType').value == 'IP') {
      opip_Type = 1;
    }
    else {
      opip_Type = 0;
    }

    let otBookingID = this.registerObj1.OTBookingID;

    this.isLoading = 'submit';

    if (!otBookingID) {
      var m_data = {
        "saveOTBookingParam": {
          "otBookingID": 0,
          "tranDate": formattedDate,
          "tranTime": formattedTime,
          "oP_IP_ID": this.vOPIP_ID || 0,
          "oP_IP_Type": opip_Type,
          "opDate": this.dateTimeObj.date,// this.datePipe.transform(this._OtManagementService.otreservationFormGroup.get("OPDate").value,"yyyy-MM-dd 00:00:00.000"),
          "opTime": this.dateTimeObj.time,// this.datePipe.transform(this._OtManagementService.otreservationFormGroup.get("OPDate").value,"yyyy-MM-dd 00:00:00.000"),
          "duration": this._OtManagementService.otreservationFormGroup.get('Duration').value || 0,
          "otTableID": this._OtManagementService.otreservationFormGroup.get('OTTableId').value.OTTableId || 0,
          "surgeonId": this._OtManagementService.otreservationFormGroup.get('DoctorId').value.DoctorId || 0,
          "surgeonId1": this._OtManagementService.otreservationFormGroup.get('DoctorId1').value.DoctorId || 0,
          "anestheticsDr": this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').value.DoctorId || 0,
          "anestheticsDr1": this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').value.DoctorId || 0,
          "surgeryname": this._OtManagementService.otreservationFormGroup.get('SurgeryId').value.SurgeryName || '',// ? this.personalFormGroup.get('SurgeryId').value.SurgeryId : 0,
          "procedureId": 0,
          "anesthType": this._OtManagementService.otreservationFormGroup.get('AnesthType').value || '',
          "unBooking": false,
          "instruction": this._OtManagementService.otreservationFormGroup.get('Instruction').value || '',
          "otTypeID": 0,
          "otRequestId":this.vOtRequestId,
          "createdBy":Number(this._loggedService.currentUserValue.user.id)
        }
      }
      console.log("insertJson:",m_data);
      this._OtManagementService.ReservationInsert(m_data).subscribe(response => {
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
      
      var m_data1 = {
        "updateOTBookingParam": {
          "OTBookingID": otBookingID,
          "tranDate": formattedDate, //this.datePipe.transform(this.dateTimeObj.date,"yyyy-Mm-dd") || opdRegistrationSave"2021-03-31",// this.dateTimeObj.date,//
          "tranTime": formattedTime, // this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",
          "oP_IP_ID": this.vOPIP_ID || 0,
          "oP_IP_Type": opip_Type,
          "opDate": this.dateTimeObj.date,// this.datePipe.transform(this._OtManagementService.otreservationFormGroup.get("OPDate").value,"yyyy-MM-dd 00:00:00.000"),
          "opTime": this.dateTimeObj.time,// this.datePipe.transform(this._OtManagementService.otreservationFormGroup.get("OPDate").value,"yyyy-MM-dd 00:00:00.000"),
          "duration": this._OtManagementService.otreservationFormGroup.get('Duration').value || 0,
          "otTableID": this._OtManagementService.otreservationFormGroup.get('OTTableId').value.OTTableId || 0,
          "surgeonId": this._OtManagementService.otreservationFormGroup.get('DoctorId').value.DoctorId || 0,
          "surgeonId1": this._OtManagementService.otreservationFormGroup.get('DoctorId1').value.DoctorId || 0,
          "anestheticsDr": this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').value.DoctorId || 0,
          "anestheticsDr1": this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').value.DoctorId || 0,
          "surgeryname": this._OtManagementService.otreservationFormGroup.get('SurgeryId').value.SurgeryName || '',// ? this.personalFormGroup.get('SurgeryId').value.SurgeryId : 0,
          "procedureId": 0,
          "anesthType": this._OtManagementService.otreservationFormGroup.get('AnesthType').value || '',
          "unBooking": false,
          "instruction": this._OtManagementService.otreservationFormGroup.get('Instruction').value || '',
          "otTypeID": 0,
          "otRequestId":this.vOtRequestId,
          "modifiedBy": Number(this._loggedService.currentUserValue.user.id)
        }
      }
      console.log("updateJson:",m_data1);
      this._OtManagementService.ReservationUpdate(m_data1).subscribe(response => {
        if (response) {
          this.toastr.success('Record Update Successfully.', 'Update !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not Update !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
  }


}

