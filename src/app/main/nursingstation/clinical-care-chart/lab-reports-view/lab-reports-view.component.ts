import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ClinicalCareChartService } from '../clinical-care-chart.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-lab-reports-view',
  templateUrl: './lab-reports-view.component.html',
  styleUrls: ['./lab-reports-view.component.scss'],  
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LabReportsViewComponent implements OnInit {
  displayedColumns: string[] = [
    'Date', 
    'TestName', 
    'PBillNo',
    'IsCompleted', 
  ]

  MyForm:FormGroup;
  PatientType:any;
  RefDocName:any;
  DepartmentName:any;
  Ageyear:any;
  AgeMonth:any;
  AgeDay:any;
  AdmissionDate:any;
  GenderName:any;
  PatientName: any ;
  vAdmissionID: any = 0;
  RegNo:any;
  Doctorname:any;
  Tarrifname:any;
  CompanyName:any;
  WardName:any;
  BedNo:any;
  IPDNo:any;
  sIsLoading:string = '';
  registerObj:any;
  SpinLoading:boolean=false; 
  AdmissionID:any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;

  datasource = new MatTableDataSource<LabtestList>();

  constructor(
    public _formbuilder:FormBuilder,
    public  _ClinicalcareService: ClinicalCareChartService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<LabReportsViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    if(this.data){
      this.registerObj = this.data.Obj;
      console.log(this.registerObj) 
      this.RegNo = this.registerObj.RegNo
      this.Doctorname = this.registerObj.DoctorName
      this.PatientName = this.registerObj.PatientName
      this.BedNo = this.registerObj.BedName
      this.Ageyear = this.registerObj.AgeYear
      this.AgeMonth = this.registerObj.AgeMonth
      this.AgeDay = this.registerObj.AgeDay
      this.DepartmentName = this.registerObj.DepartmentName
      this.WardName = this.registerObj.RoomName
      this.BedNo = this.registerObj.BedName
      this.Ageyear = this.registerObj.AgeYear
      this.AgeMonth = this.registerObj.AgeMonth
      this.AgeDay = this.registerObj.AgeDay 
      this.AdmissionID =this.registerObj.AdmissionID  
    }
    this.gettestList();
  } 

  // gettestList(obj){
  //   var vdata={
  //     "AdmissionId": obj.AdmissionID,
  //     "OP_IP_Type ": 1
  //   }
  //   console.log(vdata)
  //   this._ClinicalcareService.getLabTestList(vdata).subscribe(data =>{
  //     this.datasource.data = data as LabtestList[];
  //   })
  // }


  gettestList(){
    this.sIsLoading = ''
     var vdata={
      "AdmissionId": this.AdmissionID,
      "OP_IP_Type ": 1
     }
     console.log(vdata)
     this._ClinicalcareService.getLabTestList(vdata).subscribe((data) =>{
       this.datasource.data = data as LabtestList[];
       this.datasource.sort = this.sort;  
       this.datasource.paginator = this.paginator; 
       console.log(this.datasource.data); 
     },
   error =>{
     this.sIsLoading = ''; 
   }); 
   }
   
   LabDataList:any=[];
  LabReportView(contact) {
    console.log(contact) 
    this.LabDataList.push(
      {
        PathReportID :  contact.PathReportID, 
      });
      console.log(this.LabDataList)
    let pathologyDelete = [];
    this.LabDataList.forEach((element) => { 
        let pathologyDeleteObj = {};
        pathologyDeleteObj['pathReportId'] = element.PathReportID
        pathologyDelete.push(pathologyDeleteObj);
    }); 
 
    let submitData = {
        "printInsert": pathologyDelete,
    };
    console.log(submitData);
    this._ClinicalcareService.PathPrintResultentryInsert(submitData).subscribe(response => {
        if (response) {
            this.viewgetPathologyTestReportPdf(contact.OPD_IPD_Type)
        }
    }); 
}
viewgetPathologyTestReportPdf(OPD_IP_Type ) {

  setTimeout(() => {
      this.SpinLoading = true; 
      this._ClinicalcareService.getPathTestReport(OPD_IP_Type).subscribe(res => {
          const dialogRef = this._matDialog.open(PdfviewerComponent,
              {
                  maxWidth: "85vw",
                  height: '750px',
                  width: '100%',
                  data: {
                      base64: res["base64"] as string,
                      title: "pathology Test Report Viewer"
                  }
              });
          dialogRef.afterClosed().subscribe(result => { 
              this.SpinLoading = false;
          });
      });

  }, 100);
}
  onClose(){
    this._matDialog.closeAll();
  }
}
export class LabtestList{
  Date : any;
  IsCompleted : any;
  PBillNo : any
  Testname:any

  constructor(LabtestList){
    this.IsCompleted = LabtestList.IsCompleted || 0;
    this.Date = LabtestList.Date || 0;
    this.PBillNo = LabtestList.PBillNo || 0;
    this.Testname = LabtestList.Testname || '';
  }
}
