import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import { ReplaySubject, Subject } from "rxjs";
import {
    ParamteragewiseComponent,
    PathparameterAgeWiseMaster,
} from "../paramteragewise.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ParamteragewiseService } from "../paramteragewise.service";
import { takeUntil } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";

@Component({
    selector: "app-paramteragewiseform",
    templateUrl: "./paramteragewiseform.component.html",
    styleUrls: ["./paramteragewiseform.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ParamteragewiseformComponent implements OnInit {
    submitted = false;
    isLoading = true;
    Parametercmb: any = [];
    GendercmbList: any = [];
    Parametercmblist: [];

    msg: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    //parametername filter
    public parameternameFilterCtrl: FormControl = new FormControl();
    public filteredParametername: ReplaySubject<any> = new ReplaySubject<any>(
        1
    );

    //parametername filter
    public gendernameFilterCtrl: FormControl = new FormControl();
    public filteredGendername: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    dataSource = new MatTableDataSource<PathparameterAgeWiseMaster>();

    constructor(
        public _ParameterageService: ParamteragewiseService,
        public dialogRef: MatDialogRef<ParamteragewiseComponent>,
        public _matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getParameterNameCombobox();
        this.getGenderNameCombobox();
        //this.getParameteragewiseMasterList();

        this.parameternameFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterParametername();
            });

        this.gendernameFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterGendername();
            });
    }

    get f() {
        return this._ParameterageService.myform.controls;
    }

    // parameter filter
    private filterParametername() {
        if (!this.Parametercmb) {
            return;
        }
        // get the search keyword
        let search = this.parameternameFilterCtrl.value;
        if (!search) {
            this.filteredParametername.next(this.Parametercmb.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredParametername.next(
            this.Parametercmb.filter(
                (bank) => bank.ParameterName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    // gender filter
    private filterGendername() {
        if (!this.GendercmbList) {
            return;
        }
        // get the search keyword
        let search = this.parameternameFilterCtrl.value;
        if (!search) {
            this.filteredGendername.next(this.GendercmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredGendername.next(
            this.GendercmbList.filter(
                (bank) => bank.GenderName.toLowerCase().indexOf(search) > -1
            )
        );
    }
    onSearchClear() {
        this._ParameterageService.myformSearch.reset({
            ParameterAgeNameSearch: "",
            IsDeletedSearch: "2",
        });
    }

    onClear() {
        this._ParameterageService.myform.reset({ IsDeleted: "false" });
        this._ParameterageService.initializeFormGroup();
    }

    getParameterNameCombobox() {
        this._ParameterageService
            .getParameterMasterCombo()
            .subscribe((data) => {
                this.Parametercmb = data;
                this.filteredParametername.next(this.Parametercmb.slice());
            });
    }

    getGenderNameCombobox() {
        this._ParameterageService.getGenderMasterCombo().subscribe((data) => {
            this.GendercmbList = data;
            this.filteredGendername.next(this.GendercmbList.slice());
        });
    }

    onSubmit() {
        if (this._ParameterageService.myform.valid) {
            if (
                !this._ParameterageService.myform.get("PathparaRangeId").value
            ) {
                var m_data = {
                    insertParameterMasterAgeWise: {
                        PathparaRangeId: "0", // this._ParameterageService.myform.get("PathparaRangeId").value,
                        paraId: this._ParameterageService.myform.get("ParaId")
                            .value,
                        sexId: this._ParameterageService.myform.get("SexId")
                            .value,
                        minValue: this._ParameterageService.myform
                            .get("MinValue")
                            .value.trim(),
                        maxValue: this._ParameterageService.myform
                            .get("MaxValue")
                            .value.trim(),
                        addedBy: 1,
                        minAge:
                            this._ParameterageService.myform.get("MinAge")
                                .value || "0",
                        maxAge:
                            this._ParameterageService.myform.get("MaxAge")
                                .value || "0",
                        ageType: this._ParameterageService.myform
                            .get("AgeType")
                            .value.trim(),
                        // IsDeleted: Boolean(
                        //     JSON.parse(
                        //         this._ParameterageService.myform.get(
                        //             "IsDeleted"
                        //         ).value
                        //     )
                        // ),
                    },
                };
                console.log(m_data);
                this._ParameterageService
                    .insertParameterMasterAgeWise(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Saved !",
                                "Record saved Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not saved",
                                "error"
                            );
                        }
                    });
            } else {
                var m_dataUpdate = {
                    updateParameterMasterAgeWise: {
                        pathparaRangeId:
                            this._ParameterageService.myform.get(
                                "PathparaRangeId"
                            ).value,
                        paraId: this._ParameterageService.myform.get("ParaId")
                            .value,
                        sexId: this._ParameterageService.myform.get("SexId")
                            .value,

                        minValue: this._ParameterageService.myform
                            .get("MinValue")
                            .value.trim(),
                        maxValue: this._ParameterageService.myform
                            .get("MaxValue")
                            .value.trim(),
                        updatedby: 1,
                        minAge:
                            this._ParameterageService.myform.get("MinAge")
                                .value || "0",
                        maxAge:
                            this._ParameterageService.myform.get("MaxAge")
                                .value || "0",
                        ageType: this._ParameterageService.myform
                            .get("AgeType")
                            .value.trim(),
                        // IsDeleted: Boolean(
                        //     JSON.parse(
                        //         this._ParameterageService.myform.get(
                        //             "IsDeleted"
                        //         ).value
                        //     )
                        // ),
                    },
                };
                console.log(m_dataUpdate);
                this._ParameterageService
                    .updateParameterMasterAgeWise(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Updated !",
                                "Record updated Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not updated",
                                "error"
                            );
                        }
                    });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            PathparaRangeId: row.PathparaRangeId,
            ParaId: row.ParaId,
            SexId: row.SexId,
            MinAge: row.MinAge,
            MaxAge: row.MaxAge,
            AgeType: row.IsNumeric,
            MinValue: row.MinValue.trim(),
            MaxValue: row.MaxValue.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
    }

    onClose() {
        this._ParameterageService.myform.reset();
        this.dialogRef.close();
    }
}
