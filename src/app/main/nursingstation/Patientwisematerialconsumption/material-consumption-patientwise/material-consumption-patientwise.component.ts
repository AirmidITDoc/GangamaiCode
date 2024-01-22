import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { PatientwiseMaterialConsumptionService } from '../patientwise-material-consumption.service';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { NewPatientwiseMaterialconsumptionComponent } from '../new-patientwise-materialconsumption/new-patientwise-materialconsumption.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-material-consumption-patientwise',
  templateUrl: './material-consumption-patientwise.component.html',
  styleUrls: ['./material-consumption-patientwise.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MaterialConsumptionPatientwiseComponent implements OnInit {

  step = 0;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  sIsLoading: string = '';
  isStoreselected: boolean = false;
  Fileterform:FormGroup;
  screenFromString = 'admission-form';
  msg:any;
  SearchName : string;
  storelist:any=[];
  filteredOptionsStore: Observable<string[]>;
  optionsStore: any[] = [];
 
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
  
  constructor(public _NursingStationService:PatientwiseMaterialConsumptionService,
    private accountService: AuthenticationService,
    public notification:NotificationServiceService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    public datePipe: DatePipe,
    // public dialogRef: MatDialogRef<PatientwiseMaterialConsumptionComponent>, 
    ) { }

  ngOnInit(): void {
   this.Fileterform=this.filterForm();

   this.getStorelist();

    this.sIsLoading = 'loading-data';
   
    var m_data={
    
      "ToStoreId": this.accountService.currentUserValue.user.storeId,//this._NursingStationService.myFilterform.get("StoreId").value.StoreId || 0,
      "From_Dt" : '01/01/1900',//this.datePipe.transform(this._NursingStationService.myFilterform.get("start").value,"yyyy-MM-dd 00:00:00.000") ||  
      "To_Dt" :'01/01/1900',//  this.datePipe.transform(this._NursingStationService.myFilterform.get("end").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',  
      
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

  filterForm(): FormGroup {
    return this._formBuilder.group({
      StoreId: '',
      StoreName:'' ,
     
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
    });
  }

  

  getRegistrationList()
   {
   
    this.sIsLoading = 'loading-data';
   
    var m_data={
     
      "ToStoreId": this.Fileterform.get("StoreId").value.StoreId || this.accountService.currentUserValue.user.storeId,
      "From_Dt" : '01/01/1900',//this.datePipe.transform(this.Fileterform.get("start").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900', 
      "To_Dt" : '01/01/1900',// this.datePipe.transform(this.Fileterform.get("end").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',  
    
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
    this._matDialog.closeAll();
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

//   getStorelist() {
     
//     this._NursingStationService.getStoreCombo().subscribe(data => {
//     this.storelist = data;
//     this.filteredstore.next(this.storelist.slice());
//   });
// }
getOptionTextStore(option) {
  return option && option.StoreName ? option.StoreName : '';
}

getStorelist() {
  var vdata = {
    Id: this.accountService.currentUserValue.user.storeId
  }
  this._NursingStationService.getLoggedStoreList(vdata).subscribe(data => {
    this.storelist = data;
    this.optionsStore = this.storelist.slice();
    this.filteredOptionsStore = this.Fileterform.get('StoreId').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._filterStore(value) : this.storelist.slice()),
    );

  });
}

private _filterStore(value: any): string[] {
  if (value) {
    const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
    return this.optionsStore.filter(option => option.StoreName.toLowerCase().includes(filterValue));
  }

}


NewMaterial() {
  const dialogRef = this._matDialog.open(NewPatientwiseMaterialconsumptionComponent,
    {
     
      maxWidth: "85vw", 
          maxHeight: "600px !important ", width: '100%' 
    
    });
  dialogRef.afterClosed().subscribe(result => {
    // console.log('The dialog was closed - Insert Action', result);
    // this.getAdmittedPatientList();
  });
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

