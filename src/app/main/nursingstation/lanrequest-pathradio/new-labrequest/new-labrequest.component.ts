import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { OPIPPatientModel } from '../../patient-vist/patient-vist.component';
import { AdvanceDetailObj, ChargesList } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { NursingstationService } from '../../nursingstation.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-labrequest',
  templateUrl: './new-labrequest.component.html',
  styleUrls: ['./new-labrequest.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewLabrequestComponent implements OnInit {

  sIsLoading: string = '';
  searchFormGroup: FormGroup;
  PatientsearchForm:FormGroup;
  patsearchFormGroup:FormGroup;
  isRegSearchDisabled: boolean = true;
  
  registerObj = new OPIPPatientModel({});
  click: boolean = false;
  MouseEvent = true;
  SrvcName:any;
  b_price:any;
  filteredOptions:any;
  filteredOptions1: any;
  noOptionFound:any;
  private nextPage$ = new Subject();
  selectedAdvanceObj: AdvanceDetailObj;
  dataSource = new MatTableDataSource<ChargesList>();
  chargeslist: any = [];
  screenFromString = 'OP-billing';
  isLoading:any;
  serviceId: number;
 
IsPathRad:any;
PatientName:any ='';
OPIP:any='';
Bedname:any='';
wardname:any='';
classname:any='';
tariffname:any='';
AgeYear:any='';
ipno:any='';
patienttype:any='';
Adm_Vit_ID:any=0;

CompanyList: any = [];
ServiceList: any = [];

displayedColumns1 = [
  'ServiceName',
  'Price'
];
@Output() showClicked = new EventEmitter();
  displayedColumns = [
    'ServiceName',
    'Price'
    // 'action'
  ];

  dataSource1 = new MatTableDataSource<ServiceListdetail>();
  // isLoading: String = '';

  constructor( private _fuseSidebarService: FuseSidebarService,
    private changeDetectorRefs: ChangeDetectorRef,
    public _NursingStationService: NursingstationService,
    private _ActRoute: Router,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    // public datePipe: DatePipe,
      private accountService: AuthenticationService,
    // private dialogRef: MatDialogRef<NewLabrequestComponent>,
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();
    // this.PatientsearchForm = this.PatientsearchFormGroup();
    // this.patsearchFormGroup = this.createSearchForm();

    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      this.PatientName=this.selectedAdvanceObj.PatientName;
      this.OPIP=this.selectedAdvanceObj.OPD_IPD_ID;
      this.AgeYear=this.selectedAdvanceObj.AgeYear;
      // this.classname=this.selectedAdvanceObj.ClassName;
      this.tariffname=this.selectedAdvanceObj.TariffName;
      // this.ipno=this.selectedAdvanceObj.IPNumber;
      this.Bedname=this.selectedAdvanceObj.BedName;
      this.wardname=this.selectedAdvanceObj.WardName;
    }
      console.log(this.selectedAdvanceObj);
    this.getServiceListCombobox();
    this.getServiceList();
    
  }


  patcreateSearchForm() {
    return this.formBuilder.group({
      // regRadio: ['registration'],
      RegId: [{ value: '', disabled: this.isRegSearchDisabled }, [Validators.required]],
      PatientName:'',
      IPDNo: ''
    });
  }
 
  createSearchForm() {
    return this.formBuilder.group({
      ServiceId:'',
      ServiceName:'',
      SrvcName: [''],
      // price: [''],
      Ispathrad:[],

    });
  }

  getSearchList() {
    var m_data = {
      "F_Name": `${this._NursingStationService.myFilterform.get('RegId').value}%`,
      "L_Name": '%',
      "Reg_No": '0',
      "From_Dt" : '01/01/1900', 
      "To_Dt" :  '01/01/1900',  
      "AdmDisFlag":0,
      "OP_IP_Type":1,
      "IPNumber":1
    }
    // if (this.searchFormGroup.get('RegId').value.length >= 1) {
      this._NursingStationService.getOPIPPatient(m_data).subscribe(resData => {
        // debugger;
     
        this.filteredOptions1 = resData;
        console.log(resData);
        if (this.filteredOptions1.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }

      });
    // }

  }

  onShow(){
    this.showClicked.emit(this._NursingStationService.myFilterform);
 
  }

  
  PatientsearchFormGroup(): FormGroup {
    return this._formBuilder.group({
      RegNo: '',
      IPDNo: '',
      FirstName:'' ,
      MiddleName: '',
      LastName: '',
      MobileNo: '',
      DoctorId: '0',
      DoctorName: '',
      WardId: '0',
      RoomName: '',
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
    });
  }

  getServiceList(){

    if(this.searchFormGroup.get('Ispathrad').value==1){
      this.IsPathRad=1;
    }else if(this.searchFormGroup.get('Ispathrad').value==2)
    {
      this.IsPathRad=2;
    }else{
      this.IsPathRad=3;
      
    }
    var m_data = {
      ServiceName:"%",//`${this.searchFormGroup.get('SrvcName').value}%`,
      IsPathRad: this.IsPathRad || 1,
      TraiffID:this.registerObj.TariffId || 1,
      ClassID:this.registerObj.ClassId || 1
      };
    console.log(m_data);
    this._NursingStationService.getServicelistpathradio(m_data).subscribe(data => {
      this.dataSource1.data = data as ServiceListdetail[];
      console.log(data);
  });
}

  getServiceListCombobox() {
debugger;
  
    let tempObj;
    var m_data = {
      ServiceName:`${this.searchFormGroup.get('SrvcName').value}%` || '%',
      IsPathRad: this.IsPathRad || 1,
      TraiffID:this.registerObj.TariffId || 1,
      ClassID:this.registerObj.ClassId || 1
     
      };
    console.log(m_data);
    this._NursingStationService.getServicelistpathradio(m_data).subscribe(data => {
      this.ServiceList = data;
      console.log(data);
      this.filteredOptions = data;
      console.log( this.filteredOptions);
      if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
    
    // });
  // }
  }
  delservice(){}

  getOptionText1(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegId + ')';
  }

  getOptionText(option) {
  // debugger;
    if (!option)
     return '';
    return option.ServiceName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';
   
  }

  searchPatientList() {
    // const dialogRef = this._matDialog.open(IPPatientsearchComponent,
    //   {
    //     maxWidth: "90%",
    //     height: "530px !important ", width: '100%',
    //   });

    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log('The dialog was closed - Insert Action', result);
    //   if (result) {
    //     this.registerObj = result as OPIPPatientModel;
    //     if(result){
    //       this.PatientName=this.registerObj.PatientName;
    //       this.OPIP=this.registerObj.IP_OP_Number;
    //       this.AgeYear=this.registerObj.AgeYear;
    //       this.classname=this.registerObj.ClassName;
    //       this.tariffname=this.registerObj.TariffName;
    //       this.ipno=this.registerObj.IPNumber;
    //       this.Bedname=this.registerObj.Bedname;
    //       this.wardname=this.registerObj.WardId;
    //       this.Adm_Vit_ID=this.registerObj.Adm_Vit_ID;
    //      }
    //   }
    //   // console.log(this.registerObj);
    // });
  }

  NewTestRequest() {
    debugger;
    // const dialogRef = this._matDialog.open(IPPatientsearchComponent,
    //   {
    //     maxWidth: "100%",
    //       height: '560px',
    //       width: '100%',
    //   });
    // dialogRef.afterClosed().subscribe(result => {
    //  console.log(result);
    
    // });
  }



  getSelectedObj(obj) {
  // debugger;
  console.log(obj);
  //  console.log('obj==', obj);
   this.SrvcName= obj.ServiceName;
   this.b_price= obj.Price;
   this.serviceId= obj.ServiceId;
  }

  getSelectedObj1(obj) {
    debugger;
    console.log(obj);
    
     this.PatientName= obj.PatientName;
      console.log(this.PatientName);
    
    }

  onSaveEntry(row) {
    debugger;
   
    this.isLoading = 'save';
    this.dataSource.data = [];

    
    this.chargeslist.push(
      {
       
        ServiceId: row.ServiceId,
        ServiceName: row.ServiceName,
        Price: row.Price|| 0
      
      });

    this.isLoading = '';
     console.log(this.chargeslist);
    this.dataSource.data = this.chargeslist;
    console.log(this.dataSource.data);
    this.changeDetectorRefs.detectChanges();
    // }
    
  }

  onSave() {
    debugger;
  
    if(this.dataSource.data){
    this.isLoading = 'submit';
   

      let insertTHLabRequestobj = {};
      insertTHLabRequestobj['ReqDate'] = this.dateTimeObj.date;
      insertTHLabRequestobj['ReqTime'] = this.dateTimeObj.date;
      insertTHLabRequestobj['OP_IP_ID'] = this.Adm_Vit_ID;
      insertTHLabRequestobj['OP_IP_Type'] = 1;//this.selectedAdvanceObj || 0;
      insertTHLabRequestobj['IsAddedBy'] = this.accountService.currentUserValue.user.id || 0;
      insertTHLabRequestobj['IsCancelled'] = this.accountService.currentUserValue.user.id || 0;
      insertTHLabRequestobj['IsCancelledBy'] =this.accountService.currentUserValue.user.id || 0;
      insertTHLabRequestobj['IsCancelledDate'] = this.dateTimeObj.date;
      insertTHLabRequestobj['IsCancelledTime'] = this.dateTimeObj.date;
      insertTHLabRequestobj['RequestId'] = 0//element.PIsNumeric || 0;
    
    
    let insertTDLabRequestarray = [];
    this.dataSource.data.forEach((element) => {
    let insertTDLabRequestobj = {};
    insertTDLabRequestobj['RequestId'] = 0,
    insertTDLabRequestobj['ServiceId'] = element.ServiceId,
    insertTDLabRequestobj['Price'] =  element.Price,
    insertTDLabRequestobj['IsStatus'] = 0;
  
    insertTDLabRequestarray.push(insertTDLabRequestobj);

    });

    // const pathologyDelete = new PthologyresulDelt(insertTHLabRequestobj);
    // const pathologyUpdateObj = new PthologyresulUp(insertTDLabRequestobj);

   
    // this.dialogRef.afterClosed().subscribe(result => {
    console.log('==============================  PathologyResult ===========');
    let submitData = {
      "ipPathOrRadiRequestInsert": insertTHLabRequestobj,
      "ipPathOrRadiRequestLabRequestInsert": insertTDLabRequestarray
     
    };
    console.log(submitData);
    this._NursingStationService.PathResultentryInsert(submitData).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'Ip PathRadioRequest data saved Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'PAthRadioRequest  data not saved', 'error');
      }
      this.isLoading = '';
    });
  }
    // });
  }

  
  
  

  getOPIPPatientList()
  {
  debugger;
   this.sIsLoading = 'loading-data';
  
   var m_data={
     "F_Name": (this._NursingStationService.myFilterform.get("FirstName").value) + '%' || '%',
     "L_Name": (this._NursingStationService.myFilterform.get("LastName").value) + '%'  || '%',
     "Reg_No":this._NursingStationService.myFilterform.get("RegNo").value || 0,
    //  "From_Dt" : this._NursingStationService.myFilterform.get("start").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900', 
    //  "To_Dt" : this._NursingStationService.myFilterform.get("end").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',  
     "AdmDisFlag":0,
     "OP_IP_Type": this._NursingStationService.myFilterform.get("PatientType").value || 1,
     "IPNumber": this._NursingStationService.myFilterform.get("IPDNo").value || 0,
      }
     console.log(m_data);
     setTimeout(() => {
       this.sIsLoading = 'loading-data';
       this._NursingStationService.getOPIPPatient(m_data).subscribe(Visit=> {


        //  console.log(this.dataSource.data);
        //  this.dataSource.data = Visit as OPIPPatientModel[];
        //  this.dataSource.sort =this.sort;
        //  this.dataSource.paginator=this.paginator;
       
         this.sIsLoading = ' ';
       
         
       },
         error => {
           this.sIsLoading = '';
         });
     }, 50);
   }
 

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
       this.dateTimeObj = dateTimeObj;
  }
  onClose() {
    // this.dialogRef.close();
  }
  onScroll() {
    //Note: This is called multiple times after the scroll has reached the 80% threshold position.
    this.nextPage$.next();
  }
}



export class ServiceListdetail {
   ServiceName: String;
   Price:any;
 

  constructor(ServiceListdetail) {
    this.ServiceName = ServiceListdetail.ServiceName || '';
    this.Price = ServiceListdetail.Price || '';
  
  }}

