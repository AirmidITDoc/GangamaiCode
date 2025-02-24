import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { Router } from "@angular/router";
import { FormBuilder, FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ParametermasterService } from "../parametermaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { map, startWith, takeUntil } from "rxjs/operators";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { ParametermasterComponent } from "../parametermaster.component";
import { AuthenticationService } from "app/core/services/authentication.service";

@Component({
    selector: "app-parameter-form-master",
    templateUrl: "./parameter-form-master.component.html",
    styleUrls: ["./parameter-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})

export class ParameterFormMasterComponent implements OnInit {
    isPrintDisSummaryChecked: boolean = false;

    ageType: string[] = ["DAY", "MONTH", "YEAR"];

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
    registerObj: any;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    ChargeList:any=[];
    dsTemparoryList = new MatTableDataSource<PathDescriptiveMaster>();
    dataSource = new MatTableDataSource<PathDescriptiveMaster>();
    dsParameterAgeList = new MatTableDataSource<PathParaRangeAgeMaster>();

    constructor(
        public _ParameterService: ParametermasterService,
        private accountService: AuthenticationService,
        public dialogRef: MatDialogRef<ParametermasterComponent>,
        public _matDialog: MatDialog,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
        private router: Router
    ) { }

    ngOnInit(): void {
        
        this.selectedItems = [];
        this.dsParameterAgeList.data = [];
        // this._ParameterService.is_numeric = true;
        this.getunitNameCombobox();
        this.getGenderNameCombobox();
        this.getDscriptiveMasterList();

        if (this.data) {
            this.getUnitNameCombobox();
            this.registerObj = this.data.registerObj;
            debugger
           // if()
            this._ParameterService.myform.get("IsBold").setValue(this.registerObj.IsBoldFlag == 'B'? 1: 0);
        }
        console.log(this.data)
        if (this._ParameterService.myform.get("ParameterID").value) {

            this.dsParameterAgeList.data = this._ParameterService.numericList;
            this.selectedItems = this._ParameterService.descriptiveList;
        }


        this.filteredOptionsUnit = this._ParameterService.myform.get('UnitId').valueChanges.pipe(
            startWith(''),
            map(value => this._filterUnit(value)),
        );


       

    }

    getGenderNameCombobox() {
        debugger
        this._ParameterService.getGenderMasterCombo().subscribe(data => {
            this.GendercmbList = data;
            console.log(this.GendercmbList);
        });
    }

    getUnitNameCombobox() {
        this._ParameterService.getUnitMasterCombo().subscribe((data) => {
            this.UnitcmbList = data;
            console.log(this.UnitcmbList)
            if (this.data) {
                const toSelectUnitId = this.UnitcmbList.find(c => c.UnitId == this.registerObj.UnitId);
                this._ParameterService.myform.get('UnitId').setValue(toSelectUnitId);

            }
        });
    }

    private _filterunit(value: any): string[] {
        if (value) {
            const filterValue = value && value.UnitName ? value.UnitName.toLowerCase() : value.toLowerCase();
            return this.optionsUnit.filter(option => option.UnitName.toLowerCase().includes(filterValue));
        }

    }

    private _filterUnit(value: any): string[] {
        if (value) {
          const filterValue = value && value.UnitName ? value.UnitName.toLowerCase() : value.toLowerCase();
          return this.UnitcmbList.filter(option => option.UnitName.toLowerCase().includes(filterValue));
        }
      }
    
    getunitNameCombobox() {
    this._ParameterService.getUnitMasterCombo().subscribe(data => {
      this.UnitcmbList = data;
      this.optionsUnit = this.UnitcmbList.slice();
      this.filteredOptionsUnit = this._ParameterService.myform.get('UnitId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterUnit(value) : this.UnitcmbList.slice()),
      );
    });
  }


    getOptionTextUnit(option) {
        return option && option.UnitName ? option.UnitName : " ";
    }


    getDscriptiveMasterList() {
        this._ParameterService.getDescriptiveMasterList().subscribe((Menu) => {
            this.dataSource.data = Menu as PathDescriptiveMaster[];
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            console.log(Menu)
        });
    }
    onClear() {
        this._ParameterService.myform.reset();
    }
    onClose() {
        this._ParameterService.myform.reset();
        this.dialogRef.close();
    }
    checkFields(event) {

        const formValues = this._ParameterService.myform.value
        const fieldsTobeChecked = formValues.SexID
            && formValues.MinAge
            && formValues.MaxAge
            && formValues.AgeType
            && formValues.MinValue
            && formValues.MaxValue;
        if (!fieldsTobeChecked) {
            event.preventDefault;
            this.toastr.warning('Please fill in all the fields in this row to add', 'Warning');
        }
        else this.onAdd(event);


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

        const newRow: any = {
            GenderName: this._ParameterService.myform.get('SexID').value.GenderName || "",
            MinAge: this.vMinAge || 0,
            MaxAge: this.vMaxAge || 0,
            MinValue: this.vMinValue || 0,
            MaxValue: this.vMaxValue || 0,
            IsDeleted:1,
            AgeType: this._ParameterService.myform.value.AgeType,
        };

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
        this._ParameterService.myform.get("SexID").reset();
        this._ParameterService.myform.get("MinAge").reset();
        this._ParameterService.myform.get("MaxAge").reset();
        this._ParameterService.myform.get("MinValue").reset();
        this._ParameterService.myform.get("MaxValue").reset();
        this._ParameterService.myform.get("AgeType").reset();
    }

    @ViewChild('minage') minage: ElementRef;
    @ViewChild('maxage') maxage: ElementRef;
    // @ViewChild('purpose') purpose: ElementRef;

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
    public onEntermin(event, value): void {
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

    onSubmit() {
        const invalid = [];
        const controls = this._ParameterService.myform.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        console.log(invalid);
        
        if(this._ParameterService.myform.get("IsBold").value)
            var BoldValue="B"
        else
         var BoldValue=""

         if(this._ParameterService.is_numeric)
            var is_numeric="1"
        else
         var is_numeric="0"

        var numeric_info = [];
        var data2 = [];
        if (!this._ParameterService.is_numeric) {

            for (var val of this.selectedItems) {
                var data = {
                    parameterID: +this._ParameterService.descform.get("ParaId").value || 0,
                    parameterValues: val,
                    isDefaultValue: this._ParameterService.descform.get("DefaultValue").value ? true : false,
                    addedby: this.accountService.currentUserValue.user.id,
                    defaultValue: this._ParameterService.descform.get("DefaultValue").value ? this._ParameterService.descform.get("DefaultValue").value.trim() : "%",
                };
                data2.push(data);
            }
        }
        else {
            var info: any = {
                paraId: 0 || +this._ParameterService.myform.get("ParameterID").value,
                sexId: 0,
                minValue: "%",
                MaxValue: "%",
                addedby: this.accountService.currentUserValue.user.id || 1,
                ageType: "%",
                minAge: 0,
                IsDeleted:this._ParameterService.myform.get("IsDeleted").value ||1,
                maxAge: 0
            };
            this.dsParameterAgeList.data.forEach(element => {
                let c = JSON.parse(JSON.stringify(info));
                c['sexId'] = element.GenderName == 'Male' ? 1 : element.GenderName == 'Female' ? 2 : 3;
                c['minValue'] = element.MinValue;
                c['minAge'] = +element.MinAge;
                c['maxAge'] = +element.MaxAge;
                c['MaxValue'] = element.MaxValue;
                c['ageType'] = element.AgeType;
                c['IsDeleted'] = element.IsDeleted;
              numeric_info.push(c)
            });
        }


        var PathParameterMasterInsert = {
            parameterShortName: this._ParameterService.myform.get("ParameterShortName").value.trim() || "",
            parameterName: this._ParameterService.myform.get("ParameterName").value.trim() || "%",
            printParameterName: this._ParameterService.myform.get("PrintParameterName").value.trim() || "",
            methodName: this._ParameterService.myform.get("MethodName").value || "",
            IsBoldFlag: BoldValue, //this._ParameterService.myform.get("IsBold").value || 'B',
            formula: this._ParameterService.myform.get("Formula").value || "",
            unitId: this._ParameterService.myform.get("UnitId").value.UnitId || 0,
            isNumeric: is_numeric,
            isDeleted:Boolean(JSON.parse(this._ParameterService.myform.get("IsDeleted").value)),
            parameterID: this._ParameterService.myform.get("ParameterID").value || 0,
            isPrintDisSummary: Boolean(JSON.parse(this._ParameterService.myform.get("IsPrintDisSummary").value))
        }

        var m_data = {}

        if (this._ParameterService.is_numeric) {
            m_data['parameterRangeWithAgeMasterInsert'] = numeric_info;
            m_data['parameterRangeWithAgeMasterDelete'] = { parameterId: this._ParameterService.myform.get("ParameterID").value || 0, };
        } else {
            m_data['parameterDescriptiveMasterInsert'] = data2;
            m_data['descriptiveParameterMasterDelete'] = { parameterId: this._ParameterService.myform.get("ParameterID").value || 0, }
        }

        if (!this._ParameterService.myform.get("ParameterID").value) {
            PathParameterMasterInsert['addedby'] = this.accountService.currentUserValue.user.id || 1;
            m_data['pathParameterMasterInsert'] = PathParameterMasterInsert;
            console.log(m_data);

            this._ParameterService.insertParameterMaster(m_data).subscribe((data) => {
                
                if (data) {
                    this._ParameterService.myform.reset();
                    // this._ParameterService.myform.get("IsDeleted").setValue(false);
                    this.selectedItems = [];
                    this.dsParameterAgeList.data = [];

                    this.toastr.success('Record Saved Successfully.', 'Saved !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });
                } 
            });
        } else {
            PathParameterMasterInsert['updatedby'] = this.accountService.currentUserValue.user.id || 1;
            m_data['pathParameterMasterUpdate'] = PathParameterMasterInsert;

            console.log(m_data)
            this._ParameterService.updateParameterMaster(m_data).subscribe((data) => {this.msg = data;if (data) {
                        this._ParameterService.myform.reset();
                       this.toastr.success('Record updated Successfully.', 'Updated !', {
                            toastClass: 'tostr-tost custom-toast-success',
                        });
                    } else {
                        this.toastr.error('Parameter-Form Master Data not saved !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    }
                });

        }

        this.onClear();
        // }

        this.onClose()
    }




    onEdit(row) {
        var m_data = {
            ParameterID: row.ParameterID,
            ParameterShortName: row.ParameterShortName.trim(),
            ParameterName: row.ParameterName.trim(),
            PrintParameterName: row.PrintParameterName.trim(),
            UnitId: row.UnitId,
            IsNumeric: row.IsNumeric,
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
            IsPrintDisSummary: JSON.stringify(row.IsPrintDisSummary),
            MethodName: row.MethodName.trim(),
            ParaMultipleRange: row.ParaMultipleRange,
        };
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
    //for list
    selectedToAdd: any;
    groupsArray: any = [];
    selectedItems: any = [];
    isTxtUnique = true;

    AddData(txt) {
        debugger
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
        }
    }

    
    onAddDescrow(event) {
        console.log("event is :" + event)

        // for parameters
        // this.DSTestList.data = [];
        this.ChargeList = this.dsTemparoryList.data;
       
        this.ChargeList.push(
            {
                //ParameterID: this._ParameterService.descform.get("ParaId").value,
                ParameterName:this._ParameterService.descform.get("ParaId").value,
                DefaultValue:this._ParameterService.descform.get("DefaultValue").value,
            });
        this.dsTemparoryList.data = this.ChargeList;

        // let temp = this.paramterList.data;
       
        // temp.splice(temp.findIndex(item => item.ParameterName === event.ParameterName), 1);
       
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
    IsDeleted:any;
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
