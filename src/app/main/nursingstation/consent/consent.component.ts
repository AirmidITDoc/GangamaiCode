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
    'patientId',
    'PatientName',
    'Age',
    'MobileNo',
    'DoctorName',
    'PatienSource',
    'date',
    'Action'
  ]

  dsConsentList = new MatTableDataSource<OPIPMasterList>();

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
    this.getIPOPPatientList();
  }

  getIPOPPatientList(){
    // debugger
    // var m_data = {
    //   "Keyword": this.RegId
    // }
    // console.log(m_data)
    // this._ConsentService.getPatientRegisterListSearch(m_data).subscribe(visit => {
    //   console.log("Raw API Response:", visit); 
    //   this.dsConsentList.data=visit as OPIPMasterList[];
    //   console.log("daaaaaataaa:", this.dsConsentList.data)
    //   this.dsConsentList.sort = this.sort;
    //   this.dsConsentList.paginator = this.paginator;
    // }); 
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
     });
  }

}
export class OPIPMasterList {

  RegId: number;
  PatientName: any;
  Age: any;
  MobileNo: any;
  DoctorName: any;
  PatienSource: any;
  RegDate: any;

  constructor(OPIPMasterList) {
    {

      this.RegId = OPIPMasterList.RegId || 0;
      this.PatientName = OPIPMasterList.FirstName + ' ' +OPIPMasterList.MiddleName+ ' ' + OPIPMasterList.LastName || 0;
      this.Age = OPIPMasterList.Age || 0;
      this.MobileNo = OPIPMasterList.MobileNo || 0;      
      this.DoctorName = OPIPMasterList.DoctorName || 0;
      this.PatienSource = OPIPMasterList.PatienSource || 0;
      this.RegDate = OPIPMasterList.RegDate || 0;

    }
  }
}
