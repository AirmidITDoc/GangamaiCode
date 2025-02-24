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

@Component({
  selector: 'app-smsconfuguration',
  templateUrl: './smsconfuguration.component.html',
  styleUrls: ['./smsconfuguration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SMSConfugurationComponent implements OnInit {

    msg: any;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "TalukaMaster/List",
        columnsList: [
            { heading: "OutGoingCode", key: "OutGoingCode", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Date", key: "Date", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "MobileNo", key: "MobileNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "SMSString", key: "SMSString", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsSent", key: "IsSent", sort: true, align: 'left', emptySign: 'NA' },
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
        sortField: "talukaId",
        sortOrder: 0,
        filters: [
            { fieldName: "talukaName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }
       
        //    constructor(
        //        public _SMSConfugurationService: SMSConfugurationService,
        //        public toastr: ToastrService, public _matDialog: MatDialog
        //    ) { }
       
        //    ngOnInit(): void { }
       
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

  sIsLoading: string = '';
  isLoading = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator; 

  dsSMSSentList= new MatTableDataSource<SentSMSList>();

  constructor(
    public _SMSConfigService : SMSConfugurationService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getSMSSentList();
  }

  getSMSSentList(){
    this.sIsLoading = 'loading-data';
    var vdata = {    
      "FromDate":this.datePipe.transform(this._SMSConfigService.MySearchForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "ToDate":  this.datePipe.transform(this._SMSConfigService.MySearchForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    }
      console.log(vdata);
      this._SMSConfigService.getSMSSentList(vdata).subscribe(data => {
      this.dsSMSSentList.data = data as SentSMSList[];
      console.log(this.dsSMSSentList.data)
      this.dsSMSSentList.sort = this.sort;
      this.dsSMSSentList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
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
      this.getSMSSentList();
    });
  }
}
 
export class SentSMSList {
 
  PatientName:string;
  Date: Number;
  RegNo:number;
  MobileNo:number;
  Doctorname:number; 
  constructor(SentSMSList) {
    {
      this.Date = SentSMSList.Date || 0;
      this.RegNo = SentSMSList.RegNo || 0;
      this.MobileNo = SentSMSList.MobileNo || 0; 
      this.Doctorname = SentSMSList.Doctorname || '';
      this.PatientName = SentSMSList.PatientName || '';
    }
  }
}
