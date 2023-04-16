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
import { YarninwardService } from '../yarninward.service';
import { EditYarnoutwordComponent } from './edit-yarnoutword/edit-yarnoutword.component';
import { NewYarnOutwordComponent } from './new-yarn-outword/new-yarn-outword.component';

@Component({
  selector: 'app-yarn-outward',
  templateUrl: './yarn-outward.component.html',
  styleUrls: ['./yarn-outward.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class YarnOutwardComponent implements OnInit {

 

  sIsLoading: string = '';
  isLoading = true;
  
  screenFromString = 'admission-form';
  Totalamount:any;
  TotalWeight:any;
  TotalBag:any;
  registerObj: any;
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;

  displayedColumns = [

    'YarnInwardID',
    'YarnInwardCode',
    'EntryDate',
    'ChallanNo',
    'ChallanDate',
    'LotNo',
    'PartyName',
    // 'PartyName',
  
    'TotalBags',
    'TotalWeight',
    'TotalAmount',
    'AuthorisedBy',
    'CheckedBy',
    // 'TransportId',
    'VehichleNo',
    'Remarks',
    // 'UpdatedBy',
    // 'yin.updatedon',
   
    // 'isActive',
    'action'
  ];
  dataSource = new MatTableDataSource<YarnInwardMaster>();
  menuActions: Array<string> = [];

  public doctorFilterCtrl: FormControl = new FormControl();
  public filtereddoctor: ReplaySubject<any> = new ReplaySubject<any>(1);
  private _onDestroy = new Subject<void>();


  constructor(public _YarninwardService: YarninwardService,
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
      "Keyword": '',// this._OtherinfoMasterService.Searchform.get("Keyword").value + '%' || '%',
      "AccountName":'',
      "From_Dt" :'',// this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
      "To_Dt" : '',//this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("end").value,"MM-dd-yyyy") || "01/01/1900", 
    

    }
    console.log(D_data);
    this.D_data1 = D_data;
    this._YarninwardService.getYarnInventorylist(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as YarnInwardMaster[];
      this.dataSource.sort = this.sort;
      this.getWeightSum(this.dataSource.data);
      this.getAmountSum(this.dataSource.data);
      this.getBagsSum(this.dataSource.data);
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource.data);
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });


  }




  getYarnInwardList() {
    //  debugger;
    this.sIsLoading = 'loading-data';
    var D_data = {
      "Keyword": this._YarninwardService.yarnsearchform.get("Keyword").value + '%' || '%',
       "AccountName": this._YarninwardService.yarnsearchform.get("AccountName").value + '%' || '%',
       "From_Dt": this.datePipe.transform(this._YarninwardService.yarnsearchform.get("start").value,"MM-dd-yyyy") || "",
       "To_Dt": this.datePipe.transform(this._YarninwardService.yarnsearchform.get("start").value,"MM-dd-yyyy") || "",

    }

    this._YarninwardService.getYarnInventorylist(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as YarnInwardMaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getWeightSum(element) {
    debugger;
    let netAmt;
    netAmt = element.reduce((sum, { TotalWeight }) => sum += +( TotalWeight || 0), 0);
    console.log(netAmt);
    this.TotalWeight = netAmt;
        
  }

  getAmountSum(element) {
    debugger;
    let netAmt;
    netAmt = element.reduce((sum, { TotalAmount }) => sum += +( TotalAmount || 0), 0);
    console.log(netAmt);
    this.Totalamount = netAmt;
        
  }

  getBagsSum(element) {
    debugger;
    let netAmt;
    netAmt = element.reduce((sum, { TotalBags }) => sum += +( TotalBags || 0), 0);
    console.log(netAmt);
    this.TotalBag = netAmt;
        
  }


  onSearch() {
    this.getYarnInwardList();

  }



  NewYarnmaster() {
    const dialogRef = this._matDialog.open(NewYarnOutwordComponent,
      {
        maxWidth: "98%",
        height: '99%',
        width: '100%',
        // height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getYarnInwardList();
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
      "YarnInListID":row.YarnInListID,
      "YarnInwardID": row.YarnInwardID,
      "YarnInwardCode": row.YarnInwardCode,
      "PartyName":row.PartyName,
      "EntryDate": row.EntryDate,
      "ChallanNo": row.ChallanNo,
      "ChallanDate": row.ChallanDate,
      "LotNo": row.LotNo,
      "AccountId": row.AccountId,
      "TotalBag": row.TotalBags,
      "TotalWeight": row.TotalWeight,
      "TotalAmount": row.TotalAmount,
      "Authorisedby": row.AuthorisedBy,
      "TransportId": row.TransportId,
      "CheckedBy": row.CheckedBy,
      "VehichleNo": row.VehichleNo,
      "Remarks": row.Remarks,

    }

    console.log(m_data);
    this._YarninwardService.populateFormYarnInward(m_data);

    const dialogRef = this._matDialog.open(EditYarnoutwordComponent,
      {
        maxWidth: "98%",
        height: '85%',
        width: '100%',
        data: {
          registerObj: m_data,
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getYarnInwardList();
    });
  }


  onClear() {

    this._YarninwardService.yarnsearchform.get('Keyword').reset();
    this._YarninwardService.yarnsearchform.get('AccountName').reset();

    var D_data = {
      "Keyword": '',// this._OtherinfoMasterService.Searchform.get("Keyword").value + '%' || '%',
      "AccountName":'',
      "From_Dt" :'',// this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
      "To_Dt" : '',//this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("end").value,"MM-dd-yyyy") || "01/01/1900", 
    

    }
    console.log(D_data);
    this.D_data1 = D_data;
    this._YarninwardService.getYarnInventorylist(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as YarnInwardMaster[];
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

    // let Query = "update YarnMaster set isActive=0 where yID=" + element.yID + "";
    // console.log(Query);
    // this._YarninwardService.getDeleteYarnmaster(Query).subscribe(data => {
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


export class YarnMaster {
  yID: number;
  yName: string;
  yCount: any;
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



export class YarnInwardMaster {
  YarnInwardID:any;
  YarnInwardCode:any;
  EntryDate:any;
  ChallanNo:any;
  ChallanDate:any;
  LotNo:any;
  AccountId:any;
  PartyName:any;

  TotalBags:any;
  TotalWeight:any;
  TotalAmount:any;
  AuthorisedBy:any;
  CheckedBy:any;
  TransportId:any;
  VehichleNo:any;
  Remarks:any;

  constructor(YarnInwardMaster){
    this.YarnInwardID = YarnInwardMaster.YarnInwardID || '';
    this.YarnInwardCode = YarnInwardMaster.YarnInwardCode || '';
    this.ChallanNo = YarnInwardMaster.ChallanNo || '';
    this.LotNo = YarnInwardMaster.LotNo || '';
    this.PartyName = YarnInwardMaster.PartyName || '';
  
    this.AccountId = YarnInwardMaster.AccountId || 0;
    this.TotalBags = YarnInwardMaster.TotalBags || '';
    this.TotalWeight = YarnInwardMaster.TotalWeight || '';
    this.TotalAmount = YarnInwardMaster.TotalAmount || '';
    this.AuthorisedBy = YarnInwardMaster.AuthorisedBy || '';
    this.CheckedBy = YarnInwardMaster.CheckedBy || '';
    this.TransportId = YarnInwardMaster.TransportId || '';
    this.VehichleNo = YarnInwardMaster.VehichleNo || '';
    this.Remarks = YarnInwardMaster.Remarks || '';
  

  }

}



export class YarnInwardTableMaster {

  // YarnInListID:any;
YarnCount:any;
MillID:any;
ShadeId:any;
WtPerBag:any;
ConePerBag:any;
TotalBags:any;
TotalGrossWt:any;
TotalNetWt:any;

Category:any;
Scale:any;
Rate:any;
Amount:any;
isLocallyAdded:any;

constructor(YarnInwardTableMaster){
//  this.YarnInListID=YarnInwardTableMaster.YarnInListID || 0;
  this.YarnCount = YarnInwardTableMaster.YarnCount || '';
  this.MillID = YarnInwardTableMaster.MillID || '';
  this.ShadeId = YarnInwardTableMaster.ShadeId || '';
  this.WtPerBag = YarnInwardTableMaster.WtPerBag || '';
  this.ConePerBag = YarnInwardTableMaster.ConePerBag || '';
  this.TotalBags = YarnInwardTableMaster.TotalBags || '';
  this.TotalGrossWt = YarnInwardTableMaster.TotalGrossWt || '';
  this.TotalNetWt = YarnInwardTableMaster.TotalNetWt || '';
  this.Category = YarnInwardTableMaster.Category || '';
  this.Scale = YarnInwardTableMaster.Scale || '';
  this.Rate = YarnInwardTableMaster.Rate || '';
  this.Amount = YarnInwardTableMaster.Amount || '';
  this.isLocallyAdded = YarnInwardTableMaster.isLocallyAdded || '';
}
}