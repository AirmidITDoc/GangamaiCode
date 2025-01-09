import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ConsentService } from './consent.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NewConsentComponent } from './new-consent/new-consent.component';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss'],  
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ConsentComponent implements OnInit {
  
  sIsLoading: string = '';

  displayedColumns: string[] = [
    'ConsentId',
    'ConsentDate',
    'ConsentTime',
    'ConsentName',
    'ConsentText',
    'ConsentDeptId',
    'ConsentTempId',
    'Action'
  ]
  displayedPatientColumns: string[] = [
    'RegNo',
    'PatientName',
    'OPIPType',
    'MobileNo',
    'AgeYear',
    'Action'
  ]

  dsConsentList = new MatTableDataSource<OPIPMasterList>();
  dsPatientList = new MatTableDataSource<OPIPMasterList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  
  constructor(
    public _ConsentService : ConsentService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getConsentPatientInfoList();
  }

  getConsentPatientInfoList(){
    debugger
    this.sIsLoading = 'loading-data';
    var D_data = {
      "FromDate": this.datePipe.transform(this._ConsentService.myform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "ToDate ": this.datePipe.transform(this._ConsentService.myform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
    }
    console.log("certificateList:", D_data);
    this._ConsentService.getConsentPatientlist(D_data).subscribe(Visit => {
    this.dsConsentList.data = Visit as OPIPMasterList[];
    this.dsConsentList.sort = this.sort;
    this.dsConsentList.paginator = this.paginator;
    this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      }); 
  }


  NewConsent() {
    const dialogRef = this._matDialog.open(NewConsentComponent,
      {
        maxWidth: '85%',
        height: '90%',
        width: '100%',
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        this.getConsentPatientInfoList();
     });
  }
  
  OnEdit(element){
    console.log('ddd:',element)
    const dialogRef = this._matDialog.open(NewConsentComponent,
      {
        maxWidth: '85%',
        height: '90%',
        width: '100%',
        data: {
          Obj: element
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        this.getConsentPatientInfoList();
     });
  }

}
export class OPIPMasterList {

  RegId: number;
  ConsentId:number;
  PatientName: any;
  ConsentDeptId:any;
  ConsentTempId:any;
  ConsentName:any;
  ConsentText:any;
  Age: any;
  MobileNo: any;
  DoctorName: any;
  PatienSource: any;
  RegDate: any;
  OPIPType:any;
  RegNo:any;
  AgeYear:any;
  AgeMonth:any;
  AgeDay:any;
  OPIPID:any;
 
  constructor(OPIPMasterList) {
    {
      this.RegId = OPIPMasterList.RegId || 0;
      this.PatientName = OPIPMasterList.FirstName + ' ' +OPIPMasterList.MiddleName+ ' ' + OPIPMasterList.LastName || 0;
      this.Age = OPIPMasterList.Age || 0;
      this.MobileNo = OPIPMasterList.MobileNo || 0;      
      this.DoctorName = OPIPMasterList.DoctorName || 0;
      this.PatienSource = OPIPMasterList.PatienSource || 0;
      this.RegDate = OPIPMasterList.RegDate || 0;      
      this.ConsentId = OPIPMasterList.ConsentId || 0;      
      this.ConsentDeptId = OPIPMasterList.ConsentDeptId || 0;
      this.ConsentTempId = OPIPMasterList.ConsentTempId || 0;
      this.ConsentName = OPIPMasterList.ConsentName || 0;
      this.ConsentText = OPIPMasterList.ConsentText || 0;
      
      this.OPIPType = OPIPMasterList.OPIPType || 0;      
      this.RegNo = OPIPMasterList.RegNo || 0;
      this.AgeYear = OPIPMasterList.AgeYear || 0;
      this.AgeMonth = OPIPMasterList.AgeMonth || 0;
      this.AgeDay = OPIPMasterList.AgeDay || 0;
      this.OPIPID = OPIPMasterList.OPIPID || 0;
    }
  }
}
