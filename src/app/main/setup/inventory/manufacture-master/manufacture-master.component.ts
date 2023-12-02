import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ManufactureMasterService } from "./manufacture-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-manufacture-master",
    templateUrl: "./manufacture-master.component.html",
    styleUrls: ["./manufacture-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ManufactureMasterComponent implements OnInit {
    msg: any;

    displayedColumns: string[] = [
        "ManufId",
        "ManufName",
        "ManufShortName",
        "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSManufactureMasterList = new MatTableDataSource<ManufactureMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _manufactureService: ManufactureMasterService,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        this.getmanufactureMasterList();
    }
    onSearch() {
        this.getmanufactureMasterList();
    }

    onSearchClear() {
        this._manufactureService.myformSearch.reset({
            ManufNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getmanufactureMasterList();
    }
    getmanufactureMasterList() {
        var param = {
            ManufName:
                this._manufactureService.myformSearch
                    .get("ManufNameSearch")
                    .value.trim() + "%" || "%",
        };
        this._manufactureService
            .getmanufactureMasterList(param)
            .subscribe((Menu) => {
                this.DSManufactureMasterList.data = Menu as ManufactureMaster[];
                this.DSManufactureMasterList.sort = this.sort;
                this.DSManufactureMasterList.paginator = this.paginator;
            });
    }

    onClear() {
        this._manufactureService.myform.reset({ IsDeleted: "false" });
        this._manufactureService.initializeFormGroup();
    }

    onSubmit() {
        if (this._manufactureService.myform.valid) {
            if (!this._manufactureService.myform.get("ManufId").value) {
                var m_data = {
                    insertManufactureMaster: {
                        manufName: this._manufactureService.myform
                            .get("ManufName")
                            .value.trim(),
                        manufShortName: this._manufactureService.myform
                            .get("ManufShortName")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._manufactureService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        addedBy: 1,
                    },
                };

                this._manufactureService
                    .insertManufactureMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getmanufactureMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getmanufactureMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Manufacture Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getmanufactureMasterList();
                    },error => {
                        this.toastr.error('Manufacture not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    updateManufactureMaster: {
                        manufId:
                            this._manufactureService.myform.get("ManufId")
                                .value,
                        manufName: this._manufactureService.myform
                            .get("ManufName")
                            .value.trim(),
                        manufShortName: this._manufactureService.myform
                            .get("ManufShortName")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._manufactureService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        updatedBy: 1,
                    },
                };
                console.log(m_dataUpdate);
                this._manufactureService
                    .updateManufactureMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getmanufactureMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getmanufactureMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Manufacture Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getmanufactureMasterList();
                    },error => {
                        this.toastr.error('Manufacture not updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            ManufId: row.ManufId,
            ManufName: row.ManufName.trim(),
            ManufShortName: row.ManufShortName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._manufactureService.populateForm(m_data);
    }
}
export class ManufactureMaster {
    ManufId: number;
    ManufName: string;
    ManufShortName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param ManufactureMaster
     */
    constructor(ManufactureMaster) {
        {
            this.ManufId = ManufactureMaster.ManufId || "";
            this.ManufName = ManufactureMaster.ManufName || "";
            this.ManufShortName = ManufactureMaster.ManufShortName || "";
            this.IsDeleted = ManufactureMaster.IsDeleted || "false";
            this.AddedBy = ManufactureMaster.AddedBy || "";
            this.UpdatedBy = ManufactureMaster.UpdatedBy || "";
        }
    }
}
