import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { Router } from "@angular/router";
import { UntypedFormBuilder, FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ParametermasterService } from "../parametermaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { map, startWith } from "rxjs/operators";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { ParametermasterComponent, PathparameterMaster } from "../parametermaster.component";
import { AuthenticationService } from "app/core/services/authentication.service";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Component({
    selector: "app-parameter-form-master",
    templateUrl: "./parameter-form-master.component.html",
    styleUrls: ["./parameter-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ParameterFormMasterComponent implements OnInit {
    parameterForm: FormGroup;
    numericForm: FormGroup;
    descForm: FormGroup;
    TableForm: FormGroup;

    isPrintDisSummaryChecked: boolean = false;
    autocompleteModeUnitId: string = "Unit";

    ageType: string[] = ["DAY", "MONTH", "YEAR"];
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    displayedColumns: string[] = [
        "GenderName",
        "MinAge",
        "MaxAge",
        "MinValue",
        "MaxValue",
        "AgeType",
        "Action"
    ];
    submitted = false;
    isLoading = true;
    isHidden: boolean = true;
    UnitcmbList: any = [];
    Parametercmb: any = [];
    GendercmbList: any = [];
    chargeslist: any = [];
    vMinAge: any;
    vMaxAge: any;
    vMinValue: any;
    vMaxValue: any;
    msg: any;
    UnitId: any = 0;
    filteredOptionsUnit: Observable<string[]>;
    optionsUnit: any[] = [];
    isunitSelected: boolean = false;
    ParaId: any;
    DefaultValue: any;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    registerObj = new PathparameterMaster({});

    vParameterShortName: any;
    vParameterName: any;
    vPrintParameterName: any;
    vMethodName: any;
    vFormula: any;
    vUnitId: any;

    selectedToAdd: any;
    groupsArray: any = [];
    selectedItems: any[] = [];
    isTxtUnique = true;
    paraId: any;
    defaultValue: any;
    vParameterId: any;
    parameterValue: any;
vparaMultipleRange:any;
    ChargeList: any = [];
    dsTemparoryList = new MatTableDataSource<PathDescriptiveMaster>();
    dataSource = new MatTableDataSource<PathDescriptiveMaster>();
    dsParameterAgeList = new MatTableDataSource<PathParaRangeAgeMaster>();
    autocompleteModeGender: String = "Gender";
    tableData: any;
    rowData: any;

    constructor(
        public _ParameterService: ParametermasterService,
        public dialogRef: MatDialogRef<ParametermasterComponent>,
        private accountService: AuthenticationService,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private _formBuilder: FormBuilder,
        private _loggedService: AuthenticationService,
        public toastr: ToastrService) { }

    ngOnInit(): void {

        this.parameterForm = this._ParameterService.createParameterForm();
        this.parameterForm.markAllAsTouched();
        this.numericForm = this._ParameterService.numericForm();
        this.descForm = this._ParameterService.descForm();

        this.TableForm = this.tableForm();

        // this.DescArray.push(this.createdescDetails());
        // this.NumericArray.push(this.createnumDetails());


        this.selectedItems = [];
        this.dsParameterAgeList.data = [];

        if (this.data) {
            this.registerObj = this.data;
            this.vParameterId = this.registerObj.parameterId;
            this.vparaMultipleRange = this.data?.rowData?.paraMultipleRange
        }

        this.tableData = this.data.tableData;
        this.rowData = this.data.rowData;

        console.log("Received Row Data:", this.rowData);
        console.log("Received Table Data:", this.tableData);

        if (this.parameterForm.get("parameterId").value) {

            this.dsParameterAgeList.data = this._ParameterService.numericList;
            this.selectedItems = this._ParameterService.descriptiveList;
        }
 debugger
        this.dsParameterAgeList.data = this.tableData;  // Assign received data
        this.dsParameterAgeList.data = [...this.dsParameterAgeList.data];

        this.selectedItems = [...this.tableData];
        this.selectedItems = [...this.selectedItems];
        console.log()
       
        var mdata = {
            parameterId: this.rowData?.parameterId,
            parameterShortName: this.rowData?.parameterShortName,
            parameterName: this.rowData?.parameterName,
            printParameterName: this.rowData?.printParameterName,
            methodName: this.rowData?.methodName,
            formula: this.rowData?.formula,
            unitId: this.rowData?.unitId,
            isNumeric: this.rowData?.isNumericParameter,
            isActive: JSON.stringify(this.rowData?.isActive),
        };
        this.parameterForm.patchValue(mdata); 
        const defaultvalue = this.data?.tableData.find(item => item.defaultValue)?.defaultValue || '';
        this.descForm.patchValue({defaultValue:defaultvalue || ''})

    }

    tableForm(): FormGroup {
        return this._formBuilder.group({
            genderId: 0,
            ageType: [""]
        });
    }

    createdescDetails(item: any = {}): FormGroup {
        console.log(item)
        return this._formBuilder.group({
            descriptiveId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            parameterId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            parameterValues: [item.parameterValues ?? ''],
            isDefaultValue: true,
            defaultValue: [''],
            addedby: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            updatedby: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
        });
    }


    createnumDetails(item: any = {}): FormGroup {
        console.log(item)
        return this._formBuilder.group({
            pathparaRangeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            paraId: [item.paraId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            sexId: [item.sexId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            minAge: [item.minAge, [this._FormvalidationserviceService.onlyNumberValidator()]],
            maxAge: [item.maxAge, [this._FormvalidationserviceService.onlyNumberValidator()]],
            ageType: [(item.ageType ?? '').trim()],
            minValue: [String(item.minValue)],
            maxValue: [String(item.maxValue)],
            isDeleted: true,
            addedby: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            updatedby: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
        });
    }
    get DescArray(): FormArray {
        return this.parameterForm.get('mParameterDescriptiveMasters') as FormArray;
    }

    get NumericArray(): FormArray {
        return this.parameterForm.get('mPathParaRangeWithAgeMasters') as FormArray;
    }

    OnSave() {
        // debugger
        const isBoldChecked = this.parameterForm.get("isBoldFlag").value;
        const BoldValue = isBoldChecked ? "B" : "";

        // if (!this._ParameterService.is_numeric) {

        //     console.log('selected:', this.selectedItems)
        //     this.DescArray.clear();
        //     this.selectedItems.forEach(item => {
        //         this.DescArray.push(this.createdescDetails(item));
        //     });
        // }
        // else {

        //     this.NumericArray.clear();
        //     this.dsParameterAgeList.data.forEach(item => {
        //         this.NumericArray.push(this.createnumDetails(item));
        //     });
        // }

        if (!this.parameterForm.invalid) {

            if (this._ParameterService.is_numeric)
                var is_numeric = "1"
            else
                var is_numeric = "0"

            var numeric_info = [];
            var mPathParaRangeMasters = [];
            var data2 = [];
            if (!this._ParameterService.is_numeric) {

                console.log('selected:', this.selectedItems)
                this.DescArray.clear();
                this.selectedItems.forEach(item => { 
                const formObj = this.createdescDetails(item);  
                formObj.patchValue({ defaultValue: this.descForm.get("defaultValue")?.value || ''});  
                this.DescArray.push(formObj);
                }); 
            }
            else {

                this.NumericArray.clear();
                this.dsParameterAgeList.data.forEach(item => {
                    this.NumericArray.push(this.createnumDetails(item));
                });

            }

            this.parameterForm.get("isNumeric").setValue(is_numeric)
            // this.parameterForm.get("isPrintDisSummary").setValue(this.parameterForm.get("isPrintDisSummary").value)
            this.parameterForm.get("isBoldFlag").setValue(BoldValue)
            // this.parameterForm.get("mParameterDescriptiveMasters").setValue(data2)
            // this.parameterForm.get("mPathParaRangeWithAgeMasters").setValue(mPathParaRangeMasters)

            console.log(this.parameterForm.value)
            this._ParameterService.insertParameterMaster(this.parameterForm.value).subscribe(data => {
                if (data) {
                    this.parameterForm.reset({
                        isNumeric: ["1"],
                        isPrintDisSummary: true,
                        IsBold: ['0'],
                        IsDeleted: [true],
                    });
                    this.selectedItems = [];
                    this.dsParameterAgeList.data = [];
                    this.onClose();

                }

            });
        }
        else {
            const invalidFields = this.collectErrors(this.parameterForm);
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Field "${field}" is invalid.`, 'Warning');
                });
                return;
            }
        }
    }

    collectErrors(formGroup: FormGroup | FormArray, parentKey: string = ''): string[] {
        let errors: string[] = [];
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            const newKey = parentKey ? `${parentKey}.${key}` : key;
            if (control instanceof FormGroup || control instanceof FormArray) {
                // go deeper
                errors = errors.concat(this.collectErrors(control, newKey));
            } else {
                if (control?.invalid) {
                    errors.push(newKey);
                }
            }
        });
        return errors;
    }

    toggle(val: any) {
        if (val == 1) {
            this._ParameterService.is_numeric = true;
            this.dsParameterAgeList.data = []
        } else {
            this._ParameterService.is_numeric = false;
            this.selectedItems = []
        }
    }

    checkFields(event) {

        const {
            sexId,
            ageType,
            minAge,
            maxAge,
            minValue,
            maxvalue
        } = this.numericForm.value;

        // Mandatory checks
        if (!sexId) {
            this.toastr.warning('Please select Gender', 'Warning');
            return;
        }

        if (!ageType) {
            this.toastr.warning('Please select Age Type', 'Warning');
            return;
        }

        // Optional fields → default to 0
        this.numericForm.patchValue({
            minAge: minAge ?? 0,
            maxAge: maxAge ?? 0,
            minValue: minValue ?? 0,
            maxvalue: maxvalue ?? 0
        });

        this.onAdd(event);
    }

    onAdd(event) {

        let isNewRowUnique = true;

        const newRow: any = {
            sexId: this.numericForm.get('sexId').value,
            genderName: this.selectedGenderName,
            minAge: this.numericForm.get('minAge').value || 0,
            maxAge: this.numericForm.get('maxAge').value || 0,
            minValue: this.numericForm.get('minValue').value || 0,
            maxValue: this.numericForm.get('maxvalue').value || 0,
            IsDeleted: Boolean(this._ParameterService.myform.get("IsDeleted").value) || true,
            ageType: this.numericForm.get('ageType').value,
        };
        console.log("sata:-",)
        for (const row of this.dsParameterAgeList.data) {
            if (JSON.stringify(row) === JSON.stringify(newRow)) {
                isNewRowUnique = false;
                break;
            }
        }

        if (isNewRowUnique) {
            this.dsParameterAgeList.data.push(newRow);
            this.dsParameterAgeList.data = [...this.dsParameterAgeList.data];
            console.log(this.dsParameterAgeList.data);
        }
        else {
            this.toastr.success('You are adding a duplicate row', ' !', {
                toastClass: 'tostr-tost custom-toast-success',
            });

        }
        this.numericForm.get("sexId").reset();
        this.numericForm.get("minAge").reset();
        this.numericForm.get("maxAge").reset();
        this.numericForm.get("minValue").reset();
        this.numericForm.get("maxvalue").reset();
        this.numericForm.get("ageType").reset();
    }

    // onAddDescrow() {
    //     console.log("event is :" + event)

    //     // this.ChargeList = this.dsTemparoryList.data;

    //     this.ChargeList.push(
    //         {
    //             parameterValues: this.descForm.get("paraId").value,
    //             DefaultValue: this.descForm.get("defaultValue").value,
    //         });
    //     // this.dsTemparoryList.data = this.ChargeList;
    //     this.selectedItems = this.ChargeList;
    //     console.log(this.selectedItems)
    //     this.descForm.get("paraId").reset();
    //     this.descForm.get("defaultValue").reset();
    // }

    onAddDescrow() {
        console.log("event is :", event);

        if (!this.ChargeList) {
            this.ChargeList = []; // Ensure it's initialized
        }

        const newItem = {
            parameterValues: this.descForm.get("paraId").value,
            DefaultValue: this.descForm.get("defaultValue").value,
        };

        this.ChargeList.push(newItem);

        this.selectedItems = [...this.selectedItems, newItem];

        console.log("Updated selectedItems:", this.selectedItems);

        // Reset form fields
        this.descForm.get("paraId").reset();
        //this.descForm.get("defaultValue").reset();
    }


    getValidationMessages() {
        return {
            parameterShortName: [
                // { name: "required", Message: "Parameter Short Name is required" },
                // { name: "maxlength", Message: "Parameter Short Name should not be greater than 50 char." },
                // { name: "pattern", Message: "Special char not allowed." }
            ],
            parameterName: [
                // { name: "required", Message: "Parameter Name is required" },
                // { name: "maxlength", Message: "Parameter Name should not be greater than 50 char." },
                // { name: "pattern", Message: "Special char not allowed." }
            ],
            printParameterName: [
                // { name: "required", Message: "Print Parameter Name is required" },
                // { name: "maxlength", Message: "Print Parameter Name should not be greater than 50 char." },
                // { name: "pattern", Message: "Special char not allowed." }
            ],
            methodName: [
                // { name: "required", Message: "Method Name is required" },
            ],
            formula: [
                // { name: "required", Message: "Formula is required" },
            ],
            unitId: [
                // { name: "required", Message: "Unit Id is required" },
            ],
            sexId: [
                // { name: "required", Message: "Sex Id is required" },
            ],
            MinAge: [
                // { name: "required", Message: "Min Age is required" },
            ],
            MaxAge: [
                // { name: "required", Message: "Max Age is required" },
            ],
            AgeType: [
                // { name: "required", Message: "Age Type is required" },
            ],
            minValue: [
                // { name: "required", Message: "Min Value is required" },
            ],
            maxValue: [
                // { name: "required", Message: "Max Value is required" },
            ],
            paraId: [],
            defaultValue: [],
            paraMultipleRange:[]
            
        };
    }

    // public onEnterParameterShortName(event): void {
    //     if (event.which === 13) {
    //         this.vParameterName.nativeElement.focus();
    //     }
    // }
    // public onEnterParameterName(event): void {
    //     if (event.which === 13) {
    //         this.vPrintParameterName.nativeElement.focus();
    //     }
    // }
    // public onEnterPrintParameterName(event): void {
    //     if (event.which === 13) {
    //         this.vMethodName.nativeElement.focus();
    //     }
    // }
    // public onEnterMethodName(event): void {
    //     if (event.which === 13) {
    //         this.vFormula.nativeElement.focus();
    //     }
    // }
    // public onEnterFormula(event): void {
    //     if (event.which === 13) {
    //         this.UnitId.nativeElement.focus();
    //     }
    // }
    // public onEnterUnitId(event): void {
    //     if (event.which === 13) {
    //         this.UnitId.nativeElement.focus();
    //     }
    // }

    chkage() {
        const age = this.numericForm.get("minAge").value// this.myForm.get("ageYear")?.value;
        // debugger
        if (age < 0 || age > 120) {
            Swal.fire("Please Enter Valid Age..")
        }
    }

    keyPressAlphanumeric(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    selectChangeUnitId(obj: any) {
        console.log(obj);
        this.UnitId = obj;
    }

    onClear(val: boolean) {
        this.parameterForm.reset();
        this.dialogRef.close(val);
    }
    onClose() {
        this.parameterForm.reset({ isNumeric: ["1"] });
        this.numericForm.reset();
        this.dialogRef.close();
    }

    // checkFields(event) {
    //     // debugger
    //     const formValues = this.numericForm.value
    //     const fieldsTobeChecked =
    //         formValues.sexId
    //         // && formValues.genderName
    //         && formValues.minAge
    //         && formValues.maxAge
    //         && formValues.ageType
    //         && formValues.minValue
    //         && formValues.maxvalue;
    //     if (!fieldsTobeChecked) {
    //         event.preventDefault;
    //         this.toastr.warning('Please fill in all the fields in this row to add', 'Warning');
    //     }
    //     else {
    //         this.onAdd(event);
    //     }
    // }

    selectedGenderName: any;
    selectChangeGender(obj: any) {
        console.log(obj);
        this.selectedGenderName = obj.text
        // this.refdocId = obj.value
    }

    @ViewChild('minage') minage: ElementRef;
    @ViewChild('maxage') maxage: ElementRef;

    ageyearcheck(event) {

        if (parseInt(event) < 0) {
            this.toastr.warning('Please Enter Valid Minium Age ', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            this.minage.nativeElement.focus();
        }
        return;
    }

    ageyear1check(event) {
        if (parseInt(event) > 110) {
            this.toastr.warning('Please Enter Valid Maximum Age.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            this.maxage.nativeElement.focus();
        }
        return;
    }

    public onEnteragey(event, value): void {
        if (event.which === 13) {
            this.maxage.nativeElement.focus();

            this.ageyearcheck(value);
        }
    }
    public onEnteragem(event, value): void {
        if (event.which === 13) {
            this.ageyear1check(value);
            // this.maxage.nativeElement.focus();
        }
    }
    public onEntermin(event): void {
        if (event.which === 13) {
            this.maxage.nativeElement.focus();

        }
    }
    public onEntermax(event): void {
        if (event.which === 13) {
            this.maxage.nativeElement.focus();
        }
    }

    get f() {
        return this._ParameterService.myform.controls;
    }

    onEdit() {
    }
    // onDeleteRow(row: PathParaRangeAgeMaster) {
    //     const index = this.dsParameterAgeList.data.indexOf(row);
    //     if (index > -1) {
    //         this.dsParameterAgeList.data.splice(index, 1);
    //         this.dsParameterAgeList.data = [...this.dsParameterAgeList.data];

    //     }
    // }
    onDeleteRow(row: PathParaRangeAgeMaster) {
        debugger
        this.dsParameterAgeList.data =
            this.dsParameterAgeList.data.filter(item => item !== row);
    }

    removeItem(index: number) {
        this.selectedItems.splice(index, 1);
    }

    currentval = "";
    AddData1(val) {
        console.warn(val);
        this.currentval = this.currentval + "  " + val;
    }

    AddData(txt) {

        // console.log(this.descForm.get("paraId").value)
        txt = this.descForm.get('paraId').value + this.descForm.get('defaultValue').value

        if (txt.replace(/\s/g, '').length !== 0) {

            if (!this.selectedItems.includes(txt)) {
                this.selectedItems = this.selectedItems.concat(txt);
                this.selectedToAdd = [];

            }
            else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Duplicate Row',
                    text: 'You are adding a duplicate row.',
                    confirmButtonText: 'OK'
                });
            }
            this.descForm.get("paraId").reset();
            this.descForm.get("defaultValue").reset();
        }
    }

}

export class PathParaRangeAgeMaster {
    PathparaRangeId: any;
    ParaId: any;
    GenderName: any;
    GenderId: any;
    MinValue: any;
    MaxValue: any;
    AgeType: any;
    MinAge: any;
    MaxAge: any;
    IsDeleted: any;
    paraMultipleRange:any;
    /**
     * Constructor
     *
     * @param PathParaRangeAgeMaster
     */
    constructor(PathParaRangeAgeMaster) {
        {
            this.PathparaRangeId = PathParaRangeAgeMaster.PathparaRangeId || 0;
            this.ParaId = PathParaRangeAgeMaster.ParaId || 0;
            this.GenderName = PathParaRangeAgeMaster.GenderName || "";
            this.AgeType = PathParaRangeAgeMaster.AgeType || "";
            this.MinValue = PathParaRangeAgeMaster.MinValue || 0;
            this.MaxValue = PathParaRangeAgeMaster.MaxValue || 0;
            this.MinAge = PathParaRangeAgeMaster.MinAge || 0;
            this.MaxAge = PathParaRangeAgeMaster.MaxAge || 0;
            this.IsDeleted = PathParaRangeAgeMaster.IsDeleted || 1;
             this.paraMultipleRange = PathParaRangeAgeMaster.paraMultipleRange || '';
        }
    }
}
export class PathDescriptiveMaster {
    DescriptiveID: number;
    ParameterId: number;
    ParameterValues: String;
    IsDefaultValue: boolean;
    AddedBy: number;
    UpdatedBy: number;
    DefaultValue: String;
    /**
     * Constructor
     *
     * @param PathDescriptiveMaster
     */
    constructor(PathDescriptiveMaster) {
        {
            this.DescriptiveID = PathDescriptiveMaster.DescriptiveID || "";
            this.ParameterId = PathDescriptiveMaster.ParameterId || "";
            this.ParameterValues = PathDescriptiveMaster.ParameterValues || "";
            this.IsDefaultValue = PathDescriptiveMaster.IsDefaultValue || "";
            this.AddedBy = PathDescriptiveMaster.AddedBy || "";
            this.UpdatedBy = PathDescriptiveMaster.UpdatedBy || "";
            this.DefaultValue = PathDescriptiveMaster.DefaultValue || "";
        }
    }
}



