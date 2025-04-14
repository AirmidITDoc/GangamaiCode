import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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
    
    vPharExpOpt:any=0;
    vPharIPOpt:any=0;
    vPharOPOpt:any=0;
    registerObj = new UserDetail({});
    vUserId: any = 0;
    isLoading: string;
    vdoctorID:any=0;
    regobj:any;
    visGRNVerify: any=false;
    visPoinchargeVerify:any=false;
    visPOVerify:any=false;
    visIndentVerify:any=false;
    visInchIndVfy:any=false;
    vpharExtOpt:any=false;
    vpharIPOpt:any=false;
    vpharOPOpt:any=false;
    visCollection:any=false;
    visPatientInfo:any=false;
    visBedStatus:any=false;
    visCurrentStk:any=false;
    vaddChargeIsDelete:any=false;
    unitname = 0;
    rolename = 0;
    storename = 0;
    webrolename = 0;

    autocompleteModeUnitName: string = "Hospital"; 
    autocompleteModeRoleName: String = "Role";
    autocompleteModeStoreName: String = "Store";
    autocompleteModeWebRoleName: String = "WebRole";
    autocompleteModedoctor: string = "ConDoctor";
    @ViewChild('passwordTextbox', { static: false }) passwordTextbox: ElementRef;


    constructor(
        public _CreateUserService: CreateUserService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
      private _formBuilder: UntypedFormBuilder,
        private _loggedService: AuthenticationService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<NUserComponent>,
        private renderer: Renderer2
    ) {    
      this.myuserform = this.createuserForm();
      this.myuserform.markAllAsTouched(); }

    ngAfterViewInit() {
      setTimeout(() => {
          // Find the password input inside airmid-textbox
          const passwordInput = document.querySelector('airmid-textbox[formControlName="password"] input');
          if (passwordInput) {
              passwordInput.setAttribute('type', 'password'); // Hide password input
          }
      }, 100); // Ensure it's executed after rendering
  }
    
    ngOnInit(): void {
    
        if((this.data?.userId??0) > 0)
        {
          console.log(this.data)
          this.myuserform.patchValue(this.data);
          
            console.log("data:", this.data)
            this.regobj=this.data;
            this.isActive=this.regobj.isActive
            this.visGRNVerify=this.regobj.isGRNVerify
            this.visPOVerify=this.regobj.isPOVerify
            this.visPoinchargeVerify=this.regobj.isPoinchargeVerify
            this.visIndentVerify=this.regobj.isIndentVerify
            this.visInchIndVfy=this.regobj.isInchIndVfy
            this.vpharExtOpt = this.regobj.pharExtOpt == 1 ? true : false;
            this.vpharIPOpt = this.regobj.pharIPOpt == 1 ? true : false;
            this.vpharOPOpt = this.regobj.pharOPOpt == 1 ? true : false;
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

            if(this.regobj.isDiscApply==1)
              this.DisclimitFlag=true
            else
            this.DisclimitFlag=false
            
            // 
        }
    }

    createuserForm(): FormGroup {
      return this._formBuilder.group({
        userId: [0],
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
            Validators.pattern('[a-z A-Z 0-9_ ]*')
          ]],
        password: [
          "",
          [
            Validators.required,
            Validators.pattern("^\\d{0,12}(\\.\\d*)?$")
          ]
        ],
        unitId: [1],
        mobileNo: ["", [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
        ]],
        roleId: [0,
          [
            Validators.required
          ]
        ],
        storeId: [2,
          [
            Validators.required
          ]
        ],
        isDoctorType: false,
        doctorId: "0",
        isPoverify: false,
        isGrnverify:false,
        isCollection:false,
        isBedStatus: false,
        isCurrentStk:false,
        isPatientInfo:false,
        isDateInterval: true,
        isDateIntervalDays: [0
        ],
          //  [Validators.minLength(10),
          // Validators.maxLength(10),
          // Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
        // ]],
        mailId: ["",[Validators.required,
            Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
          ]
        ],
        mailDomain: ["1"],
        loginStatus: true,
        addChargeIsDelete:true,
        isIndentVerify: false,
        isPoinchargeVerify: false,
        isInchIndVfy: false,
        isRefDocEditOpt: true,
        webRoleId: [0,
          [
            Validators.required
          ]
        ],
        userToken: [""],
        pharExtOpt: 0,
        pharOpopt: 0,
        pharIpopt: 0,
        isDiscApply: 0,
        discApplyPer: [0],
      isActive:[true,[Validators.required]]
      });
    }
    onSubmit() {
               
     
        if (this.docflag == true) {
          if(!this.myuserform.get('doctorId')?.value){
            this.toastr.warning('Please select Doctor Name', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }  
        }
        if(this.DisclimitFlag == true){ 
          if ((this.myuserform.get('discApplyPer').value == '' || this.myuserform.get('discApplyPer').value == 0 
          || this.myuserform.get('discApplyPer').value == undefined)) {
            this.toastr.warning('Please enter a Discount % ', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          } 
        }

        console.log(this.myuserform.value)
         if(this.myuserform.valid){        
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
            formData.isDiscApply = formData.isDiscApply === true ? 1 : 0;
        
            console.log("MenuMaster json:", formData);

            this._CreateUserService.insertuser(formData).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
            }, (error) => {
              this.toastr.error(error.message);
            });                
          }
          else {
            let invalidFields = [];
            if (this.myuserform.invalid) {
                for (const controlName in this.myuserform.controls) {
                    if (this.myuserform.controls[controlName].invalid) { invalidFields.push(`User Form: ${controlName}`); }
                }
            }
           
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
            }

        }
        }

   
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
        // 
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
        this.myuserform.get('discApplyPer').setValue('')
        }            
    }

    onClear(val: boolean) 
    {
        this.dialogRef.close(val);
    }

    getValidationMessages() {
      return {
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
          isDateIntervalDays:[
            
          ]
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

