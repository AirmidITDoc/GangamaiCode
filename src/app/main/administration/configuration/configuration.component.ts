import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationService } from './configuration.service';
import { NewconfigComponent } from './newconfig/newconfig.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { NewConfigurationComponent } from './new-configuration/new-configuration.component';

@Component({
    selector: 'app-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ConfigurationComponent implements OnInit {

    constructor(public _ConfigurationService: ConfigurationService, 
            public _matDialog: MatDialog,
            public toastr: ToastrService,) { }
    
        @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
        gridConfig: gridModel = {
            apiUrl: "Configuration/List",
            columnsList: [
                { heading: "FirstName", key: "firstName", sort: true, width: 100, align: 'left', emptySign: 'NA' },
                { heading: "MiddleName", key: "middleName", sort: true, width: 100, align: 'left', emptySign: 'NA' },
                { heading: "LastName", key: "lastName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "City", key: "City", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "Age", key: "Age", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "PhoneNo", key: "PhoneNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "OPBILL", key: "oPBILL", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "OPReceipt", key: "oPReceipt", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "RefundCounter", key: "refundCounter", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "IPAdvance", key: "iPAdvance", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "IPBill", key: "iPBill", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "IPReceipt", key: "iPReceipt", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "IPRefundBill", key: "iPRefundBill", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "IPRefOfAdv", key: "iPRefOfAdv", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "DepartmentName", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "PrintRegAfterReg", key: "printRegAfterReg", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "OTCharges", key: "oTCharges", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "PrintOPDCaseAfterVisit", key: "printOPDCaseAfterVisit", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "PrintIPDAfterAdm", key: "printIPDAfterAdm", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                {
                    heading: "Action", key: "action", align: "right", width: 100, type: gridColumnTypes.action, actions: [
                        {
                            action: gridActions.edit, callback: (data: any) => {
                                this.onSave(data);
                            }
                        }, {
                            action: gridActions.delete, callback: (data: any) => {
                                this._ConfigurationService.deactivateTheStatus(data.currencyId).subscribe((response: any) => {
                                    this.toastr.success(response.message);
                                    this.grid.bindGridData();
                                });
                            }
                        }]
                } //Action 1-view, 2-Edit,3-delete
            ],
            sortField: "firstName",
            sortOrder: 0,
            filters: [
                { fieldName: "firstName", fieldValue: "", opType: OperatorComparer.Contains },
                { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
            ]
        }
    
        ngOnInit(): void { }
        onSave(row: any = null) {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button
            
            let that = this;
            const dialogRef = this._matDialog.open(NewConfigurationComponent,
                {
                    maxWidth: "95vw",
                    height: '95%',
                    width: '95%',
                    data: row
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
    
    }

   