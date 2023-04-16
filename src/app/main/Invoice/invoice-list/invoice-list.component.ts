import { MatTableDataSource } from '@angular/material/table';

import { Component, Input, OnInit, ViewEncapsulation, OnDestroy, TemplateRef, ViewChild, ElementRef,Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatDialog , MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject ,ReplaySubject,Observable} from 'rxjs';
import { takeUntil,startWith,map } from 'rxjs/operators';
import { FormGroup ,FormBuilder,FormControl} from '@angular/forms';
import { InvoiceListService } from '../invoice-list.service';

import { ServiceMaster } from '../invoice.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { de } from 'date-fns/locale';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { AdvanceDataStored } from '../advance';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { NewPartyAccountComponent } from 'app/main/Master/party-account/new-party-account/new-party-account.component';
import { PartyAccountComponent } from 'app/main/Master/party-account/party-account.component';

import { NewYarnMasterComponent } from './new-yarn-master/new-yarn-master.component';
import Swal from 'sweetalert2';
import { EditYarnmasterComponent } from './edit-yarnmaster/edit-yarnmaster.component';
import { RegisterComponent } from 'app/main/auth/register/register.component';

// declare const require: any;
// const jsPDF = require('jspdf');
// require('jspdf-autotable');
// const jsPDF = require('jspdf')
// var pdf = new jsPDF('p', 'pt', 'letter')

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InvoiceListComponent implements OnInit {
  step = 0;
  setStep(index: number) {
    this.step = index;
  }
  Range: boolean = true;
  VisitList: any;
  msg: any;
  sIsLoading: string = '';
  isLoading = true;
  isRateLimitReached = false;
  screenFromString = 'admission-form';
  PatientTypeList: any = [];
  registerObj:any;
  // menuActions:Array<string> = [];
  hasSelectedContacts: boolean;
  doctorNameCmbList: any = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;

  displayedColumns = [

    'yID',
    'yName',
    'yCode',
    'yPly',
    'yType',
    'yBlend',
    'yActualCount',
    'yDenierCount',
    'Created',
    'isActive',
  'action'
  ];
  dataSource = new MatTableDataSource<YarnMaster>();
  menuActions: Array<string> = [];

  public doctorFilterCtrl: FormControl = new FormControl();
  public filtereddoctor: ReplaySubject<any> = new ReplaySubject<any>(1);
  private _onDestroy = new Subject<void>();


  constructor(public _InvoiceListService: InvoiceListService,
    private _ActRoute: Router,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    private _fuseSidebarService: FuseSidebarService,
  ) { }
  D_data1: any;
  ngOnInit(): void {
    
    var D_data = {
      "yCode": this._InvoiceListService.mySearchform.get("yCode").value + '%' || '%',
     // "yName": this._InvoiceListService.mySearchform.get("yName").value + '%' || '%',


    }
    console.log(D_data);
    this.D_data1 = D_data;
    this._InvoiceListService.getYarnlist(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as YarnMaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource.data);
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });


  }

  


  getYarnList() {
    //  debugger;
    this.sIsLoading = 'loading-data';
    var D_data = {
      "yCode": this._InvoiceListService.mySearchform.get("yCode").value + '%' || '%',
    //  "yName": this._InvoiceListService.mySearchform.get("yName").value + '%' || '%',

    }
    
    this._InvoiceListService.getYarnlist(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as YarnMaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }


  

  getYarnListbydate($event) {
    //  debugger;
    this.sIsLoading = 'loading-data';
    var D_data = {
   
    "From_Dt" : this.datePipe.transform(this._InvoiceListService.mySearchform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
    "To_Dt" : this.datePipe.transform(this._InvoiceListService.mySearchform.get("end").value,"MM-dd-yyyy") || "01/01/1900", 
    

    }
    
    this._InvoiceListService.getYarnlistbydate(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as YarnMaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  onSearch() {
    this.getYarnList();

  }



  NewYarnmaster() {
    const dialogRef = this._matDialog.open(RegisterComponent,
      {
        maxWidth: "45vw",
        height: '450px',
        width: '100%',
        // height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getYarnList();
    });
  }




  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  onClose() {
    // this.dialogRef.close();
  }

  onSubmit() { }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }



  onEdit(row){
    console.log(row);
      var m_data = {
        "yID":row.yID,
        "yName":row.yName,
        "yCode":row.yCode,
        "yCount":row.yCount,
        "yPly":row.yPly,
        "yType":row.yType,
        "yBlend":row.yBlend,
        "yActualCount":row.yActualCount,
        "yDenierCount":row.yDenierCount,
    
      }
    
      console.log(m_data);
      this._InvoiceListService.populateForm2(m_data);
      
      const dialogRef = this._matDialog.open(EditYarnmasterComponent, 
        {   maxWidth: "45vw",
            height: '450px',
            width: '100%',
             data : {
            registerObj : m_data,
          }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        this.getYarnList();
      });
    }


  onClear() {

    this._InvoiceListService.mySearchform.get('yCode').reset();
 

  }
// Delete row in datatable level
  ondelete(element){
 
debugger;
//  let Query = "Select DischargeId from Discharge where  AdmissionID=" + this.selectedAdvanceObj.AdmissionID + " ";

 let Query ="update YarnMaster set isActive=0 where yID=" +element.yID + "";
console.log(Query);
 this._InvoiceListService.getDeleteYarnmaster(Query).subscribe(data => {
  if(data)
  Swal.fire('Success !', 'ChargeList Row Deleted Successfully', 'success');
  
  //  console.log(this.DischargeId);
 });
  }


  onExport(exprtType){
    // debugger;
    // let columnList=[];
    // if(this.dataSource.data.length == 0){
    //   // this.toastr.error("No Data Found");
    //   Swal.fire('Error !', 'No Data Found', 'error');
    // }
    // else{
    //   var excelData = [];
    //   var a=1;
    //   for(var i=0;i<this.dataSource.data.length;i++){
    //     let singleEntry = {
    //       // "Sr No":a+i,

      
    //       "yID" :this.dataSource.data[i]["yID"],
    //       "yName" :this.dataSource.data[i]["yName"] ? this.dataSource.data[i]["yName"]:"N/A",
    //       "yCode" :this.dataSource.data[i]["yCode"] ? this.dataSource.data[i]["yCode"]:"N/A",
    //       "yPly" :this.dataSource.data[i]["yPly"] ? this.dataSource.data[i]["yPly"] :"N/A",
    //       "yType" :this.dataSource.data[i]["yType"] ? this.dataSource.data[i]["yType"] :"N/A",
    //       "yBlend" :this.dataSource.data[i]["yBlend"] ? this.dataSource.data[i]["yBlend"] : "N/A",
    //       "yActualCount" :this.dataSource.data[i]["yActualCount"] ? this.dataSource.data[i]["yActualCount"]:"N/A",
    //       "yDenierCount" :this.dataSource.data[i]["yDenierCount"] ? this.dataSource.data[i]["yDenierCount"]:"N/A",
    //       "createdBy" :this.dataSource.data[i]["createdBy"] ? this.dataSource.data[i]["createdBy"]:"N/A",
    //       "createdOn" :this.dataSource.data[i]["createdOn"] ? this.dataSource.data[i]["createdOn"]:"N/A",


    //     };
    //     excelData.push(singleEntry);
    //   }
    //   var fileName = "Yarn-Master-List " + new Date() +".xlsx";
    //   if(exprtType =="Excel"){
    //     const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(excelData);
    //     var wscols = [];
    //     if(excelData.length > 0){ 
    //       var columnsIn = excelData[0]; 
    //       for(var key in columnsIn){
    //         let headerLength = {wch:(key.length+1)};
    //         let columnLength = headerLength;
    //         try{
    //           columnLength = {wch: Math.max(...excelData.map(o => o[key].length), 0)+1}; 
    //         }
    //         catch{
    //           columnLength = headerLength;
    //         }
    //         if(headerLength["wch"] <= columnLength["wch"]){
    //           wscols.push(columnLength)
    //         }
    //         else{
    //           wscols.push(headerLength)
    //         }
    //       } 
    //     }
    //     ws['!cols'] = wscols;
    //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    //     XLSX.writeFile(wb, fileName);
    //   }else{
    //     let doc = new jsPDF('p','pt', 'a4');
    //     doc.page = 0;
    //     var col=[];
    //     for (var k in excelData[0]) col.push(k);
    //       console.log(col.length)
    //     var rows = [];
    //     excelData.forEach(obj => {
    //       console.log(obj)
    //       let arr = [];
    //       col.forEach(col => {
    //         arr.push(obj[col]);
    //       });
    //       rows.push(arr);
    //     });

    //     doc.autoTable(col, rows,{
    //       margin:{left:5,right:5,top:5},
    //       theme:"grid",
    //       styles: {
    //         fontSize: 3
    //       }});
    //     doc.setFontSize(3);
    //     // doc.save("Indoor-Patient-List.pdf");
    //     window.open(URL.createObjectURL(doc.output("blob")))
    //   }
    // }
  }
}


export class YarnMaster {
  yID: number;
  yName: string;
  yCount:any;
  yCode: any;
  yPly: string;
  yType: any;
  yBlend: string;
  yActualCount: any;
  yDenierCount: any;
  isActive: boolean;
 
  Created: any;
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(YarnMaster) {
    {
      this.yID = YarnMaster.yID || '';
      this.yName = YarnMaster.yName || '';
      this.yCode = YarnMaster.yCode || '';
      this.yPly = YarnMaster.yPly || '';
      this.yCount = YarnMaster.yCount || '';
      this.yType = YarnMaster.yType || '';
      this.yBlend = YarnMaster.yBlend || '';
      this.yActualCount = YarnMaster.yActualCount || '';
      this.yDenierCount = YarnMaster.yDenierCount || '';
      this.isActive = YarnMaster.isActive || '';
       this.Created = YarnMaster.Created || '';

    }
  }
}