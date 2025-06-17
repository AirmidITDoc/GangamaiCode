import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';
import { CreditreasonService } from './creditreason.service';
import { NewCreditReasonComponent } from './new-credit-reason/new-credit-reason.component';


@Component({
    selector: 'app-credit-reason-master',
    templateUrl: './credit-reason-master.component.html',
    styleUrls: ['./credit-reason-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CreditReasonMasterComponent implements OnInit {

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
creditReason: any = "";
   
         allcolumns = [
            { heading: "Code", key: "creditId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Credit Reason ", key: "creditReason", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "User Name", key: "username", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._CreditreasonService.deactivateTheStatus(data.creditId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
       
       allfilters = [
            { fieldName: "creditReason", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    
 gridConfig: gridModel = {
        apiUrl: "CreditReasonMaster/List",
        columnsList: this.allcolumns,
        sortField: "creditId",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(
        public _CreditreasonService: CreditreasonService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,) { }

    ngOnInit(): void { }
 //filters addedby avdhoot vedpathak date-28/05/2025
    // Clearfilter(event) {
    //     console.log(event)
    //     if (event == 'CreditReasonSearch')
    //         this._CreditreasonService.myformSearch.get('CreditReasonSearch').setValue("")

    //     this.onChangeFirst();
    // }

    // onChangeFirst() {
    //     this.creditReason = this._CreditreasonService.myformSearch.get('CreditReasonSearch').value
    //     this.getfilterdata();
    // }

    // getfilterdata() {
    //     debugger
    //     let isActive = this._CreditreasonService.myformSearch.get("IsDeletedSearch").value || "";
    //     this.gridConfig = {
    //         apiUrl: "CreditReasonMaster/List",
    //         columnsList: this.allcolumns,
    //         sortField: "creditId",
    //         sortOrder: 0,
    //         filters: [
    //             { fieldName: "creditReason", fieldValue: this.creditReason, opType: OperatorComparer.Contains },
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
    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewCreditReasonComponent,
            {
                maxWidth: "50vw",
                maxHeight: '50%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

}