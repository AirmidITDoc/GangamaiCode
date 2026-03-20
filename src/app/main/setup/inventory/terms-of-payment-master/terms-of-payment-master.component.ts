import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { NewTermofpaymentComponent } from "./new-termofpayment/new-termofpayment.component";
import { TermsOfPaymentMasterService } from "./terms-of-payment-master.service";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";

@Component({
    selector: "app-terms-of-payment-master",
    templateUrl: "./terms-of-payment-master.component.html",
    styleUrls: ["./terms-of-payment-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TermsOfPaymentMasterComponent implements OnInit {
     IsAdd: boolean = this.permissionService.getPermission(permissionCodes.TermsofPayment, permissionType.Add);
        
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    termsOfPayment: any = "";
        allcolumns =  [
           { heading: "Terms Of Payment", key: "termsOfPayment", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        // action: gridActions.edit, callback: (data: any) => {
                        //     this.onSave(data);
                        // }
                         action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.TermsofPayment, permissionType.Edit), callback: (data: any) => {
                                                    this.onSave(data);
                                                }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._TermsOfPaymentMasterService.deactivateTheStatus(data.id).subscribe((response: any) => {
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
       
        allfilters = [
            { fieldName: "termsOfPayment", fieldValue: "", opType: OperatorComparer.StartsWith },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
     gridConfig: gridModel = {
          permissionCode: permissionCodes.TermsofPayment,
        apiUrl: "TermsOfPayment/List",
        columnsList: this.allcolumns,
        sortField: "id",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(public _TermsOfPaymentMasterService: TermsOfPaymentMasterService,
        public _matDialog: MatDialog,
        public toastr: ToastrService, public permissionService: PagePermissionService) { }

    ngOnInit(): void { }
 
    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        const that = this;
        const dialogRef = this._matDialog.open(NewTermofpaymentComponent,
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