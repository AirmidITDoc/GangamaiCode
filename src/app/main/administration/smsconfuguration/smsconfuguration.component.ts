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

@Component({
  selector: 'app-smsconfuguration',
  templateUrl: './smsconfuguration.component.html',
  styleUrls: ['./smsconfuguration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SMSConfugurationComponent implements OnInit {
  displayedColumns = [
    'OutGoingCode',
    'Date',
    'MobileNo',
    'SMSString',
    'IsSent',
  ];

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
        height: '80%',
        width: '70%', 
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
