import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { OPIPPatientModel } from '../patient-vist/patient-vist.component';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { MatSort } from '@angular/material/sort';
import { ReplaySubject, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { DatePipe } from '@angular/common';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { NursingstationService } from '../nursingstation.service';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-pahrmacy-summary',
  templateUrl: './pahrmacy-summary.component.html',
  styleUrls: ['./pahrmacy-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PahrmacySummaryComponent implements OnInit {

 
  sIsLoading: string = '';
  MouseEvent = true;
  click: boolean = false;
  Returnprescription:FormGroup;
  isLoading: string = '';
  selectedAdvanceObj: AdvanceDetailObj;
  screenFromString = 'advance';
  dateTimeObj: any;
  searchFormGroup:FormGroup;
  registerObj = new OPIPPatientModel({});
  storelist:any=[];

  public storeFilterCtrl: FormControl = new FormControl();
  public filteredstore: ReplaySubject<any> = new ReplaySubject<any>(1);
  private _onDestroy = new Subject<void>();
 dataSource = new MatTableDataSource<PharmacySummary>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  
  displayedColumns: string[] = [
    //  'checkbox',
    'RegNo',
    'PatientName',
    'NetAmount',
    'CashPay',
    'ChequePay',
    'CardPay',
    'NEFTPay',
    'PayTMPay',
    'OP_IP_ID'
    // 'action'

  ];
  
  hasSelectedContacts: boolean;
  constructor( private formBuilder: FormBuilder,
    private _ActRoute: Router,
    // public dialogRef: MatDialogRef<PathologresultEntryComponent>,
    private _NursingStationService:NursingstationService,
    private advanceDataStored: AdvanceDataStored,
    // public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,) { }

  ngOnInit(): void {
    
    this.getStorelist();
    this.searchFormGroup=this.createSearchForm();
    this.storeFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterstore();
    });

    this.Phaymacysummarylist();
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }


  createSearchForm() {
    return this.formBuilder.group({
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      StoreId: [''],
     
    });
  }
     
  // Store filter code
  private filterstore() {

    if (!this.storelist) {
      return;
    }
    // get the search keyword
    let search = this.storeFilterCtrl.value;
    if (!search) {
      this.filteredstore.next(this.storelist.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredstore.next(
      this.storelist.filter(bank => bank.StoreName.toLowerCase().indexOf(search) > -1)
    );

  }
  getStorelist() {
     
    this._NursingStationService.getStoreCombo().subscribe(data => {
    this.storelist = data;
    this.filteredstore.next(this.storelist.slice());
  });
}
  onShow(event: MouseEvent) {
    // this.click = false;// !this.click;
    this.click = !this.click;
    // this. showSpinner = true;

    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data';

        this.Phaymacysummarylist();
      }

    }, 50);
    this.MouseEvent = true;
    this.click = true;

  }

  Phaymacysummarylist(){
    // debugger;
    this.sIsLoading = 'loading-data';
    var m_data = {
      "FromDate": '11/23/2022',//this.datePipe.transform(this.Returnprescription.get("start").value, "yyyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
      "ToDate": '11/23/2022',// this.datePipe.transform(this.Returnprescription.get("end").value, "yyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
      "StoreId":2// this.Returnprescription.get("StoreId").value || 0,
      
    }
    // this.isLoadingStr = 'loading';
    console.log(m_data);


    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this._NursingStationService.getPharmacySummaryList(m_data).subscribe(Visit => {
        this.dataSource.data = Visit as PharmacySummary[];

        console.log(this.dataSource.data);
        this.dataSource.sort= this.sort;
        this.dataSource.paginator=this.paginator;
        this.sIsLoading = ' ';
     
      },
        error => {
          this.sIsLoading = '';
        });
    }, 500);
  
 }

//  searchPatientList() {
//   const dialogRef = this._matDialog.open(IPPatientsearchComponent,
//     {
//       maxWidth: "90%",
//       height: "530px !important ", width: '100%',
//     });

//   dialogRef.afterClosed().subscribe(result => {
//     // console.log('The dialog was closed - Insert Action', result);
//     if (result) {
//       this.registerObj = result as OPIPPatientModel;
//       if (result) {
//         this.PatientName = this.registerObj.PatientName;
//         this.OPIP = this.registerObj.IP_OP_Number;
//         this.AgeYear = this.registerObj.AgeYear;
//         this.classname = this.registerObj.ClassName;
//         this.tariffname = this.registerObj.TariffName;
//         this.ipno = this.registerObj.IPNumber;
//         this.Bedname = this.registerObj.Bedname;
//         this.wardname = this.registerObj.WardId;
//         this.Adm_Vit_ID = this.registerObj.Adm_Vit_ID;
//       }
//     }
//     // console.log(this.registerObj);
//   });
// }

  getDateTime(dateTimeObj) {
    
    this.dateTimeObj = dateTimeObj;
  }

  onClose() {
    // this.dialogRef.close();
  }
 
  onClear(){}

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
         
    //       "Reg No" :this.dataSource.data[i]["RegNo"],
    //       "Patient Name" :this.dataSource.data[i]["PatientName"] ? this.dataSource.data[i]["PatientName"]:"N/A",
    //       "NetAmount" :this.dataSource.data[i]["NetAmount"] ? this.dataSource.data[i]["NetAmount"] :"N/A",
    //       "ChequePay" :this.dataSource.data[i]["ChequePay"] ? this.dataSource.data[i]["ChequePay"] : "N/A",
    //       "CardPay" :this.dataSource.data[i]["CardPay"],
    //       "NEFTPay" :this.dataSource.data[i]["NEFTPay"] ? this.dataSource.data[i]["NEFTPay"]:"N/A",
    //       "PayTMPay" :this.dataSource.data[i]["PayTMPay"] ? this.dataSource.data[i]["PayTMPay"] :"N/A",
    //       "OP_IP_ID" :this.dataSource.data[i]["OP_IP_ID"] ? this.dataSource.data[i]["OP_IP_ID"] :"N/A",
    //     };
    //     excelData.push(singleEntry);
    //   }
    //   var fileName = "Pharmacy_Summary" + new Date() +".xlsx";
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



export class PharmacySummary {
  
  RegNo : number;
  PatientName : any;
  NetAmount : any;
  CashPay: any;
  ChequePay: number;
  CardPay: any;
  NEFTPay : any;
  PayTMPay: any;
  OP_IP_ID : any;
  
  constructor(PharmacySummary) {
    this.RegNo  = PharmacySummary.RegNo  || '0';
    this.PatientName  = PharmacySummary.PatientName  || '';
    this.NetAmount  = PharmacySummary.NetAmount  || '';
    this.CashPay = PharmacySummary.CashPay || '';
    this.ChequePay = PharmacySummary.ChequePay || '0';
    this.CardPay = PharmacySummary.CardPay || '';
    this.NEFTPay  = PharmacySummary.NEFTPay  || '';
    this.PayTMPay = PharmacySummary.PayTMPay || '';
    this.OP_IP_ID  = PharmacySummary.OP_IP_ID  || '';
  
  }

}

