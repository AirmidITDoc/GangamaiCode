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

@Component({
  selector: 'app-new-reservation',
  templateUrl: './new-reservation.component.html',
  styleUrls: ['./new-reservation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewReservationComponent implements OnInit {

 
  personalFormGroup: FormGroup;
  isRegIdSelected:Boolean=false;
  submitted = false;
  now = Date.now();
  searchFormGroup: FormGroup;
  isRegSearchDisabled: boolean = true;
  newRegSelected: any = 'registration';
  selectedAdvanceObj: OPIPPatientModel;
  msg: any = [];
  DoctorList: any = [];
  Doctor1List: any = [];
  Doctor2List: any = [];
  SurgeryList: any = [];
  OTtableList: any = [];
  Anesthestishdoclist1: any = [];
  Anesthestishdoclist2: any = [];
  Today:Date =new Date();
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
  Age:any='';
  ipno: any = '';
  patienttype: any = '';
  Adm_Vit_ID: any = 0;
  public dateValue: Date = new Date();
  options = [];
  myForm:FormGroup;
  filteredOptions: any;
  noOptionFound: boolean = false;
  RegId:any;
  vAdmissionID:any;
  PatientListfilteredOptions:any;

  vGenderName:any;
  vRegNo:any;
  vOPDNo:any;
  vCompanyName:any;
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
  vConditionOP:boolean=false;
  vConditionIP:boolean=false;
  OP_IP_Id: any = 0;
  OP_IPType: any = 2;
  vWardName: any;
  vBedNo:any;
  vPatientName:any;
  vAgeYear:any;
  vAge:any;
  vTariffName:any;
  vSiteDescId:any;
  vSurgeryCategoryId:any;
  vSurgeryId:any;
  vDocName:any;
  vDepName:any;
  PatientListfilteredOptionsIP:any;
  PatientListfilteredOptionsOP:any;

  // @Input() panelWidth: string | number;
  // @ViewChild('multiUserSearch') multiUserSearchInput: ElementRef;


  screenFromString = 'registration';
  selectedPrefixId: any;

  // @Input() childName: string[];
  // @Output() parentFunction: EventEmitter<any> = new EventEmitter();
  matDialogRef: any;

  //doctorone filter
  public doctoroneFilterCtrl: FormControl = new FormControl();
  public filteredDoctorone: ReplaySubject<any> = new ReplaySubject<any>(1);


  //doctorone filter
  public doctorFilterCtrl: FormControl = new FormControl();
  public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);


  //doctortwo filter
  public doctortwoFilterCtrl: FormControl = new FormControl();
  public filteredDoctortwo: ReplaySubject<any> = new ReplaySubject<any>(1);



  //area filter
  public AnesthDoctFilterCtrl1: FormControl = new FormControl();
  public filteredAnesthDoctor1: ReplaySubject<any> = new ReplaySubject<any>(1);



  //area filter
  public AnesthDoctFilterCtrl2: FormControl = new FormControl();
  public filteredAnesthDoctor2: ReplaySubject<any> = new ReplaySubject<any>(1);


  private _onDestroy = new Subject<void>();

  constructor(
    public _OtManagementService: OTManagementServiceService,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    // public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewReservationComponent>,
    // public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    private router: Router) { }    
    private _loggedService: AuthenticationService


  ngOnInit(): void {
    this.searchFormGroup = this.createMyForm();
    console.log(this.data)
    this.personalFormGroup = this.createOtCathlabForm();
    this.vSelectedOption = this.OP_IPType === 1 ? 'IP' : 'OP';

    if (this.data) {

      this.registerObj1 = this.data.PatObj;
    
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
      this.getSergeryList();
      this.getOttableList();
      this.getDoctorList();
      this.getDoctor1List();
      this.getDoctor2List();
      this.getAnesthestishDoctorList1();
      this.getAnesthestishDoctorList2();
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
      this.getSergeryList();
      this.getOttableList();
      this.getDoctorList();
      this.getDoctor1List();
      this.getDoctor2List();
      this.getAnesthestishDoctorList1();
      this.getAnesthestishDoctorList2();
      }

      console.log(this.registerObj1);

      this.setDropdownObjs1();
    }

    this.getSergeryList();
    this.getOttableList();
    this.getDoctorList();
    this.getDoctor1List();
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
  
    this.doctorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctor();
      });

    this.doctoroneFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctorone();
      });

    this.doctortwoFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctortwo();
      });


    this.AnesthDoctFilterCtrl1.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAnesthDoctor1();
      });

    this.AnesthDoctFilterCtrl2.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAnesthDoctor2();
      });

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

  // getSelectedObj(obj) {
  //   this.registerObj = obj;
  //   // this.PatientName = obj.FirstName + '' + obj.LastName;
  //   this.PatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.PatientName;
  //   this.RegId = obj.RegID;
  //   this.vAdmissionID = obj.AdmissionID

  //   this.RegId = obj.RegID;
  //     this.OP_IP_Id = this.registerObj.AdmissionID;
  //     this.vIPDNo = obj.IPDNo;
  //     this.vRegNo =obj.RegNo;
  //     this.vDoctorName = obj.DoctorName;
  //     this.tariffname =obj.TariffName
  //     this.vCompanyName = obj.CompanyName;
  //     this.Age = obj.Age;
  //     this.vOP_IP_MobileNo = obj.MobileNo;
  //     this.vDepartmentName=obj.DepartmentName;
  //     this.vGenderName=obj.GenderName;

  //   console.log(obj);
  // }

  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.PatientName + ' (' + option.RegID + ')';
  }

  
  getSelectedObjOP(obj) {
    debugger
    console.log("AdmittedListOP:",obj)
    this.registerObj = obj;
    this.vWardName=obj.RoomName;
    this.vBedNo=obj.BedName;
    this.vGenderName=obj.GenderName;
    this.vPatientName = obj.FirstName + ' ' +obj.MiddleName+ ' ' + obj.LastName;
    this.vAgeYear = obj.AgeYear;
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
    
    this.getSergeryList();
    this.getOttableList();
    this.getDoctorList();
    this.getDoctor1List();
    this.getDoctor2List();
    this.getAnesthestishDoctorList1();
    this.getAnesthestishDoctorList2();
  }

  getSelectedObjRegIP(obj) {
    debugger
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
      this.getSergeryList();
      this.getOttableList();
      this.getDoctorList();
      this.getDoctor1List();
      this.getDoctor2List();
      this.getAnesthestishDoctorList1();
      this.getAnesthestishDoctorList2();
  }

  closeDialog() {
    
    // this.dialogRef.close();
    // this.personalFormGroup.reset();
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
    debugger;

    this._OtManagementService.populateFormpersonal(this.registerObj1);

    // const toSelect = this.SurgeryList.find(c => c.SurgeryId == this.registerObj1.SurgeryId);
    // this.personalFormGroup.get('SurgeryId').setValue(toSelect);

    console.log(this.DoctorList);
    console.log(this.OTtableList);
    console.log(this.Anesthestishdoclist1);
    console.log(this.Anesthestishdoclist2);

    const toSurgeonId1 = this.DoctorList.find(c => c.DoctorId == this.registerObj1.SurgeonId);
    this._OtManagementService.otreservationFormGroup.get('SurgeonId').setValue(toSurgeonId1);

    const toOTTableId = this.OTtableList.find(c => c.OTTableId == this.registerObj1.OTTableID);
    this._OtManagementService.otreservationFormGroup.get('OTTableId').setValue(toOTTableId);

    const toSelectAnestheticsDr = this.Anesthestishdoclist1.find(c => c.DoctorId == this.registerObj1.AnestheticsDr);
    this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').setValue(toSelectAnestheticsDr);

    const toSelectAnestheticsDr1 = this.Anesthestishdoclist2.find(c => c.Anesthestishdoclist2 == this.registerObj1.AnestheticsDr1);
    this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').setValue(toSelectAnestheticsDr1);



    this.personalFormGroup.updateValueAndValidity();


  }

  // doctorone filter code  
  private filterDoctor() {
    if (!this.DoctorList) {
      return;
    }
    // get the search keyword
    let search = this.doctorFilterCtrl.value;
    if (!search) {
      this.filteredDoctor.next(this.DoctorList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDoctor.next(
      this.DoctorList.filter(bank => bank.Doctorname.toLowerCase().indexOf(search) > -1)
    );
  }


  // doctorone filter code  
  private filterDoctorone() {

    if (!this.Doctor1List) {
      return;
    }
    // get the search keyword
    let search = this.doctoroneFilterCtrl.value;
    if (!search) {
      this.filteredDoctorone.next(this.Doctor1List.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDoctorone.next(
      this.Doctor1List.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );
  }


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


  // area filter code  
  private filterAnesthDoctor1() {

    if (!this.Anesthestishdoclist1) {
      return;
    }
    // get the search keyword
    let search = this.AnesthDoctFilterCtrl1.value;
    if (!search) {
      this.filteredAnesthDoctor1.next(this.Anesthestishdoclist1.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredAnesthDoctor1.next(
      this.Anesthestishdoclist1.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );

  }



  // area filter code  
  private filterAnesthDoctor2() {
    if (!this.Anesthestishdoclist2) {
      return;
    }
    // get the search keyword
    let search = this.AnesthDoctFilterCtrl2.value;
    if (!search) {
      this.filteredAnesthDoctor2.next(this.Anesthestishdoclist2.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredAnesthDoctor2.next(
      this.Anesthestishdoclist2.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
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


  getOttableList() {
    this._OtManagementService.getOTtableCombo().subscribe(data => { this.OTtableList = data; })
  }


  getSergeryList() {
    debugger
    this._OtManagementService.getSurgeryCombo().subscribe(data => { this.SurgeryList = data; })
  }


  // getOptionText(option) {
  //   if (!option) return '';
  //   return option.FirstName + ' ' + option.LastName + ' (' + option.RegId + ')';
  // }



  getAnesthestishDoctorList1() {
    this._OtManagementService.getAnesthestishDoctorCombo().subscribe(data => {
      this.Anesthestishdoclist1 = data;
      console.log(data);
      this.filteredAnesthDoctor1.next(this.Anesthestishdoclist1.slice());

    })
  }


  getAnesthestishDoctorList2() {
    this._OtManagementService.getAnesthestishDoctorCombo().subscribe(data => {
      this.Anesthestishdoclist2 = data;
      console.log(data);
      this.filteredAnesthDoctor2.next(this.Anesthestishdoclist2.slice());

    })
  }


  // getDoctor1List() {
  //   this._registerService.getDoctorMaster1Combo().subscribe(data => { this.Doctor1List = data; })
  // }

// doctor 1 start 

  getDoctorList() {
    this._OtManagementService.getDoctorMaster().subscribe(
      data => {
      this.DoctorList = data;
        console.log(data)
        // data => {
        //   this.DoctorList = data;
        this.filteredDoctor.next(this.DoctorList.slice());
      })
  }
  // doctor end

  getDoctor1List() {
    debugger
    this._OtManagementService.getDoctorMaster1Combo().subscribe(data => {
      this.Doctor1List = data;
      console.log(this.Doctor1List);
      this.filteredDoctorone.next(this.Doctor1List.slice());
    })
  }

  getDoctor2List() {
    this._OtManagementService.getDoctorMaster2Combo().subscribe(data => {
      this.Doctor2List = data;
      this.filteredDoctortwo.next(this.Doctor2List.slice())
    })
  }

  getOTRequest(){
    const dialogRef = this._matDialog.open(GetOTRequetComponent,
      {
        maxWidth: '80%',
        height: '90%',
        width: '100%',
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
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
    this.dialogRef.close();
  }


  onSubmit() {
    debugger;
    let otBookingID = this.registerObj1.OTBookingID;

    this.isLoading = 'submit';

    // if (this.Adm_Vit_ID) {
      if (!otBookingID) {
        var m_data = {
          "otTableBookingDetailInsert": {
            "OTBookingID": 0,// this._registerService.mySaveForm.get("RegId").value || "0",
            "tranDate": this.dateTimeObj.date, //this.datePipe.transform(this.dateTimeObj.date,"yyyy-Mm-dd") || opdRegistrationSave"2021-03-31",// this.dateTimeObj.date,//
            "tranTime": this.dateTimeObj.time, // this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",
            "oP_IP_ID": this.Adm_Vit_ID,// this._OtManagementService.otreservationFormGroup.get('OP_IP_ID').value | 0,
            "oP_IP_Type": 1,
            "opDate":this.dateTimeObj.date,// this.datePipe.transform(this._OtManagementService.otreservationFormGroup.get("OPDate").value,"yyyy-MM-dd 00:00:00.000"),
            "opTime":this.dateTimeObj.time,// this.datePipe.transform(this._OtManagementService.otreservationFormGroup.get("OPDate").value,"yyyy-MM-dd 00:00:00.000"),
            "duration": this._OtManagementService.otreservationFormGroup.get('Duration').value || 0,
            "otTableID": this._OtManagementService.otreservationFormGroup.get('OTTableId').value.OTTableId || 0,
            "surgeonId": this._OtManagementService.otreservationFormGroup.get('SurgeonId').value.DoctorId || 0,
            "surgeonId1": this._OtManagementService.otreservationFormGroup.get('SurgeonId1').value.DoctorID || 0,
            "anestheticsDr": this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').value.DoctorId || 0,
            "anestheticsDr1": this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').value ? this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').value.DoctorId : 0,
            "surgeryname": this._OtManagementService.otreservationFormGroup.get('SurgeryId').value.SurgeryName || '',// ? this.personalFormGroup.get('SurgeryId').value.SurgeryId : 0,
            "procedureId": 0,
            "anesthType": this._OtManagementService.otreservationFormGroup.get('AnesthType').value || '',
            "instruction": this._OtManagementService.otreservationFormGroup.get('Instruction').value || '',
            "PatientName": this.PatientName || '',
            "isAddedBy": this.accountService.currentUserValue.user.id || 0,
            "unBooking": false,// Boolean(JSON.parse(this.personalFormGroup.get("IsCharity").value)) || "0",
            "isNormalOrFuture": 0

          }
        }
        console.log(m_data);
        this._OtManagementService.ReservationInsert(m_data).subscribe(response => {
          if (response) {
            this._OtManagementService
            Swal.fire('Congratulations !', 'OT Reservation  Data save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();
                //  this.addEmptyRow();

              }
            });
          } else {
            Swal.fire('Error !', 'Ot Reservation Data  not saved', 'error');
          }

        });
      }
      else {
        debugger;
        var m_data1 = {
          "otTableBookingDetailUpdate": {
            "OTBookingID": otBookingID,
            "tranDate": this.dateTimeObj.date, //this.datePipe.transform(this.dateTimeObj.date,"yyyy-Mm-dd") || opdRegistrationSave"2021-03-31",// this.dateTimeObj.date,//
            "tranTime": this.dateTimeObj.time, // this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",
            "opDate": this.dateTimeObj.date,// this.datePipe.transform(this.personalFormGroup.get('OPDate').value,"yyyy-Mm-dd") ,// this.dateTimeObj.date,//
            "opTime": this.dateTimeObj.time,
            "duration": this._OtManagementService.otreservationFormGroup.get('Duration').value || 0,
            "otTableID": this._OtManagementService.otreservationFormGroup.get('OTTableId').value.OTTableId || 0,
            "surgeonId": this._OtManagementService.otreservationFormGroup.get('SurgeonId').value.DoctorId || 0,
            "surgeonId1": this._OtManagementService.otreservationFormGroup.get('SurgeonId1').value.DoctorID || 0,
            "anestheticsDr": this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').value.DoctorId || 0,
            "anestheticsDr1": this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').value ? this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').value.DoctorId : 0,
            "surgeryname": this._OtManagementService.otreservationFormGroup.get('SurgeryId').value.SurgeryName || 0,// ? this.personalFormGroup.get('SurgeryId').value.SurgeryId : 0,
            "procedureId": 0,
            "anesthType": this._OtManagementService.otreservationFormGroup.get('AnesthType').value || '',
            "instruction": this._OtManagementService.otreservationFormGroup.get('Instruction').value || '',
            "PatientName": this.PatientName || '',
            "IsUpdatedBy": this.accountService.currentUserValue.user.id || 0,
            "unBooking": false,// Boolean(JSON.parse(this.personalFormGroup.get("IsCharity").value)) || "0",
            

          }
        }
        console.log(m_data1);
        this._OtManagementService.ReservationUpdate(m_data1).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Reservation Data Updated Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();
              }
            });
          } else {
            Swal.fire('Error !', 'Reservation Data  not saved', 'error');
          }

        });
      }
    // }
  }




}

