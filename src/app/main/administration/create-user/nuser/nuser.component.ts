import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { CreateUserService } from '../create-user.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

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
    UserForm: FormGroup;
    
    vPharExpOpt:any;
    vPharIPOpt:any;
    vPharOPOpt:any;

    registerObj = new UserDetail({});
    vUserId: any = 0;

    autocompleteModeUnitName: string = "Hospital"; 
    autocompleteModeRoleName: String = "Role";
    autocompleteModeStoreName: String = "Store";
    autocompleteModeWebRoleName: String = "WebRole";


    constructor(
        public _CreateUserService: CreateUserService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<NUserComponent>
    ) { }
    
    ngOnInit(): void {
        this.myuserform = this._CreateUserService.createuserForm();
        // this.vPharExpOpt = this.registerObj.PharExpOpt;
        // this.vPharIPOpt = this.registerObj.PharIPOpt;
        // this.vPharOPOpt = this.registerObj.PharOPOpt;
        // this.UserForm = this.createPesonalForm();
        //   if (this.data) {
        //     console.log(this.data)
        //     this.registerObj = this.data.registerObj;
        //     this.vUserId = this.registerObj.UserId;
        //     this.vPharExpOpt = this.registerObj.PharExpOpt;
        //     this.vPharIPOpt = this.registerObj.PharIPOpt;
            
        //     this.vPharOPOpt = this.registerObj.PharOPOpt;
        //     if(this.registerObj.isDiscApply == true){
        //       this.UserForm.get('IsDicslimit').setValue(true)
        //       this.DisclimitFlag = true;
        //       this.UserForm.get('DiscLimitPer').setValue(this.registerObj.DiscApplyPer)
        //     }else{
        //       this.myuserform.get('IsDicslimit').setValue(false)
        //       this.DisclimitFlag = false;
        //       this.myuserform.get('DiscLimitPer').setValue('')
        //     }
        //   }
        if((this.data?.userId??0) > 0)
        {
            this.isActive=this.data.isActive
            this.myuserform.patchValue(this.data);
        }
    }

    createPesonalForm() {
        return this._formBuilder.group({
            mobileNo:'',
        HospitalId: '1',
        firstName: '',
        lastName: '',
        userName: [''],
        password: '',
        storeId: '',
        mailId: [ ""],
        roleId: '1',
        webRoleId:'1',
        doctorId: '',
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

    onSubmit() {
        if (!this.myuserform.invalid) 
        {
            debugger
            console.log("Create User JSON :-", this.myuserform.value);
            
            this._CreateUserService.insertuser(this.myuserform.value).subscribe((data) => {
            this.toastr.success(data.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        } 
        else {
            this.toastr.warning('please check from is invalid', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
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
            mobileNo:[],
            firstName:[],
            lastName:[],
            userName:[],
            password:[],
            mailId:[],
            roleId:[],
            storeId:[],
            webRoleId:[],
        };
    }

    docflag: boolean = false;
    chkdoctor(event) {
        // debugger
        if (this.myuserform.get('IsDoctor').value  == true) {
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

