import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SMSConfugurationService } from './smsconfuguration.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';
import { UpdateSMSComponent } from './update-sms/update-sms.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-smsconfuguration',
  templateUrl: './smsconfuguration.component.html',
  styleUrls: ['./smsconfuguration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SMSConfugurationComponent implements OnInit {
  MySearchForm:FormGroup;
    msg: any;
    fromDate ="01/01/2024" //this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "smsConfig/SMSconfigList",
        columnsList: [
            { heading: "OutGoingCode", key: "smsOutGoingID", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Date", key: "smsDate", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "MobileNo", key: "mobileNumber", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "SMSString", key: "smsString", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsSent", key: "isSent", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._SMSConfigService.deactivateTheStatus(data.talukaId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "SMSOutGoingID",
        sortOrder: 0,
        filters: [
            { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Contains },
            { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
        ]
    }
    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(UpdateSMSComponent,
            {
                maxWidth: "85vw",
                height: '90%',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }


   constructor(
    public _SMSConfigService : SMSConfugurationService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.MySearchForm = this._SMSConfigService.CreateSearchForm();
  }

 
  NewSMS(){ 
    const dialogRef = this._matDialog.open(UpdateSMSComponent,
      {
        maxWidth: "100%",
        height: '90%',
        width: '90%', 
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      
    });
  }
}
 

