import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { map, startWith, takeUntil } from "rxjs/operators";
import { DrugmasterService } from "./drugmaster.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-drugmaster",
    templateUrl: "./drugmaster.component.html",
    styleUrls: ["./drugmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DrugmasterComponent implements OnInit {
    displayedColumns: string[] = [
        "DrugId",
        "DrugName",
        "GenericName",
        "ClassName",
        // "AddedByName",
        "IsDeleted",
        "action",
    ];

    DrugMasterList: any;
    GenericmbList: any = [];
    ClassmbList: any = [];
    msg: any;
    sIsLoading: string = '';
    isLoading = true;
    isClassIdSelected: boolean = false;
    isGenericIdSelected: boolean = false
    filteredClassName: Observable<string[]>;
    filteredGenericname: Observable<string[]>;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    DSDrugMasterList = new MatTableDataSource<DrugMaster>();

    constructor(public _drugService: DrugmasterService,
        public toastr: ToastrService,) { }

    ngOnInit(): void {
        this.getDrugMasterList();
        this.getGenericNameCombobox();
        this.getClassNameCombobox();
    }
    onSearch() {
        this.getDrugMasterList();
    }

    onSearchClear() {
        this._drugService.myformSearch.reset({
            DrugNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getDrugMasterList();
    }

    getDrugMasterList() {
        var param = {
            DrugName: this._drugService.myformSearch.get("DrugNameSearch")
                .value.trim() + "%" || "%",
        };
        this._drugService.getDrugMasterList(param).subscribe((Menu) => {
            this.DSDrugMasterList.data = Menu as DrugMaster[];
            this.DSDrugMasterList.sort = this.sort;
            this.DSDrugMasterList.paginator = this.paginator;
            this.sIsLoading = '';
            console.log(this.DSDrugMasterList);
        },
            error => {
                this.sIsLoading = '';
            });
    }

    getGenericNameCombobox() {
        this._drugService.getGenericMasterCombo().subscribe((data) => {
            this.GenericmbList = data;
            this.filteredGenericname = this._drugService.myform.get('GenericId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterGeneric(value) : this.GenericmbList.slice()),
            );
            if (this.registerObj) {
                const ddValue = this.GenericmbList.filter(c => c.GenericId == this.registerObj.GenericId);
                this._drugService.myform.get('GenericId').setValue(ddValue[0]);
                this._drugService.myform.updateValueAndValidity();
                return;
            }
        });
    }
    getClassNameCombobox() {
        this._drugService.getClassMasterCombo().subscribe((data) => {
            this.ClassmbList = data;
            this.filteredClassName = this._drugService.myform.get('ClassId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterClassName(value) : this.ClassmbList.slice()),
            );
            console.log(this.ClassmbList);
            if (this.registerObj) {
                const ddValue = this.ClassmbList.filter(c => c.ClassId == this.registerObj.ClassId);
                this._drugService.myform.get('ClassId').setValue(ddValue[0]);
                this._drugService.myform.updateValueAndValidity();
                return;
            }
        });
    }
    private _filterClassName(value: any): string[] {
        if (value) {
            const filterValue = value && value.ClassName ? value.ClassName.toLowerCase() : value.toLowerCase();
            return this.ClassmbList.filter(option => option.ClassName.toLowerCase().includes(filterValue));
        }
    }
    private _filterGeneric(value: any): string[] {
        if (value) {
            const filterValue = value && value.GenericName ? value.GenericName.toLowerCase() : value.toLowerCase();
            return this.GenericmbList.filter(option => option.GenericName.toLowerCase().includes(filterValue));
        }
    }
    getOptionTextClassName(option) {
        return option && option.ClassName ? option.ClassName : '';
    }
    getOptionTextGenericName(option) {
        return option && option.GenericName ? option.GenericName : '';
    }
    onClear() {
        this._drugService.myform.reset({ IsDeleted: "false" });
        this._drugService.initializeFormGroup();
    }

    onSubmit() {
        if (this._drugService.myform.valid) {
            if (!this._drugService.myform.get("DrugId").value) {
                var m_data = {
                    insertDrugMaster: {
                        drugName: this._drugService.myform
                            .get("DrugName")
                            .value.trim(),
                        genericId:
                            this._drugService.myform.get("GenericId").value
                                .GenericId,
                        classId:
                            this._drugService.myform.get("ClassId").value
                                .ClassId,
                        isActive: Boolean(
                            JSON.parse(
                                this._drugService.myform.get("IsDeleted").value
                            )
                        ),
                        // addedBy: 1,
                    },
                };

                this._drugService.insertDrugMaster(m_data).subscribe((data) => {
                    this.msg = data;
                    console.log(this.msg);
                    if (data) {
                        this.toastr.success('Record Saved Successfully.', 'Saved !', {
                            toastClass: 'tostr-tost custom-toast-success',
                        });
                        this.getDrugMasterList();

                    } else {
                        this.toastr.error('Drug Master Data not saved !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    }
                }, error => {
                    this.toastr.error('Drug Class Data not saved !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                });
            } else {
                var m_dataUpdate = {
                    updateDrugMaster: {
                        drugId: this._drugService.myform.get("DrugId").value,
                        drugName:
                            this._drugService.myform.get("DrugName").value,
                        genericId:
                            this._drugService.myform.get("GenericId").value
                                .GenericId,
                        classId:
                            this._drugService.myform.get("ClassId").value
                                .ClassId,
                        isActive: Boolean(
                            JSON.parse(
                                this._drugService.myform.get("IsDeleted").value
                            )
                        ),
                        //  updatedBy: 1,
                    },
                };
                this._drugService
                    .updateDrugMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                            });
                            this.getDrugMasterList();
                        } else {
                            this.toastr.error('Drug Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                            });
                        }
                    }, error => {
                        this.toastr.error('Drug Class Data not updated !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    });
            }
            this.onClear();
            this.getDrugMasterList();
        }
    }
    registerObj: any;
    onEdit(row) {
        debugger
        this.registerObj = row
        var m_data = {
            DrugId: row.DrugId,
            DrugName: row.DrugName.trim(),
            GenericId: row.GenericName,
            ClassId: row.ClassName,
            IsDeleted: JSON.stringify(row.IsActive),
            UpdatedBy: row.UpdatedBy,
        };
        this._drugService.populateForm(m_data);
        this.getGenericNameCombobox();
        this.getClassNameCombobox();
    }
}
export class DrugMaster {
    DrugId: number;
    DrugName: string;
    GenericId: number;
    ClassId: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param DrugMaster
     */
    constructor(DrugMaster) {
        {
            this.DrugId = DrugMaster.DrugId || "";
            this.DrugName = DrugMaster.DrugName || "";
            this.GenericId = DrugMaster.GenericId || "";
            this.ClassId = DrugMaster.ClassId || "";
            this.IsDeleted = DrugMaster.IsDeleted || "false";
            this.AddedBy = DrugMaster.AddedBy || "";
            this.UpdatedBy = DrugMaster.UpdatedBy || "";
            this.AddedByName = DrugMaster.AddedByName || "";
        }
    }
}
