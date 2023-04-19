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
import { ContractbookingService } from '../contractbooking.service';
import { EditContractBookingComponent } from './edit-contract-booking/edit-contract-booking.component';
import { NewContractBookingComponent } from './new-contract-booking/new-contract-booking.component';

@Component({
  selector: 'app-contract-booking',
  templateUrl: './contract-booking.component.html',
  styleUrls: ['./contract-booking.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ContractBookingComponent implements OnInit {

 
  sIsLoading: string = '';
  isLoading = true;
  
  screenFromString = 'admission-form';
  
  registerObj: any;
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;

  displayedColumns = [

    "ContractBookingID",
    "BookingNo",
    "BookingDate",
    "PartyName",
    "BrokerName",
    "SizingName",
    "Brokerage",
    "QualityName",
    "TotalBeams",
    // "Pick",
    "JobRate",
    "TotalMeter",
    "CompleteDate",
    "PaymentTerms",
    "Remark",
    
    "UpdatedBy",
    "UpdatedOn",
    // 'isActive',
    'action'
  ];
  dataSource = new MatTableDataSource<ContractMaster>();
  menuActions: Array<string> = [];


  constructor(public _ContractbookingService: ContractbookingService,
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
      "Keyword": '',//this._ContractbookingService.mySearchform.get("Keyword").value + '%' || '',
      "From_Dt" :'',// this.datePipe.transform(this._ContractbookingService.mySearchform.get("start").value,"MM-dd-yyyy") || '',
      "To_Dt " :'',// this.datePipe.transform(this._ContractbookingService.mySearchform.get("end").value,"MM-dd-yyyy") || '', 
    

    }
    console.log(D_data);
    this.D_data1 = D_data;
    this._ContractbookingService.getBookingList(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as ContractMaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource.data);
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });


  }




  getContractbookingList() {
    //  debugger;
    this.sIsLoading = 'loading-data';
    var D_data = {
      "Keyword": this._ContractbookingService.Searchform.get("Keyword").value + '%' || '',
      "From_Dt" : this.datePipe.transform(this._ContractbookingService.Searchform.get("start").value,"MM-dd-yyyy") || '',
      "To_Dt" : this.datePipe.transform(this._ContractbookingService.Searchform.get("end").value,"MM-dd-yyyy") || '', 
    
    }

    this._ContractbookingService.getBookingList(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as ContractMaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }




 

  onSearch() {
    this.getContractbookingList();

  }



  NewContractnmaster() {
    const dialogRef = this._matDialog.open(NewContractBookingComponent,
      {
        maxWidth: "75vw",
        height: '510px',
        width: '100%',
        // height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getContractbookingList();
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
    
      "ContractBookingID":row.ContractBookingID,
      "Bookingno":row.BookingNo,
      "Bookdate":row.BookingDate,
      "Partyname":row.PartyName,
      "Brokername":row.BrokerName,
      "Sizingname":row.SizingName,
      "Brokerage":row.Brokerage,
      "Quality":row.QualityName,
       "Design":row.Design,
      "Noofbeam":row.TotalBeams,
      "Pick":row.Pick,
      "Jobrate":row.JobRate,
      "Totalmeter":row.TotalMeter,
      "Completedate":row.CompleteDate,
      "PaymentTerm":row.PaymentTerms,
      "Remark":row.Remark,
      "PartyID":1,
      "BrokerID":1,
      "SizingID":1,


    }

    console.log(m_data);
    this._ContractbookingService.populateForm2(m_data);

    const dialogRef = this._matDialog.open(EditContractBookingComponent,
      {
        maxWidth: "75vw",
        height: '510px',
        width: '100%',
        data: {
          registerObj: m_data,
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getContractbookingList();
    });
  }


  onClear() {

    this._ContractbookingService.Searchform.get('Keyword').reset();
    var D_data = {
      "Keyword": '',//this._ContractbookingService.mySearchform.get("Keyword").value + '%' || '',
      "From_Dt" :'',// this.datePipe.transform(this._ContractbookingService.mySearchform.get("start").value,"MM-dd-yyyy") || '',
      "To_Dt" :'',// this.datePipe.transform(this._ContractbookingService.mySearchform.get("end").value,"MM-dd-yyyy") || '', 
    

    }
    console.log(D_data);
    this.D_data1 = D_data;
    this._ContractbookingService.getBookingList(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as ContractMaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource.data);
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });

  }
  // Delete row in datatable level
  ondelete(element) {

    // debugger;
    // //  let Query = "Select DischargeId from Discharge where  AdmissionID=" + this.selectedAdvanceObj.AdmissionID + " ";

    // let Query = "update ContractMaster set isActive=0 where yID=" + element.yID + "";
    // console.log(Query);
    // this._ContractbookingService.getDeleteYarnmaster(Query).subscribe(data => {
    //   if (data)
    //     Swal.fire('Success !', 'ChargeList Row Deleted Successfully', 'success');

    //   //  console.log(this.DischargeId);
    // });
  }


  onExport(exprtType) {
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


export class ContractMaster {
  ContractBookingID:any;
  BookingNo:any;
  BookingDate:any;
  PartyName:any;
  BrokerName:any;
  SizingName:any;
  Brokerage:any;
  QualityName:any;
  
  DesignId:any;
  TotalBeams:any;
  Pick:any;
  JobRate:any;
  TotalMeter:any;
  CompleteDate:any;
  PaymentTerms:any;
  Remark:any;
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(ContractMaster) {
    {
      this.ContractBookingID = ContractMaster.ContractBookingID || '';
      this.BookingNo = ContractMaster.BookingNo || '';
      this.BookingDate = ContractMaster.BookingDate || '';
      this.PartyName = ContractMaster.PartyName || '';
      this.BrokerName = ContractMaster.BrokerName || '';
      this.SizingName = ContractMaster.SizingName || '';
      this.Brokerage = ContractMaster.Brokerage || '';
      this.QualityName = ContractMaster.QualityName || '';
      this.TotalBeams = ContractMaster.TotalBeams || '';
      this.Pick = ContractMaster.Pick || '';
      this.JobRate = ContractMaster.JobRate || '';
      this.TotalMeter = ContractMaster.TotalMeter || '';
      this.CompleteDate = ContractMaster.CompleteDate || '';
      this.PaymentTerms = ContractMaster.PaymentTerms || '';
      this.Remark = ContractMaster.Remark || '';
  }
}
}