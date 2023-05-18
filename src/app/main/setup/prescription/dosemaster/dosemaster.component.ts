import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { DosemasterService } from "./dosemaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";

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

    displayedColumns: string[] = [
        "DoseId",
        "DoseName",
        "DoseNameInEnglish",
        "DoseQtyPerDay",
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSDoseMasterList = new MatTableDataSource<DoseMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _DoseService: DosemasterService) {}

    ngOnInit(): void {
        this.getDoseMasterList();
    }
    onSearch() {
        this.getDoseMasterList();
    }

    onSearchClear() {
        this._DoseService.myformSearch.reset({
            PrefixNameSearch: "",
            IsDeletedSearch: "2",
        });
    }

    getDoseMasterList() {
        this._DoseService
            .getDoseMasterList()
            .subscribe(
                (Menu) => (this.DSDoseMasterList.data = Menu as DoseMaster[])
            );
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
                        DoseName: this._DoseService.myForm
                            .get("DoseName")
                            .value.trim(),
                        DoseNameInEnglish: this._DoseService.myForm
                            .get("DoseNameInEnglish")
                            .value.trim(),

                        DoseQtyPerDay:
                            this._DoseService.myForm.get("DoseQtyPerDay").value,

                        IsDeleted: Boolean(
                            JSON.parse(
                                this._DoseService.myForm.get("IsDeleted").value
                            )
                        ),
                    },
                };
                this._DoseService.insertDoseMaster(m_data).subscribe((data) => {
                    this.msg = m_data;
                    this.getDoseMasterList();
                });
            } else {
                var m_dataUpdate = {
                    updateDoseMaster: {
                        DoseId: this._DoseService.myForm.get("DoseId").value,
                        DoseName: this._DoseService.myForm
                            .get("DoseName")
                            .value.trim(),
                        DoseNameInEnglish: this._DoseService.myForm
                            .get("DoseNameInEnglish")
                            .value.trim(),

                        DoseQtyPerDay:
                            this._DoseService.myForm.get("DoseQtyPerDay").value,

                        IsDeleted: Boolean(
                            JSON.parse(
                                this._DoseService.myForm.get("IsDeleted").value
                            )
                        ),
                    },
                };
                this._DoseService
                    .updateDoseMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = m_dataUpdate;
                        this.getDoseMasterList();
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
            IsDeleted: JSON.stringify(row.IsDeleted),
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
