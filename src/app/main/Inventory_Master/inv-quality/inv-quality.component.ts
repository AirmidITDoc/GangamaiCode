import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/Invoice/advance';
import { InvoiceListService } from 'app/main/Invoice/invoice-list.service';
import { ReplaySubject, Subject } from 'rxjs';
import { InventoryMasterService } from '../inventory-master.service';
import { EditQualityComponent } from './edit-quality/edit-quality.component';
import { NewQualityMasterComponent } from './new-quality-master/new-quality-master.component';

// declare const require: any;
// const jsPDF = require('jspdf');
// require('jspdf-autotable');

// import * as XLSX from 'xlsx';
// import Swal from 'sweetalert2';

@Component({
  selector: 'app-inv-quality',
  templateUrl: './inv-quality.component.html',
  styleUrls: ['./inv-quality.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InvQualityComponent implements OnInit {

  VisitList: any;
  msg: any;
  sIsLoading: string = '';
  isLoading = true;
  isRateLimitReached = false;
  screenFromString = 'admission-form';
  PatientTypeList: any = [];

  // menuActions:Array<string> = [];
  hasSelectedContacts: boolean;
  doctorNameCmbList: any = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;
 

  displayedColumns = [
    'QualityId',
    'QualityCode',
    'QualityName',
    
    'AccountId',
    'Waste',
    'Construction',
    'Type',
    'Remark',
    'IsDesign',
    'UpdatedBy',
    
    'UpdatedOn',
    // 'IsActive',
    'action'
  ];
  dataSource = new MatTableDataSource<Itemmaster>();
  menuActions: Array<string> = [];

  public doctorFilterCtrl: FormControl = new FormControl();
  public filtereddoctor: ReplaySubject<any> = new ReplaySubject<any>(1);
  private _onDestroy = new Subject<void>();


  constructor(public _InvoiceListService: InventoryMasterService,
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
      "Keyword": '',//this._InvoiceListService.mySearchform.get("Keyword").value + '%' || '',
      "From_Dt" : '',//this.datePipe.transform(this._InvoiceListService.mySearchform.get("start").value,"MM-dd-yyyy") || "",
      "To_Dt" : '',//this.datePipe.transform(this._InvoiceListService.mySearchform.get("end").value,"MM-dd-yyyy") || "", 
    
    }
    console.log(D_data);
    this.D_data1 = D_data;
    this._InvoiceListService.getQualitylist(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as Itemmaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource.data);
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });


  }

  

  getQualitymasterList() {
     debugger;
    this.sIsLoading = 'loading-data';
    var D_data = {
      "Keyword": this._InvoiceListService.mySearchform.get("Keyword").value + '%' || '',
      "From_Dt" :this.datePipe.transform(this._InvoiceListService.mySearchform.get("start").value,"MM-dd-yyyy") || "",
      "To_Dt" : this.datePipe.transform(this._InvoiceListService.mySearchform.get("end").value,"MM-dd-yyyy") || "", 
    
    }
    // console.log(D_data);
    this._InvoiceListService.getQualitylist(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as Itemmaster[];
      // console.log(this.dataSource.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

 
  onSearch() {
    this.getQualitymasterList();

  }

  


  NewQualitymaster() {
    const dialogRef = this._matDialog.open(NewQualityMasterComponent,
      {
        maxWidth: "60%",
        height: '99%',
        width: '100%',
        
      });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed - Insert Action', result);
      this.getQualitymasterList();
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



  onEdit(row) {
    console.log(row);


    var m_data = {
      "QualityId": row.QualityId,
      "QualityCode": row.QualityCode,
      "QualityName": row.QualityName,
      "AccountId": row.AccountId,
      "Waste": row.Waste,
      "Type": row.Type,
      "Remark": row.Remark,
      "Construction": row.Construction,

      "WarpSort1": row.WarpSort1,
      "WarpSort2": row.WarpSort2,
      "WarpSort3": row.WarpSort3,
      "WeftSort1": row.WeftSort1,
      "WeftSort2": row.WeftSort2,
      "WeftSort3": row.WeftSort3,
      "WidthInch": row.WidthInch,
      "WidthCms": row.WidthCms,


      "RsInch": row.RsInch,
      "RsCms": row.RsCms,
      "ReedInch": row.ReedInch,
      "ReedCms": row.ReedCms,
      "PickInch": row.PickInch,
      "PickCms": row.PickCms,
           
    
    }

    console.log(m_data);
    this._InvoiceListService.populateFormQuality(m_data);

    const dialogRef = this._matDialog.open(EditQualityComponent,
      {
        maxWidth: "60%",
        height: '99%',
        width: '100%',
        data: {
          registerObj: m_data,
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getQualitymasterList();
    });
  }


  onClear() {


    this._InvoiceListService.Itemform.get('Keyword').reset();
    var D_data = {
      "Keyword": '',//this._InvoiceListService.mySearchform.get("Keyword").value + '%' || '',
      "From_Dt" : '',//this.datePipe.transform(this._InvoiceListService.mySearchform.get("start").value,"MM-dd-yyyy") || "",
      "To_Dt" : '',//this.datePipe.transform(this._InvoiceListService.mySearchform.get("end").value,"MM-dd-yyyy") || "", 
    
    }
    console.log(D_data);
    this.D_data1 = D_data;
    this._InvoiceListService.getQualitylist(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as Itemmaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource.data);
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
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
    //       "PhoneAppId" :this.dataSource.data[i]["PhoneAppId"],
    //       "AppointmentDate" :this.dataSource.data[i]["AppDate"] ? this.dataSource.data[i]["AppDate"]:"N/A",
    //       "Patient Name" :this.dataSource.data[i]["PatientName"] ? this.dataSource.data[i]["PatientName"]:"N/A",
    //       "Address" :this.dataSource.data[i]["Address"] ? this.dataSource.data[i]["Address"] :"N/A",
    //       "MobileNo" :this.dataSource.data[i]["MobileNo"] ? this.dataSource.data[i]["MobileNo"] :"N/A",
    //       "DepartmentName" :this.dataSource.data[i]["DepartmentName"] ? this.dataSource.data[i]["DepartmentName"] : "N/A",
    //       "Doctorname" :this.dataSource.data[i]["DoctorName"] ? this.dataSource.data[i]["DoctorName"]:"N/A",
    //       "PhAppDate" :this.dataSource.data[i]["PhAppDate"] ? this.dataSource.data[i]["PhAppDate"]:"N/A",


    //     };
    //     excelData.push(singleEntry);
    //   }
    //   var fileName = "Phone-Appointment-List " + new Date() +".xlsx";
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





export class Itemmaster {
  QualityId: number;
  QualityName: string;
  QualityCode: any;
  AccountId: any;
  Waste: any;
  Construction: any;
  WidthInch: any;
  WidthCms: any;

  RsInch: any;
  RsCms: any;
  ReedInch: any;
  ReedCms: any;
  
  PickInch: any;
  PickCms: any;
  WarpSort1: any;
  WarpSort2: any;

  WarpSort3: any;

  WeftSort1: any;
  WeftSort2: any;
  WeftSort3: any;

  Type: any;
  IsDesign: any;
  isActive:any;
  createdBy: any;
  updatedBy: any;
  createdOn: any;
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(Itemmaster) {
    {
      this.QualityId = Itemmaster.QualityId || 0;
      this.QualityName = Itemmaster.QualityName || '';
      this.QualityCode = Itemmaster.QualityCode || '';
      this.AccountId = Itemmaster.AccountId || '';
      this.Waste = Itemmaster.Waste || '';
      this.Construction = Itemmaster.Construction || '';
      this.WidthInch = Itemmaster.WidthInch || '';

      this.WidthCms = Itemmaster.WidthCms || 0;
      this.RsInch = Itemmaster.RsInch || '';
      this.RsCms = Itemmaster.RsCms || '';
      this.ReedInch = Itemmaster.ReedInch || '';
      this.ReedCms = Itemmaster.ReedCms || '';
      this.PickInch = Itemmaster.PickInch || '';
      this.PickCms = Itemmaster.PickCms || '';
      this.WarpSort1 = Itemmaster.WarpSort1 || '';
      this.WarpSort2 = Itemmaster.WarpSort2 || '';
      this.WarpSort3 = Itemmaster.WarpSort3 || '';

      this.WeftSort1 = Itemmaster.WeftSort1 || '';
      this.WeftSort2 = Itemmaster.WeftSort2 || '';
      this.WeftSort3 = Itemmaster.WeftSort3 || '';
      
      this.Type = Itemmaster.Type || '';
      this.IsDesign = Itemmaster.IsDesign || '';


      this.isActive = Itemmaster.isActive || '';
      this.createdBy = Itemmaster.createdBy || '';
      this.updatedBy = Itemmaster.updatedBy || '';
      this.createdOn = Itemmaster.createdOn || '';

    }
  }
}