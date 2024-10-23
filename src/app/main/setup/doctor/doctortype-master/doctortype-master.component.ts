import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { DoctortypeMasterService } from "./doctortype-master.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NewDoctorTypeComponent } from "./new-doctor-type/new-doctor-type.component";

@Component({
    selector: "app-doctortype-master",
    templateUrl: "./doctortype-master.component.html",
    styleUrls: ["./doctortype-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DoctortypeMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "DoctorTypeMaster/List",
        columnsList: [
            { heading: "Code", key: "id", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "DoctorType Name", key: "doctorType", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            debugger
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            debugger
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "id",
        sortOrder: 0,
        filters: [
            { fieldName: "doctorType", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }

    constructor(public _doctortypeService: DoctortypeMasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
       
    }
    onSearch() {
       
    }
    onSearchClear() {
        this._doctortypeService.myformSearch.reset({
            DoctorTypeSearch: "",
            IsDeletedSearch: "2",
        });
       
    }
    resultsLength=0;
    
   
    onClear() {
        this._doctortypeService.myform.reset({ IsDeleted: "false" });
        this._doctortypeService.initializeFormGroup();
    }

   

    changeStatus(status: any) {
        switch (status.id) {
            case 1:
                //this.onEdit(status.data)
                break;
            case 2:
                this.onEdit(status.data)
                break;
            case 5:
                this.onDeactive(status.data.genderId);
                break;
            default:
                break;
        }
    }
  
    onDeactive(id) {
        debugger
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage =
            "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            debugger
            if (result) {
                this._doctortypeService.deactivateTheStatus(id).subscribe((data: any) => {
                    
                    if (data.StatusCode == 200) {
                        this.toastr.success(
                            "Record updated Successfully.",
                            "updated !",
                            {
                                toastClass:
                                    "tostr-tost custom-toast-success",
                            }
                        );
                        // this.getGenderMasterList();
                    }
                });
            }
            this.confirmDialogRef = null;
        });
    }

    newDoctorTypemaster() {
        const dialogRef = this._matDialog.open(NewDoctorTypeComponent,
            {
                maxWidth: "45vw",
                height: '35%',
                width: '70%',
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);

        });
    }

    // onFilterChange() {
       
    //     if (this.currentStatus == 1) {
    //         this.tempList.data = []
    //         this.DSDoctorTypeMasterList.data= this.DSDoctorTypeMasterList1.data
    //         for (let item of this.DSDoctorTypeMasterList.data) {
    //             if (item.IsActive) this.tempList.data.push(item)

    //         }

    //         this.DSDoctorTypeMasterList.data = [];
    //         this.DSDoctorTypeMasterList.data = this.tempList.data;
    //     }
    //     else if (this.currentStatus == 0) {
    //         this.DSDoctorTypeMasterList.data= this.DSDoctorTypeMasterList.data
    //         this.tempList.data = []

    //         for (let item of this.DSDoctorTypeMasterList.data) {
    //             if (!item.IsActive) this.tempList.data.push(item)

    //         }
    //         this.DSDoctorTypeMasterList.data = [];
    //         this.DSDoctorTypeMasterList.data = this.tempList.data;
    //     }
    //     else {
    //         this.DSDoctorTypeMasterList.data= this.DSDoctorTypeMasterList1.data
    //         this.tempList.data = this.DSDoctorTypeMasterList.data;
    //     }


    // }
    // toggle(val: any) {
    //     if (val == "2") {
    //         this.currentStatus = 2;
    //     } else if (val == "1") {
    //         this.currentStatus = 1;
    //     }
    //     else {
    //         this.currentStatus = 0;

    //     }
    // }
    onEdit(row) {
        var m_data = {
            Id: row.Id,
            DoctorType: row.DoctorType.trim(),
            IsActive: JSON.stringify(row.IsActive),
        };
        this._doctortypeService.populateForm(m_data);
    }
}

export class DoctortypeMaster {
    id: number;
    doctorType: string;
    isActive: boolean;
    IsActive:any;
    /**
     * Constructor
     *
     * @param DoctortypeMaster
     */
    constructor(DoctortypeMaster) {
        {
            this.id = DoctortypeMaster.id || "";
            this.doctorType = DoctortypeMaster.doctorType || "";
            this.isActive = DoctortypeMaster.isActive || true;
            this.IsActive = DoctortypeMaster.IsActive || true;
        }
    }
}

