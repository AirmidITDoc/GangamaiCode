import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { CreateUserService } from '../create-user.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
    selector: 'app-nuser',
    templateUrl: './nuser.component.html',
    styleUrls: ['./nuser.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NUserComponent implements OnInit{
    myuserform: FormGroup;
    isActive:boolean=true;
    
    vPharExpOpt:any;
    vPharIPOpt:any;
    vPharOPOpt:any;

    registerObj = new UserDetail({});
    vUserId: any = 0;
    isLoading: string;

    autocompleteModeUnitName: string = "Hospital"; 
    autocompleteModeRoleName: String = "Role";
    autocompleteModeStoreName: String = "Store";
    autocompleteModeWebRoleName: String = "WebRole";
    autocompleteModedoctor: string = "ConDoctor";

    constructor(
        public _CreateUserService: CreateUserService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _loggedService: AuthenticationService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<NUserComponent>
    ) { }
    
    ngOnInit(): void {
        debugger
        this.myuserform = this._CreateUserService.createuserForm();
        // this.vPharExpOpt = this.registerObj.PharExpOpt;
        // this.vPharIPOpt = this.registerObj.PharIPOpt;
        // this.vPharOPOpt = this.registerObj.PharOPOpt;
        // this.myuserform = this.createPesonalForm();
        //   if (this.data) {
        //     console.log(this.data)
        //     this.registerObj = this.data.registerObj;
        //     this.vUserId = this.registerObj.UserId;
        //     this.vPharExpOpt = this.registerObj.PharExpOpt;
        //     this.vPharIPOpt = this.registerObj.PharIPOpt;
            
        //     this.vPharOPOpt = this.registerObj.PharOPOpt;
        //     if(this.registerObj.isDiscApply == true){
        //       this.myuserform.get('IsDicslimit').setValue(true)
        //       this.DisclimitFlag = true;
        //       this.myuserform.get('DiscLimitPer').setValue(this.registerObj.DiscApplyPer)
        //     }else{
        //       this.myuserform.get('IsDicslimit').setValue(false)
        //       this.DisclimitFlag = false;
        //       this.myuserform.get('DiscLimitPer').setValue('')
        //     }
        //   }
        if((this.data?.userId??0) > 0)
        {
            console.log("data:", this.data)
            this.isActive=this.data.isActive
            this.myuserform.patchValue(this.data);
        }
    }

    createPesonalForm() {
        return this._formBuilder.group({
            mobileNo:['', 
                [   
                    Validators.required,
                    Validators.minLength(10),
                    Validators.maxLength(10),
                    Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
                ]],
        HospitalId: '1',
        firstName: ['', [
            Validators.required,
            Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
        ]],
        lastName: ['', [
            Validators.required,
            Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
        ]],
        userName: ['', 
            [
                Validators.required, 
                Validators.pattern('[a-zA-Z0-9_]*')
            ]],
        password: [
            "",
            Validators.pattern("^\\d{0,12}(\\.\\d*)?$")
        ],
        storeId: '',
        mailId:  [
            "",
            Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
        ],
        roleId: '1',
        webRoleId:'1',
        DoctorID: '',
        IsDoctor: '',
        userId:'0',
        roomId:'',
        browseDay:'',
        isActive:true,
        
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
        ViewBrowseBill: '0',
        IsAddChargeDelete: '',
        IsPharmacyBalClearnace: '',
        BedStatus: '',
        IsActive: 'true',
        PharExpOpt:'',
        PharIPOpt:'',
        PharOPOpt:'',
        IsDicslimit:'',
        DiscLimitPer:'',
        });
    }

    // onSubmit() {
    //     if (!this.myuserform.invalid) 
    //     {
    //         debugger
    //         console.log("Create User JSON :-", this.myuserform.value);
            
    //         this._CreateUserService.insertuser(this.myuserform.value).subscribe((data) => {
    //         this.toastr.success(data.message);
    //             this.onClear(true);
    //         }, (error) => {
    //             this.toastr.error(error.message);
    //         });
    //     } 
    //     else {
    //         this.toastr.warning('please check from is invalid', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //             });
    //             return;
    //     }
    // }

    onSubmit() {
        debugger        
                    
            let PharmExpOpt = 0;
            let PharmIPOpt = false;
            let PharmOPOpt = false; 
              if(this.myuserform.get('PharExpOpt').value){
                PharmExpOpt = 1
              }
              PharmIPOpt = this.myuserform.get('PharIPOpt').value 
              PharmOPOpt = this.myuserform.get('PharOPOpt').value 
        
              let isDiscApply = 0
              if(this.myuserform.get('IsDicslimit').value == true){
                isDiscApply =  1
                } 
                 
            if (!this.data?.userId) {
              this.isLoading = 'submit'; 
              var m_data = {            
                "userId": 0,
                "firstName": this.myuserform.get('firstName').value || '',
                "lastName": this.myuserform.get('lastName').value || '',
                "userName": this.myuserform.get('userName').value || '',
                "password": this.myuserform.get('password').value || 0,
                "roleId": this.myuserform.get('roleId').value || 1,
                "storeId": this.myuserform.get('storeId').value || 0,
                "isDoctorType": this.myuserform.get('isDoctorType').value || 0,
                "doctorId": this.myuserform.get('DoctorID').value || 0,
                "isPoverify": this.myuserform.get('isPoverify').value || 0,
                "isGrnverify": this.myuserform.get('isGrnverify').value || 0,
                "isCollection": this.myuserform.get('CollectionInformation').value || 0,
                "isBedStatus": this.myuserform.get('BedStatus').value  || 0,
                "isCurrentStk": this.myuserform.get('CurrentStock').value || 0,
                "isPatientInfo": this.myuserform.get('PatientInformation').value || 0,
                "isDateInterval": true,
                "isDateIntervalDays": 0,
                "mailId": this.myuserform.get('mailId').value || 0,
                "mailDomain": "1",
                "loginStatus": true,
                "addChargeIsDelete": this.myuserform.get('IsAddChargeDelete').value,
                "isIndentVerify": this.myuserform.get('Indentverify').value,
                "isPoinchargeVerify": this.myuserform.get('Ipoverify').value,
                "isRefDocEditOpt": this.myuserform.get('isRefDocEditOpt').value,
                "isInchIndVfy": this.myuserform.get('IIverify').value,
                "webRoleId": this.myuserform.get('webRoleId').value || 0, 
                "userToken": "string",
                "pharExtOpt": this.myuserform.get('PharExpOpt').value || 0,
                "pharOpopt":this.myuserform.get('PharOPOpt').value || 0,
                "pharIpopt": this.myuserform.get('PharIPOpt').value || 0,
              }
        
              console.log(m_data);
        
              this._CreateUserService.insertuser(m_data).subscribe(response => {
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
                    "userId": this.data?.userId,
                    "firstName": this.myuserform.get('firstName').value || '',
                    "lastName": this.myuserform.get('lastName').value || '',
                    "userName": this.myuserform.get('userName').value || '',
                    "password": this.myuserform.get('password').value || 0,
                    "roleId": this.myuserform.get('roleId').value || 1,
                    "storeId": this.myuserform.get('storeId').value || 0,
                    "isDoctorType": this.myuserform.get('isDoctorType').value || 0,
                    "doctorId": this.myuserform.get('DoctorID').value || 0,
                    "isPoverify": this.myuserform.get('isPoverify').value || 0,
                    "isGrnverify": this.myuserform.get('isGrnverify').value || 0,
                    "isCollection": this.myuserform.get('CollectionInformation').value || 0,
                    "isBedStatus": this.myuserform.get('BedStatus').value  || 0,
                    "isCurrentStk": this.myuserform.get('CurrentStock').value || 0,
                    "isPatientInfo": this.myuserform.get('PatientInformation').value || 0,
                    "isDateInterval": true,
                    "isDateIntervalDays": 0,
                    "mailId": this.myuserform.get('mailId').value || 0,
                    "mailDomain": "1",
                    "loginStatus": true,
                    "addChargeIsDelete": this.myuserform.get('IsAddChargeDelete').value,
                    "isIndentVerify": this.myuserform.get('Indentverify').value,
                    "isPoinchargeVerify": this.myuserform.get('Ipoverify').value,
                    "isRefDocEditOpt": this.myuserform.get('isRefDocEditOpt').value,
                    "isInchIndVfy": this.myuserform.get('IIverify').value,
                    "webRoleId": this.myuserform.get('webRoleId').value || 0, 
                    "userToken": "string",
                    "pharExtOpt": this.myuserform.get('PharExpOpt').value || 0,
                    "pharOpopt":this.myuserform.get('PharOPOpt').value || 0,
                    "pharIpopt": this.myuserform.get('PharIPOpt').value || 0,
                  }
            
                  console.log(m_data1);
            
                  this._CreateUserService.updateuser(m_data1).subscribe(response => {
                    console.log(response);
                    if (response) {
                      this.toastr.success('User Detail Update', 'Update !', {
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
          }

    unitname = 0;
    rolename = 0;
    storename = 0;
    webrolename = 0;

    selectChangeUnitName(obj: any){
        console.log(obj);
        this.unitname=obj.value
    }
    
    selectChangeRoleName(obj: any){
        console.log(obj);
        this.rolename=obj.value
    }
    
    selectChangeStoreName(obj: any){
        console.log(obj);
        this.storename=obj.value
    }

    selectChangeWebRoleName(obj: any){
        console.log(obj);
        this.webrolename=obj.value
    }

    getValidationMessages() {
        return {
            roomId:[],
            unitId:[],
            mobileNo:[
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "required", Message: "Mobile No is required" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 10 digits not allowed." }
            ],
            firstName:[
                { name: "required", Message: "First Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            lastName:[
                { name: "required", Message: "First Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            userName:[],
            password:[],
            mailId:[],
            roleId:[],
            storeId:[],
            webRoleId:[],
            DoctorID:[],
        };
    }

    docflag: boolean = false;
    chkdoctor(event) {
        // debugger
        if (this.myuserform.get('isDoctorType').value  == true) {
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
        this.myuserform.get('DiscLimitPer').setValue('')
        }            
    }

    onClear(val: boolean) 
    {
        this.dialogRef.close(val);
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
    isPoverify: any;
    Ipoverify: any;
    Grnverify: any;
    isGrnverify:any;
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
    isPOInchargeVerify: any;
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
        this.isPoverify = UserDetail.isPoverify || '';
        this.Ipoverify = UserDetail.Ipoverify || '';
        this.Grnverify = UserDetail.Grnverify || '';
        this.isGrnverify = UserDetail.isGrnverify || '';
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
        this.isPOInchargeVerify = UserDetail.isPOInchargeVerify || '',
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

