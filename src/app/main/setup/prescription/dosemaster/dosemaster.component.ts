import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { DosemasterService } from "./dosemaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-dosemaster",
    templateUrl: "./dosemaster.component.html",
    styleUrls: ["./dosemaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DosemasterComponent implements OnInit {
    DoseMasterList: any;
    msg: any;
    sIsLoading: string = '';
    isLoading = true;

    displayedColumns: string[] = [
        "DoseId",
        "DoseName",
        "DoseNameInEnglish",
        "DoseQtyPerDay",
        //"AddedByName",
        "IsDeleted",
        "action",
    ];

    DSDoseMasterList = new MatTableDataSource<DoseMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _DoseService: DosemasterService,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        this.getDoseMasterList();
    }
    onSearch() {
        this.getDoseMasterList();
    }

    onSearchClear() {
        this._DoseService.myformSearch.reset({
            DoseNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getDoseMasterList();
    }

    getDoseMasterList() {
        this.sIsLoading = 'loading-data';
        var param = {
            DoseName:this._DoseService.myformSearch.get("DoseNameSearch")
                    .value.trim() + "%" || "%",
        };
        this._DoseService.getDoseMasterList(param).subscribe((Menu) => {
            this.DSDoseMasterList.data = Menu as DoseMaster[];
            this.DSDoseMasterList.sort = this.sort;
            this.DSDoseMasterList.paginator = this.paginator;
            this.sIsLoading = '';
        },
        error => {
          this.sIsLoading = '';
        });
    }

    onClear() {
        this._DoseService.myForm.reset({ IsDeleted: "false" });
        this._DoseService.initializeFormGroup();
    }

    onSubmit() {
        if (this._DoseService.myForm.valid) {
            if (!this._DoseService.myForm.get("DoseId").value) {
                var m_data = {
                    insertDoseMaster: {
                        doseName: this._DoseService.myForm
                            .get("DoseName")
                            .value.trim(),
                        doseNameInEnglish: this._DoseService.myForm
                            .get("DoseNameInEnglish")
                            .value.trim(),
                        doseNameInMarathi: "",
                        doseQtyPerDay:
                            this._DoseService.myForm.get("DoseQtyPerDay").value,

                        isActive: Boolean(
                            JSON.parse(
                                this._DoseService.myForm.get("IsDeleted").value
                            )
                        ),
                        // addedBy: 1,
                    },
                };
                this._DoseService.insertDoseMaster(m_data).subscribe((data) => {
                    this.msg = m_data;
                    if (data) {
                        this.toastr.success('Record Saved Successfully.', 'Saved !', {
                            toastClass: 'tostr-tost custom-toast-success',
                          });
                        this.getDoseMasterList();
                        // Swal.fire(
                        //     "Saved !",
                        //     "Record saved Successfully !",
                        //     "success"
                        // ).then((result) => {
                        //     if (result.isConfirmed) {
                        //         this.getDoseMasterList();
                        //     }
                        // });
                    } else {
                        this.toastr.error(' Dose Master Data not saved !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                          });
                    }
                    this.getDoseMasterList();
                },error => {
                    this.toastr.error('Dose Class Data not saved !, Please check API error..', 'Error !', {
                     toastClass: 'tostr-tost custom-toast-error',
                   });
                 });
            } else {
                var m_dataUpdate = {
                    updateDoseMaster: {
                        doseId: this._DoseService.myForm.get("DoseId").value,
                        doseName: this._DoseService.myForm
                            .get("DoseName")
                            .value.trim(),
                        doseNameInEnglish: this._DoseService.myForm
                            .get("DoseNameInEnglish")
                            .value.trim(),
                        doseNameInMarathi: "",
                        isActive: Boolean(
                            JSON.parse(
                                this._DoseService.myForm.get("IsDeleted").value
                            )
                        ),
                        doseQtyPerDay:
                            this._DoseService.myForm.get("DoseQtyPerDay").value,
                        //  updatedBy: 1,
                    },
                };
                this._DoseService
                    .updateDoseMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = m_dataUpdate;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.getDoseMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getDoseMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error(' Dose Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getDoseMasterList();
                    },error => {
                        this.toastr.error('Dose Class Data not updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data1 = {
            DoseId: row.DoseId,
            DoseName: row.DoseName.trim(),
            DoseNameInEnglish: row.DoseNameInEnglish.trim(),
            DoseQtyPerDay: row.DoseQtyPerDay,
            IsDeleted: JSON.stringify(row.IsActive),
            UpdatedBy: row.UpdatedBy,
        };

        this._DoseService.populateForm(m_data1);
    }
}

export class DoseMaster {
    DoseId: number;
    DoseName: string;
    DoseNameInEnglish: string;
    DoseQtyPerDay: number;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param DoseMaster
     */
    constructor(DoseMaster) {
        {
            this.DoseId = DoseMaster.DoseId || "";
            this.DoseName = DoseMaster.DoseName || "";
            this.DoseNameInEnglish = DoseMaster.DoseNameInEnglish || "";
            this.DoseQtyPerDay = DoseMaster.DoseQtyPerDay || "";

            this.IsDeleted = DoseMaster.IsDeleted || "false";
            this.AddedBy = DoseMaster.AddedBy || "";
            this.UpdatedBy = DoseMaster.UpdatedBy || "";
            this.AddedByName = DoseMaster.AddedByName || "";
        }
    }
}
