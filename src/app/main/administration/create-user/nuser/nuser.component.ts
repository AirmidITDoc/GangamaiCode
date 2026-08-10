import { Component, ElementRef, Inject, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { CreateUserService } from '../create-user.service';

@Component({
    selector: 'app-nuser',
    templateUrl: './nuser.component.html',
    styleUrls: ['./nuser.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NUserComponent implements OnInit {
    myuserApprovalform: FormGroup;
    myuserApprovalform1: FormGroup;
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
    CashCounterName = 0;
    rolename = 0;
    storename = 0;
    webrolename = 0;
    hidePassword = true;
    removeEmpDiv:boolean=false;

    autocompleteModeUnitName: string = "Hospital";
    autocompleteModeRoleName: string = "Role";
    autocompleteModeStoreName: string = "Store";
    autocompleteModeWebRoleName: string = "WebRole";
    autocompleteModedoctor: string = "ConDoctor";
    autocompleteModeCashcounter: string = "CashCounter";

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
    @ViewChild('ddlCashCounter') ddlCashCounter: AirmidDropDownComponent;

    constructor(
        public _CreateUserService: CreateUserService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        private _formBuilder: UntypedFormBuilder,
        private _loggedService: AuthenticationService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<NUserComponent>,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private zone: NgZone
    ) {
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
            this.removeEmpDiv=true
            this.myuserApprovalform.patchValue(this.data);

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
            this.myuserApprovalform.get("IsAdminMultiview").setValue(this.regobj.isAdminMultiview)
            this.myuserApprovalform.get("userName").setValue(this.regobj.userLoginName)
            this.myuserApprovalform.get("doctorId").setValue(this.regobj.doctorID)
            this.myuserApprovalform.get("mailDomain").setValue("1")
            if (this.regobj.isDoctorType == true)
                this.docflag = true
            else
                this.docflag = false

            if (this.regobj.isDiscApply == 1)
                this.DisclimitFlag = true
            else
                this.DisclimitFlag = false
            this.getAccessDetail(this.data)
            this.getUnitDetail(this.data)
            this.getStoreDetail(this.data)
            this.getCashcounterDetail(this.data)

        } else {
            this.getList()
        }
        this.LoginAccessDetailsArray.push(this.createLoginAccessDetails());
        this.LoginUnitDetailsArray.push(this.createLoginUnitDetails());
        this.LoginStoreDetailsArray.push(this.createLoginStoreDetails());

        this.myuserApprovalform1 = this.CreateMultidataform()
    }

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

    getAccessDetail(row) {
        // debugger
        const SelectQuery = {
            "first": 0,
            "rows": 999,
            "sortField": "AccessValueId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "LoginId",
                    "fieldValue": String(row.userId), //"30091",
                    "opType": "Equals"
                }
            ],
            "exportType": "JSON",
            "columns": []
        }
        this._CreateUserService.getAccessDetailList(SelectQuery).subscribe(response => {
            this.dsApprovalList.data = response.data as UserDetail[];
            // console.log("get Access data:", this.dsApprovalList.data)
            this.dsApprovalList.sort = this.sort;
            this.dsApprovalList.paginator = this.paginator;

            // Set dropdown value after data load
            this.dsApprovalList.data.forEach((element: any) => {
                if (
                    element.accessValueName === 'IsExecutiveUserId' &&
                    element.accessValue === true
                ) {
                    // set value from API
                    setTimeout(() => {
                        this.myuserApprovalform.get('employeId')?.setValue(
                            Number(element.accessInputValue)
                        );
                    }, 300);
                }
            });
        });
    }

    RtrvUnitList: any = [];
    RtrvStoreList: any = [];
     RtrvCashCounterList: any = [];
    getUnitDetail(row) {
        // debugger
        const SelectQuery = {
            "first": 0,
            "rows": 999,
            "sortField": "LoginUnitDetId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "LoginId",
                    "fieldValue": String(row.userId), //"30091",
                    "opType": "Equals"
                }
            ],
            "exportType": "JSON",
            "columns": []
        }
        setTimeout(() => {
            this._CreateUserService.getUnitDetailList(SelectQuery).subscribe(response => {
                const rowData = response?.data || [];

                console.log(rowData)
                this.RtrvUnitList = rowData.map(item => ({
                    value: String(item.unitId),
                    text: item.hospitalName
                }))
                // debugger

                console.log("unit data:", this.RtrvUnitList)
                const assignedunit = this.RtrvUnitList.filter(unit => {
                    const originalItem = rowData.find(r => r.unitId == unit.value);
                    return true;
                });

                this.myuserApprovalform1.patchValue({
                    multipleUnitId: assignedunit
                });

            });

            // setTimeout(() => {
            //   this.myuserApprovalform1.get('multipleUnitId')?.setValue(this.RtrvUnitList);
            // }, 0);
            // console.log("setData:", this.myuserApprovalform1.get('multipleUnitId').value)
        }, 1000);
    }


    getStoreDetail(row) {
        const SelectQuery = {
            "first": 0,
            "rows": 999,
            "sortField": "LoginStoreDetId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "LoginId",
                    "fieldValue": String(row.userId), //"30091",
                    "opType": "Equals"
                }
            ],
            "exportType": "JSON",
            "columns": []
        }
        setTimeout(() => {
            this._CreateUserService.getStoreDetailList(SelectQuery).subscribe(response => {
                const rowData = response?.data || [];

                console.log(rowData)
                this.RtrvStoreList = rowData.map(item => ({
                    value: String(item.storeId),
                    text: item.storeName
                }))


                console.log("store data:", this.RtrvStoreList)
                const assignedStore = this.RtrvStoreList.filter(store => {
                    const originalItem = rowData.find(r => r.storeId == store.value);
                    return true;
                });
                //  this.ddlStore.SetSelection(assignedStore);

                this.myuserApprovalform1.patchValue({
                    multipleStoreId: assignedStore
                });
            });

            // setTimeout(() => {
            //   this.myuserApprovalform1.get('multipleStoreId')?.setValue(this.RtrvStoreList);
            // }, 0);

        }, 1000);
    }
getCashcounterDetail(row) {
        const SelectQuery = {
            "first": 0,
            "rows": 999,
            "sortField": "LoginCashCounterDetId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "LoginId",
                    "fieldValue": String(row.userId), //"30091",
                    "opType": "Equals"
                }
            ],
            "exportType": "JSON",
            "columns": []
        }
        setTimeout(() => {
            this._CreateUserService.getCashCounterDetailList(SelectQuery).subscribe(response => {
                const rowData = response?.data || [];

                console.log(rowData)
                this.RtrvCashCounterList = rowData.map(item => ({
                    value: String(item.cashCounterId),
                    text: item.cashCounterName
                }))


                console.log("Cashcounter data:", this.RtrvCashCounterList)
                const assignedCashcounter = this.RtrvCashCounterList.filter(Item => {
                    const originalItem = rowData.find(r => r.cashCounterId == Item.value);
                    return true;
                });
                //  this.ddlStore.SetSelection(assignedCashcounter);

                this.myuserApprovalform1.patchValue({
                    multipleCashCounterId: assignedCashcounter
                });
            });

            // setTimeout(() => {
            //   this.myuserApprovalform1.get('multipleStoreId')?.setValue(this.RtrvCashCounterList);
            // }, 0);

        }, 1000);
    }
    createuserApprovalForm(): FormGroup {
        return this._formBuilder.group({
            userId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
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
            password: ["", [Validators.required]],
            unitId: [this._loggedService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
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
            storeId: [this._loggedService.currentUserValue.user.storeId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
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
            webRoleId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            userToken: [""],
            pharExtOpt: 0,
            pharOpopt: 0,
            pharIpopt: 0,
            isDiscApply: 0,
            discApplyPer: [0],
            IsBillReview: false,
            IsAdminMultiview: false,
            isActive: [true, [Validators.required]],
            tLoginAccessDetails: this._formBuilder.array([]),
            tLoginUnitDetails: this._formBuilder.array([]),
            tLoginStoreDetails: this._formBuilder.array([]),
            tLoginCashCounterDetails: this._formBuilder.array([]),
            // extra fields
            // multipleUnitId: [[], [Validators.required]],
            // multipleStoreId: [[], [Validators.required]],
            IsPharmacyBalClearnace: false,
            employeId: [0],
            isEmployee: false

        });
    }

    CreateMultidataform(): FormGroup {
        return this._formBuilder.group({
            multipleUnitId: [[], [Validators.required]],
            multipleStoreId: [[], [Validators.required]],
            multipleCashCounterId: [[]] 
        });
    }

    createLoginAccessDetails(item: any = {}): FormGroup {
        return this._formBuilder.group({
            loginAccessId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            loginId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            accessValueId: [item.LoginConfigId || item.accessValueId],
            accessValue: [item.IsInputField || item.accessValue || false, [Validators.maxLength(100)]],
            accessInputValue: [String(item.InputValue ?? item.accessInputValue ?? '')],
        });
    }

    createLoginUnitDetails(item: any = {}): FormGroup {
        return this._formBuilder.group({
            loginUnitDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            loginId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            unitId: [Number(item.value)],
        });
    }

    createLoginStoreDetails(item: any = {}): FormGroup {
        return this._formBuilder.group({
            loginUnitDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            loginId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            storeId: [Number(item.value)],
        });
    }
    createLoginCashCounterDetails(item: any = {}): FormGroup {
        return this._formBuilder.group({
            loginCashCounterDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            loginId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            cashCounterId: [Number(item.value)],
            isDefault:[(item.isDefault) || false],
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
    get LoginCashCounterDetailsArray(): FormArray {
     return this.myuserApprovalform.get('tLoginCashCounterDetails') as FormArray;
    }
   removeCashcounter(item) {
        const removedIndex = this.myuserApprovalform1.value.multipleCashCounterId.findIndex(x => x.value == item.value);
        this.myuserApprovalform1.value.multipleCashCounterId.splice(removedIndex, 1);
        this.ddlCashCounter.SetSelection(this.myuserApprovalform1.value.multipleCashCounterId.map(x => x.value));
    }
    removeUnit(item) {
        const removedIndex = this.myuserApprovalform1.value.multipleUnitId.findIndex(x => x.value == item.value);
        this.myuserApprovalform1.value.multipleUnitId.splice(removedIndex, 1);
        this.ddlUnit.SetSelection(this.myuserApprovalform1.value.multipleUnitId.map(x => x.value));
    }

    removeStore(item) {
        const removedIndex = this.myuserApprovalform1.value.multipleStoreId.findIndex(x => x.value == item.value);
        this.myuserApprovalform1.value.multipleStoreId.splice(removedIndex, 1);
        this.ddlStore.SetSelection(this.myuserApprovalform1.value.multipleStoreId.map(x => x.value));
    }

    getCheckboxValue(element: any): boolean {
        return element.IsInputField ?? element.accessValue ?? false;
    }

    keyPressAlphanumeric(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    setCheckboxValue(element: any, value: boolean): void {
        if (element.hasOwnProperty('IsInputField')) {
            element.IsInputField = value;
        } else {
            element.accessValue = value;
        }
        //When unchecked → reset dropdown + value
        if (!value) {
            // reset form control
            this.myuserApprovalform.get('employeId')?.reset();

            // clear stored value
            if ('InputValue' in element) {
                element.InputValue = false;
            } else {
                element.accessInputValue = 0;
            }
        }
    }

    getInputFieldValue(element: any): string {
        return element.InputValue ?? element.accessInputValue ?? '';
    }

    setInputFieldValue(element: any, value: string): void {
        if ('InputValue' in element) {
            element.InputValue = value;
        } else {
            element.accessInputValue = value;
        }
    }

    getSelectedObjExecutive(element: any, event: any): void {
        debugger
        const value = event?.executiveId;
        if ('InputValue' in element) {
            element.InputValue = String(value);
        } else {
            element.accessInputValue = String(value);
        }
    }

    empflag: boolean = false;
    chkEmpApp(event) {
        if (this.myuserApprovalform.get('isEmployee').value == true) {
            this.empflag = true
        } else {
            this.empflag = false
            this.myuserApprovalform.get('employeId').setValue(0)
            // this.myuserApprovalform.reset();
        }
    }

    getSelectedObjEmp(obj) {
        this._CreateUserService.getEmpById(obj.executiveId).subscribe((response) => {
            console.log("Emp Detail:", response)
            this.myuserApprovalform.patchValue({
                ...response,
                mailId: response.emailId
            });
        });
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

        if (this.myuserApprovalform.valid && this.myuserApprovalform1.valid) {
            // debugger
            this.LoginAccessDetailsArray.clear();
            this.dsApprovalList.data.forEach((item) => {
                this.LoginAccessDetailsArray.push(this.createLoginAccessDetails(item))
            })

            this.LoginUnitDetailsArray.clear();
            debugger
            if (this.myuserApprovalform1.get('multipleUnitId').value) {
                this.myuserApprovalform1.get('multipleUnitId').value.forEach((item) => {
                    this.LoginUnitDetailsArray.push(this.createLoginUnitDetails(item))
                })
            }
            this.LoginStoreDetailsArray.clear();
            if (this.myuserApprovalform1.get('multipleStoreId').value) {
                this.myuserApprovalform1.get('multipleStoreId').value.forEach((item) => {
                    this.LoginStoreDetailsArray.push(this.createLoginStoreDetails(item))
                })
            }
            this.LoginCashCounterDetailsArray.clear();
            if (this.myuserApprovalform1.get('multipleCashCounterId').value) {
                this.myuserApprovalform1.get('multipleCashCounterId').value.forEach((item) => {
                    this.LoginCashCounterDetailsArray.push(this.createLoginCashCounterDetails(item))
                })
            }
            this.myuserApprovalform1.removeControl('isEmployee')
            this.myuserApprovalform.removeControl('employeId')
            this.myuserApprovalform.removeControl('IsPharmacyBalClearnace')
            debugger
            const formData = { ...this.myuserApprovalform.value };

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
            const invalidFields = [];
            const invalidFields1 = [];
            if (this.myuserApprovalform.invalid) {
                for (const controlName in this.myuserApprovalform.controls) {
                    if (this.myuserApprovalform.controls[controlName].invalid) { invalidFields.push(`User Form: ${controlName}`); }
                }
            }

            if (this.myuserApprovalform1.invalid) {
                for (const controlName in this.myuserApprovalform1.controls) {
                    if (this.myuserApprovalform1.controls[controlName].invalid) { invalidFields1.push(`User Form: ${controlName}`); }
                }
            }

            if (invalidFields.length > 0) {
                invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
            }
            if (invalidFields1.length > 0) {
                invalidFields1.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
            }

        }
    }

    selectChangeUnitName(obj: any) {
        console.log(obj)
        this.unitname = obj.value
        console.log("set:", this.myuserApprovalform1.get('multipleUnitId').value)
    }
    selectChangeCashCounterName(obj: any) {
        console.log(obj)
        this.CashCounterName = obj.value
        console.log("set:", this.myuserApprovalform1.get('multipleCashCounterId').value)
    }
    selectChangeRoleName(obj: any) {
        this.rolename = obj.value
    }

    selectChangeStoreName(obj: any) {
        console.log(obj)
        this.storename = obj.value
    }

    selectChangeWebRoleName(obj: any) {
        this.webrolename = obj.value
    }

    docflag: boolean = false;
    chkdoctorApp(event) {
        const doctorControl = this.myuserApprovalform.get('doctorId');
        if (this.myuserApprovalform.get('isDoctorType').value == true) {
            this.docflag = true
            doctorControl?.setValidators([Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]);
        } else {
            doctorControl?.clearValidators();
            this.docflag = false
        }
        doctorControl?.updateValueAndValidity();
    }


    chkIsBillReview(event) {
        const doctorControl = this.myuserApprovalform.get('doctorId');
        // if (this.myuserApprovalform.get('isDoctorType').value == true) {
        //   this.docflag = true
        //   doctorControl?.setValidators([Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]);
        // } else {
        //   doctorControl?.clearValidators();
        //   this.docflag = false
        // }
        // doctorControl?.updateValueAndValidity();
    }


    DisclimitFlag: boolean = false;
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
            CashCounterId: [],
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
    InputValue: any;
    accessValueId: any;
    accessValue: any;
    accessInputValue: any;
    accessValueName: any;
    loginId: any;
    isBillReview: any;
    isAdminMultiview: any;
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
            this.InputValue = UserDetail.InputValue || '';
            this.accessValueId = UserDetail.accessValueId || ''
            this.accessValue = UserDetail.accessValue || ''
            this.accessInputValue = UserDetail.accessInputValue || ''
            this.accessValueName = UserDetail.accessValueName || ''
            this.loginId = UserDetail.loginId || 0
            this.isBillReview = UserDetail.isBillReview || false
            this.isAdminMultiview = UserDetail.isAdminMultiview || false
        }

    }
}

