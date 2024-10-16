import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { PrefixMasterService } from "./prefix-master.service";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { NewPrefixComponent } from "./new-prefix/new-prefix.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";


@Component({
    selector: "app-prefix-master",
    templateUrl: "./prefix-master.component.html",
    styleUrls: ["./prefix-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PrefixMasterComponent implements OnInit {
    PrefixMasterList: any;
    msg: any;
   
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "Prefix/List",
        columnsList: [
            { heading: "Code", key: "PrefixID", sort: false, align: 'left', emptySign: 'NA' },
            { heading: "Prefix Name", key: "PrefixName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Gender Name", key: "SexID", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: 'status', align: "center" },
            { heading: "Action", key: "action", align: "right", type: "action", action: [2, 3] } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "PrefixID",
        sortOrder: 0,
        filters: [
            { fieldName: "PrefixName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 10
    }

    constructor(
        public _PrefixMasterService: PrefixMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void {
    }
    onClear() {
        this._PrefixMasterService.myform.reset({ IsDeleted: "false" });
        this._PrefixMasterService.initializeFormGroup();
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
                this.onDeactive(status.data.PrefixID);
                break;
            default:
                break;
        }
    }
    onEdit(row) {
        var m_data = {
            PrefixID: row.PrefixID,
            PrefixName: row.PrefixName.trim(),
            isDeleted: JSON.stringify(row.isActive),
        };
        this._PrefixMasterService.populateForm(m_data);
    }
    onDeactive(PrefixID) {
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
                this._PrefixMasterService.deactivateTheStatus(PrefixID).subscribe((data: any) => {
                    this.msg = data
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

    NewPrefix(){
        const dialogRef = this._matDialog.open(NewPrefixComponent,
            {
              maxWidth: "85vw",
              height: '65%',
              width: '70%',
            });
          dialogRef.afterClosed().subscribe(result => {
             console.log('The dialog was closed - Insert Action', result);
            
          });
    }
}

export class PrefixMaster {
    PrefixID: number;
    PrefixName: string;
    SexID: number;
    IsActive: boolean;
   
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
            this.IsActive = PrefixMaster.IsActive || "false";
          
        }
    }
}
