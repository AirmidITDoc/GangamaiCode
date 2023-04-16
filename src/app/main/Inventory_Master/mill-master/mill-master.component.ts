import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/Invoice/advance';
import { ReplaySubject, Subject } from 'rxjs';
import { InventoryMasterService } from '../inventory-master.service';
import { EditMillmasterComponent } from './edit-millmaster/edit-millmaster.component';
import { NewMillMasterComponent } from './new-mill-master/new-mill-master.component';

@Component({
  selector: 'app-mill-master',
  templateUrl: './mill-master.component.html',
  styleUrls: ['./mill-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MillMasterComponent implements OnInit {

  

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
    'millID',
    'millCode',
    'millName',
    'updatedBy',
    'updatedOn',
    // 'Created',
    // 'isActive',
    //'updatedO',
    'action'
  ];
  dataSource = new MatTableDataSource<Millmaster>();
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
      "Keyword": '',// this._InvoiceListService.mySearchform.get("Keyword").value + '%' || '',
      "From_Dt" : '',//this.datePipe.transform(this._InvoiceListService.mySearchform.get("start").value,"MM-dd-yyyy") || "",
      "To_Dt" :'',// this.datePipe.transform(this._InvoiceListService.mySearchform.get("end").value,"MM-dd-yyyy") || "", 
    
       }
    console.log(D_data);
    this.D_data1 = D_data;
    this._InvoiceListService.getMilllist(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as Millmaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource.data);
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });


  }

  // get f() { return this._InvoiceListService.mysearchform.controls; }



  getMillMasterList() {
     debugger;
    this.sIsLoading = 'loading-data';
    var D_data = {
      "Keyword": this._InvoiceListService.mySearchform.get("Keyword").value + '%' || '%',
      "From_Dt" : this.datePipe.transform(this._InvoiceListService.mySearchform.get("start").value,"MM-dd-yyyy") || "",
      "To_Dt" : this.datePipe.transform(this._InvoiceListService.mySearchform.get("end").value,"MM-dd-yyyy") || "", 
    
    }
    console.log(D_data);
    this._InvoiceListService.getMilllist(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as Millmaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource.data);
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
      this._InvoiceListService.mySearchform.get('Keyword').reset();
  }

  // getMillMasterDatewiseList(e) {
  //   //  debugger;
  //   this.sIsLoading = 'loading-data';
  //   var D_data = {
     
   
  //   }
    
  //   this._InvoiceListService.getMilllistDatewise(D_data).subscribe(Visit => {
  //     this.dataSource.data = Visit as Millmaster[];
  //     this.dataSource.sort = this.sort;
  //     this.dataSource.paginator = this.paginator;

  //     this.sIsLoading = '';
  //   },
  //     error => {
  //       this.sIsLoading = '';
  //     });
  // }

  onSearch() {
    this.getMillMasterList();

  }

 


  NewMillmaster() {
    const dialogRef = this._matDialog.open(NewMillMasterComponent,
      {
        maxWidth: "45vw",
        height: '400px',
        width: '100%',
        // height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
     this.getMillMasterList();
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
    debugger;
    console.log(row);
  
      var m_data = {
        "millID":row.millID,
        "millCode":row.millCode,
        "millName":row.millName,
    
      }
    
      console.log(m_data);
      this._InvoiceListService.populateForm2(m_data);
      
      const dialogRef = this._matDialog.open(EditMillmasterComponent, 
        {   maxWidth: "45vw",
            height: '400px',
            width: '100%',
             data : {
            registerObj : m_data,
          }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        this.getMillMasterList();
      });
    }




  onClear() {

    this._InvoiceListService.mySearchform.get('Keyword').reset();
    var D_data = {
      "Keyword": '',// this._InvoiceListService.mySearchform.get("Keyword").value + '%' || '',
      "From_Dt" : '',//this.datePipe.transform(this._InvoiceListService.mySearchform.get("start").value,"MM-dd-yyyy") || "",
      "To_Dt" :'',// this.datePipe.transform(this._InvoiceListService.mySearchform.get("end").value,"MM-dd-yyyy") || "", 
    
       }
    console.log(D_data);
    this.D_data1 = D_data;
    this._InvoiceListService.getMilllist(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as Millmaster[];
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
         
      
    //       "millID" :this.dataSource.data[i]["millID"],
    //       "millCode" :this.dataSource.data[i]["millCode"] ? this.dataSource.data[i]["millCode"]:"N/A",
    //       "millName" :this.dataSource.data[i]["millName"] ? this.dataSource.data[i]["millName"]:"N/A",
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




export class Millmaster {
  millID: number;
  millCode: string;
  millName: any;
  isActive: any;
  createdBy: any;
  updatedBy: any;
  createdOn: any;
  Created:any;

  /**
   * Constructor
   *
   * @param contact
   */
  constructor(Millmaster) {
    {
      this.millID = Millmaster.millID || 0;
      this.millCode = Millmaster.millCode || '';
      this.millName = Millmaster.millName || '';
      this.isActive = Millmaster.isActive || '';
      this.createdBy = Millmaster.createdBy || '';
      this.updatedBy = Millmaster.updatedBy || '';
      this.createdOn = Millmaster.createdOn || '';
      this.Created=Millmaster.Created || '';
    }
  }
}