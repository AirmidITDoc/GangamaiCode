import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { BankMasterService } from "./bank-master.service";
import { ToastrService } from "ngx-toastr";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { MatDialog } from "@angular/material/dialog";
import { NewBankComponent } from "./new-bank/new-bank.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";


@Component({
    selector: "app-bank-master",
    templateUrl: "./bank-master.component.html",
    styleUrls: ["./bank-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class BankMasterComponent implements OnInit {
     IsAdd: boolean = this.permissionService.getPermission(permissionCodes.BankMaster, permissionType.Add);
       
     
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
        bankName: any = "";
   
         allcolumns = [
             { heading: "BankName", key: "bankName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        // action: gridActions.edit, callback: (data: any) => {
                        //     this.onSave(data) // EDIT Records
                        // }
 action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.BankMaster, permissionType.Edit), callback: (data: any) => {
                            this.onSave(data);
                        }
                        
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._bankService.deactivateTheStatus(data.bankId).subscribe((response: any) => {
                                this.grid.bindGridData;
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
       
         allfilters = [
            { fieldName: "BankName", fieldValue: "", opType: OperatorComparer.StartsWith },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    
  gridConfig: gridModel = {
        permissionCode: permissionCodes.BankMaster,
        apiUrl: "BankMaster/List",
        columnsList: this.allcolumns,
        sortField: "bankId",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(public _bankService: BankMasterService, public _matDialog: MatDialog,public permissionService: PagePermissionService,
        public toastr: ToastrService,) { }

    ngOnInit(): void { }
 
    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        const that = this;
        const dialogRef = this._matDialog.open(NewBankComponent,
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
            console.log('The dialog was closed - Action', result);
        });
    }

}

