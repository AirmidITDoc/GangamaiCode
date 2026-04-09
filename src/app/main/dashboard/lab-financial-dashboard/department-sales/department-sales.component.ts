import { DatePipe } from '@angular/common';
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { Chart } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from '../../dashboard.service';
import { departmentList, RadioList } from '../lab-financial-dashboard.component';
import { MatTableDataSource } from '@angular/material/table';


@Component({
    selector: 'app-department-sales',
    templateUrl: './department-sales.component.html',
    styleUrls: ['./department-sales.component.scss'],
        encapsulation: ViewEncapsulation.None,
        animations: fuseAnimations,
})
export class DepartmentSalesComponent {

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    GroupId = "0"
    TotalTestCount=0
TotalCenSale=0
TotalNetSale=0

    // trendRadioData: departmentList[] = [];
    // trendChart: any;

    // public DeptDailysalesChart: any;

    serviceSalesColumns: string[] = ['serviceName', 'testCount', 'centerSale', 'netSale'];

    departmentSales = new MatTableDataSource<departmentList>();


    //  allserviceFilter = [
    //         { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    //         { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    //         { fieldName: "GroupId", fieldValue: this.GroupId, opType: OperatorComparer.Equals },
            
    //     ]
    
    //     allserColumns = [
    //         { heading: "Service Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    //         { heading: "Test Count", key: "testCount", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    //         { heading: "Center Sale", key: "centerSale", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    //         { heading: "Net Sale", key: "netSale", sort: true, align: 'left', emptySign: 'NA', width: 100 },
          
    //     ]

    constructor(
        public _dashboardServices: DashboardService,
        private _loggedService: AuthenticationService,
        public datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        private commonService: PrintserviceService,) { }

    ngOnInit() {
        // this.unitId = this.data.unit
        this.getServicelist();
    }


    // gridConfig: gridModel = {
    //     //    permissionCode: permissionCodes.Advance,
    //        apiUrl: "Advance/BrowseAdvanceList",
    //        columnsList: this.allserColumns,
    //        sortField: "RegID",
    //        sortOrder: 0,
    //        filters: this.allserviceFilter
    //    }


     get TotalPatient(): number {
        return this.departmentSales.data.reduce((sum, r) => sum + (r.testCount || 0), 0);
    }
    get CentralTotal(): number {
        return this.departmentSales.data.reduce((sum, r) => sum + (r.centerSale || 0), 0);
    }
    get netSale(): number {
        return this.departmentSales.data.reduce((sum, r) => sum + (r.netSale || 0), 0);
    }
   
    getServicelist() {
        console.log(this.data)
        
        const vadat = {
            "UnitId": this.data.unit,
            "GroupId": this.data.groupId,
            'FromDate': this.data.fdate,
            'ToDate': this.data.tdate
        }
        debugger
        this._dashboardServices.getServicedetailList(vadat).subscribe((data: any) => {
          debugger
            console.log(data)
            this.departmentSales.data = data
             console.log(this.departmentSales.data)
        });
    }
  

    onClose() {
        this._matDialog.closeAll()
    }
}


