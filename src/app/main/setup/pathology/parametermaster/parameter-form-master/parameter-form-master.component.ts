import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { Router } from "@angular/router";
import { UntypedFormBuilder, FormGroup } from "@angular/forms";
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

    isPrintDisSummaryChecked: boolean = false;
    autocompleteModeUnitId: string = "Unit";

    ageType: string[] = ["Days", "Months", "Years"];

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
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService) { }

    ngOnInit(): void {
        debugger
        this.parameterForm = this._ParameterService.createParameterForm();
        this.numericForm = this._ParameterService.numericForm();
        this.descForm = this._ParameterService.descForm();

        this.selectedItems = [];
        this.dsParameterAgeList.data = [];

        if (this.data) {
            this.registerObj = this.data;
            this.vParameterId = this.registerObj.parameterId;
        }

        this.tableData = this.data.tableData;
        this.rowData = this.data.rowData;

        console.log("Received Row Data:", this.rowData);
        console.log("Received Table Data:", this.tableData);

        if (this.parameterForm.get("parameterId").value) {

            this.dsParameterAgeList.data = this._ParameterService.numericList;
            this.selectedItems = this._ParameterService.descriptiveList;
        }

        this.dsParameterAgeList.data = this.tableData;  // Assign received data
        this.dsParameterAgeList.data = [...this.dsParameterAgeList.data];

        this.selectedItems = [...this.tableData];
        this.selectedItems = [...this.selectedItems];

        var mdata = {
            parameterId: this.rowData?.parameterId,
            parameterShortName: this.rowData?.parameterShortName,
            parameterName: this.rowData?.parameterName,
            printParameterName: this.rowData?.printParameterName,
            MethodName: this.rowData?.methodName,
            Formula: this.rowData?.formula,
            unitId: this.rowData?.unitId,
            isNumeric: this.rowData?.isNumericParameter,
            isActive: JSON.stringify(this.rowData?.isActive),
        };
        this.parameterForm.patchValue(mdata);
    }

    OnSave() {
        debugger
        if (this._ParameterService.myform.get("IsBold").value)
            var BoldValue = "B"
        else
            var BoldValue = ""

        if (this._ParameterService.is_numeric)
            var is_numeric = "1"
        else
            var is_numeric = "0"

        var numeric_info = [];
        var mPathParaRangeMasters = [];
        var data2 = [];
        if (!this._ParameterService.is_numeric) {

            console.log('selected:', this.selectedItems)
            for (var val of this.selectedItems) {
                debugger
                var data = {
                    descriptiveId: 0,
                    parameterId: 0, //this.descForm.get("paraId").value, 
                    parameterValues: val.parameterValues,
                    isDefaultValue: val.DefaultValue ? true : false,
                    defaultValue: val.DefaultValue
                };
                data2.push(data);
            }
        }
        else {
            mPathParaRangeMasters = this.dsParameterAgeList.data.map((row: any) => ({
                "pathparaRangeId": 0,
                "paraId": 0,
                "sexId": row.sexId, //this.numericForm.get("sexId").value || 1,
                "minValue": row.minValue, //this.numericForm.get("minValue").value,
                "maxvalue": row.maxValue, //this.numericForm.get("maxvalue").value
            }));
            // var info: any = {
            //     paraId: 0 || +this._ParameterService.myform.get("parameterId").value,
            //     sexId: 0,
            //     minValue: "%",
            //     maxValue: "%",
            //     addedby:1,
            //     ageType: "%",
            //     minAge: 0,
            //     IsDeleted:this._ParameterService.myform.get("IsDeleted").value ||1,
            //     maxAge: 0
            // };
            // this.dsParameterAgeList.data.forEach(element => {
            //     let c = JSON.parse(JSON.stringify(info));
            //     c['sexId'] = element.GenderName == 'Male' ? 1 : element.GenderName == 'Female' ? 2 : 3;
            //     c['minValue'] = element.MinValue;
            //     c['minAge'] = +element.MinAge;
            //     c['maxAge'] = +element.MaxAge;
            //     c['maxvalue'] = element.MaxValue;
            //     c['ageType'] = element.AgeType;
            //     c['IsDeleted'] = element.IsDeleted;
            //   numeric_info.push(c)
            // });
        }

        if (!this.parameterForm.get("parameterId").value) {

            var m_data = {
                "parameterId": 0,
                "parameterShortName": this.parameterForm.get('parameterShortName').value,
                "parameterName": this.parameterForm.get('parameterName').value,
                "printParameterName": this.parameterForm.get('printParameterName').value,
                "unitId": this.parameterForm.get('unitId').value || 1,
                "isNumeric": is_numeric, //0,
                "MethodName": this.parameterForm.get('MethodName').value,
                "Formula": this.parameterForm.get('Formula').value,
                "isPrintDisSummary": true,
                "mParameterDescriptiveMasters": data2,
                "mPathParaRangeMasters": mPathParaRangeMasters, //numeric_info
            }
            console.log(m_data);

            this._ParameterService.insertParameterMaster(m_data).subscribe((data) => {

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
                    this.toastr.success('Record Saved Successfully.', 'Saved !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });
                }
            });
        } else {
            var m_data1 = {
                "parameterId": this.vParameterId,
                "parameterShortName": this.parameterForm.get('parameterShortName').value,
                "parameterName": this.parameterForm.get('parameterName').value,
                "printParameterName": this.parameterForm.get('printParameterName').value,
                "unitId": this.parameterForm.get('unitId').value,
                "isNumeric": is_numeric, //0,
                "MethodName": this.parameterForm.get('MethodName').value,
                "Formula": this.parameterForm.get('Formula').value,
                "isPrintDisSummary": true,
                "mParameterDescriptiveMasters": data2,
                "mPathParaRangeMasters": mPathParaRangeMasters, //numeric_info
            }
            console.log(m_data1);

            this._ParameterService.update1ParameterMaster(m_data1).subscribe((data) => {

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

                    this.toastr.success('Record Updated Successfully.', 'Updated !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });
                }
            });
        }

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

    onAdd(event) {

        let isNewRowUnique = true;
        debugger
        const newRow: any = {
            sexId: this.numericForm.get('sexId').value || "",
            minAge: this.numericForm.get('minAge').value,
            maxAge: this.numericForm.get('maxAge').value,
            minValue: this.numericForm.get('minValue').value,
            maxValue: this.numericForm.get('maxvalue').value,
            IsDeleted: 1,
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
        this.descForm.get("defaultValue").reset();
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
            MethodName: [
                // { name: "required", Message: "Method Name is required" },
            ],
            Formula: [
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
        };
    }

    public onEnterParameterShortName(event): void {
        if (event.which === 13) {
            this.vParameterName.nativeElement.focus();
        }
    }
    public onEnterParameterName(event): void {
        if (event.which === 13) {
            this.vPrintParameterName.nativeElement.focus();
        }
    }
    public onEnterPrintParameterName(event): void {
        if (event.which === 13) {
            this.vMethodName.nativeElement.focus();
        }
    }
    public onEnterMethodName(event): void {
        if (event.which === 13) {
            this.vFormula.nativeElement.focus();
        }
    }
    public onEnterFormula(event): void {
        if (event.which === 13) {
            this.UnitId.nativeElement.focus();
        }
    }
    public onEnterUnitId(event): void {
        if (event.which === 13) {
            this.UnitId.nativeElement.focus();
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
        this.parameterForm.reset({isNumeric: ["1"]});
        this.numericForm.reset();
        this.dialogRef.close();
    }

    checkFields(event) {
        const formValues = this.numericForm.value
        const fieldsTobeChecked =
            formValues.sexId
            && formValues.minAge
            && formValues.maxAge
            && formValues.ageType
            && formValues.minValue
            && formValues.maxvalue;
        if (!fieldsTobeChecked) {
            event.preventDefault;
            this.toastr.warning('Please fill in all the fields in this row to add', 'Warning');
        }
        else {
            this.onAdd(event);
        }
    }

    selectChangeGender(obj: any) {
        console.log(obj);
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
    onDeleteRow(row: PathParaRangeAgeMaster) {
        const index = this.dsParameterAgeList.data.indexOf(row);
        if (index > -1) {
            this.dsParameterAgeList.data.splice(index, 1);
            this.dsParameterAgeList.data = [...this.dsParameterAgeList.data];

        }
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
        debugger
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



