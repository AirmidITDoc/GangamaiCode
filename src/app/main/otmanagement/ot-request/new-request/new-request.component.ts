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

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewRequestComponent implements OnInit {
  searchFormGroup:FormGroup;
  personalFormGroup: FormGroup;
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
  RegId:any;
  vAdmissionID:any;
  PatientListfilteredOptionsIP:any;
  PatientListfilteredOptionsOP:any;
  isRegIdSelected: boolean = false;
  vWardName: any;
  vBedNo:any;
  vPatientName:any;
  vGenderName:any;
  vAgeYear:any;
  vAge:any;
  vRegNo:any;
  vOPDNo:any;
  vCompanyName:any;
  vTariffName:any;
  vOP_IP_MobileNo:any;
  vDoctorName:any;
  GendercmbList: any = [];
  optionsGender: any[] = [];
  vSelectedOption: any= 'OP';
  selectedType: any='';
  vOtReqOPD: any ;
  vOtReqIPD: any ; 
  vDepartmentName:any;
  vIPDNo:any;
  vSiteDescId:any;
  vSurgeryCategoryId:any;
  vSurgeryId:any;
  vDocName:any;
  vDepName:any;
  // vOP_IP_Type:any;
  vConditionOP:boolean=false;
  vConditionIP:boolean=false;
  OP_IP_Id: any = 0;
  OP_IPType: any = 2;
  isSystemSelected: boolean = false;  
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
    private accountService: AuthenticationService,
    // public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewRequestComponent>,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    private router: Router) { }
    private _loggedService: AuthenticationService


  ngOnInit(): void {
    
    this.searchFormGroup = this.createMyForm();
    
    this.personalFormGroup = this.createOtrequestForm();
    this.vSelectedOption = this.OP_IPType === 1 ? 'IP' : 'OP';
    if(this.data) {

      this.registerObj1 = this.data.Obj;

      // ip and op edit
      if (this.registerObj1.OP_IP_Type === 1) {
        // Fetch IP-specific information
      console.log("IIIIIIIIIIIIIPPPPPPPPP:",this.registerObj1);
      this.vWardName=this.registerObj1.RoomName;
      this.vBedNo=this.registerObj1.BedName;
      this.vGenderName=this.registerObj1.GenderName;
      this.vPatientName = this.registerObj1.FirstName + ' ' +this.registerObj1.MiddleName+ ' ' + this.registerObj1.LastName;
      this.vAgeYear = this.registerObj1.AgeYear;
      this.RegId = this.registerObj1.RegID;
      this.vAdmissionID = this.registerObj1.AdmissionID
      this.vAge=this.registerObj1.Age;
      this.vRegNo =this.registerObj1.RegNo; 
      this.vIPDNo = this.registerObj1.IPDNo;
      this.vCompanyName = this.registerObj1.CompanyName;
      this.vTariffName = this.registerObj1.TariffName; 
      this.vOP_IP_MobileNo = this.registerObj1.MobileNo;
      this.vDoctorName = this.registerObj1.DoctorName;
      this.vDepartmentName=this.registerObj1.DepartmentName;      
      this.vSelectedOption = 'IP';
      this.vSiteDescId=this.registerObj1.SiteDescId
      this.vSurgeryCategoryId=this.registerObj1.SurgeryCategoryId;
      this.vSurgeryId=this.registerObj1.SurgeryId;
      this.vDocName = this.registerObj1.DoctorName;
      this.vDepName=this.registerObj1.DepartmentName;

      this.setDropdownObjs1();
      this.getSurgeryList();
      this.getOttableList();
      this.getDoctorList();
      this.getDoctor1List();
      this.getDoctor2List();
      this.getCategoryList();
      // this.getSiteList();
      this.getDepartmentList();
      } else if (this.registerObj1.OP_IP_Type === 0) {
        // Fetch OP-specific information
      console.log("OOOOOOOPPPPPPPPP:",this.registerObj1);
      this.vWardName=this.registerObj1.RoomName;
      this.vBedNo=this.registerObj1.BedName;
      this.vGenderName=this.registerObj1.GenderName;
      this.vPatientName = this.registerObj1.FirstName + ' ' +this.registerObj1.MiddleName+ ' ' + this.registerObj1.LastName;
      this.vAgeYear = this.registerObj1.AgeYear;
     this.RegId = this.registerObj1.RegID;
      this.vAdmissionID = this.registerObj1.AdmissionID
      this.vAge=this.registerObj1.Age;
      this.vRegNo =this.registerObj1.RegNo; 
      this.vOPDNo = this.registerObj1.OPDNo;
      this.vCompanyName = this.registerObj1.CompanyName;
      this.vTariffName = this.registerObj1.TariffName; 
      this.vOP_IP_MobileNo = this.registerObj1.MobileNo;
      this.vDoctorName = this.registerObj1.DoctorName;
      this.vDepartmentName=this.registerObj1.DepartmentName;
      this.vSelectedOption = 'OP';
      this.vSiteDescId=this.registerObj1.SiteDescId
      this.vSurgeryCategoryId=this.registerObj1.SurgeryCategoryId;
      this.vSurgeryId=this.registerObj1.SurgeryId;
      this.vDocName = this.registerObj1.DoctorName;
      this.vDepName=this.registerObj1.DepartmentName;

      this.setDropdownObjs1();
      this.getSurgeryList();
      this.getOttableList();
      this.getDoctorList();
      this.getDoctor1List();
      this.getDoctor2List();
      this.getCategoryList();
      // this.getSiteList();
      this.getDepartmentList();
      }
      this.setDropdownObjs1();
    }

    this.getSurgeryList();
    this.getOttableList();
    this.getDoctorList();
    this.getDoctor1List();
    this.getDoctor2List();
    this.getCategoryList();
    // this.getSiteList();
    this.getDepartmentList();
  
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
        if(this.vOtReqOPD == false){
          this.vSelectedOption = 'IP';  
        this.searchFormGroup.get('MobileNo').clearValidators();
        this.searchFormGroup.get('PatientName').clearValidators();
        this.searchFormGroup.get('MobileNo').updateValueAndValidity();
        this.searchFormGroup.get('PatientName').updateValueAndValidity();
        }  
      }else{
        this.vConditionIP = true
      } 
      if (this.vOtReqOPD == true) {
        if (this.vOtReqIPD == false) { 
          this.vSelectedOption = 'OP'; 
          this.searchFormGroup.get('MobileNo').clearValidators();
          this.searchFormGroup.get('PatientName').clearValidators();
          this.searchFormGroup.get('MobileNo').updateValueAndValidity();
          this.searchFormGroup.get('PatientName').updateValueAndValidity();
        }
      } else{
        this.vConditionOP = true
      }

  }

  onChangePatientType(event) {
    if (event.value == 'OP') {
      this.OP_IPType = 0;
      this.RegId = "";
      this.searchFormGroup.get('MobileNo').clearValidators();
      this.searchFormGroup.get('PatientName').clearValidators();
      this.searchFormGroup.get('MobileNo').updateValueAndValidity();
      this.searchFormGroup.get('PatientName').updateValueAndValidity();
    }
    else if (event.value == 'IP') {
      this.OP_IPType = 1;
      this.RegId = "";
      this.searchFormGroup.get('MobileNo').clearValidators();
      this.searchFormGroup.get('PatientName').clearValidators();
      this.searchFormGroup.get('MobileNo').updateValueAndValidity();
      this.searchFormGroup.get('PatientName').updateValueAndValidity();
    } else {
      this.searchFormGroup.get('MobileNo').reset();
      this.searchFormGroup.get('MobileNo').setValidators([Validators.required]);
      this.searchFormGroup.get('MobileNo').enable();
      this.searchFormGroup.get('PatientName').reset();
      this.searchFormGroup.get('PatientName').setValidators([Validators.required]);
      this.searchFormGroup.get('PatientName').enable();
      this.searchFormGroup.updateValueAndValidity();
      this.OP_IPType = 2;  
    }
  }
  getOptionTextIPObj(option) { 
    return option && option.FirstName + " " + option.LastName; 
  }
  getOptionTextOPObj(option) { 
    return option && option.FirstName + " " + option.LastName; 
  }
  
  createMyForm() {
    return this.formBuilder.group({
      RegID: '',
      PatientType: ['OP'],
      MobileNo:'',
      PatientName:''
      // PatientName: '',
      // WardName: '',
      // StoreId: '',
      // RegID: [''],
      // Op_ip_id: ['1'],
      // AdmissionID: 0

    })
  }

  PatientInformRest(){
    this.vWardName='';
    this.vBedNo='';
    this.vGenderName='';
    this.vPatientName='';
    this.vAgeYear='';
    this.RegId='';
    this.vAdmissionID='';
    this.vAge='';
    this.vRegNo
    this.vOPDNo='';
    this.vCompanyName='';
    this.vTariffName='';
    this.vOP_IP_MobileNo='';
    this.vDoctorName='';
    this.vDepartmentName='';
    this.OP_IP_Id = '';
    this.vIPDNo = '';
  }

  closeDialog() {
    console.log("closed")
    this.dialogRef.close();
    // this.personalFormGroup.reset();
  }

  createOtrequestForm() {
    return this.formBuilder.group({
      OTbookingDate: [new Date().toISOString()],
      OTbookingTime: [new Date().toISOString()],
      OP_IP_ID: '',
      OP_IP_Type: '',
      AddedDateTime: [new Date().toISOString()],
      SurgeryId: '',
      SurgeonId: '',
      SurgeonId1: '',
      SurgeryType: '',
      DepartmentId: '',
      CategoryId: ' ',
      IsCancelled: '',
      SiteDescId: '',
      DoctorId: '',
      WardName:'',
      BedNo:'',
      PatientName:'',
      GenderId:'',
      Age:''
    });
  }


  getSearchList() {
    var m_data = {
      "Keyword": `${this.searchFormGroup.get('RegID').value}%`
    }
    if (this.searchFormGroup.get('PatientType').value == 'OP'){

      if (this.searchFormGroup.get('RegID').value.length >= 1) {
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
    }else if (this.searchFormGroup.get('PatientType').value == 'IP') {

      if (this.searchFormGroup.get('RegID').value.length >= 1) {
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
   this.PatientInformRest();
  }

  getSelectedObjOP(obj) {
    console.log("AdmittedListOP:",obj)
    this.registerObj = obj;
    this.vWardName=obj.RoomName;
    this.vBedNo=obj.BedName;
    this.vGenderName=obj.GenderName;
    this.vPatientName = obj.FirstName + ' ' +obj.MiddleName+ ' ' + obj.LastName;
    this.vAgeYear = obj.AgeYear;
    // this.PatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.PatientName;
    this.RegId = obj.RegID;
    this.vAdmissionID = obj.AdmissionID
    this.vAge=obj.Age;
    this.vRegNo =obj.RegNo; 
    this.vOPDNo = obj.OPDNo;
    this.vCompanyName = obj.CompanyName;
    this.vTariffName = obj.TariffName; 
    this.vOP_IP_MobileNo = obj.MobileNo;
    this.vDoctorName = obj.DoctorName;
    this.vDepartmentName=obj.DepartmentName;
    this.vDocName = obj.DoctorName;
    this.vDepName=obj.DepartmentName;
    // this.OP_IPType=0;
    // this.OP_IPType=1;

    // this.PatientInformRest();
    this.getSurgeryList(); //SurgeryName
    this.getOttableList();
    this.getDoctorList(); //SurgeonName
    this.getDoctor1List();
    this.getDoctor2List();
    this.getCategoryList(); //SurgeryCategoryName
    // this.getSiteList(); //sitName
    this.getDepartmentList(); //departmentName
  }

  getSelectedObjRegIP(obj) {
    let IsDischarged = 0;
    IsDischarged = obj.IsDischarged 
    if(IsDischarged == 1){
      Swal.fire('Selected Patient is already discharged'); 
      this.RegId = ''
    }
    else{
      console.log("AdmittedListIP:",obj)
      this.registerObj = obj;
      this.vPatientName = obj.FirstName + ' ' +obj.MiddleName+ ' ' + obj.LastName;
      this.RegId = obj.RegID;
      this.OP_IP_Id = this.registerObj.AdmissionID;
      this.vIPDNo = obj.IPDNo;
      this.vRegNo =obj.RegNo;
      this.vDoctorName = obj.DoctorName;
      this.vTariffName =obj.TariffName
      this.vCompanyName = obj.CompanyName;
      this.vAgeYear = obj.AgeYear;
      this.vOP_IP_MobileNo = obj.MobileNo;
      this.vDepartmentName=obj.DepartmentName;
      this.vAge=obj.Age;
      this.vGenderName=obj.GenderName;
      this.vDocName = obj.DoctorName;
      this.vDepName=obj.DepartmentName;
    } 
    this.getSurgeryList();
    this.getOttableList();
    this.getDoctorList();
    this.getDoctor1List();
    this.getDoctor2List();
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

    // const toSelect = this.SurgeryList.find(c => c.SurgeryId == this.registerObj1.SurgeryId);
    // this.personalFormGroup.get('SurgeryId').setValue(toSelect);

    const toSurgeonId1 = this.DoctorList.find(c => c.DoctorId == this.registerObj1.SurgeonId);
    this._OtManagementService.otreservationFormGroup.get('SurgeonId').setValue(toSurgeonId1);

    const toDepartment = this.DepartmentList.find(c => c.DepartmentId == this.registerObj1.DepartmentId);
    this._OtManagementService.otreservationFormGroup.get('DepartmentId').setValue(toDepartment);

    const toCategory = this.CategoryList.find(c => c.SurgeryCategoryId == this.registerObj1.CategoryId);
    this._OtManagementService.otreservationFormGroup.get('SurgeryCategoryId').setValue(toCategory);

    const toSurgery = this.SurgeryList.find(c => c.SurgeryId == this.registerObj1.SurgeryId);
    this._OtManagementService.otreservationFormGroup.get('SurgeryId').setValue(toSurgery);



    this.personalFormGroup.updateValueAndValidity();


  }
  ngOnDestroys() {
    // this.isAlive = false;
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj ==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }


  getOttableList() {
    this._OtManagementService.getOTtableCombo().subscribe(data => { this.OTtableList = data; })
  }


  getSergeryList() {
    this._OtManagementService.getSurgeryCombo().subscribe(data => { this.SurgeryList = data; })
  }

  // System start 
  getCategoryList() {
    this._OtManagementService.getCategoryCombo().subscribe(data => {
      this.CategoryList = data;
      this.optionsSurgeryCategory = this.CategoryList.slice();
      this.filteredOptionsSurgeryCategory = this._OtManagementService.otreservationFormGroup.get('SurgeryCategoryId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSurgeryCategory(value) : this.CategoryList.slice()),
      );
      if (this.data) {
        
        const DValue = this.CategoryList.filter(item => item.SurgeryCategoryId == this.registerObj1.SurgeryId);
        console.log("SurgeryCategoryId:",DValue)
        this._OtManagementService.otreservationFormGroup.get('SurgeryCategoryId').setValue(DValue[0]);
        this._OtManagementService.otreservationFormGroup.updateValueAndValidity();
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

  getSurgeryList() {
    
    this._OtManagementService.getSurgeryCombo().subscribe(data => {
      this.SurgeryList = data;
      this.optionsSurgery = this.SurgeryList.slice();
      this.filteredOptionsSurgery = this._OtManagementService.otreservationFormGroup.get('SurgeryId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this.Surgery(value) : this.SurgeryList.slice()),
      );
      if (this.data) {
        
        const DValue = this.SurgeryList.filter(item => item.SurgeryId == this.registerObj1.SurgeryId);
        console.log("SurgeryId:",DValue)
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

  // site star
  // getSiteList() {
        
  //   this._OtManagementService.getSiteCombo().subscribe(data => {
  //     this.Sitelist = data;
  //     this.optionsSite = this.Sitelist.slice();
  //     this.filteredOptionsSite = this._OtManagementService.otreservationFormGroup.get('SiteDescId').valueChanges.pipe(
  //       startWith(''),
  //       map(value => value ? this._filterSite(value) : this.Sitelist.slice()),
  //     );

  //     if (this.data) {
        
  //       const SValue = this.Sitelist.filter(item => item.SiteDescId == this.registerObj1.SiteDescId);
  //       console.log("SiteDescId:",SValue)
  //       this._OtManagementService.otreservationFormGroup.get('SiteDescId').setValue(SValue[0]);
  //       this._OtManagementService.otreservationFormGroup.updateValueAndValidity();
  //       return;
  //     }

  //   });

  // }
  private _filterSite(value: any): string[] {
    if (value) {
      const filterValue = value && value.SiteDescriptionName ? value.SiteDescriptionName.toLowerCase() : value.toLowerCase();
      this.isSiteSelected=false;
      return this.optionsSite.filter(option => option.SiteDescriptionName.toLowerCase().includes(filterValue));
    }

  }
  getOptionTextautoSiteDesc(option) {
    return option && option.SiteDescriptionName ? option.SiteDescriptionName : '';
  }

  onChangeSiteList(systemObj){
    debugger
    console.log(systemObj)
    this._OtManagementService.otreservationFormGroup.get('SiteDescId').reset();
    var vdata={
      "Id":systemObj.SurgeryCategoryId
    } 
    this.isSystemSelected = true;

    this._OtManagementService.getSiteCombo(vdata).subscribe(
      data => {
        this.Sitelist = data;
        console.log(this.Sitelist)
        this.optionsSite = this.Sitelist.slice();
        this.filteredOptionsSite = this._OtManagementService.otreservationFormGroup.get('SiteDescId').valueChanges.pipe(
          startWith(''),
            map(value => value ? this._filterSite(value) : this.Sitelist.slice()),
        );
        if (this.registerObj1) {    
          debugger    
          const SValue = this.Sitelist.filter(item => item.SiteDescId == this.registerObj1.SiteDescId);
          console.log("SiteDescId:",SValue)
          this._OtManagementService.otreservationFormGroup.get('SiteDescId').setValue(SValue[0]);
          this._OtManagementService.otreservationFormGroup.updateValueAndValidity();
          return;
        }
        console.log("Site ndfkdf:",this._OtManagementService.otreservationFormGroup.get('SiteDescId').value)
      })

  }
   // site end

  // doctor start
  getDoctorList() {
    debugger
    this._OtManagementService.getDoctorMaster().subscribe(data => {
      this.DoctorList = data;
      this.optionsSurgeon = this.DoctorList.slice();
      this.filteredOptionsSurgeon = this._OtManagementService.otreservationFormGroup.get('DoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDoctor(value) : this.DoctorList.slice()),
      );
      if (this.data) {
        debugger
        const DValue = this.DoctorList.filter(item => item.DoctorId == this.registerObj1.SurgeonId);
        console.log("DoctorId:",DValue)
        this._OtManagementService.otreservationFormGroup.get('DoctorId').setValue(DValue[0]);
        this._OtManagementService.otreservationFormGroup.updateValueAndValidity();

        return;
      }

    });

  }
  private _filterDoctor(value: any): string[] {
    debugger
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsSurgeon.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }

  getOptionTextSurgeonId1(option) {
    debugger
    return option && option.Doctorname ? option.Doctorname : '';
  }

  // doctor end

  getOptionTextautoSurgeonName(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }

  // deparment start
  getDepartmentList() {

    this._OtManagementService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.optionsDepartment = this.DepartmentList.slice();
      this.filteredOptionautoDepartment = this._OtManagementService.otreservationFormGroup.get('DepartmentId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDepartment(value) : this.DepartmentList.slice()),
      );

      if (this.data) {
        
        const DValue = this.DepartmentList.filter(item => item.DepartmentId == this.registerObj1.DepartmentId);
        console.log("Departmentid:",DValue)
        this._OtManagementService.otreservationFormGroup.get('DepartmentId').setValue(DValue[0]);
        this._OtManagementService.otreservationFormGroup.updateValueAndValidity();
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
  getDoctor1List() {

    this._OtManagementService.getDoctorMaster1Combo().subscribe(data => {
      this.Doctor1List = data;
      console.log(this.Doctor1List);
      // this.filteredDoctorone.next(this.Doctor1List.slice());
    })
  }

  getDoctor2List() {
    this._OtManagementService.getDoctorMaster2Combo().subscribe(data => {
      this.Doctor2List = data;
      // this.filteredDoctortwo.next(this.Doctor2List.slice())
    })
  }

 
  
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
    this.dialogRef.close();
  }


  onSubmit() {
    
    let otBookingID = this.registerObj1.OTBookingId;

    this.isLoading = 'submit';
    
    // if (this.Adm_Vit_ID)
      if (!otBookingID) {
        var m_data = {
          "otTableRequestInsert": {
            "OTBookingID": 0,// this._registerService.mySaveForm.get("RegId").value || "0",
            "OTbookingDate": this.dateTimeObj.date,
            "OTbookingTime": this.dateTimeObj.date,
            "oP_IP_ID": this.Adm_Vit_ID || 0,
            "oP_IP_Type": 1,
            "surgeonId": this._OtManagementService.otreservationFormGroup.get('DoctorId').value.DoctorId || 0,
            "SurgeryId": this._OtManagementService.otreservationFormGroup.get('SurgeryId').value.SurgeryId || 0,
            "SurgeryType": this._OtManagementService.otreservationFormGroup.get('SurgeryType').value || 0,
            "DepartmentId": this._OtManagementService.otreservationFormGroup.get('DepartmentId').value.Departmentid || 0,
            "CategoryId": this._OtManagementService.otreservationFormGroup.get('SurgeryCategoryId').value.SurgeryCategoryId || 0,
            "AddedDateTime": this.dateTimeObj.date,
            "AddedBy ": this.accountService.currentUserValue.user.id || 0,
            "IsCancelled": 0,//this.personalFormGroup.get('IsCancelled ').value || '',
            "SiteDescId": this._OtManagementService.otreservationFormGroup.get('SiteDescId').value.SiteDescId || 0


          }
        }
        console.log(m_data);
        this._OtManagementService.RequestInsert(m_data).subscribe(response => {
          if (response) {
            this._OtManagementService
            Swal.fire('Congratulations !', 'OT Request  Data save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();
              }
            });
          } else {
            Swal.fire('Error !', 'Ot Request Data  not saved', 'error');
          }

        });
      }
      else {
        
        var m_data1 = {
          "otTableRequestUpdate": {
            "OTBookingID": otBookingID || 0,
            "OTbookingDate  ": this.dateTimeObj.date, //this.datePipe.transform(this.dateTimeObj.date,"yyyy-Mm-dd") || opdRegistrationSave"2021-03-31",// this.dateTimeObj.date,//
            "OTbookingTime  ": this.dateTimeObj.time, // this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",

            "oP_IP_ID": 1,//this._OtManagementService.otreservationFormGroup.get('OP_IP_ID').value | 0,
            "oP_IP_Type": 1,
            "surgeonId": this._OtManagementService.otreservationFormGroup.get('SurgeonId1').value.DoctorId || 0,
            "SurgeryId ": this._OtManagementService.otreservationFormGroup.get('SurgeryId').value.SurgeryId || 0,
            "SurgeryType ": this._OtManagementService.otreservationFormGroup.get('SurgeryType').value || 0,

            "DepartmentId ": this._OtManagementService.otreservationFormGroup.get('DepartmentId').value.Departmentid || 0,
            "CategoryId ": this._OtManagementService.otreservationFormGroup.get('SurgeryCategoryId').value.SurgeryCategoryId || 0,

            "AddedDateTime ": this.dateTimeObj.time,
            "AddedBy ": this.accountService.currentUserValue.user.id || 0,
            "IsCancelled ": 0,//this.personalFormGroup.get('IsCancelled ').value || '',
            "SiteDescId ": this._OtManagementService.otreservationFormGroup.get('SiteDescId').value.SiteDescId || 0,

          }
        }
        console.log(m_data1);
        this._OtManagementService.RequestUpdate(m_data1).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'OT Request Data Updated Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();
              }
            });
          } else {
            Swal.fire('Error !', 'OT Request Data  not saved', 'error');
          }

        });
      }
  }
}





