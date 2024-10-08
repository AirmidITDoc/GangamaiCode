import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { UomMasterService } from "./uom-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "app/core/services/authentication.service";

@Component({
    selector: "app-uom-master",
    templateUrl: "./uom-master.component.html",
    styleUrls: ["./uom-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class UomMasterComponent implements OnInit {
    msg: any;
    resultsLength:any=0;
    displayedColumns: string[] = [
        "UnitofMeasurementId",
        "UnitofMeasurementName",
        "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSUnitofmeasurementList = new MatTableDataSource<UnitofmeasurementMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _unitofmeasurementService: UomMasterService,
        private accountService: AuthenticationService,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        this.getUnitofmeasurementMasterList();
    }
    onSearch() {
        this.getUnitofmeasurementMasterList();
    }

    onSearchClear() {
        this._unitofmeasurementService.myformSearch.reset({
            UnitofMeasurementSearch: "",
            IsDeletedSearch: "2",
        });
        this.getUnitofmeasurementMasterList();
    }
    getUnitofmeasurementMasterList() {
        var param = {
            UnitofMeasurmentName:
                this._unitofmeasurementService.myformSearch
                    .get("UnitofMeasurementSearch")
                    .value.trim() + "%" || "%",
        };
        this._unitofmeasurementService
            .getUnitofmeasurementMasterList(param)
            .subscribe((Menu) => {
                this.DSUnitofmeasurementList.data =
                    Menu as UnitofmeasurementMaster[];
                this.DSUnitofmeasurementList.sort = this.sort;
                this.DSUnitofmeasurementList.paginator = this.paginator;
                this.resultsLength= this.DSUnitofmeasurementList.data.length
            });
    }

    onClear() {
        this._unitofmeasurementService.myform.reset({ IsDeleted: "false" });
        this._unitofmeasurementService.initializeFormGroup();
    }

    onSubmit() {
        if (this._unitofmeasurementService.myform.valid) {
            if (
                !this._unitofmeasurementService.myform.get(
                    "UnitofMeasurementId"
                ).value
            ) {
                var m_data = {
                    insertUnitofMeasurementMaster: {
                        unitofMeasurementName:
                            this._unitofmeasurementService.myform
                                .get("UnitofMeasurementName")
                                .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._unitofmeasurementService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                        addedBy:this.accountService.currentUserValue.user.id,
                        updatedBy: this.accountService.currentUserValue.user.id,
                    },
                };

                this._unitofmeasurementService
                    .insertUnitofMeasurementMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getUnitofmeasurementMasterList();
                           
                        } else {
                            this.toastr.error('UOM   Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getUnitofmeasurementMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    updateUnitofMeasurementMaster: {
                        unitofMeasurementId:
                            this._unitofmeasurementService.myform.get(
                                "UnitofMeasurementId"
                            ).value,
                        unitofMeasurementName:
                            this._unitofmeasurementService.myform
                                .get("UnitofMeasurementName")
                                .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._unitofmeasurementService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                        updatedBy: this.accountService.currentUserValue.user.id,
                    },
                };

                this._unitofmeasurementService
                    .updateUnitofMeasurementMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.getUnitofmeasurementMasterList();
                           
                        } else {
                            this.toastr.error('UOM  Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getUnitofmeasurementMasterList();
                    });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            UnitofMeasurementId: row.UnitofMeasurementId,
            UnitofMeasurementName: row.UnitofMeasurementName,
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._unitofmeasurementService.populateForm(m_data);
    }
}
export class UnitofmeasurementMaster {
    UnitofMeasurementId: number;
    UnitofMeasurementName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param UnitofmeasurementMaster
     */
    constructor(UnitofmeasurementMaster) {
        {
            this.UnitofMeasurementId =
                UnitofmeasurementMaster.UnitofMeasurementId || "";
            this.UnitofMeasurementName =
                UnitofmeasurementMaster.UnitofMeasurementName || "";
            this.IsDeleted = UnitofmeasurementMaster.IsDeleted || "true";
            this.AddedBy = UnitofmeasurementMaster.AddedBy || "";
            this.UpdatedBy = UnitofmeasurementMaster.UpdatedBy || "";
        }
    }
}
