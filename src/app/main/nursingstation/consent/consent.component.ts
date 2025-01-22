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
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss'],  
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ConsentComponent implements OnInit {
  
  sIsLoading: string = '';
  hasSelectedContacts: boolean;
  SpinLoading: boolean = false;

  displayedColumns: string[] = [
    'IpOpType',
    'UHIDNO',
    'ConsentDateTime',
    'PatientName',
    'ConsentName',
    'ConsentDesc',
    'AgeYear',
    'Mobile',
    'AddedBy',
    'Action',
  ]
  // displayedPatientColumns: string[] = [
  //   'Date',
  //   'ConsentName',
  //   'ConsentDesc',
  //   'Action'
  // ]

  dsConsentList = new MatTableDataSource<OPIPMasterList>();
  dsPatientDetailList = new MatTableDataSource<OPIPMasterList>();

  @ViewChild('paginator1', { static: true }) paginator1: MatPaginator;
  @ViewChild('paginator2', { static: true }) paginator2: MatPaginator;
  @ViewChild(MatSort) sort1: MatSort;
  @ViewChild(MatSort) sort2: MatSort;
  
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
 // field validation 
 get f() { return this._ConsentService.myform.controls; }

  // getConsentPatientInfoList() {
  //   this.sIsLoading = 'loading-data';
  //   const D_data = {
  //     "FromDate": this.datePipe.transform(this._ConsentService.myformSearch.get("start").value, "MM-dd-yyyy") || "01/01/1900",
  //     "ToDate": this.datePipe.transform(this._ConsentService.myformSearch.get("end").value, "MM-dd-yyyy") || "01/01/1900",
  //     "PatientName": this._ConsentService.myformSearch.get("consentNameSearch").value + '%' || '%',
  //     "RegNo": this._ConsentService.myformSearch.get("uhidNo").value || '',
  //     "OPIPType":this._ConsentService.myformSearch.get("IsIPOrOP").value || ''
  //   };
  
  //   console.log("Request Payload:", D_data);
  
  //   this._ConsentService.getConsentPatientlist(D_data).subscribe(
  //     (response) => {
  //       console.log("API Response:", response);
  
  //       this.dsConsentList.data = response as OPIPMasterList[];
  //       this.dsConsentList.sort = this.sort1;
  //       this.dsConsentList.paginator = this.paginator1;
  //       this.sIsLoading = '';
  //     },
  //     (error) => {
  //       console.error("Error Fetching Data:", error);
  //       this.sIsLoading = '';
  //     }
  //   );
  // }

  getConsentPatientInfoList() {
    this.sIsLoading = 'loading-data';
  
    // Retrieve form values and make sure default values are set
    const FromDate = this._ConsentService.myformSearch.get("start").value;
    const ToDate = this._ConsentService.myformSearch.get("end").value;
    const PatientName = this._ConsentService.myformSearch.get("consentNameSearch").value;
    const RegNo = this._ConsentService.myformSearch.get("uhidNo").value;
    const OPIPType = this._ConsentService.myformSearch.get("IsIPOrOP").value;
  
    // Prepare request payload
    const D_data = {
      "FromDate": this.datePipe.transform(FromDate, "MM-dd-yyyy") || "01/01/1900", // Default date if not set
      "ToDate": this.datePipe.transform(ToDate, "MM-dd-yyyy") || "01/01/1900", // Default date if not set
      "PatientName": PatientName ? `${PatientName}%` : '%', // Add '%' if PatientName is not empty
      "RegNo": RegNo || '', // Handle empty RegNo properly
      "OPIPType": OPIPType || '' // Handle empty OPIPType properly
    };
  
    console.log("Request Payload:", D_data);
  
    // Make API call
    this._ConsentService.getConsentPatientlist(D_data).subscribe(
      (response) => {
        console.log("API Response:", response);
        
        if (response && Array.isArray(response)) {
          // Update the data source and bind to the table
          this.dsConsentList.data = response as OPIPMasterList[];
          this.dsConsentList.sort = this.sort1;
          this.dsConsentList.paginator = this.paginator1;
        } else {
          console.error("Invalid data format received:", response);
        }
  
        // Clear loading state
        this.sIsLoading = '';
      },
      (error) => {
        console.error("Error Fetching Data:", error);
        this.sIsLoading = ''; // Clear loading state on error
      }
    );
  }
  
  
  currentOPIPID: any;
  getConsentPatientInfoDetailList(Param){
    this.currentOPIPID = Param.OPIPID;
    var vdata={
      OPIPID: Param.OPIPID
    }
    console.log("OPIPID:",vdata)
    this._ConsentService.getConsentPatientInfoDetaillist(vdata).subscribe(data =>{
      this.dsPatientDetailList.data = data as OPIPMasterList[];
      this.dsPatientDetailList.sort = this.sort2;
      this.dsPatientDetailList.paginator = this.paginator2;
       console.log(this.dsPatientDetailList.data);
    })
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
        if (this.currentOPIPID) {
          this.getConsentPatientInfoDetailList({ OPIPID: this.currentOPIPID });
        }
     });
  }

  viewgetConsentReportPdf(element){
debugger
    console.log("pdf:", element)
    setTimeout(() => {
      this.SpinLoading = true;
      this._ConsentService.getConsentReportview(
        element.ConsentId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '850px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Consent Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.SpinLoading = false;
        });
        dialogRef.afterClosed().subscribe(result => {
          this.SpinLoading = false;
        });
      });

    }, 100);
  }

  onClear() {
    this._ConsentService.myformSearch.reset({
      start: new Date(),
      end: new Date(),
      IsIPOrOP:'2'
    });
    console.log("Form values after reset:", this._ConsentService.myform.value);
    this.getConsentPatientInfoList();
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
