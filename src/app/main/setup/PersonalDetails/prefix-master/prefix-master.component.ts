import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { PrefixMasterService } from "./prefix-master.service";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToasterService } from "app/main/shared/services/toaster.service";

@Component({
    selector: "app-prefix-master",
    templateUrl: "./prefix-master.component.html",
    styleUrls: ["./prefix-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PrefixMasterComponent implements OnInit {
    GendercmbList: any = [];
    msg: any;
    displayedColumns: string[] = [
        "PrefixID",
        "PrefixName",
        "GenderName",
        // "AddedByName",
        "IsDeleted",
        "action",
    ];

    dsPrefixMasterList = new MatTableDataSource<PrefixMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _PrefixService: PrefixMasterService,
        public _toastr : ToasterService,) {}

    ngOnInit(): void {
        this.getPrefixMasterList();
        this.getGenderNameCombobox();
    }

    onSearch() {
        this.getPrefixMasterList();
    }

    onSearchClear() {
        this._PrefixService.myformSearch.reset({
            PrefixNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getPrefixMasterList();
    }
  

    // getGenderNameCombobox() {
    //     this._PrefixService.getGenderMasterCombo().subscribe((data) => (this.GendercmbList = data));
         
    // }
    
    getGenderNameCombobox() {
        this._PrefixService.getGenderMasterCombo().subscribe(data => {
            this.GendercmbList = data;
            console.log(this.GendercmbList);
        });
         
    }

    getPrefixMasterList() {
        var Param = {
            PrefixName:
                this._PrefixService.myformSearch.get("PrefixNameSearch").value.trim() + "%" || "%",
            // p_IsDeleted:
            //     this._PrefixService.myformSearch.get("IsDeletedSearch").value,
        };
        this._PrefixService.getPrefixMasterList(Param).subscribe((Menu) => {
            this.dsPrefixMasterList.data = Menu as PrefixMaster[];
            this.dsPrefixMasterList.sort = this.sort;
            this.dsPrefixMasterList.paginator = this.paginator;
        });
    }

    onSubmit() {
        if (this._PrefixService.myform.valid) {
            if (!this._PrefixService.myform.get("PrefixID").value) {
                var m_data = {
                    prefixMasterInsert: {
                        prefixName: this._PrefixService.myform.get("PrefixName") .value.trim(),
                        sexID: this._PrefixService.myform.get("SexID").value.GenderId | 0,
                        // addedBy: 1,
                        isActive: Boolean(
                            JSON.parse(
                                this._PrefixService.myform.get("IsActive").value
                            )
                        ),
                    },
                };
                console.log(m_data);
                this._PrefixService
                    .insertPrefixMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Saved !",
                                "Record saved Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getPrefixMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not saved",
                                "error"
                            );
                        }
                        this.getPrefixMasterList();
                    },  
                       // this._toastr.showSuccess(' Data not saved !, Please check API error..'+ 'Error !');
                      
                    
                     error => {
                        Swal.fire(' Data not saved !, Please check API error..', 'Error !')
                       }
                      );
            } else {
                var m_dataUpdate = {
                    prefixMasterUpdate: {
                        prefixID:
                            this._PrefixService.myform.get("PrefixID").value,
                        prefixName: this._PrefixService.myform
                            .get("PrefixName")
                            .value.trim(),
                        sexID: this._PrefixService.myform.get("SexID").value
                            .GenderId,
                        isActive: Boolean(
                            JSON.parse(
                                this._PrefixService.myform.get("IsActive")
                                    .value
                            )
                        ),
                    },
                };
console.log(m_dataUpdate);
                this._PrefixService
                    .updatePrefixMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Updated !",
                                "Record updated Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getPrefixMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not updated",
                                "error"
                            );
                        }
                        this.getPrefixMasterList();
                    });
            }
            this.onClear();
        }
    }

    onClear() {
        this._PrefixService.myform.reset({ IsDeleted: "false" });
        this._PrefixService.initializeFormGroup();
    }

    onEdit(row) {
        var m_data = {
            PrefixID: row.PrefixID,
            PrefixName: row.PrefixName,
            SexID: row.SexID,
            IsDeleted: JSON.stringify(row.IsActive),
            UpdatedBy: row.UpdatedBy,
        };
        this._PrefixService.populateForm(m_data);
    }
}

export class PrefixMaster {
    PrefixID: number;
    PrefixName: string;
    SexID: number;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param PrefixMaster
     */
    constructor(PrefixMaster) {
        {
            this.PrefixID = PrefixMaster.PrefixID || 0;
            this.PrefixName = PrefixMaster.PrefixName || "";
            this.SexID = PrefixMaster.SexID || 0;
            this.IsDeleted = PrefixMaster.IsDeleted || "false";
            this.AddedBy = PrefixMaster.AddedBy || 0;
            this.UpdatedBy = PrefixMaster.UpdatedBy || 0;
        }
    }
}
