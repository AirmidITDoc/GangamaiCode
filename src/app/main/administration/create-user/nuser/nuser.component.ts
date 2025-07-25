import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { CreateUserService } from '../create-user.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-nuser',
  templateUrl: './nuser.component.html',
  styleUrls: ['./nuser.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NUserComponent implements OnInit {
  myuserform: FormGroup;
  myuserApprovalform: FormGroup;
  isActive: boolean = true;

  vPharExpOpt: any = 0;
  vPharIPOpt: any = 0;
  vPharOPOpt: any = 0;
  registerObj = new UserDetail({});
  vUserId: any = 0;
  isLoading: string;
  vdoctorID: any = 0;
  regobj: any;
  visGRNVerify: any = false;
  visPoinchargeVerify: any = false;
  visPOVerify: any = false;
  visIndentVerify: any = false;
  visInchIndVfy: any = false;
  vpharExtOpt: any = false;
  vpharIPOpt: any = false;
  vpharOPOpt: any = false;
  visCollection: any = false;
  visPatientInfo: any = false;
  visBedStatus: any = false;
  visCurrentStk: any = false;
  vaddChargeIsDelete: any = false;
  unitname = 0;
  rolename = 0;
  storename = 0;
  webrolename = 0;
  hidePassword = true;

  autocompleteModeUnitName: string = "Hospital";
  autocompleteModeRoleName: String = "Role";
  autocompleteModeStoreName: String = "Store";
  autocompleteModeWebRoleName: String = "WebRole";
  autocompleteModedoctor: string = "ConDoctor";

  displayedColumn: string[] = [
    'Header',
    'CheckBox',
    'InputField'
  ]
  dsApprovalList = new MatTableDataSource<UserDetail>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('passwordTextbox', { static: false }) passwordTextbox: ElementRef;
  @ViewChild('ddlUnit') ddlUnit: AirmidDropDownComponent;
  @ViewChild('ddlStore') ddlStore: AirmidDropDownComponent;

  constructor(
    public _CreateUserService: CreateUserService,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
    private _formBuilder: UntypedFormBuilder,
    private _loggedService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NUserComponent>,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private renderer: Renderer2
  ) {
    this.myuserform = this.createuserForm();
    this.myuserform.markAllAsTouched();

    this.myuserApprovalform = this.createuserApprovalForm();
    this.myuserApprovalform.markAllAsTouched();
  }

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

    if ((this.data?.userId ?? 0) > 0) {
      console.log(this.data)
      this.myuserform.patchValue(this.data);

      console.log("data:", this.data)
      this.regobj = this.data;
      this.isActive = this.regobj.isActive
      this.visGRNVerify = this.regobj.isGRNVerify
      this.visPOVerify = this.regobj.isPOVerify
      this.visPoinchargeVerify = this.regobj.isPoinchargeVerify
      this.visIndentVerify = this.regobj.isIndentVerify
      this.visInchIndVfy = this.regobj.isInchIndVfy
      this.vpharExtOpt = this.regobj.pharExtOpt == 1 ? true : false;
      this.vpharIPOpt = this.regobj.pharIPOpt == 1 ? true : false;
      this.vpharOPOpt = this.regobj.pharOPOpt == 1 ? true : false;
      this.visCollection = this.regobj.isCollection
      this.visPatientInfo = this.regobj.isPatientInfo
      this.visBedStatus = this.regobj.isBedStatus
      this.visCurrentStk = this.regobj.isCurrentStk
      this.vaddChargeIsDelete = this.regobj.addChargeIsDelete
      this.myuserform.get("doctorId").setValue(this.regobj.doctorID)
      if (this.regobj.isDoctorType == true)
        this.docflag = true
      else
        this.docflag = false

      if (this.regobj.isDiscApply == 1)
        this.DisclimitFlag = true
      else
        this.DisclimitFlag = false

      // 
    }
    this.getList()
    this.LoginAccessDetailsArray.push(this.createLoginAccessDetails());
    this.LoginUnitDetailsArray.push(this.createLoginUnitDetails());
    this.LoginStoreDetailsArray.push(this.createLoginStoreDetails());
  }

  //  getList() {
  //     var SelectQuery = {
  //       "searchFields": [
          
  //       ],
  //       "mode": "LoginAccessConfigList"
  //     }
  //     console.log(SelectQuery);
  //     this._CreateUserService.getApprovalList(SelectQuery).subscribe(Visit => {
  //       this.dsApprovalList.data = Visit as UserDetail[];
  //       console.log("Get data:",this.dsApprovalList.data)
  //       this.dsApprovalList.sort = this.sort;
  //       this.dsApprovalList.paginator = this.paginator;
  //     });
  //   }

  getList() {
  const SelectQuery = {
    searchFields: [],
    mode: "LoginAccessConfigList"
  };

  this._CreateUserService.getApprovalList(SelectQuery).subscribe((Visit: UserDetail[]) => {
    const updatedList = Visit.map(item => ({
      ...item,
      InputValue: item.InputValue ?? '' // i am not getting this field from list so i am adding here
    }));

    this.dsApprovalList.data = updatedList;
    console.log("Get data:", this.dsApprovalList.data);

    this.dsApprovalList.sort = this.sort;
    this.dsApprovalList.paginator = this.paginator;
  });
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
      isGrnverify: false,
      isCollection: false,
      isBedStatus: false,
      isCurrentStk: false,
      isPatientInfo: false,
      isDateInterval: true,
      isDateIntervalDays: [0
      ],
      //  [Validators.minLength(10),
      // Validators.maxLength(10),
      // Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      // ]],
      mailId: ["", [Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
      ]
      ],
      mailDomain: ["1"],
      loginStatus: true,
      addChargeIsDelete: true,
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
      isActive: [true, [Validators.required]]
    });
  }

  createuserApprovalForm(): FormGroup {
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
      isGrnverify: false,
      isCollection: false,
      isBedStatus: false,
      isCurrentStk: false,
      isPatientInfo: false,
      isDateInterval: true,
      isDateIntervalDays: [0
      ],
      mailId: ["", [Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
      ]
      ],
      mailDomain: ["1"],
      loginStatus: true,
      addChargeIsDelete: true,
      isIndentVerify: false,
      isPoinchargeVerify: false,
      isInchIndVfy: false,
      isRefDocEditOpt: true,
      webRoleId: [0, [ Validators.required ] ],
      userToken: [""],
      pharExtOpt: 0,
      pharOpopt: 0,
      pharIpopt: 0,
      isDiscApply: 0,
      discApplyPer: [0],
      isActive: [true, [Validators.required]],
      tLoginAccessDetails: this._formBuilder.array([]),
      tLoginUnitDetails: this._formBuilder.array([]),
      tLoginStoreDetails: this._formBuilder.array([]),

      // extra fields
      multipleUnitId: [[]],
      multipleStoreId: [[]],

    });
  }

  createLoginAccessDetails(item: any = {}): FormGroup {
      return this._formBuilder.group({
        loginAccessId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        loginId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        accessValueId: [item.AccessValueId ?? 0], //what to send here id or name (LoginConfigId)
        accessValue: [item.IsInputField ?? false, [Validators.maxLength(100)]],
        accessInputValue: [item.InputValue ?? ''],
      });
    }
  
    createLoginUnitDetails(item: any = {}): FormGroup {
      return this._formBuilder.group({
        loginUnitDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        loginId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        unitId: [Number(item.value) ?? 0],
      });
    }
  
    createLoginStoreDetails(item: any = {}): FormGroup {
      return this._formBuilder.group({
        loginUnitDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        loginId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        storeId: [Number(item.value) ?? 0],
      });
    }

    get LoginAccessDetailsArray(): FormArray {
      return this.myuserApprovalform.get('tLoginAccessDetails') as FormArray;
    }

    get LoginUnitDetailsArray(): FormArray {
      return this.myuserApprovalform.get('tLoginUnitDetails') as FormArray;
    }

    get LoginStoreDetailsArray(): FormArray {
      return this.myuserApprovalform.get('tLoginStoreDetails') as FormArray;
    }

  removeUnit(item) {
    let removedIndex = this.myuserApprovalform.value.multipleUnitId.findIndex(x => x.value == item.value);
    this.myuserApprovalform.value.multipleUnitId.splice(removedIndex, 1);
    this.ddlUnit.SetSelection(this.myuserApprovalform.value.multipleUnitId.map(x => x.value));
  }

  removeStore(item) {
    let removedIndex = this.myuserApprovalform.value.multipleStoreId.findIndex(x => x.value == item.value);
    this.myuserApprovalform.value.multipleStoreId.splice(removedIndex, 1);
    this.ddlStore.SetSelection(this.myuserApprovalform.value.multipleStoreId.map(x => x.value));
  }
  onSubmitApproval() {

    if (this.docflag == true) {
      if (!this.myuserApprovalform.get('doctorId')?.value) {
        this.toastr.warning('Please select Doctor Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.DisclimitFlag == true) {
      if ((this.myuserApprovalform.get('discApplyPer').value == '' || this.myuserApprovalform.get('discApplyPer').value == 0
        || this.myuserApprovalform.get('discApplyPer').value == undefined)) {
        this.toastr.warning('Please enter a Discount % ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    console.log(this.myuserApprovalform.value)
    if (this.myuserApprovalform.valid) {
      debugger
      this.LoginAccessDetailsArray.clear();
      this.dsApprovalList.data.forEach((item)=>{
        this.LoginAccessDetailsArray.push(this.createLoginAccessDetails(item))
      })

      this.LoginUnitDetailsArray.clear();
      this.myuserApprovalform.get('multipleUnitId').value.forEach((item)=>{
        this.LoginUnitDetailsArray.push(this.createLoginUnitDetails(item))
      })

      this.LoginStoreDetailsArray.clear();
      this.myuserApprovalform.get('multipleStoreId').value.forEach((item)=>{
        this.LoginStoreDetailsArray.push(this.createLoginStoreDetails(item))
      })

        this.myuserApprovalform.removeControl('multipleUnitId')
        this.myuserApprovalform.removeControl('multipleStoreId')

      let formData = { ...this.myuserApprovalform.value };

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
      if (this.myuserApprovalform.invalid) {
        for (const controlName in this.myuserApprovalform.controls) {
          if (this.myuserApprovalform.controls[controlName].invalid) { invalidFields.push(`User Form: ${controlName}`); }
        }
      }

      if (invalidFields.length > 0) {
        invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
      }

    }
  }

 onSubmit() {

    if (this.docflag == true) {
      if (!this.myuserform.get('doctorId')?.value) {
        this.toastr.warning('Please select Doctor Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.DisclimitFlag == true) {
      if ((this.myuserform.get('discApplyPer').value == '' || this.myuserform.get('discApplyPer').value == 0
        || this.myuserform.get('discApplyPer').value == undefined)) {
        this.toastr.warning('Please enter a Discount % ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    console.log(this.myuserform.value)
    if (this.myuserform.valid) {
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

  selectChangeUnitName(obj: any) {
    console.log(obj);
    this.unitname = obj.value
  }

  selectChangeRoleName(obj: any) {
    console.log(obj);
    this.rolename = obj.value
  }

  selectChangeStoreName(obj: any) {
    console.log(obj);
    this.storename = obj.value
  }

  selectChangeWebRoleName(obj: any) {
    console.log(obj);
    this.webrolename = obj.value
  }

  docflag: boolean = false;
  chkdoctor(event) {
    // 
    if (this.myuserform.get('isDoctorType').value == true) {
      this.docflag = true
    } else {
      this.docflag = false
    }
  }

  chkdoctorApp(event) {
    if (this.myuserApprovalform.get('isDoctorType').value == true) {
      this.docflag = true
    } else {
      this.docflag = false
    }
  }
  DisclimitFlag: boolean = false;
  chkDiscLimit(event) {
    if (event.checked == true) {
      this.DisclimitFlag = true
    } else {
      this.DisclimitFlag = false
      this.myuserform.get('discApplyPer').setValue('')
    }
  }
  chkDiscLimitApp(event) {
    if (event.checked == true) {
      this.DisclimitFlag = true
    } else {
      this.DisclimitFlag = false
      this.myuserApprovalform.get('discApplyPer').setValue('')
    }
  }

  onClear(val: boolean) {
    this.dialogRef.close(val);
  }

  selectedTabIndexHide = 0;

  onTabChange(event: MatTabChangeEvent) {
    this.selectedTabIndexHide = event.index;
  }

  getValidationMessages() {
    return {
      unitId: [],
      mobileNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "Mobile No is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }
      ],
      firstName: [
        { name: "required", Message: "First Name is required" },
        { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      lastName: [
        { name: "required", Message: "Last Name is required" },
        { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      userName: [
        { name: "required", Message: "User Name is required" },
        { name: "maxLength", Message: "Enter only upto 50 chars" },
      ],
      password: [
        { name: "required", Message: "Password is required" },
      ],
      mailId: [
        { name: "required", Message: "Mail is required" },
      ],
      roleId: [
        { name: "required", Message: "Role is required" },
      ],
      storeId: [
        { name: "required", Message: "Store is required" },
      ],
      webRoleId: [
        { name: "required", Message: "WebRole is required" },
      ],
      doctorId: [],
      isDateIntervalDays: [

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
  isGrnverify: any;
  Indentverify: any;
  IIverify: any;
  DoctorID: any;
  isDiscApply: any;
  DiscApplyPer: any;
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

  ViewBrowseBill: any;
  IsPharmacyBalClearnace: any;
  IsAddChargeDelete: any;
  PharExpOpt: any;
  PharIPOpt: any;
  PharOPOpt: any;
  InputValue:any;
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
      this.IsPharmacyBalClearnace = UserDetail.IsPharmacyBalClearnace || 0;
      this.IsAddChargeDelete = UserDetail.IsAddChargeDelete || 0;
      this.InputValue = UserDetail.InputValue || ''
    }

  }
}

