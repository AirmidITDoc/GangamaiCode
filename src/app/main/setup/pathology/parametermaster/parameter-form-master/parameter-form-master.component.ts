import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { Router } from "@angular/router";
import { FormBuilder, FormControl } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ParametermasterService } from "../parametermaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { ReplaySubject, Subject } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { takeUntil } from "rxjs/operators";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { ParametermasterComponent } from "../parametermaster.component";

@Component({
    selector: "app-parameter-form-master",
    templateUrl: "./parameter-form-master.component.html",
    styleUrls: ["./parameter-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})

export class ParameterFormMasterComponent implements OnInit {
    isPrintDisSummaryChecked: boolean = false;

    ageType: string[] = ["Days", "Months", "Years"];

    displayedColumns: string[] = [
        "GenderName",
        "MinAge",
        "MaxAge",
        "MinValue",
        "Maxvalue",
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
    vMaxvalue: any;
    msg: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    // uitname filter
    // public unitnameFilterCtrl: FormControl = new FormControl();
    // public filteredUnitname: ReplaySubject<any> = new ReplaySubject<any>(1);

    // // prefix filter
    // public parameternameFilterCtrl: FormControl = new FormControl();
    // public filteredParametername: ReplaySubject<any> = new ReplaySubject<any>(
    //     1
    // );

    // private _onDestroy = new Subject<void>();

    dataSource = new MatTableDataSource<PathDescriptiveMaster>();
    dsParameterAgeList = new MatTableDataSource<PathParaRangeAgeMaster>();


    constructor(
        public _ParameterService: ParametermasterService,

        public dialogRef: MatDialogRef<ParametermasterComponent>,
        public _matDialog: MatDialog,
        private formBuilder: FormBuilder,
        public toastr: ToastrService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // debugger;
        // this.getParameterNameCombobox();
        this.getUnitNameCombobox();
        this.getGenderNameCombobox();
        this.getDscriptiveMasterList();
        //this.getParameterNameCombobox();

        // this.unitnameFilterCtrl.valueChanges
        //     .pipe(takeUntil(this._onDestroy))
        //     .subscribe(() => {
        //         this.filterUnitname();
        //     });
    }
    getGenderNameCombobox() {
        this._ParameterService.getGenderMasterCombo().subscribe(data => {
            this.GendercmbList = data;
            console.log(this.GendercmbList);
        });
    }
    getUnitNameCombobox() {

        this._ParameterService.getUnitMasterCombo().subscribe((data) => {
            this.UnitcmbList = data;
            //this.filteredUnitname.next(this.UnitcmbList.slice());
            // if (this.data) {
            //     const toSelectSexId = this.UnitcmbList.find(c => c.GenderName == this.registerObj.GenderName);
            //     this._ParameterService.myform.get('SexId').setValue(toSelectSexId);
            //    //console.log(toSelectGSTType);  
            //   console.log(this.registerObj); 
            //    } 
        });
    }
    getDscriptiveMasterList() {
        this._ParameterService.getDescriptiveMasterList().subscribe((Menu) => {
            this.dataSource.data = Menu as PathDescriptiveMaster[];
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }
    onClear() {
        this._ParameterService.myform.reset();
    }
    onClose() {
        this._ParameterService.myform.reset();
        this.dialogRef.close();
    }

    public show: boolean = true; //numeric
    public show1: boolean = false; ///descriptive

    toggle() {
        if (this.show = true) {
            this.show = true;
        }
        this.show1 = false;
        this._ParameterService.myform.reset();
        this.dsParameterAgeList.data = []
    }

    toggle1() {
        if (this.show1 = true) {
            this.show1 = true;
        }
        this.show = false;
        this._ParameterService.myform.reset();
        this.selectedItems = []
    }

    onAdd(event) {
        let isNewRowUnique = true;

        const newRow: any = {
            GenderName: this._ParameterService.myform.get('SexID').value.GenderName || "",
            MinAge: this.vMinAge || 0,
            MaxAge: this.vMaxAge || 0,
            MinValue: this.vMinValue || 0,
            Maxvalue: this.vMaxvalue || 0,
            AgeType: this._ParameterService.myform.get('AgeType').value || "",
        };
        debugger;
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
    }


    // unitname filter
    // private filterUnitname() {
    //     if (!this.UnitcmbList) {
    //         return;
    //     }
    //     // get the search keyword
    //     let search = this.unitnameFilterCtrl.value;
    //     if (!search) {
    //         this.filteredUnitname.next(this.UnitcmbList.slice());
    //         return;
    //     } else {
    //         search = search.toLowerCase();
    //     }
    //     // filter the banks
    //     this.filteredUnitname.next(
    //         this.UnitcmbList.filter(
    //             (bank) => bank.UnitName.toLowerCase().indexOf(search) > -1
    //         )
    //     );
    // }

    get f() {
        return this._ParameterService.myform.controls;
    }



    // getParameterNameCombobox() {
    //     this._ParameterService
    //         .getParameterMasterCombo()
    //         .subscribe((data) => (this.Parametercmb = data));
    // }



    // getParameterName1Combobox() {
    //     this._ParameterService
    //         .getParameterMasterCombo()
    //         .subscribe((data) => (this.Parametercmblist = data));
    // }

    //Descriptive master



    onSubmit() {
        debugger;
        if (this._ParameterService.myform.valid) {
            if (!this._ParameterService.myform.get("ParameterID").value) {
                if (this._ParameterService.myform.get("IsNumeric").value == "'2") {
                    var data2 = [];
                    for (var val of this._ParameterService.myform.get(
                        "parameterValues"
                    ).value) {
                        var data = {
                            parameterId: 0,
                            parameterValues: val,
                            isDefaultValue: 0,
                            addedBy: 1,
                            defaultValue:
                                this._ParameterService.myform
                                    .get("DefaultValue")
                                    .value.trim() || "%",
                        };
                        data2.push(data);
                    }

                    console.log(data2);
                }

                var m_data = {
                    pathParameterMasterInsert: {
                        parameterShortName:
                            this._ParameterService.myform
                                .get("ParameterShortName")
                                .value.trim() || "%",
                        parameterName:
                            this._ParameterService.myform
                                .get("ParameterName")
                                .value.trim() || "%",
                        printParameterName:
                            this._ParameterService.myform
                                .get("PrintParameterName")
                                .value.trim() || "%",
                        methodName:
                            this._ParameterService.myform
                                .get("MethodName")
                                .value.trim() || "%",
                        unitId:
                            this._ParameterService.myform.get("UnitId").value ||
                            1,
                        isNumeric:
                            this._ParameterService.myform.get("IsNumeric")
                                .value!=2 ? true : false ,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._ParameterService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        addedBy: 1,
                        isPrintDisSummary: Boolean(
                            JSON.parse(
                                this._ParameterService.myform.get(
                                    "IsPrintDisSummary"
                                ).value
                            )
                        ),
                        // methodName: " ", // (this._ParameterService.myform.get("MethodName").value).trim(),
                        // paraMultipleRange: " ", // this._ParameterService.myform.get("ParaMultipleRange").value,
                        parameterID: 0, // this._ParameterService.myform.get("ParameterID").value,
                    },
                    parameterDescriptiveMasterInsert: {
                        paraId:
                            "0" ||
                            this._ParameterService.myform.get("ParameterID")
                                .value,
                        sexId: 1, // this._ParameterService.myform.get("SexId").value,
                        minValue:
                            this._ParameterService.myform
                                .get("MinValue")
                                .value.trim() || "%",
                        maxvalue:
                            this._ParameterService.myform
                                .get("Maxvalue")
                                .value.trim() || "%",
                        // isDeleted: 0, // Boolean(JSON.parse(this._ParameterService.myform.get("IsDeleted").value)),
                        addedby: 218, // this.accountService.currentUserValue.user.id ,
                        ageType: this._ParameterService.myform.get("AgeType").value.trim()||"%",
                        minAge:
                            this._ParameterService.myform.get("MinAge")
                                .value,
                        maxAge:
                            this._ParameterService.myform.get("MaxAge")
                                .value,
                    },
                    // insertAssignParameterToDescriptives: data2,
                };

                this._ParameterService
                    .insertParameterMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                            });
                        } else {
                            this.toastr.error('Parameter-Form Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                            });
                        }
                    }, error => {
                        this.toastr.error('Parameter-Form not saved !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    });
            } else {
                if (this._ParameterService.myform.get("IsNumeric").value == 2) {
                    var data3 = [];
                    for (var val of this._ParameterService.myform.get(
                        "ParameterValues"
                    ).value) {
                        var data4 = {
                            parameterId:
                                this._ParameterService.myform.get("ParameterID")
                                    .value,
                            parameterValues: val,
                            isDefaultValue: 0,
                            addedBy: 1,
                            defaultValue:
                                this._ParameterService.myform
                                    .get("DefaultValue")
                                    .value.trim() || "%",
                        };
                        data3.push(data4);
                    }
                }
                var m_dataUpdate = {
                    updateParameterMaster: {
                        parameterId:
                            this._ParameterService.myform.get("ParameterID")
                                .value,
                        parameterShortName:
                            this._ParameterService.myform
                                .get("ParameterShortName")
                                .value.trim() || "%",
                        parameterName:
                            this._ParameterService.myform
                                .get("ParameterName")
                                .value.trim() || "%",
                        printParameterName:
                            this._ParameterService.myform
                                .get("PrintParameterName")
                                .value.trim() || "%",
                        unitId: this._ParameterService.myform.get("UnitId")
                            .value,
                        isNumeric:
                            this._ParameterService.myform.get("IsNumeric")
                                .value,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._ParameterService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        updatedBy: 1,
                        isPrintDisSummary: Boolean(
                            JSON.parse(
                                this._ParameterService.myform.get(
                                    "IsPrintDisSummary"
                                ).value
                            )
                        ),
                        // paraMultipleRange: "", // this._ParameterService.myform.get("ParaMultipleRange").value || "0",
                        // methodName: " ", // (this._ParameterService.myform.get("MethodName").value).trim() || "%",
                    },
                    deleteAssignParameterToRange: {
                        paraId: this._ParameterService.myform.get("ParameterID")
                            .value,
                    },
                    insertParameterMasterRangeWise: {
                        // "PathparaRangeId":"0",//this._ParameterService.myform.get("PathparaRangeId").value,
                        paraId: this._ParameterService.myform.get("ParameterID")
                            .value,
                        sexId: 1, // this._ParameterService.myform.get("SexId").value,
                        minValue:
                            this._ParameterService.myform
                                .get("MinValue")
                                .value.trim() || "%",
                        maxvalue:
                            this._ParameterService.myform
                                .get("Maxvalue")
                                .value.trim() || "%",
                        isDeleted: 0, // Boolean(JSON.parse(this._ParameterService.myform.get("IsDeleted").value)),
                        addedby: 218, // this.accountService.currentUserValue.user.id ,
                    },
                    deleteAssignParameterToDescriptive: {
                        parameterId:
                            this._ParameterService.myform.get("ParameterID")
                                .value,
                    },
                    insertAssignParameterToDescriptives: data3,
                };

                this._ParameterService
                    .updateParameterMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                            });
                        } else {
                            this.toastr.error('Parameter-Form Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                            });
                        }
                    }, error => {
                        this.toastr.error('Parameter-Form not updated !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
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
        if (txt.replace(/\s/g, '').length !== 0) {

            if (!this.selectedItems.includes(txt)) {
                this.selectedItems = this.selectedItems.concat(txt);
                this.selectedToAdd = [];
            }
        }
    }
}
export class PathParaRangeAgeMaster {
    PathparaRangeId: any;
    ParaId: any;
    GenderName: any;
    MinValue: any;
    Maxvalue: any;
    AgeType: any;
    MinAge: any;
    MaxAge: any;
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
            this.AgeType = PathParaRangeAgeMaster.AgeType || 0;
            this.MinValue = PathParaRangeAgeMaster.MinValue || 0;
            this.Maxvalue = PathParaRangeAgeMaster.Maxvalue || 0;
            this.MinAge = PathParaRangeAgeMaster.MinAge || 0;
            this.MaxAge = PathParaRangeAgeMaster.MaxAge || 0;

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
