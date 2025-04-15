import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OPIPPatientModel } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { OTManagementServiceService } from '../../ot-management-service.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Requestlist } from '../ot-request.component';
import { fuseAnimations } from '@fuse/animations';
import { MatSelect } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewRequestComponent implements OnInit {
  isAlive = false;
  savedValue: number = null;
  isLoadings = false;
  isOpen = false;
  loadID = 0;
  submitted = false;
  now = Date.now();
  isRegSearchDisabled: boolean = true;
  newRegSelected: any = 'registration';
  selectedAdvanceObj: OPIPPatientModel;
  msg: any = [];
  DoctorList: any = [];
  Doctor1List: any = [];
  Doctor2List: any = [];
  SurgeryList: any = [];
  OTtableList: any = [];
  CategoryList: any = [];
  // CategoryList : any = [];
  Sitelist: any = [];
  Today: any;
  registerObj = new OPIPPatientModel({});
  isLoading: string = '';
  Prefix: any;
  registerObj1 = new Requestlist({});

  IsPathRad: any;
  PatientName: any = '';
  OPIP: any = '';
  Bedname: any = '';
  wardname: any = '';
  classname: any = '';
  tariffname: any = '';
  AgeYear: any = '';
  ipno: any = '';
  patienttype: any = '';
  Adm_Vit_ID: any = 0;
  DepartmentList: any = [];
  options = [];
  filteredOptions: any;
  noOptionFound: boolean = false;
  RegId: any;
  vAdmissionID: any;
  PatientListfilteredOptionsIP: any;
  PatientListfilteredOptionsOP: any;
  isRegIdSelected: boolean = false;
  vWardName: any;
  vBedNo: any;
  vPatientName: any;
  vGenderName: any;
  vAgeYear: any;
  vAge: any;
  vRegNo: any;
  vOPDNo: any;
  vCompanyName: any;
  vTariffName: any;
  vOP_IP_MobileNo: any;
  vDoctorName: any;
  GendercmbList: any = [];
  optionsGender: any[] = [];
  vSelectedOption: any = 'OP';
  vSelectedSurgeryType:any="0";
  selectedType: any = '';
  vOtReqOPD: any;
  vOtReqIPD: any;
  vDepartmentName: any;
  vIPDNo: any;
  vSiteDescId: any;
  vSurgeryCategoryId: any;
  vSurgeryId: any;
  vOPIP_ID: any;
  selectedDepartment: string = '';
  selectedDoctor: string = '';
  // vOP_IP_Type:any;
  vConditionOP: boolean = false;
  vConditionIP: boolean = false;
  OP_IP_Id: any = 0;
  OP_IPType: any = 2;
  isSystemSelected: boolean = false;
  iscategorySelected: boolean = false;
  isSiteSelected: boolean = false;

  filteredOptionautoDepartment: Observable<string[]>;
  filteredOptionsSurgeryCategory: Observable<string[]>;
  filteredOptionsSurgeon: Observable<string[]>;
  filteredOptionsSurgeon2: Observable<string[]>;
  filteredOptionsSite: Observable<string[]>;
  filteredOptionsSurgery: Observable<string[]>;
  filteredOptionsRegSearch: Observable<string[]>;
  filteredOptionsGender: Observable<string[]>;


  optionsDepartment: any[] = [];
  optionsSurgeryCategory: any[] = [];
  optionsSurgeon: any[] = [];
  optionsSurgeon2: any[] = [];
  optionsSite: any[] = [];
  optionsSurgery: any[] = [];
  // optionsSurgery: any[] = [];


  isSurgerySelected: boolean = false;
  isDepartmentSelected: boolean = false;


  // @Input() panelWidth: string | number;
  // @ViewChild('multiUserSearch') multiUserSearchInput: ElementRef;


  screenFromString = 'otBooking-form';
  selectedPrefixId: any;

  // @Input() childName: string[];
  // @Output() parentFunction: EventEmitter<any> = new EventEmitter();
  matDialogRef: any;


  private _onDestroy = new Subject<void>();

  constructor(
    public _OtManagementService: OTManagementServiceService,
    private formBuilder: FormBuilder,
    private _loggedService: AuthenticationService,
    // public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewRequestComponent>,
    public datePipe: DatePipe,
        public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    private router: Router) { }


  ngOnInit(): void {

    this.vSelectedOption = this.OP_IPType === 1 ? 'IP' : 'OP';
    if (this.data) {
debugger
      this.registerObj1 = this.data.Obj;

      // ip and op edit
      if (this.registerObj1.OP_IP_Type === 1) {
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
        this.vSelectedSurgeryType= this.registerObj1.SurgeryType.trim();
        this.vSiteDescId = this.registerObj1.SiteDescId
        this.vSurgeryCategoryId = this.registerObj1.SurgeryCategoryId;
        this.vSurgeryId = this.registerObj1.SurgeryId;

        this.selectedDepartment = this.registerObj1.DepartmentName;
        this.selectedDoctor=this.registerObj1.DoctorName;
        this.vOPIP_ID=this.registerObj1.OP_IP_Id;

        this.getSurgeryList(); //SurgeryName (procedure)
        this.getDoctorList(); //SurgeonName
        this.getCategoryList(); //SurgeryCategoryName
        // this.getSiteList(); //sitName
        this.getDepartmentList(); //departmentName

      } else if (this.registerObj1.OP_IP_Type === 0) {
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
        this.vSelectedSurgeryType= this.registerObj1.SurgeryType.trim();
        this.vSiteDescId = this.registerObj1.SiteDescId
        this.vSurgeryCategoryId = this.registerObj1.SurgeryCategoryId;
        this.vSurgeryId = this.registerObj1.SurgeryId;

        this.selectedDepartment = this.registerObj1.DepartmentName;
        this.selectedDoctor=this.registerObj1.DoctorName;
        this.vOPIP_ID=this.registerObj1.OP_IP_Id;

        this.getSurgeryList(); //SurgeryName (procedure)
        this.getDoctorList(); //SurgeonName
        this.getCategoryList(); //SurgeryCategoryName
        this.getDepartmentList(); //departmentName
      }
      this.setDropdownObjs1();
    }

    this.getSurgeryList(); //SurgeryName (procedure)
    this.getDoctorList(); //SurgeonName
    this.getCategoryList(); //SurgeryCategoryName
    this.getDepartmentList(); //departmentName

    if (this.advanceDataStored.storage) {
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
    // console.log(this.selectedAdvanceObj);
    this.Today = new Date().toDateString;
    console.log(this.Today);


    setTimeout(function () {

      let element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
      element.click();

    }, 1000);

    this.vOtReqOPD = this._loggedService.currentUserValue.user.pharOPOpt;
    this.vOtReqIPD = this._loggedService.currentUserValue.user.pharIPOpt;

    if (this.vOtReqIPD == true) {
      if (this.vOtReqOPD == false) {
        this.vSelectedOption = 'IP';
        this._OtManagementService.otRequestForm.get('MobileNo').clearValidators();
        this._OtManagementService.otRequestForm.get('PatientName').clearValidators();
        this._OtManagementService.otRequestForm.get('MobileNo').updateValueAndValidity();
        this._OtManagementService.otRequestForm.get('PatientName').updateValueAndValidity();
      }
    } else {
      this.vConditionIP = true
    }
    if (this.vOtReqOPD == true) {
      if (this.vOtReqIPD == false) {
        this.vSelectedOption = 'OP';
        this._OtManagementService.otRequestForm.get('MobileNo').clearValidators();
        this._OtManagementService.otRequestForm.get('PatientName').clearValidators();
        this._OtManagementService.otRequestForm.get('MobileNo').updateValueAndValidity();
        this._OtManagementService.otRequestForm.get('PatientName').updateValueAndValidity();
      }
    } else {
      this.vConditionOP = true
    }

  }

  onChangePatientType(event) {

    this._OtManagementService.otRequestForm.get('RegID').reset();
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
    this.OP_IP_Id = '';
    this.vIPDNo = '';
  }

  closeDialog() {
    console.log("closed")
    this.dialogRef.close();
    // this.personalFormGroup.reset();
  }

  getSearchList() {
    var m_data = {
      "Keyword": `${this._OtManagementService.otRequestForm.get('RegID').value}%`
    }
    if (this._OtManagementService.otRequestForm.get('PatientType').value == 'OP') {

      if (this._OtManagementService.otRequestForm.get('RegID').value.length >= 1) {
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
    } else if (this._OtManagementService.otRequestForm.get('PatientType').value == 'IP') {

      if (this._OtManagementService.otRequestForm.get('RegID').value.length >= 1) {
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

    this.getSurgeryList(); //SurgeryName (procedure)
    this.getDoctorList(); //SurgeonName
    this.getCategoryList(); //SurgeryCategoryName
    // this.getSiteList(); //sitName
    this.getDepartmentList(); //departmentName
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
    this.getSurgeryList();
    this.getDoctorList();
    this.getCategoryList();
    // this.getSiteList();
    this.getDepartmentList();
  }


  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.PatientName + ' (' + option.RegID + ')';
  }

  // openChanged(event) {
  //   this.isOpen = event;
  //   this.isLoading = event;
  //   if (event) {
  //     this.savedValue = this.departmentFilterCtrl.value;
  //     this.options = [];
  //     this.departmentFilterCtrl.reset();
  //     this._OtManagementService.getDepartmentCombo();
  //   }
  // }


  setDropdownObjs1() {


    this._OtManagementService.populateFormpersonal(this.registerObj1);

    const toSurgeonId1 = this.DoctorList.find(c => c.DoctorId == this.registerObj1.SurgeonId);
    this._OtManagementService.otRequestForm.get('SurgeonId').setValue(toSurgeonId1);

    const toDepartment = this.DepartmentList.find(c => c.DepartmentId == this.registerObj1.DepartmentId);
    this._OtManagementService.otRequestForm.get('DepartmentId').setValue(toDepartment);

    const toCategory = this.CategoryList.find(c => c.SurgeryCategoryId == this.registerObj1.CategoryId);
    this._OtManagementService.otRequestForm.get('SurgeryCategoryId').setValue(toCategory);

    const toSurgery = this.SurgeryList.find(c => c.SurgeryId == this.registerObj1.SurgeryId);
    this._OtManagementService.otRequestForm.get('SurgeryId').setValue(toSurgery);



    this._OtManagementService.otRequestForm.updateValueAndValidity();


  }
  ngOnDestroys() {
    // this.isAlive = false;
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj ==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  onSave() {
    if (this.RegId == '' || this.RegId == null || this.RegId == undefined) {
      this.toastr.warning('Please select patient Name ', 'Warning !', {
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
    if (this._OtManagementService.otRequestForm.get('DepartmentId').value) {
      if (!this.DepartmentList.find(item => item.DepartmentName == this._OtManagementService.otRequestForm.get('DepartmentId').value.DepartmentName)) {
        this.toastr.warning('Please select Valid Department Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.vSurgeryCategoryId == '' || this.vSurgeryCategoryId == null || this.vSurgeryCategoryId == undefined) {
      this.toastr.warning('Please select SurgeryCategory ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._OtManagementService.otRequestForm.get('SurgeryCategoryId').value) {
      if (!this.CategoryList.find(item => item.SurgeryCategoryName == this._OtManagementService.otRequestForm.get('SurgeryCategoryId').value.SurgeryCategoryName)) {
        this.toastr.warning('Please select Valid SurgeryCategory Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    if (this.vSiteDescId == '' || this.vSiteDescId == null || this.vSiteDescId == undefined) {
      this.toastr.warning('Please select SiteDescription ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._OtManagementService.otRequestForm.get('SiteDescId').value) {
      if (!this.Sitelist.find(item => item.SiteDescriptionName == this._OtManagementService.otRequestForm.get('SiteDescId').value.SiteDescriptionName)) {
        this.toastr.warning('Please select Valid SiteDescription Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    if (this.vSurgeryId == '' || this.vSurgeryId == null || this.vSurgeryId == undefined) {
      this.toastr.warning('Please select Surgery ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._OtManagementService.otRequestForm.get('SurgeryId').value) {
      if (!this.SurgeryList.find(item => item.SurgeryName == this._OtManagementService.otRequestForm.get('SurgeryId').value.SurgeryName)) {
        this.toastr.warning('Please select Valid Surgery Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    if (this.selectedDoctor == '' || this.selectedDoctor == null || this.selectedDoctor == undefined) {
      this.toastr.warning('Please select SurgeonDoctor ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._OtManagementService.otRequestForm.get('DoctorId').value) {
      if (!this.DoctorList.find(item => item.Doctorname == this._OtManagementService.otRequestForm.get('DoctorId').value.Doctorname)) {
        this.toastr.warning('Please select Valid SurgeonDoctor Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    Swal.fire({
      title: 'Do you want to Save the OtBooking Recode ',
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
    if (this._OtManagementService.otRequestForm.get('PatientType').value == 'IP') {
      opip_Type = 1;
    }
    else {
      opip_Type = 0;
    }

 
  let OTRequestId = this.registerObj1.OTRequestId;

  this.isLoading = 'submit';

  // if (this.Adm_Vit_ID)
  if (!OTRequestId) {
    var m_data = {
      "saveOTBookingRequestParam": {
        "otRequestId": 0,
        "otRequestDate": formattedDate,
        "otRequestTime": formattedTime,
        "oP_IP_Id": this.vOPIP_ID || 0,
        "oP_IP_Type": opip_Type,
        "surgeryType": this._OtManagementService.otRequestForm.get('SurgeryType').value, //Boolean(JSON.parse(this._OtManagementService.otRequestForm.get('SurgeryType').value) || 0),
        "departmentId": this._OtManagementService.otRequestForm.get('DepartmentId').value.DepartmentId || 0,
        "categoryId": this._OtManagementService.otRequestForm.get('SurgeryCategoryId').value.SurgeryCategoryId || 0,
        "siteDescId": this._OtManagementService.otRequestForm.get('SiteDescId').value.SiteDescId || 0,
        "surgeonId": this._OtManagementService.otRequestForm.get('DoctorId').value.DoctorId || 0,
        "surgeryId": this._OtManagementService.otRequestForm.get('SurgeryId').value.SurgeryId || 0,
        "createdBy": Number(this._loggedService.currentUserValue.user.id)
      }
    }
    console.log("insertJson:",m_data);
    this._OtManagementService.otBookingRequestInsert(m_data).subscribe(response => {
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
      "updateOTBookingRequestParam": {
       "otRequestId": OTRequestId,
        "otRequestDate": formattedDate,
        "otRequestTime": formattedTime,
        "oP_IP_Id": this.vOPIP_ID,
        "oP_IP_Type": opip_Type,
        "surgeryType": this._OtManagementService.otRequestForm.get('SurgeryType').value || 0,
        "departmentId": this._OtManagementService.otRequestForm.get('DepartmentId').value.DepartmentId || 0,
        "categoryId": this._OtManagementService.otRequestForm.get('SurgeryCategoryId').value.SurgeryCategoryId || 0,
        "siteDescId": this._OtManagementService.otRequestForm.get('SiteDescId').value.SiteDescId || 0,
        "surgeonId": this._OtManagementService.otRequestForm.get('DoctorId').value.DoctorId || 0,
        "surgeryId": this._OtManagementService.otRequestForm.get('SurgeryId').value.SurgeryId || 0,
        "modifiedBy":Number(this._loggedService.currentUserValue.user.id)
      }
    }
    console.log("updateJson:",m_data1);
    this._OtManagementService.otBookingRequestUpdate(m_data1).subscribe(response => {
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

  // System start 

  onCategorySelect(event: MatAutocompleteSelectedEvent) {
    const selectedSurgeryCategory = event.option.value;
    if (selectedSurgeryCategory) {
      this.onChangeSiteList(selectedSurgeryCategory);
    }
  }
  
  getCategoryList() {
    
    const CategoryControl = this._OtManagementService.otRequestForm.get('SurgeryCategoryId');
    CategoryControl.setValue('');
    const SiteDescControl = this._OtManagementService.otRequestForm.get('SiteDescId');
    SiteDescControl.setValue('');
    this.Sitelist = [];
    this.filteredOptionsSite = null;

    this._OtManagementService.getCategoryCombo().subscribe(data => {
      this.CategoryList = data;
      this.optionsSurgeryCategory = this.CategoryList.slice();
      this.filteredOptionsSurgeryCategory = this._OtManagementService.otRequestForm.get('SurgeryCategoryId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSurgeryCategory(value) : this.CategoryList.slice()),
      );
      if (this.data) {

        const DValue = this.CategoryList.filter(item => item.SurgeryCategoryId == this.registerObj1.CategoryId);
        console.log("SurgeryCategoryId:", DValue)
        this._OtManagementService.otRequestForm.get('SurgeryCategoryId').setValue(DValue[0]);
        this._OtManagementService.otRequestForm.updateValueAndValidity();
        this.onChangeSiteList(DValue[0]);
        return;
      }
    });

  }
  private _filterSurgeryCategory(value: any): string[] {
    if (value) {
      const filterValue = value && value.SurgeryCategoryName ? value.SurgeryCategoryName.toLowerCase() : value.toLowerCase();
      return this.optionsSurgeryCategory.filter(option => option.SurgeryCategoryName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextautoSurgeryCategory(option) {
    return option && option.SurgeryCategoryName ? option.SurgeryCategoryName : '';
  }
  // System end

   // site star

   onSiteSelect(option: any){
    
    console.log("selectedSiteOption:", option)
  }  
   private _filterSite(value: any): string[] {
    if (value) {
      const filterValue = value && value.SiteDescriptionName ? value.SiteDescriptionName.toLowerCase() : value.toLowerCase();
      this.isSiteSelected = false;
      return this.optionsSite.filter(option => option.SiteDescriptionName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextautoSiteDesc(option) {
    return option && option.SiteDescriptionName ? option.SiteDescriptionName : '';
  }
  onChangeSiteList(systemObj) {
    
    console.log(systemObj)
    const SiteDescControl= this._OtManagementService.otRequestForm.get('SiteDescId');
    SiteDescControl.setValue('');
    this.Sitelist = [];
    this.filteredOptionsSite = null;
    this.iscategorySelected = true;

    var vdata = {
      "Id": systemObj.SurgeryCategoryId
    }
    this.iscategorySelected = true;

    this._OtManagementService.getSiteCombo(vdata).subscribe(
      data => {
        this.Sitelist = data;
        console.log(this.Sitelist)
        this.optionsSite = this.Sitelist.slice();
        this.filteredOptionsSite = this._OtManagementService.otRequestForm.get('SiteDescId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterSite(value) : this.Sitelist.slice()),
        );
        if (this.registerObj1) {
          
          const SValue = this.Sitelist.filter(item => item.SiteDescId == this.registerObj1.SiteDescId);
          console.log("SiteDescId:", SValue)
          this._OtManagementService.otRequestForm.get('SiteDescId').setValue(SValue[0]);
          this._OtManagementService.otRequestForm.updateValueAndValidity();
          return;
        }
        console.log("Site ndfkdf:", this._OtManagementService.otRequestForm.get('SiteDescId').value)
      })

  }
  // site end

  // Procedure start
  getSurgeryList() {

    this._OtManagementService.getSurgeryCombo().subscribe(data => {
      this.SurgeryList = data;
      this.optionsSurgery = this.SurgeryList.slice();
      this.filteredOptionsSurgery = this._OtManagementService.otRequestForm.get('SurgeryId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this.Surgery(value) : this.SurgeryList.slice()),
      );
      if (this.data) {

        const DValue = this.SurgeryList.filter(item => item.SurgeryId == this.registerObj1.SurgeryId);
        console.log("SurgeryId:", DValue)
        this._OtManagementService.otRequestForm.get('SurgeryId').setValue(DValue[0]);
        this._OtManagementService.otRequestForm.updateValueAndValidity();
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
  // Procedure end

 

  // doctor start
  getDoctorList() {
    
    this._OtManagementService.getDoctorMaster().subscribe(data => {
      this.DoctorList = data;
      this.optionsSurgeon = this.DoctorList.slice();
      this.filteredOptionsSurgeon = this._OtManagementService.otRequestForm.get('DoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDoctor(value) : this.DoctorList.slice()),
      );
      if (this.data) {
        
        const DValue = this.DoctorList.filter(item => item.DoctorId == this.registerObj1.SurgeonId);
        console.log("DoctorId:", DValue)
        this._OtManagementService.otRequestForm.get('DoctorId').setValue(DValue[0]);
        this._OtManagementService.otRequestForm.updateValueAndValidity();

        return;
      }

    });

  }
  private _filterDoctor(value: any): string[] {
    
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.optionsSurgeon.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }
  }

  getOptionTextSurgeonId1(option) {
    
    return option && option.Doctorname ? option.Doctorname : '';
  }

  // doctor end

  // deparment start
  getDepartmentList() {

    this._OtManagementService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.optionsDepartment = this.DepartmentList.slice();
      this.filteredOptionautoDepartment = this._OtManagementService.otRequestForm.get('DepartmentId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDepartment(value) : this.DepartmentList.slice()),
      );

      if (this.data) {

        const DValue = this.DepartmentList.filter(item => item.DepartmentId == this.registerObj1.DepartmentId);
        console.log("Departmentid:", DValue)
        this._OtManagementService.otRequestForm.get('DepartmentId').setValue(DValue[0]);
        this._OtManagementService.otRequestForm.updateValueAndValidity();
        // this.OnChangeDoctorList(DValue[0]);
        return;
      }

    });
  }

  private _filterDepartment(value: any): string[] {
    if (value) {
      const filterValue = value && value.DepartmentName ? value.DepartmentName.toLowerCase() : value.toLowerCase();
      return this.optionsDepartment.filter(option => option.DepartmentName.toLowerCase().includes(filterValue));
    }

  }
  getOptionTextautoDepartment(option) {
    return option && option.DepartmentName ? option.DepartmentName : '';
  }
  // deparment end

  @ViewChild('SurgeryCategory') SurgeryCategory: ElementRef;
  @ViewChild('SurgeonId1') SurgeonId1: ElementRef;
  @ViewChild('Site') Site: ElementRef;
  @ViewChild('OTTable') OTTable: MatSelect;
  @ViewChild('SurgeonName') SurgeonName: ElementRef;
  @ViewChild('SurgeryId') SurgeryId: ElementRef;
  @ViewChild('AnesthType') AnesthType: ElementRef;
  @ViewChild('Instruction') Instruction: ElementRef;
  @ViewChild('wardname') wname: ElementRef;
  @ViewChild('bedno') bedno: ElementRef;
  @ViewChild('pName') pName: ElementRef;
  @ViewChild('GName') GName: ElementRef;
  @ViewChild('age') age: ElementRef;

  public onEnterwname(event): void {
    if (event.which === 13) {
      this.bedno.nativeElement.focus();
    }
  }
  public onEnterbedno(event): void {
    if (event.which === 13) {
      this.pName.nativeElement.focus();
    }
  }
  public onEnterPname(event): void {
    if (event.which === 13) {
      this.GName.nativeElement.focus();
    }
  }
  public onEnterGname(event): void {
    if (event.which === 13) {
      this.age.nativeElement.focus();
    }
  }
  public onEnterage(event): void {
    if (event.which === 13) {
      this.GName.nativeElement.focus();
    }
  }

  public onEnterDepartmentId(event): void {
    if (event.which === 13) {
      this.SurgeryCategory.nativeElement.focus();
    }
  }

  public onEnterSurgeryCategory(event): void {
    if (event.which === 13) {
      this.SurgeonId1.nativeElement.focus();
    }
  }

  public onEnterSystem(event): void {
    if (event.which === 13) {
      this.Site.nativeElement.focus();
    }
  }
  public onEnterSite(event): void {
    if (event.which === 13) {
      this.SurgeonName.nativeElement.focus();
    }
  }

  public onEnterSurgeonName(event): void {
    if (event.which === 13) {
      this.SurgeryId.nativeElement.focus();

    }
  }

  public onEnterSurgery(event): void {
    if (event.which === 13) {
      this.SurgeonName.nativeElement.focus();
    }
  }

  // public onEnterSurgeonName(event): void {
  //   if (event.which === 13) {
  //     this.SurgeonName.nativeElement.focus();

  //   }
  // }

  OnChangeDoctorList(departmentObj) {
    // 
    console.log("departmentObj", departmentObj)
    this._OtManagementService.getDoctorMasterCombo(departmentObj.Departmentid).subscribe(
      data => {
        this.DoctorList = data;
        console.log(this.DoctorList);
        // this.filteredDoctor.next(this.DoctorList.slice());
      })
  }

  onClose() {
    this._OtManagementService.otRequestForm.reset({SurgeryType:'0'})
    this.dialogRef.close();
  }

   
}





