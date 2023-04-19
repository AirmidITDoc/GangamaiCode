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
import Swal from 'sweetalert2';
import { InventoryMasterService } from '../inventory-master.service';
import { EditDesignMasterComponent } from './edit-design-master/edit-design-master.component';
import { NewDesignmasterComponent } from './new-designmaster/new-designmaster.component';

@Component({
  selector: 'app-design-master',
  templateUrl: './design-master.component.html',
  styleUrls: ['./design-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DesignMasterComponent implements OnInit {

  

  VisitList: any;
  msg: any;
  sIsLoading: string = '';
  isLoading = true;
  isRateLimitReached = false;
  screenFromString = 'admission-form';
  PatientTypeList: any = [];

  // menuActions:Array<string> = [];
  hasSelectedContacts: boolean;
  LocationCode: any;
  LocationName: any;
  

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;



  displayedColumns = [
   'DesignID',  
    'DesignCode',
    'DesignName',
    'RSpace',
    'Reed',
    'QualityId',
    'Pick',
    'Waste',
    'HsnNo',
    'Width',
    'TotalEnds',
    'TotalExpWt',
    'TotalRepeatPick',
    'TotalDesignPick',
    'TotalExpGms',
    'TotalStandardGms',
    'UpdatedBy',
    'UpdatedOn',
    'action'
  ];
  dataSource = new MatTableDataSource<DesignMain>();
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
      "Keyword": '',// this._OtherinfoMasterService.Searchform.get("Keyword").value + '%' || '%',
      "DesignType":'',
      "From_Dt" :'',// this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
      "To_Dt" : '',//this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("end").value,"MM-dd-yyyy") || "01/01/1900", 
    
    }
    console.log(D_data);
    this.D_data1 = D_data;
    this._InvoiceListService.getDesignlist(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as DesignMain[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource.data);
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });


  }



  getDesignendtableList() {
     debugger;
    this.sIsLoading = 'loading-data';
    var D_data = {
      "Keyword": this._InvoiceListService.mySearchform.get("Keyword").value + '%' || '%',
      "DesignType": this._InvoiceListService.mySearchform.get("DesignType").value  || '%',
      "From_Dt" :this.datePipe.transform(this._InvoiceListService.mySearchform.get("start").value,"MM-dd-yyyy") || "",
      "To_Dt" : this.datePipe.transform(this._InvoiceListService.mySearchform.get("end").value,"MM-dd-yyyy") || "", 
    }

    this._InvoiceListService.getDesignlist(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as DesignMain[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
    this._InvoiceListService.mySearchform.get('Keyword').reset();
  }



  onSearch() {
    this.getDesignendtableList();

  }




  NewDesignendtable() {
    const dialogRef = this._matDialog.open(NewDesignmasterComponent,
      {
        maxWidth: "95vw",
        height: '100%',
        width: '100%',

      });
    dialogRef.afterClosed().subscribe(result => {
      this.getDesignendtableList();
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
      "DesignID":row.DesignID,
  "DesignName":row.DesignName,
  "ChallanNo":row.ChallanNo,
  "Rspace":row.RSpace,
  "Reed":row.Reed,
  "Quality":row.QualityId,
  "Pick":row.Pick,
  "Waste":row.Waste,
  "HSNNo":row.HsnNo,
  "Width":row.Width,
  "Stdgmmt":row.Stdgmmt,
  "TotalDesignPick":row.TotalDesignPick,
"TotalEnds":row.TotalEnds,
"TotalExpGms":row.TotalExpGms,
"TotalExpWt":row.TotalExpWt,
"TotalRepeatPick":row.TotalRepeatPick,
"TotalStandardGms":row.TotalStandardGms
    }

    console.log(m_data);
    this._InvoiceListService.populateFormDesign(m_data);

    const dialogRef = this._matDialog.open(EditDesignMasterComponent,
      {
        maxWidth: "95vw",
        height: '99%',
        width: '100%',
        data: {
          registerObj: m_data,
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getDesignendtableList();
    });
  }


  onClear() {


    this._InvoiceListService.mySearchform.get('Keyword').reset();
    this._InvoiceListService.mySearchform.get('DesignType').reset();
 
    var D_data = {
      "Keyword": '',// this._OtherinfoMasterService.Searchform.get("Keyword").value + '%' || '%',
      "DesignType":'',
      "From_Dt" :'',// this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
      "To_Dt" : '',//this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("end").value,"MM-dd-yyyy") || "01/01/1900", 
    
    }
    console.log(D_data);
    this.D_data1 = D_data;
    this._InvoiceListService.getDesignlist(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as DesignMain[];
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

    debugger;
    //  let Query = "Select DischargeId from Discharge where  AdmissionID=" + this.selectedAdvanceObj.AdmissionID + " ";

    let Query = "update YarnMaster set isActive=0 where yID=" + element.yID + "";
    console.log(Query);
    this._InvoiceListService.getDeleteYarnmaster(Query).subscribe(data => {
      if (data)
        Swal.fire('Success !', 'ChargeList Row Deleted Successfully', 'success');

      //  console.log(this.DischargeId);
    });
  }



  onExport(exprtType) {
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



export class Designendtable {
  WarapCount:any
  WarapShade:any
  Count:any;
  WarapDnrCount:any
  WarapEnds:any
  WarapEndsPer:any
  WarapRepeat:any
  WarapWastage:any
  WarapExpWt:any
  shadeID:any;
  isLocallyAdded:boolean
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(Designendtable) {
    {
      this.WarapCount = Designendtable.WarapCount || '';
      this.WarapShade = Designendtable.WarapShade || '';
      this.Count = Designendtable.Count || '';
      this.WarapDnrCount = Designendtable.WarapDnrCount || '';
      this.WarapEnds = Designendtable.WarapEnds || '';
      this.WarapEndsPer = Designendtable.WarapEndsPer || '';
      this.WarapRepeat = Designendtable.WarapRepeat || '';
      this.WarapWastage = Designendtable.WarapWastage || '';
      this.WarapExpWt = Designendtable.WarapExpWt || '';
      this.shadeID = Designendtable.shadeID || '';
      this.isLocallyAdded = Designendtable.isLocallyAdded || '';
     
    }
  }
}


export class DesignPick {

         
  WeftCount:any
  WeftShade:any
  ActCount:any
  WeftDnrCount:any
  Percentage:any
  DesignPer:any
  RepeatPic:any
  DesignPic:any
  WeftWastagePer:any
  ExpWt:any
  Rate:any
  Costing:any
  isLocallyAdded1:boolean
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(DesignPick) {
    {
      this.WeftCount = DesignPick.WeftCount || '';
      this.WeftShade = DesignPick.WeftShade || '';
      this.ActCount = DesignPick.ActCount || '';
      this.WeftDnrCount = DesignPick.WeftDnrCount || '';
      this.Percentage = DesignPick.Percentage || '';
      this.DesignPer=DesignPick.DesignPer || '';
      this.RepeatPic = DesignPick.RepeatPic || '';
      this.DesignPic = DesignPick.DesignPic || '';
      this.WeftWastagePer = DesignPick.WeftWastagePer || '';
      this.ExpWt = DesignPick.ExpWt || '';
      this.Rate = DesignPick.Rate || '';
      this.Costing = DesignPick.Costing || '';
      this.isLocallyAdded1 = DesignPick.isLocallyAdded1 || '';
     
    }
  }
}





export class DesignMain {
  DesignID:any;
  DesignName:any;
  ChallanNo:any;
  Rspace:any;
  Reed:any;
  Quality:any;
  Pick:any;
  Waste:any;
  HSNNo:any;
  Width:any;
  Stdgmmt:any;
  TotalEnds:any;
  TotalExpWt:any;
  TotalRepeatPick:any;
  TotalDesignPick:any;
  TotalExpGms:any;
  TotalStandardGms:any;
  UpdatedBy:any;
  UpdatedOn:any;
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(DesignMain) {
    {
      this.DesignID = DesignMain.DesignID || '';
      this.DesignName = DesignMain.DesignName || '';
      this.ChallanNo = DesignMain.ChallanNo || '';
      this.Rspace = DesignMain.Rspace || '';
      this.Reed = DesignMain.Reed || '';
      this.Quality = DesignMain.Quality || '';
      this.Pick=DesignMain.Pick || '';
      this.Waste = DesignMain.Waste || '';
      this.HSNNo = DesignMain.HSNNo || '';
      this.Width = DesignMain.Width || '';
      this.Stdgmmt = DesignMain.Stdgmmt || '';
      this.TotalEnds=DesignMain.TotalEnds || '';
      this.TotalExpWt = DesignMain.TotalExpWt || '';
      this.TotalRepeatPick = DesignMain.TotalRepeatPick || '';
      this.TotalDesignPick = DesignMain.TotalDesignPick || '';
      this.TotalExpGms = DesignMain.TotalExpGms || '';
      this.TotalStandardGms = DesignMain.TotalStandardGms || '';
      this.UpdatedBy = DesignMain.UpdatedBy || '';
      this.UpdatedOn = DesignMain.UpdatedOn || '';
    
    }
  }
}




