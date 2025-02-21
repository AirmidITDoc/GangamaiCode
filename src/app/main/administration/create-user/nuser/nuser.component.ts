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
    vdoctorID:any;
    regobj:any;
    visGRNVerify: any;
    visPOVerify:any;
    visIndentVerify:any;
    visInchIndVfy:any;
    vpharExtOpt:any;
    vpharIPOpt:any;
    vpharOPOpt:any;
    visCollection:any;
    visPatientInfo:any;
    visBedStatus:any;
    visCurrentStk:any;
    vaddChargeIsDelete:any;

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
        this.myuserform.get("roomId").setValue("1")
        if((this.data?.userId??0) > 0)
        {
          this.myuserform.patchValue(this.data);
          debugger
            console.log("data:", this.data)
            this.regobj=this.data;
            this.isActive=this.regobj.isActive
            this.visGRNVerify=this.regobj.isGRNVerify
            this.visPOVerify=this.regobj.isPOVerify
            this.visIndentVerify=this.regobj.isIndentVerify
            this.visInchIndVfy=this.regobj.isInchIndVfy
            this.vpharExtOpt=this.regobj.pharExtOpt
            this.vpharIPOpt=this.regobj.pharIPOpt
            this.vpharOPOpt=this.regobj.pharOPOpt
            this.visCollection=this.regobj.isCollection
            this.visPatientInfo=this.regobj.isPatientInfo
            this.visBedStatus=this.regobj.isBedStatus
            this.visCurrentStk=this.regobj.isCurrentStk
            this.vaddChargeIsDelete=this.regobj.addChargeIsDelete
            this.myuserform.get("doctorId").setValue(this.regobj.doctorID)
            if(this.regobj.isDoctorType==true)
              this.docflag=true
            else
              this.docflag=false
            
            // 
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

    onSubmit() {
        debugger       
        if (!this.myuserform.get("firstName")?.value) {
          this.toastr.warning('Please enter a First Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        if (!this.myuserform.get("lastName")?.value) {
          this.toastr.warning('Please enter a Last Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        if (!this.myuserform.get("userName")?.value) {
          this.toastr.warning('Please enter a User Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }

        if (!this.myuserform.get("password")?.value) {
          this.toastr.warning('Please enter a Password', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        if (!this.myuserform.get("mailId")?.value) {
          this.toastr.warning('Please enter a Email', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        if (!this.myuserform.get("roleId")?.value) {
          this.toastr.warning('Please select a Role Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }

        if (!this.myuserform.get("storeId")?.value) {
          this.toastr.warning('Please select a Store Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }     
        
        if (!this.myuserform.get("webRoleId")?.value) {
          this.toastr.warning('Please select a WebRole Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }  
        if (this.docflag == true) {
          if(!this.myuserform.get('doctorId')?.value){
            this.toastr.warning('Please select Doctor Name', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }  
        }
        if(this.DisclimitFlag == true){ 
          if ((this.myuserform.get('DiscLimitPer').value == '' || this.myuserform.get('DiscLimitPer').value == 0 
          || this.myuserform.get('DiscLimitPer').value == undefined)) {
            this.toastr.warning('Please enter a Discount % ', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          } 
        }
                 
            let formData = { ...this.myuserform.value };
    
            formData.pharExtOpt = formData.pharExtOpt === true ? 1 : 0;
            formData.pharOpopt = formData.pharOpopt === true ? 1 : 0;
            formData.pharIpopt = formData.pharIpopt === true ? 1 : 0;
            formData.isPoverify = formData.isPoverify ?? false;
            formData.addChargeIsDelete = formData.addChargeIsDelete ?? false;
            formData.isCollection = formData.isCollection ?? false;
            formData.isCurrentStk = formData.isCurrentStk ?? false;
            formData.isBedStatus = formData.isBedStatus ?? false;
            formData.isGrnverify = formData.isGrnverify ?? false;
            formData.isInchIndVfy = formData.isInchIndVfy ?? false;
            formData.isIndentVerify = formData.isIndentVerify ?? false;
            formData.isPatientInfo = formData.isPatientInfo ?? false;
            formData.isPoinchargeVerify = formData.isPoinchargeVerify ?? false;
            formData.isDoctorType = formData.isDoctorType ?? false;
            formData.IsDicslimit = formData.IsDicslimit ?? false;
        
            console.log("MenuMaster json:", formData);

            this._CreateUserService.insertuser(formData).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
            }, (error) => {
              this.toastr.error(error.message);
            });                
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
              { name: "required", Message: "Last Name is required" },
              { name: "maxLength", Message: "Enter only upto 50 chars" },
              { name: "pattern", Message: "only char allowed." }
          ],
          userName:[
            { name: "required", Message: "User Name is required" },
            { name: "maxLength", Message: "Enter only upto 50 chars" },
          ],
          password:[
            { name: "required", Message: "Password is required" },
          ],
          mailId:[
             { name: "required", Message: "Mail is required" },
          ],
          roleId:[
             { name: "required", Message: "Role is required" },
          ],
          storeId:[
             { name: "required", Message: "Store is required" },
          ],
          webRoleId:[
             { name: "required", Message: "WebRole is required" },
          ],
          doctorId:[],
      };
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

