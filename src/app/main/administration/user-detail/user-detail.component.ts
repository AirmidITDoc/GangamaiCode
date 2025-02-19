import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { AdministrationService } from '../administration.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { BatchAndExpDateAdjustmentService } from 'app/main/inventory/batch-and-exp-date-adjustment/batch-and-exp-date-adjustment.service';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { debug } from 'console';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class UserDetailComponent implements OnInit {

  submitted = false;
  data1: [];
  StoreList: any = [];
  RoleList: any = [];
  DoctortypecmbList: any = [];
  UserForm: FormGroup;
  filteredOptionsRole: Observable<string[]>;
  filteredOptionsDoctorName: Observable<string[]>;
  filteredOptionsStorename: Observable<string[]>;
  filteredOptionswebrollName: Observable<string[]>;


  isRoleSelected: boolean = false;
  isDoctorSelected: boolean = false;
  isStoreSelected: boolean = false;
  iswebrollSelected: boolean = false;
  vUserId: any = 0;
  registerObj = new UserDetail({});
  msg: any;
  DocotorList: any = [];
  RoleNameList: any = [];
  WebRoleNameList: any = [];
  snackmessage: any;
  screenFromString = 'admission-form';
  Store1List: any = [];
  isLoading: string;
  vPharExpOpt:any;
  vPharIPOpt:any;
  vPharOPOpt:any;
  vMobileNo:any;

  constructor(public _UserService: AdministrationService,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
    public _BatchAndExpDateAdjustmentService: BatchAndExpDateAdjustmentService,
    private _loggedService: AuthenticationService,
    public dialogRef: MatDialogRef<UserDetailComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {

    this.UserForm = this.createPesonalForm();
    if (this.data) {
      console.log(this.data)
      this.registerObj = this.data.registerObj;
      this.vUserId = this.registerObj.UserId;
      this.vPharExpOpt = this.registerObj.PharExpOpt;
      this.vPharIPOpt = this.registerObj.PharIPOpt;
      this.vPharOPOpt = this.registerObj.PharOPOpt;
      if(this.registerObj.isDiscApply == true){
        this.UserForm.get('IsDicslimit').setValue(true)
        this.DisclimitFlag = true;
        this.UserForm.get('DiscLimitPer').setValue(this.registerObj.DiscApplyPer)
      }else{
        this.UserForm.get('IsDicslimit').setValue(false)
        this.DisclimitFlag = false;
        this.UserForm.get('DiscLimitPer').setValue('')
      }
    }
    console.log(this.registerObj)
    this.getDoctorlist1();
    this.getRoleNamelist1();
    this.getwebRoleNamelist1();
    this.gePharStoreList1();
    this.getHospitalList1(); 
  }

  createPesonalForm() {
    return this._formBuilder.group({
      MobileNo:'',
      HospitalId:'',
      FirstName: '',
      LastName: '',
      LoginName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9_]*')]],
      Password: '',
      StoreId: '',
     MailId: [
        "",
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
    ],
    RoleId: '',
    WebroleId:'',
      DoctorId: '',
      IsDoctor: '',
      
     // RoleName: '',
    // Status: '1',
       Poverify: '',
      Ipoverify: '',
      Grnverify: '',
      Indentverify: '',
      IIverify: '',
      CollectionInformation: '',
      CurrentStock: '',
      PatientInformation: '',
      ViewBrowseBill: '',
      bdays: '',
      IsAddChargeDelete: '',
      IsPharmacyBalClearnace: '',
      BedStatus: '',
      IsActive: 'true',
      PharExpOpt:'',
      PharIPOpt:'',
      PharOPOpt:'',
      IsDicslimit:'',
      DiscLimitPer:''
    });

  }
  HospitalList1: any = [];
  getHospitalList1() {
    this._UserService.getHospitalCombo().subscribe(data => {
      this.HospitalList1 = data;
      this.UserForm.get('HospitalId').setValue(this.HospitalList1[0]);
    })
  }
  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._UserService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this.UserForm.get('StoreId').setValue(this.StoreList[0]);
    });
  }

  getDoctorlist() {
    this._UserService.getDoctorMasterCombo().subscribe(data => {
      this.DoctortypecmbList = data;
      // this.filteredDoctor.next(this.DoctortypecmbList.slice());
    })
  }
  StoreId: any;
  gePharStoreList1() {
    this._UserService.getStoreList().subscribe(data => {
      this.Store1List = data;
      this.filteredOptionsStorename = this.UserForm.get('StoreId').valueChanges.pipe(
        startWith(''), 
        map(value => value ? this._filterStore(value) : this.Store1List.slice()),
      );
      if (this.data) {
      const ddValue = this.Store1List.filter(c => c.StoreId == this.registerObj.StoreId);
      this.UserForm.get('StoreId').setValue(ddValue[0]);
      this.UserForm.updateValueAndValidity();
      return;
      } 
    });
  }
  private _filterStore(value: any): string[] {
    if (value) {
      const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
      return this.Store1List.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextStoreName(option) {
    return option && option.StoreName ? option.StoreName : '';
  }
  getDoctorlist1() {
    this._UserService.getDoctorMasterCombo().subscribe(data => {
      this.DocotorList = data;
      console.log(this.DocotorList)
      this.filteredOptionsDoctorName = this.UserForm.get('DoctorId').valueChanges.pipe(
        startWith(''), 
        map(value => value ? this._filterDoctor(value) : this.DocotorList.slice()),
      );
      if (this.data) {
        if(this.registerObj.DoctorID){
          this.docflag = true
        }
        const ddValue = this.DocotorList.filter(c => c.DoctorId == this.registerObj.DoctorID);
        this.UserForm.get('DoctorId').setValue(ddValue[0]);
        this.UserForm.updateValueAndValidity();
        return;
      }
    });
  }
  private _filterDoctor(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.DocotorList.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextDoctorName(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }

  getRoleNamelist1() {
    // debugger
    this._UserService.getRoleCombobox().subscribe(data => {
      this.RoleNameList = data;
      this.filteredOptionsRole = this.UserForm.get('RoleId').valueChanges.pipe(
        startWith(''), 
        map(value => value ? this._filterRole(value) : this.RoleNameList.slice()),
      );
      if (this.data) {
        const ddValue = this.RoleNameList.filter(c => c.RoleId == this.registerObj.RoleId);
        this.UserForm.get('RoleId').setValue(ddValue[0]);
        this.UserForm.updateValueAndValidity();
        return;
      }
    });
  }
//role master
  private _filterRole(value: any): string[] {
    if (value) {
      const filterValue = value && value.RoleName ? value.RoleName.toLowerCase() : value.toLowerCase();

      return this.RoleNameList.filter(option => option.RoleName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextRoleName(option) {
    return option && option.RoleName ? option.RoleName : '';
  }

  getwebRoleNamelist1() {
    this._UserService.getwebRoleCombobox().subscribe(data => {
      this.WebRoleNameList = data;
      
    this.filteredOptionswebrollName = this.UserForm.get('WebroleId').valueChanges.pipe(
      startWith(''), 
      map(value => value ? this._filterwebRole(value) : this.WebRoleNameList.slice()),
    );
      console.log(data)
      if (this.data) {
        const ddValue = this.WebRoleNameList.filter(c => c.RoleId == this.registerObj.WebRoleId);
        this.UserForm.get('WebroleId').setValue(ddValue[0]);
        this.UserForm.updateValueAndValidity();
        return;
      }
    });
  }
//web role master
  private _filterwebRole(value: any): string[] {
    if (value) {
      const filterValue = value && value.RoleName ? value.RoleName.toLowerCase() : value.toLowerCase();
      return this.WebRoleNameList.filter(option => option.RoleName.toLowerCase().includes(filterValue));
    }
  }

  getOptionTextwebroleName(option) {
    return option && option.RoleName ? option.RoleName : '';
  }
  chkdisclimit(){
    if(this.UserForm.get('DiscLimitPer').value > 100){
      this.toastr.warning('Enter Discount % lessthan 100 or graterthan 0', 'warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this.UserForm.get('DiscLimitPer').setValue('');
    }
  }
  @ViewChild('fname') fname: ElementRef;
  @ViewChild('lname') lname: ElementRef;
  @ViewChild('loginname') loginname: ElementRef;
  @ViewChild('password') password: ElementRef;
  @ViewChild('mailid') mailid: ElementRef;
  @ViewChild('role') role: ElementRef;
  @ViewChild('MobileNo') MobileNo: ElementRef;
  @ViewChild('docname') docname: ElementRef;
  @ViewChild('webrole') webrole: ElementRef; 
  @ViewChild('storeId') storeId: ElementRef;
  // @ViewChild('Fax') Fax: ElementRef;
  onEnterUnit(event) {
    if (event.which === 13) {
      this.MobileNo.nativeElement.focus();
    }
  }

  onEnterMobileno(event) {
    if (event.which === 13) {
      this.fname.nativeElement.focus();
    }
  }
  onEnterfname(event) {
    if (event.which === 13) {
      this.lname.nativeElement.focus();
    }
  }

  onEnterlname(event) {
    if (event.which === 13) {
      this.loginname.nativeElement.focus();
    }
  }

  onEnterloginname(event) {
    if (event.which === 13) {
      this.password.nativeElement.focus();
    }
  }
  onEnterpassword(event) {
    if (event.which === 13) {
      this.mailid.nativeElement.focus();
    }
  }
  onEntermailid(event) {
    if (event.which === 13) {
      this.role.nativeElement.focus();
    }
  }

  onEnterrole(event) {
    if (event.which === 13) {
      this.storeId.nativeElement.focus();
    }
  }
  onEnterdocName(event) {
    if (event.which === 13) {
    }
  }
  onEnterStore(event) {
    if (event.which === 13) {
      this.webrole.nativeElement.focus();
    }
  }

 
  docflag: boolean = false;
  chkdoctor(event) {
    // debugger
    if (this.UserForm.get('IsDoctor').value  == true) {
      this.docflag = true  
    }else{
      this.docflag = false 
    }            
  }
  DisclimitFlag: boolean = false;
  chkDiscLimit(event) { 
    if (event.checked  == true) {
      this.DisclimitFlag = true 
    }else{
      this.DisclimitFlag = false
      this.UserForm.get('DiscLimitPer').setValue('')
    }            
  }
  onClose() {
   this.dialogRef.close();
   this.UserForm.reset();
   this.UserForm.get('HospitalId').setValue(this.HospitalList1[0]);
  }
  vFirstName:any;
  vLastName:any;
  vUserName:any;
  vPassword:any;
  vEmail:any;
  vStoreId:any;
  vRoleName:any;
  mobileno:number= 0;
  Save() {
// debugger 

    if ((this.vFirstName == '' || this.vFirstName == null || this.vFirstName == undefined)) {
      this.toastr.warning('Please enter a FirstName', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vLastName == '' || this.vLastName == null || this.vLastName == undefined)) {
      this.toastr.warning('Please enter a LastName', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vUserName == '' || this.vUserName == null || this.vUserName == undefined)) {
      this.toastr.warning('Please enter a UserName', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    // if ((this.vPassword == '' || this.vPassword == null || this.vPassword == undefined)) {
    //   this.toastr.warning('Please enter a Password', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    if ((this.vEmail == '' || this.vEmail == null || this.vEmail == undefined)) {
      this.toastr.warning('Please enter a Email', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vStoreId == '' || this.vStoreId == null || this.vStoreId == undefined)) {
      this.toastr.warning('Please enter a StoreId', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vRoleName == '' || this.vRoleName == null || this.vRoleName == undefined)) {
      this.toastr.warning('Please enter a RoleName', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }  
    if (this.docflag == true) {
      if(!this.UserForm.get('DoctorId').value){
        this.toastr.warning('Please select Doctor Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }  
    }
    if(this.UserForm.get('IsDicslimit').value == true){ 
      if ((this.UserForm.get('DiscLimitPer').value == '' || this.UserForm.get('DiscLimitPer').value == 0 
      || this.UserForm.get('DiscLimitPer').value == undefined)) {
        this.toastr.warning('Please enter a Discount % ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      } 
    }  


    let DoctorID = 0
    if (this.docflag == true) {
      if(this.UserForm.get('DoctorId').value){
        DoctorID= this.UserForm.get('DoctorId').value.DoctorId
      }  
    }  
    
    let PharmExpOpt = 0;
    let PharmIPOpt = false;
    let PharmOPOpt = false; 
      if(this.UserForm.get('PharExpOpt').value){
        PharmExpOpt = 1
      }
      PharmIPOpt = this.UserForm.get('PharIPOpt').value 
      PharmOPOpt = this.UserForm.get('PharOPOpt').value 

      let isDiscApply = 0
      if(this.UserForm.get('IsDicslimit').value == true){
        isDiscApply =  1
        } 
         
    this.mobileno = parseInt(this.UserForm.get('MobileNo').value) ||  0;
    if (this.vUserId == 0) {
      this.isLoading = 'submit'; 
      var m_data = {
        "loginInsert": {
          "FirstName": this.UserForm.get('FirstName').value || '',
          "LastName": this.UserForm.get('LastName').value || '',
          "userName": this.UserForm.get('LoginName').value || '',
          "Password": this.UserForm.get('Password').value || 0,
          "addedBy": this._loggedService.currentUserValue.user.id,
          "isActive": this.UserForm.get('IsActive').value || 0,
          "StoreId": this.UserForm.get('StoreId').value.StoreId || 0,
          "RoleId": this.UserForm.get('RoleId').value.RoleId || 0,
          "isDoctorType": this.UserForm.get('IsDoctor').value || 0,
          "doctorID":  DoctorID,
          "isPOVerify": this.UserForm.get('Poverify').value || 0,
          "isGRNVerify": this.UserForm.get('Grnverify').value || 0,
          "isCollection": this.UserForm.get('CollectionInformation').value || 0,
          "isBedStatus": this.UserForm.get('BedStatus').value  || 0,
          "isCurrentStk": this.UserForm.get('CurrentStock').value || 0,
          "isPatientInfo": this.UserForm.get('PatientInformation').value || 0,
          "isDateInterval": false,
          "isDateIntervalDays": 0,
          "mailId": this.UserForm.get('MailId').value || 0,
          "MailDomain": " ",// this.UserForm.get('MailDomain').value || 0,
          "addChargeIsDelete": this.UserForm.get('IsAddChargeDelete').value || 0,
          "isIndentVerify": this.UserForm.get('Indentverify').value || 0,
          "isPOInchargeVerify": this.UserForm.get('Ipoverify').value || 0,
          "isInchIndVfy": this.UserForm.get('IIverify').value || 0,
          "WebRoleId": this.UserForm.get('WebroleId').value.RoleId ,  
          "PharExpOpt": PharmExpOpt,
          "PharIPOpt": PharmIPOpt,
          "PharOPOpt": PharmOPOpt ,  
          "unitId": this.UserForm.get('HospitalId').value.HospitalId || 0,  
          "mobileNo": this.mobileno,
          "isDiscApply":  isDiscApply, 
          "discApplyPer": this.UserForm.get('DiscLimitPer').value || 0 
         
          // "ViewBrowseBill": this.UserForm.get('ViewBrowseBill').value || 0, 
          //"IsPharmacyBalClearnace": this.UserForm.get('IsPharmacyBalClearnace').value || 0,
        
        }
      }

      console.log(m_data);

      this._UserService.UserInsert(m_data).subscribe(response => {
        console.log(response);
        if (response) {
          this.toastr.success('User Detail Save', 'Save !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
        } else {
          this.toastr.error('API Error!', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
        this._matDialog.closeAll();
      });
    }
    else {

      var m_data1 = {
        "loginUpdate": {
          "UserId": this.vUserId,
          "FirstName": this.UserForm.get('FirstName').value || '',
          "LastName": this.UserForm.get('LastName').value || '',
          "userName": this.UserForm.get('LoginName').value || '',
          // "Password": this.UserForm.get('Password').value || 0,
          "addedBy": this._loggedService.currentUserValue.user.id,
          "isActive": this.UserForm.get('IsActive').value || 0,
          "StoreId": this.UserForm.get('StoreId').value.StoreId || 0,
          "RoleId": this.UserForm.get('RoleId').value.RoleId || 0,
          "isDoctorType":this.UserForm.get('IsDoctor').value || 0,
          "doctorID":  DoctorID, 
          "isPOVerify": this.UserForm.get('Poverify').value || 0,
          "isPOInchargeVerify": this.UserForm.get('Ipoverify').value || 0,
          "isGRNVerify": this.UserForm.get('Grnverify').value || 0,
          "isBedStatus": this.UserForm.get('BedStatus').value || 0,
          "isCollection":  this.UserForm.get('CollectionInformation').value || 0,
          "isIndentVerify": this.UserForm.get('Indentverify').value || 0,
          "isInchIndVfy": this.UserForm.get('IIverify').value || 0, 
          "isCurrentStk": this.UserForm.get('CurrentStock').value || 0,
          "isPatientInfo": this.UserForm.get('PatientInformation').value || 0,
          "isDateInterval": false,
          "isDateIntervalDays": 0,
          "mailId": this.UserForm.get('MailId').value || 0,
          "MailDomain": '',//this.UserForm.get('MailDomain').value || 0,
          // "ViewBrowseBill": this.UserForm.get('ViewBrowseBill').value || 0,
          "addChargeIsDelete": this.UserForm.get('IsAddChargeDelete').value || 0,
          "IsPharmacyBalClearnace": this.UserForm.get('IsPharmacyBalClearnace').value || 0,
          "WebRoleId": this.UserForm.get('WebroleId').value.RoleId ,
          "PharExpOpt":PharmExpOpt,
          "PharIPOpt": PharmIPOpt,
          "PharOPOpt":PharmOPOpt ,   
          "unitId": this.UserForm.get('HospitalId').value.HospitalId || 0,  
          "mobileNo": this.mobileno,
          "isDiscApply": isDiscApply, 
          "discApplyPer": this.UserForm.get('DiscLimitPer').value || 0 
        }
      }

      console.log(m_data1);

      this._UserService.UserUpdate(m_data1).subscribe(response => {
        console.log(response);
        if (response) {
          this.toastr.success('User Detail Update', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
        } else {
          this.toastr.error('API Error!', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });

      this._matDialog.closeAll();
    }
  }


  myFunction(s) {
    this.snackmessage = s;
    console.log(s);
    console.log(this.snackmessage);
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 5000);
  }
}


export class UserDetail {
  UserId: any;
  UserName: any;
  UserLoginName: any;
  Password: any;
  StoreId: any;
  RoleId: any;
  MailDomain: any;
  DoctorId: any;
  Status: boolean;
  poverify: any;
  Ipoverify: any;
  Grnverify: any;
  Indentverify: any;
  IIverify: any;
  DoctorID: any;
  isDiscApply:any;
  DiscApplyPer:any;
  FirstName: any;
  LastName: any;
  IsActive: boolean;
  AddedBy: any;
  RoleName: any;
  WebRoleId: any;
  StoreName: any;
  IsDoctorType: any;

  DoctorName: any;
  IsPOVerify: any;
  IsGRNVerify: any;
  IsCollection: any;
  IsBedStatus: any;
  IsCurrentStk: any;
  IsPatientInfo: any;
  IsDateInterval: any;
  IsDateIntervalDays: any;
  MailId: any;
  bdays: any;
  AddChargeIsDelete: any;
  IsIndentVerify: any;
  IsInchIndVfy: any;

  ViewBrowseBill:any;
  IsPharmacyBalClearnace:any;
  IsAddChargeDelete:any;
  PharExpOpt:any;
  PharIPOpt:any;
  PharOPOpt:any;
  /**
   * Constructor
   *
   * @param UserDetail
   */

  constructor(UserDetail) {
    {
      this.UserId = UserDetail.UserId || '';
      this.UserName = UserDetail.UserName || '';
      this.UserLoginName = UserDetail.UserLoginName || '';
      this.Password = UserDetail.Password || 0;
      this.StoreId = UserDetail.StoreId || '';
      this.RoleId = UserDetail.RoleId || '';
      this.MailDomain = UserDetail.MailDomain || '';
      this.DoctorId = UserDetail.DoctorId || 0;
      this.DoctorID = UserDetail.DoctorID || 0;
      this.Status = UserDetail.Status || '1';
      this.poverify = UserDetail.poverify || '';
      this.Ipoverify = UserDetail.Ipoverify || '';
      this.Grnverify = UserDetail.Grnverify || '';
      this.WebRoleId = UserDetail.WebRoleId || 0;
      this.Indentverify = UserDetail.Indentverify || '';
      this.IIverify = UserDetail.IIverify || '';
      this.FirstName = UserDetail.FirstName || '';
      this.LastName = UserDetail.LastName || '';
      this.IsActive = UserDetail.IsActive || 'true';
      this.AddedBy = UserDetail.AddedBy || '';
      this.RoleName = UserDetail.RoleName || ''; 
      this.StoreName = UserDetail.StoreName || '';
      this.IsDoctorType = UserDetail.IsDoctorType || ''; 
      this.DoctorName = UserDetail.DoctorName || '';
      this.IsPOVerify = UserDetail.IsPOVerify || '';
      this.IsGRNVerify = UserDetail.IsGRNVerify || '';
      this.IsCollection = UserDetail.IsCollection || '';
      this.IsBedStatus = UserDetail.IsBedStatus || '';
      this.IsCurrentStk = UserDetail.IsCurrentStk || '';
      this.IsPatientInfo = UserDetail.IsPatientInfo || '';
      this.IsDateInterval = UserDetail.IsDateInterval || '';
      this.IsDateIntervalDays = UserDetail.IsDateIntervalDays || '';
      this.MailId = UserDetail.MailId || '';
      this.bdays = UserDetail.bdays || 0;
      this.AddChargeIsDelete = UserDetail.AddChargeIsDelete || '';
      this.IsIndentVerify = UserDetail.IsIndentVerify || '';
      this.IsInchIndVfy = UserDetail.IsInchIndVfy || '';
      this.ViewBrowseBill = UserDetail.ViewBrowseBill || '';
      this.IsPharmacyBalClearnace=UserDetail.IsPharmacyBalClearnace || 0;
      this.IsAddChargeDelete =UserDetail.IsAddChargeDelete || 0;
    }

  }
}

