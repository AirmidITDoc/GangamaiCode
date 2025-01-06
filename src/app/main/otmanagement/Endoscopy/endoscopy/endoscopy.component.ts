import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OTManagementServiceService } from '../../ot-management-service.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { NewEndoscopyComponent } from './new-endoscopy/new-endoscopy.component';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

@Component({
  selector: 'app-endoscopy',
  templateUrl: './endoscopy.component.html',
  styleUrls: ['./endoscopy.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EndoscopyComponent implements OnInit {

 
  sIsLoading: string = '';
  searchFormGroup: UntypedFormGroup;
  click: boolean = false;
  MouseEvent = true;
  AnesthType:any=''
  D_data1:any;
  dataArray = {};
  hasSelectedContacts: boolean;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  displayedColumns: string[] = [
   
    'RegNo',
    'PatientName',
    'OPDate',
    'OPTime',
    'Duration',
    'OTTableName',
    'SurgeonName',
    'AnathesDrName',
    'AnathesDrName1',
    'Surgeryname',
    'AnesthType',
    'UnBooking',
    'AddedBy',
    'TranDate',
    'instruction',
    'action'
  ];
  dataSource = new MatTableDataSource<OTEndoscopydetail>();
  
  constructor( public _OtManagementService: OTManagementServiceService,
       private formBuilder: UntypedFormBuilder,
       private _fuseSidebarService: FuseSidebarService,
    public _matDialog: MatDialog,
    private accountService: AuthenticationService,
    // public dialogRef: MatDialogRef<EndoscopyDetailsComponent>,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe
    ) { }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();
  

    var D_data= {
     
      "FromDate": this.datePipe.transform(this.searchFormGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
      "ToDate":  this.datePipe.transform(this.searchFormGroup.get("end").value, "yyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
      "OTTableID": this.searchFormGroup.get("OTTableID").value || 0
    
  } 
  //  console.log(D_data);
      this.D_data1=D_data;
     this._OtManagementService.getEndoscopylist(D_data).subscribe(reg=> {
      this.dataArray =  reg as OTEndoscopydetail[];
      this.dataSource.data =  reg as OTEndoscopydetail[];
      console.log( this.dataSource.data);
      console.log( this.dataArray);
      this.sIsLoading = '';
    },
    error => {
      this.sIsLoading = '';
    });

    this.getOtendoscopyList();
  }

  createSearchForm() {
    return this.formBuilder.group({
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      OTTableID: ['']
    });
  }
 
  getOtendoscopyList() {

    debugger
     this.sIsLoading = 'loading-data';
     var m_data = {
      "FromDate": this.datePipe.transform(this.searchFormGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
      "ToDate":  this.datePipe.transform(this.searchFormGroup.get("end").value, "yyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
       "OTTableID": this.searchFormGroup.get("OTTableID").value || 0
     }
     console.log(m_data);
     this._OtManagementService.getEndoscopylist(m_data).subscribe(Visit => {
       this.dataSource.data = Visit as OTEndoscopydetail[];
       console.log(this.dataSource.data);
      //  this.dataSource.sort = this.sort;
      //  this.dataSource.paginator = this.paginator;
       this.sIsLoading = '';
      //  this.click = false;
       },
         error => {
           this.sIsLoading = '';
         });
     }

     onShow(event: MouseEvent) {
      // this.click = false;// !this.click;
      this.click = !this.click;
      // this. showSpinner = true;
  
      setTimeout(() => {
        {
          this.sIsLoading = 'loading-data';
  
          this.getOtendoscopyList();
        }
  
      }, 50);
      this.MouseEvent = true;
      this.click = true;
  
    }

    NewTestRequest() {
      const dialogRef = this._matDialog.open(NewEndoscopyComponent,
        {
          maxWidth: "70%",
          height: '85%',
          width: '100%'
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        this._OtManagementService.getEndoscopylist(this.D_data1).subscribe(reg=> {
            this.dataArray = reg;
            this.dataSource.data =  reg as OTEndoscopydetail[];
            console.log( this.dataSource.data);
            console.log( this.dataArray);
            this.sIsLoading = '';
          },
          error => {
            this.sIsLoading = '';
          });
      });
    }
    onClear() {
      this.searchFormGroup.get('start').reset();
      this.searchFormGroup.get('end').reset();
      this.searchFormGroup.get('Reg_No').reset();
    }

  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

    onEdit(contact){

      if(contact.AnesthType)
      this.AnesthType =contact.AnesthType.trim();
      
     let PatInforObj = {};
     PatInforObj['OTEndoscopyBookingID'] = contact.OTEndoscopyBookingID,
    
     PatInforObj['PatientName'] = contact.PatientName,
     PatInforObj['OTTableName'] = contact.OTTableName,
     
     PatInforObj['OTTableID'] = contact.OTTableID,
     PatInforObj['RegNo'] = contact.RegNo,
     PatInforObj['SurgeonId'] = contact.SurgeonId,
     PatInforObj['SurgeonId1'] = contact.SurgeonId1,
     PatInforObj['SurgeonName'] = contact.SurgeonName,
     PatInforObj['Surgeryname'] = 'Mild one',//contact.Surgeryname,
    
     PatInforObj['AnathesDrName'] = contact.AnathesDrName,
     PatInforObj['AnathesDrName1'] = contact.AnathesDrName1,
     PatInforObj['AnesthType'] = this.AnesthType,
     PatInforObj['AnestheticsDr'] = contact.AnestheticsDr,
     PatInforObj['AnestheticsDr1'] = contact.AnestheticsDr1,
     PatInforObj['Duration'] = contact.Duration,
     PatInforObj['OPDate'] = contact.OPDate,
     PatInforObj['OPTime'] = contact.OPTime,
     PatInforObj ['OP_IP_ID'] = contact.OP_IP_ID
     
     PatInforObj['TranDate'] = contact.TranDate,
     PatInforObj['UnBooking'] = contact.UnBooking,
     PatInforObj['Instruction'] = contact.instruction ,
     PatInforObj['AddedBy'] = contact.AddedBy,
    
     console.log(PatInforObj);
     
     
     this._OtManagementService.populateFormpersonal(PatInforObj);
    
    this.advanceDataStored.storage = new OTEndoscopydetail(PatInforObj);
    
    const dialogRef = this._matDialog.open(NewEndoscopyComponent,
      {
        maxWidth: "70%",
        height: '85%',
        width: '100%',
        data: {
          PatObj: PatInforObj 
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this._OtManagementService.getEndoscopylist(this.D_data1).subscribe(reg=> {
        this.dataArray = reg;
        this.dataSource.data =  reg as OTEndoscopydetail[];
        console.log( this.dataSource.data);
        console.log( this.dataArray);
        this.sIsLoading = '';
      },
      error => {
        this.sIsLoading = '';
      });
    
    });
      // if(contact) this.dialogRef.close(PatInforObj);
    }
    
}


export class OTEndoscopydetail {
  OTEndoscopyBookingID: any;
  OP_IP_ID: any;
  RegNo: number;
  PatientName: string;

  OPDate: Date;
  OPTime: Date;
  Duration: number;
  OTTableID: Number;
  OTTableName: any;
  SurgeonId: number;
  SurgeonId1:number;
  AdmissionID:any;
  SurgeonName: any;
  AnestheticsDr:any ;
  AnestheticsDr1: any;
  Surgeryname: any;
  AnesthType: any;
  UnBooking: any;

  IsAddedBy: any;
  AddedBy: any;
  TranDate: Date;
  instruction: any;
  Instruction:any;
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(OTEndoscopydetail) {
    {
      this.OTEndoscopyBookingID = OTEndoscopydetail. OTEndoscopyBookingID || '';
      this.OP_IP_ID = OTEndoscopydetail.OP_IP_ID || '';
      this.RegNo = OTEndoscopydetail. RegNo || '';
      this.PatientName = OTEndoscopydetail.PatientName || '';
      this.AdmissionID = OTEndoscopydetail.AdmissionID || 0;
       this.OPDate = OTEndoscopydetail.OPDate || '';
      this.OPTime = OTEndoscopydetail.OPTime || '';
      this.Duration = OTEndoscopydetail.Duration || '';
      this.OTTableID = OTEndoscopydetail.OTTableID || '';
      this.OTTableName = OTEndoscopydetail.OTTableName || '';
      this.SurgeonId = OTEndoscopydetail.SurgeonId || '';
      this.SurgeonId1 = OTEndoscopydetail.SurgeonId1 || '';
      this.SurgeonName = OTEndoscopydetail.SurgeonName || '';
      this.AnestheticsDr = OTEndoscopydetail.AnestheticsDr || '';

      this.AnestheticsDr1 = OTEndoscopydetail.AnestheticsDr1 || '';
      this.Surgeryname = OTEndoscopydetail.Surgeryname || '';
      this.AnesthType = OTEndoscopydetail.AnesthType || '';
      this. UnBooking = OTEndoscopydetail. UnBooking || '';
      this.IsAddedBy = OTEndoscopydetail.IsAddedBy || '';
      this.AddedBy = OTEndoscopydetail.AddedBy || '';
      this.TranDate = OTEndoscopydetail.TranDate || '';
      this.instruction = OTEndoscopydetail.instruction || '';
      this.Instruction = OTEndoscopydetail.Instruction || '';
    }
  }
}