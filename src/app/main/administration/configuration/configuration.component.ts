import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationService } from './configuration.service';
import { NewConfigurationComponent } from './new-configuration/new-configuration.component';
import { EditConfigurationComponent } from './edit-configuration/edit-configuration.component';


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
            // { heading: "ConfigId", key: "configId", sort: true, width: 100, align: 'left', emptySign: 'NA' },
            { heading: "FirstName", key: "mandatoryFirstName", sort: true, width: 100, align: 'left', emptySign: 'NA' },
            { heading: "MiddleName", key: "mandatoryMiddleName", sort: true, width: 100, align: 'left', emptySign: 'NA' },
            { heading: "LastName", key: "mandatoryLastName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Address", key: "mandatoryAddress", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "City", key: "mandatoryCity", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Age", key: "mandatoryAge", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "PhoneNo", key: "mandatoryPhoneNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "OP BILL", key: "oPBILL", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "OP Receipt", key: "oPReceipt", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Refund Counter", key: "refundCounter", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IPAdvance", key: "iPAdvance", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IPBill", key: "iPBill", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IPReceipt", key: "iPReceipt", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IPRefundBill", key: "iPRefundBill", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IPRefOfAdv", key: "iPRefOfAdv", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "DepartmentName", key: "pathDepartment", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "PrintRegAfterReg", key: "printRegAfterReg", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "OTCharges", key: "otcharges", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "PrintOPDCaseAfterVisit", key: "printOpdcaseAfterVisit", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "PrintIPDAfterAdm", key: "printIpdafterAdm", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            {
                heading: "Action", key: "action", align: "right", width: 100, type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "ConfigId",
        sortOrder: 0,
        filters: []
    }

    ngOnInit(): void { }
    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(EditConfigurationComponent,
            {
                  maxWidth: "95vw",
                  maxHeight: "98vh",
                  width: "100%",
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

}

