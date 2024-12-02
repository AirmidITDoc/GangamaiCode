import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { GenericmasterService } from "./genericmaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { ToastrService } from "ngx-toastr";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NewGnericMasterComponent } from "./new-gneric-master/new-gneric-master.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";


@Component({
    selector: "app-genericmaster",
    templateUrl: "./genericmaster.component.html",
    styleUrls: ["./genericmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class GenericmasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    
    gridConfig: gridModel = {
        apiUrl: "GenericMaster/List",
        columnsList: [
            { heading: "Code", key: "genericId", sort: true, align: 'left', emptySign: 'NA', width:150  },
            { heading: "Generic Name", key: "genericName", sort: true, align: 'left', emptySign: 'NA', width:300 },
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center", width:150  },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action,width:250, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.confirmDialogRef = this._matDialog.open(
                                FuseConfirmDialogComponent,
                                {
                                    disableClose: false,
                                }
                            );
                            this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                            this.confirmDialogRef.afterClosed().subscribe((result) => {
                                debugger
                                if (result) {
                                    let that = this;
                                    this._GenericService.deactivateTheStatus(data.genericId).subscribe((data: any) => {
                                    this.toastr.success(data.message)
                                    that.grid.bindGridData();
                                    });
                                }
                                this.confirmDialogRef = null;
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "genericId",
        sortOrder: 0,
        filters: [
            { fieldName: "genericName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }

    constructor(public _GenericService: GenericmasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
       
    }
    onSearch() {
       
    }

    onSearchClear() {
        this._GenericService.myformSearch.reset({
            GenericNameSearch: "",
            IsDeletedSearch: "2",
        });
       
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
                this.onDeactive(status.data.genericId);
                break;
            default:
                break;
        }
    }
    
    onDeactive(genericId) {
        debugger
        
    }

    onSave(row: any = null) {
        debugger
        let that = this;
        const dialogRef = this._matDialog.open(NewGnericMasterComponent,
            {
                maxWidth: "45vw",
                height: '35%',
                width: '70%',
                data:row
            });
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                that.grid.bindGridData();
            }

        });
    }
  
    onEdit(row) {
        var m_data1 = {
            GenericId: row.GenericId,
            GenericName: row.GenericName.trim(),
            IsDeleted: JSON.stringify(row.IsActive),
            UpdatedBy: row.UpdatedBy,
        };
        console.log(m_data1);
        this._GenericService.populateForm(m_data1);
    }
}

export class GenericMaster {
    genericId: number;
    genericName: string;

    isActive: boolean;
    // AddedBy: number;
    // UpdatedBy: number;
    // AddedByName: string;

    /**
     * Constructor
     *
     * @param GenericMaster
     */
    constructor(GenericMaster) {
        {
            this.genericId = GenericMaster.genericId || "";
            this.genericName = GenericMaster.genericName || "";

            this.isActive = GenericMaster.isActive || "false";
            // this.AddedBy = GenericMaster.AddedBy || "";
            // this.UpdatedBy = GenericMaster.UpdatedBy || "";
            // this.AddedByName = GenericMaster.AddedByName || "";
        }
    }
}
