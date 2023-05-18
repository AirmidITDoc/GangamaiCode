import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import {
    ParametermasterComponent,
    PathDescriptiveMaster,
    PathParaRangeMaster,
} from "../parametermaster.component";
import { Router } from "@angular/router";
import { FormBuilder, FormControl } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ParametermasterService } from "../parametermaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { ReplaySubject, Subject } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "app-parameter-form-master",
    templateUrl: "./parameter-form-master.component.html",
    styleUrls: ["./parameter-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ParameterFormMasterComponent implements OnInit {
    submitted = false;
    isLoading = true;
    isHidden: boolean = true;
    UnitcmbList: any = [];
    Parametercmb: any = [];
    GendercmbList: any = [];
    Parametercmblist: any = [];

    msg: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    // uitname filter
    public unitnameFilterCtrl: FormControl = new FormControl();
    public filteredUnitname: ReplaySubject<any> = new ReplaySubject<any>(1);

    // prefix filter
    public parameternameFilterCtrl: FormControl = new FormControl();
    public filteredParametername: ReplaySubject<any> = new ReplaySubject<any>(
        1
    );

    private _onDestroy = new Subject<void>();

    dataSource = new MatTableDataSource<PathDescriptiveMaster>();
    dataSource1 = new MatTableDataSource<PathParaRangeMaster>();

    constructor(
        public _ParameterService: ParametermasterService,

        public dialogRef: MatDialogRef<ParametermasterComponent>,
        public _matDialog: MatDialog,
        private formBuilder: FormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {
        // debugger;
        this.getParameterNameCombobox();
        this.getUnitNameCombobox();
        this.getParameterName1Combobox();
        //  this.getParameteragewiseMasterList();
        this.getGenderNameCombobox();
        this.getDscriptiveMasterList();
        this.getParameterNameCombobox();

        this.unitnameFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterUnitname();
            });
    }

    // unitname filter
    private filterUnitname() {
        if (!this.UnitcmbList) {
            return;
        }
        // get the search keyword
        let search = this.unitnameFilterCtrl.value;
        if (!search) {
            this.filteredUnitname.next(this.UnitcmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredUnitname.next(
            this.UnitcmbList.filter(
                (bank) => bank.UnitName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    get f() {
        return this._ParameterService.myform.controls;
    }

    getUnitNameCombobox() {
        // this._ParameterService.getUnitMasterCombo().subscribe(data => this.UnitcmbList =data);

        this._ParameterService.getUnitMasterCombo().subscribe((data) => {
            this.UnitcmbList = data;
            this.filteredUnitname.next(this.UnitcmbList.slice());
        });
    }

    getParameterNameCombobox() {
        this._ParameterService
            .getParameterMasterCombo()
            .subscribe((data) => (this.Parametercmb = data));
    }

    getGenderNameCombobox() {
        this._ParameterService
            .getGenderMasterCombo()
            .subscribe((data) => (this.GendercmbList = data));
    }

    getParameterName1Combobox() {
        this._ParameterService
            .getParameterMasterCombo()
            .subscribe((data) => (this.Parametercmblist = data));
    }

    //Descriptive master

    getDscriptiveMasterList() {
        this._ParameterService.getDescriptiveMasterList().subscribe((Menu) => {
            this.dataSource.data = Menu as PathDescriptiveMaster[];
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }

    onSubmit() {
        debugger;
        if (this._ParameterService.myform.valid) {
            if (!this._ParameterService.myform.get("ParameterID").value) {
                if (this._ParameterService.myform.get("IsNumeric").value == 2) {
                    var data2 = [];
                    for (var val of this._ParameterService.myform.get(
                        "parameterValues"
                    ).value) {
                        var data = {
                            parameterValues: val,
                            ParameterID: 0,
                            IsDefaultValue: 0,
                            DefaultValue:
                                this._ParameterService.myform
                                    .get("DefaultValue")
                                    .value.trim() || "%",
                           
                        };
                        data2.push(data);
                    }

                    console.log(data2);
                }

                var m_data = {
                    insertParameterMaster: {
                        ParameterID: 0, // this._ParameterService.myform.get("ParameterID").value,
                        ParameterShortName:
                            this._ParameterService.myform
                                .get("ParameterShortName")
                                .value.trim() || "%",
                        ParameterName:
                            this._ParameterService.myform
                                .get("ParameterName")
                                .value.trim() || "%",
                        PrintParameterName:
                            this._ParameterService.myform
                                .get("PrintParameterName")
                                .value.trim() || "%",
                        UnitId:
                            this._ParameterService.myform.get("UnitId").value ||
                            "0",
                        IsNumeric:
                            this._ParameterService.myform.get("IsNumeric")
                                .value,
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._ParameterService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                      
                        IsPrintDisSummary: Boolean(
                            JSON.parse(
                                this._ParameterService.myform.get(
                                    "IsPrintDisSummary"
                                ).value
                            )
                        ),
                        MethodName: " ", // (this._ParameterService.myform.get("MethodName").value).trim(),
                        ParaMultipleRange: " ", // this._ParameterService.myform.get("ParaMultipleRange").value,
                    },
                    insertParameterMasterRangeWise: {
                        ParaId:
                            "0" ||
                            this._ParameterService.myform.get("ParameterID")
                                .value,
                        SexId: 1, // this._ParameterService.myform.get("SexId").value,
                        MinValue:
                            this._ParameterService.myform
                                .get("MinValue")
                                .value.trim() || "%",
                        Maxvalue:
                            this._ParameterService.myform
                                .get("Maxvalue")
                                .value.trim() || "%",
                        IsDeleted: 0, // Boolean(JSON.parse(this._ParameterService.myform.get("IsDeleted").value)),
                        Addedby: 218, // this.accountService.currentUserValue.user.id ,
                    },
                    insertAssignParameterToDescriptives: data2,
                };

                this._ParameterService
                    .insertParameterMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.msg = data;
                    });
               
            } else {
                if (this._ParameterService.myform.get("IsNumeric").value == 2) {
                    var data3 = [];
                    for (var val of this._ParameterService.myform.get(
                        "ParameterValues"
                    ).value) {
                        var data4 = {
                            ParameterValues: val,
                            ParameterID:
                                this._ParameterService.myform.get("ParameterID")
                                    .value,
                            DefaultValue:
                                this._ParameterService.myform
                                    .get("DefaultValue")
                                    .value.trim() || "%",
                            
                        };
                        data3.push(data4);
                    }
                }
                var m_dataUpdate = {
                    updateParameterMaster: {
                        ParameterID:
                            this._ParameterService.myform.get("ParameterID")
                                .value,
                        ParameterShortName:
                            this._ParameterService.myform
                                .get("ParameterShortName")
                                .value.trim() || "%",
                        ParameterName:
                            this._ParameterService.myform
                                .get("ParameterName")
                                .value.trim() || "%",
                        PrintParameterName:
                            this._ParameterService.myform
                                .get("PrintParameterName")
                                .value.trim() || "%",
                        UnitId: this._ParameterService.myform.get("UnitId")
                            .value,
                        IsNumeric:
                            this._ParameterService.myform.get("IsNumeric")
                                .value,
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._ParameterService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                       
                        IsPrintDisSummary: Boolean(
                            JSON.parse(
                                this._ParameterService.myform.get(
                                    "IsPrintDisSummary"
                                ).value
                            )
                        ),
                        MethodName: " ", // (this._ParameterService.myform.get("MethodName").value).trim() || "%",
                        ParaMultipleRange: "", // this._ParameterService.myform.get("ParaMultipleRange").value || "0"
                    },
                    deleteAssignParameterToRange: {
                        ParaId: this._ParameterService.myform.get("ParameterID")
                            .value,
                    },
                    insertParameterMasterRangeWise: {
                        // "PathparaRangeId":"0",//this._ParameterService.myform.get("PathparaRangeId").value,
                        ParaId: this._ParameterService.myform.get("ParameterID")
                            .value,
                        SexId: 1, // this._ParameterService.myform.get("SexId").value,
                        MinValue:
                            this._ParameterService.myform
                                .get("MinValue")
                                .value.trim() || "%",
                        Maxvalue:
                            this._ParameterService.myform
                                .get("Maxvalue")
                                .value.trim() || "%",
                        IsDeleted: 0, // Boolean(JSON.parse(this._ParameterService.myform.get("IsDeleted").value)),
                        Addedby: 218, // this.accountService.currentUserValue.user.id ,
                    },
                    deleteAssignParameterToDescriptive: {
                        ParameterId:
                            this._ParameterService.myform.get("ParameterID")
                                .value,
                    },
                    insertAssignParameterToDescriptives: data3,
                };

                this._ParameterService
                    .updateParameterMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                    });
                
            }
            this.onClear();
        }
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

    onClear() {
        this._ParameterService.myform.reset();
    }
    onClose() {
        this._ParameterService.myform.reset();
        this.dialogRef.close();
    }

    public show: boolean = false;
    public show1: boolean = false;

    toggle() {
        if (this.show1 == false) {
            this.show1 = true;
            this.toggle1();
        }
        this.show = !this.show;
    }

    toggle1() {
        if (this.show == false) {
            this.show = true;
            this.toggle();
        }
        this.show1 = !this.show1;
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

    AddData(txt) {
        console.log(txt);
        this.selectedItems = this.selectedItems.concat(txt);
        this.selectedToAdd = [];
    }
}
