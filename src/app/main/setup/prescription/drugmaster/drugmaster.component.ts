import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { DrugmasterService } from "./drugmaster.service";
import { NewDrugMasterComponent } from "./new-drug-master/new-drug-master.component";

@Component({
    selector: "app-drugmaster",
    templateUrl: "./drugmaster.component.html",
    styleUrls: ["./drugmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DrugmasterComponent implements OnInit {
   
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    
    drugName: any = "";
       allcolumns =  [
            { heading: "Code", key: "drugId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Drug Name", key: "drugName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Generic Name", key: "genericId", sort: true, align: 'left', emptySign: 'NA'  },
            { heading: "Class Name", key: "classId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status,align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, 
                    {
                        action: gridActions.delete, callback: (data: any) => {
                            this._drugService.deactivateTheStatus(data.drugId).subscribe((data: any) => {
                                this.toastr.success(data.message)
                                this.grid.bindGridData();
                            });
                        }
                    }
                ]
            } //Action 1-view, 2-Edit,3-delete
        ]
        
       allfilters = [
            { fieldName: "drugName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
     gridConfig: gridModel = {
        apiUrl: "DrugMaster/List",
        columnsList: this.allcolumns,
        sortField: "drugId",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(public _drugService: DrugmasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {}
//filters addedby avdhoot vedpathak date-28/05/2025
    // Clearfilter(event) {
    //     console.log(event)
    //     if (event == 'DrugNameSearch')
    //         this._drugService.myformSearch.get('DrugNameSearch').setValue("")

    //     this.onChangeFirst();
    // }

    // onChangeFirst() {
    //     this.drugName = this._drugService.myformSearch.get('DrugNameSearch').value
    //     this.getfilterdata();
    // }

    // getfilterdata() {
    //     debugger
    //     let isActive = this._drugService.myformSearch.get("IsDeletedSearch").value || "";
    //     this.gridConfig = {
    //         apiUrl: "DrugMaster/List",
    //         columnsList: this.allcolumns,
    //         sortField: "drugId",
    //         sortOrder: 0,
    //         filters: [
    //             { fieldName: "drugName", fieldValue: this.drugName, opType: OperatorComparer.Contains },
    //             { fieldName: "isActive", fieldValue: isActive, opType: OperatorComparer.Equals }
    //         ]
    //     }
    //     // this.grid.gridConfig = this.gridConfig;
    //     // this.grid.bindGridData();
    //     console.log("GridConfig:", this.gridConfig);

    // if (this.grid) {
    //     this.grid.gridConfig = this.gridConfig;
    //     this.grid.bindGridData();
    // } else {
    //     console.error("Grid is undefined!");
    // }
    // }
    onSave(row: any=null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        const dialogRef = this._matDialog.open(NewDrugMasterComponent,
            {
                maxWidth: "50vw",
                maxHeight: '50%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                that.grid.bindGridData();
            }
        });
    }
}

