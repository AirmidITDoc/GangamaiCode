import { Component, Inject, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { LabPatientRegService } from '../lab-patient-reg.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-lab-reg-bill-deatils',
    templateUrl: './lab-reg-bill-deatils.component.html',
    styleUrls: ['./lab-reg-bill-deatils.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class LabRegBillDeatilsComponent {

    BillNo = "0"
    doctorName = ""
    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'isPathology')!.template = this.iconisPathology;
        this.gridConfig.columnsList.find(col => col.key === 'isRadiology')!.template = this.iconisRadiology;
 this.gridConfig.columnsList.find(col => col.key === 'isCompleted')!.template = this.iconisCompleted;

    }
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('iconisPathology') iconisPathology!: TemplateRef<any>;
    @ViewChild('iconisRadiology') iconisRadiology!: TemplateRef<any>;
     @ViewChild('isCompleted') iconisCompleted!: TemplateRef<any>;
    ngOnInit(): void {
        if (this.data) {
            
            this.BillNo = this.data.billNo
            this.doctorName = this.data.doctorName
            this.getBilldetail()
        }
    }
    allcolumns = [
       
         { heading: "--", key: "isCompleted", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },

        { heading: "--", key: "isPathology", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },

        { heading: "--", key: "isRadiology", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
         { heading: "BillNo", key: "billNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
       
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 300 },

       { heading: "Service Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 320 },
        { heading: "Price", key: "price", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Charges Date", key: "chargesTime", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },

        // {
        //     heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
        //     template: this.actionButtonTemplate  // Assign ng-template to the column
        // }

    ];
    gridConfig: gridModel = {
        apiUrl: "LabPatientRegistration/LabBillDetailList",
        columnsList: this.allcolumns,
        sortField: "BillNo",
        sortOrder: 0,
        filters: [
            { fieldName: "BillNo", fieldValue: this.BillNo, opType: OperatorComparer.Equals }

        ]
    }

    constructor(public _labPatientRegService: LabPatientRegService,
        private _loggedService: AuthenticationService,
        public datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        private commonService: PrintserviceService,) { }

    getBilldetail() {
        this.gridConfig = {
            apiUrl: "LabPatientRegistration/LabBillDetailList",
            columnsList: this.allcolumns,
            sortField: "BillNo",
            sortOrder: 0,
            filters: [
                { fieldName: "BillNo", fieldValue: this.BillNo, opType: OperatorComparer.Equals }

            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();

    }
    onClose() {
        this._matDialog.closeAll()
    }
}
