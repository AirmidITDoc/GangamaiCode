import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ReplaySubject, Subject } from 'rxjs';
import { NursingstationService } from '../nursingstation.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { NewPatientConsumpionComponent } from './new-patient-consumpion/new-patient-consumpion.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-patient-wise-materialconsumption',
  templateUrl: './patient-wise-materialconsumption.component.html',
  styleUrls: ['./patient-wise-materialconsumption.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PatientWiseMaterialconsumptionComponent implements OnInit {

  step = 0;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  sIsLoading: string = '';
  
  Fileterform:FormGroup;
  screenFromString = 'admission-form';
  msg:any;
  SearchName : string;
  storelist:any=[];
  //Store filter
  public storeFilterCtrl: FormControl = new FormControl();
  public filteredstore: ReplaySubject<any> = new ReplaySubject<any>(1);
  private _onDestroy = new Subject<void>();
  
  displayedColumns: string[] = [
    // 'RegNo',
    'ConsumptionDate',
    'MaterialConsumptionId',
    // 'FromStoreId',
    'StoreName',
    'RegNo',
    'PatientName',
    'AddedBy',
    'Remark',
 
    'action'
  ];

  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  // @Input() childName: string [];
  // @Output() parentFunction:EventEmitter<any> = new EventEmitter();

  dataSource = new MatTableDataSource<MaterialDetail>();
  isLoading: String = '';
  
  constructor(public _NursingStationService:NursingstationService,
    private accountService: AuthenticationService,
    // public notification:NotificationServiceService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    // public datePipe: DatePipe,
    // public dialogRef: MatDialogRef<PatientwiseMaterialConsumptionComponent>, 
    ) { }

  ngOnInit(): void {
   this.Fileterform=this.filterForm();

   this.getStorelist();

    this.sIsLoading = 'loading-data';
   
    var m_data={
    
      "ToStoreId": 10009,//this._NursingStationService.myFilterform.get("StoreId").value.StoreId || 0,
      "From_Dt" : '2022-11-03 00:00:00.000',//this.datePipe.transform(this._NursingStationService.myFilterform.get("start").value,"yyyy-MM-dd 00:00:00.000") ||  
      "To_Dt" :'2022-11-03 00:00:00.000',//  this.datePipe.transform(this._NursingStationService.myFilterform.get("end").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',  
      
       }
       console.log(m_data);
      setTimeout(() => {
        this.sIsLoading = 'loading-data';
        this._NursingStationService.getpatientwisematerialconsumptionList(m_data).subscribe(Visit=> {
          
          this.dataSource.data = Visit as MaterialDetail[];
          console.log(this.dataSource.data);
          this.dataSource.sort =this.sort;
          this.dataSource.paginator=this.paginator;
        
          this.sIsLoading = ' ';
        },
          error => {
            this.sIsLoading = '';
          });
      }, 50);

      this.storeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterstore();
      });
  }

  filterForm(): FormGroup {
    return this._formBuilder.group({
      StoreId: '',
      StoreName:'' ,
     
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
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

  getRegistrationList()
   {
   
    this.sIsLoading = 'loading-data';
   
    var m_data={
     
      "ToStoreId": this.Fileterform.get("StoreId").value.StoreId || 10009,
      "From_Dt" : '2022-11-03 00:00:00.000',//this.datePipe.transform(this.Fileterform.get("start").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900', 
      "To_Dt" : '2022-11-03 00:00:00.000',// this.datePipe.transform(this.Fileterform.get("end").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',  
    
       }
       console.log(m_data);
      setTimeout(() => {
        this.sIsLoading = 'loading-data';
        this._NursingStationService.getpatientwisematerialconsumptionList(m_data).subscribe(Visit=> {
          
          this.dataSource.data = Visit as MaterialDetail[];
          console.log(this.dataSource.data);
          this.dataSource.sort =this.sort;
          this.dataSource.paginator=this.paginator;
        
          this.sIsLoading = ' ';
        
          
        },
          error => {
            this.sIsLoading = '';
          });
      }, 50);
    }
  

  onClear(){
    this.Fileterform.get('StoreId').reset();
    // this.Fileterform.get('LastName').reset();
    // this.Fileterform.get('RegNo').reset();
   
  }
  
  onClose() {
    this.Fileterform.reset();
    // this._matDialog.closeAll();
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  getStorelist() {
     
    this._NursingStationService.getStoreCombo().subscribe(data => {
    this.storelist = data;
    this.filteredstore.next(this.storelist.slice());
  });
}


NewMaterial() {
  const dialogRef = this._matDialog.open(NewPatientConsumpionComponent,
    {
     
      maxWidth: "100vw", 
          maxHeight: "600px !important ", width: '100%' 
    
    });
  dialogRef.afterClosed().subscribe(result => {
    // console.log('The dialog was closed - Insert Action', result);
    // this.getAdmittedPatientList();
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
  //       "ConsumptionDate" :this.dataSource.data[i]["ConsumptionDate"],
  //       "MaterialConsumptionId" :this.dataSource.data[i]["MaterialConsumptionId"] ? this.dataSource.data[i]["MaterialConsumptionId"]:"N/A",
  //       "StoreName" :this.dataSource.data[i]["StoreName"] ? this.dataSource.data[i]["StoreName"] :"N/A",
  //       "Reg No" :this.dataSource.data[i]["RegNo"],
  //       "Patient Name" :this.dataSource.data[i]["PatientName"] ? this.dataSource.data[i]["PatientName"]:"N/A",
  //       "AddedBy" :this.dataSource.data[i]["AddedBy"] ? this.dataSource.data[i]["AddedBy"] :"N/A",
  //       "Remark" :this.dataSource.data[i]["Remark"] ? this.dataSource.data[i]["Remark"] : "N/A",
       
  //     };
  //     excelData.push(singleEntry);
  //   }
  //   var fileName = "Patientwise_ Materialcounsumption" + new Date() +".xlsx";
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

export class MaterialDetail {
 
  ConsumptionDate: Date;
  MaterialConsumptionId: number;
  FromStoreId: number;
  StoreName: string;
  RegNo: number;
  PatientName: string;
  Remark:string;
  AddedBy: string;
  
  /**
   * Constructor
   *
   * @param MaterialDetail
   */

  constructor(MaterialDetail) {
      {
          this.ConsumptionDate = MaterialDetail.ConsumptionDate || '';
          this.MaterialConsumptionId = MaterialDetail.MaterialConsumptionId || 0;
          this.FromStoreId = MaterialDetail.FromStoreId || 0;
          this.RegNo = MaterialDetail.RegNo || '';
          this.PatientName = MaterialDetail.PatientName || '';
          this.Remark = MaterialDetail.Remark || '';
          this.AddedBy = MaterialDetail.AddedBy || '';
         
         
      }
  }
}
