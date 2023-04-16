import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReplaySubject, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { AdvanceDataStored } from '../../advance';
import { InvoiceListService } from '../../invoice-list.service';
import { NewItemMasterComponent } from './new-item-master/new-item-master.component';
import { UpdateItemmasterComponent } from './update-itemmaster/update-itemmaster.component';

@Component({
  selector: 'app-inv-item',
  templateUrl: './inv-item.component.html',
  styleUrls: ['./inv-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InvItemComponent implements OnInit {



  VisitList: any;
  msg: any;
  sIsLoading: string = '';
  isLoading = true;
  isRateLimitReached = false;
  screenFromString = 'admission-form';
  PatientTypeList: any = [];

  // menuActions:Array<string> = [];
  hasSelectedContacts: boolean;
  itemID:any;
  itemCode:any;
  itemName:any;
  itemMaker:any;
  itemCategory:any;
  itemUnit:any;
  itemPartNumber:any;
  itemRate:any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;

  

  displayedColumns = [
    'itemID',
    'itemCode',
    'itemName',
    'itemMaker',
    'itemCategory',
    'itemUnit',
    'itemPartNumber',
    'itemRate',
  
    'createdBy',
    // 'updatedBy',
    'createdOn',
    'isActive',
    //'updatedO',
    'action'
  ];
  dataSource = new MatTableDataSource<Itemmaster>();
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
      "itemCode": this._InvoiceListService.mySearchform.get("itemCode").value + '%' || '%',
      "itemCategory": this._InvoiceListService.mySearchform.get("itemCategory").value + '%' || '%',


    }
    console.log(D_data);
    this.D_data1 = D_data;
    this._InvoiceListService.getItemlist(D_data).subscribe(Visit => {
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

  // get f() { return this._InvoiceListService.mysearchform.controls; }



  getItemList() {
    //  debugger;
    this.sIsLoading = 'loading-data';
    var D_data = {
      "itemCode": this._InvoiceListService.mySearchform.get("itemCode").value + '%' || '%',
      "itemCategory": this._InvoiceListService.mySearchform.get("itemCategory").value + '%' || '%',

    }
    // console.log(D_data);
    this._InvoiceListService.getItemlist(D_data).subscribe(Visit => {
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


  getItemDatewiseList(eve) {
    //  debugger;
    this.sIsLoading = 'loading-data';
    var D_data = {
      "itemCode": this._InvoiceListService.mySearchform.get("itemCode").value + '%' || '%',
      "itemCategory": this._InvoiceListService.mySearchform.get("itemCategory").value + '%' || '%',

    }
    // console.log(D_data);
    this._InvoiceListService.getItemlist(D_data).subscribe(Visit => {
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
    this.getItemList();

  }

  


  NewItemmaster() {
    const dialogRef = this._matDialog.open(NewItemMasterComponent,
      {
        maxWidth: "45vw",
        height: '450px',
        width: '100%',
        // height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed - Insert Action', result);
      this.getItemList();
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
        "itemID":row.itemID,
        "itemCode":row.itemCode,
        "itemName":row.itemName,
        "itemMaker":row.itemMaker,
        "itemCategory":row.itemCategory,
        "itemUnit":row.itemUnit,
        "itemPartNumber":row.itemPartNumber,
        "itemRate":row.itemRate,
           
      }
    
      console.log(m_data);
      this._InvoiceListService.populateForm4(m_data);
      
      const dialogRef = this._matDialog.open(UpdateItemmasterComponent, 
        {   maxWidth: "45vw",
            height: '450px',
            width: '100%',
             data : {
            registerObj : m_data,
          }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        this.getItemList();
      });
    }


  onClear() {
  

    this._InvoiceListService.Itemform.get('itemName').reset();
    this._InvoiceListService.Itemform.get('itemMaker').reset();
    this._InvoiceListService.Itemform.get('itemCategory').reset();
    this._InvoiceListService.Itemform.get('itemUnit').reset();
    this._InvoiceListService.Itemform.get('itemPartNumber').reset();
    this._InvoiceListService.Itemform.get('itemRate').reset();
 

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
  //   debugger;
  //   let columnList=[];
  //   if(this.dataSource.data.length == 0){
  //     // this.toastr.error("No Data Found");
  //     Swal.fire('Error !', 'No Data Found', 'error');
  //   }
  //   else{
  //     var excelData = [];
  //     var a=1;
  //     for(var i=0;i<this.dataSource.data.length;i++){
  //       let singleEntry = {
  //         // "Sr No":a+i,
  //         "PhoneAppId" :this.dataSource.data[i]["PhoneAppId"],
  //         "AppointmentDate" :this.dataSource.data[i]["AppDate"] ? this.dataSource.data[i]["AppDate"]:"N/A",
  //         "Patient Name" :this.dataSource.data[i]["PatientName"] ? this.dataSource.data[i]["PatientName"]:"N/A",
  //         "Address" :this.dataSource.data[i]["Address"] ? this.dataSource.data[i]["Address"] :"N/A",
  //         "MobileNo" :this.dataSource.data[i]["MobileNo"] ? this.dataSource.data[i]["MobileNo"] :"N/A",
  //         "DepartmentName" :this.dataSource.data[i]["DepartmentName"] ? this.dataSource.data[i]["DepartmentName"] : "N/A",
  //         "Doctorname" :this.dataSource.data[i]["DoctorName"] ? this.dataSource.data[i]["DoctorName"]:"N/A",
  //         "PhAppDate" :this.dataSource.data[i]["PhAppDate"] ? this.dataSource.data[i]["PhAppDate"]:"N/A",


  //       };
  //       excelData.push(singleEntry);
  //     }
  //     var fileName = "Phone-Appointment-List " + new Date() +".xlsx";
  //     if(exprtType =="Excel"){
  //       const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(excelData);
  //       var wscols = [];
  //       if(excelData.length > 0){ 
  //         var columnsIn = excelData[0]; 
  //         for(var key in columnsIn){
  //           let headerLength = {wch:(key.length+1)};
  //           let columnLength = headerLength;
  //           try{
  //             columnLength = {wch: Math.max(...excelData.map(o => o[key].length), 0)+1}; 
  //           }
  //           catch{
  //             columnLength = headerLength;
  //           }
  //           if(headerLength["wch"] <= columnLength["wch"]){
  //             wscols.push(columnLength)
  //           }
  //           else{
  //             wscols.push(headerLength)
  //           }
  //         } 
  //       }
  //       ws['!cols'] = wscols;
  //       const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //       XLSX.writeFile(wb, fileName);
  //     }else{
  //       let doc = new jsPDF('p','pt', 'a4');
  //       doc.page = 0;
  //       var col=[];
  //       for (var k in excelData[0]) col.push(k);
  //         console.log(col.length)
  //       var rows = [];
  //       excelData.forEach(obj => {
  //         console.log(obj)
  //         let arr = [];
  //         col.forEach(col => {
  //           arr.push(obj[col]);
  //         });
  //         rows.push(arr);
  //       });

  //       doc.autoTable(col, rows,{
  //         margin:{left:5,right:5,top:5},
  //         theme:"grid",
  //         styles: {
  //           fontSize: 3
  //         }});
  //       doc.setFontSize(3);
  //       // doc.save("Indoor-Patient-List.pdf");
  //       window.open(URL.createObjectURL(doc.output("blob")))
  //     }
  //   }
  }
}




export class Itemmaster {
  itemID: number;
  itemCode: string;
  itemMaker: any;
  itemCategory: string;
  itemUnit: any;
  itemPartNumber: string;
  itemRate: any;
  isActive: any;
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
      this.itemID = Itemmaster.itemID || 0;
      this.itemCode = Itemmaster.itemCode || '';
      this.itemMaker = Itemmaster.itemMaker || '';
      this.itemCategory = Itemmaster.itemCategory || '';
      this.itemUnit = Itemmaster.itemUnit || '';
      this.itemPartNumber = Itemmaster.itemPartNumber || '';
      this.itemRate = Itemmaster.itemRate || '';
      this.isActive = Itemmaster.isActive || '';
      this.createdBy = Itemmaster.createdBy || '';
      this.updatedBy = Itemmaster.updatedBy || '';
      this.createdOn = Itemmaster.createdOn || '';

    }
  }
}