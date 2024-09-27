import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

import { Observable } from 'rxjs';

import { IPReportService } from './ipreport.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { L } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-ip-report',
  templateUrl: './ip-report.component.html',
  styleUrls: ['./ip-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IpReportComponent implements OnInit {

 
  UserList: any = [];
  DoctorList: any = [];
  sIsLoading: string = '';
  currentDate = new Date();
  Reportsection='IP Reports';

    ReportID: any;
 
  filteredOptionsUser: Observable<string[]>;
  filteredOptionsDoctorMode: Observable<string[]>;
  isUserSelected: boolean = false;
  isSearchdoctorSelected: boolean = false;

  FlagUserSelected: boolean = false;
  FlagDoctorSelected: boolean = false;
  FlagAdmissionIdSelected: boolean = false;
  FlagAdvanceIdSelected: boolean = false;
  FlagRequestIdSelected: boolean = false;
  FlagWardSelected : boolean = false;
  FlagCompanySelected : boolean = false;
  FlagPaymentIdSelected: boolean = false;
  FlagMaterialConsumptionIdSelected: boolean = false;
  FlagWardIdSelected: boolean = false;
  FlagCompanyIdSelected: boolean = false;
  FlagDischargetypeIdSelected: boolean = false;
  FlagGroupSelected: boolean = false;
  FlaOPIPTypeSelected: boolean = false;

  isWardSelected: boolean = false;
  isCompanyselected: boolean = false;
  filteredOptionsWard: Observable<string[]>;
  filteredOptionsCompany: Observable<string[]>;
  optionsUser: any[] = [];
  optionsPaymentMode: any[] = [];
  PaymentMode: any;
  filteredOptionsDisctype: Observable<string[]>;
  DischargeTypeList: any = [];
  ReportName: any;
  isDistypeSelected: boolean = false;
  SpinLoading: boolean = false;
  AdList: boolean = false;
  FromDate: any;
  Todate: any;
  UserId: any = 0;
  UserName: any;
  IsLoading: boolean = false;
  searchDoctorList: any = [];
  optionsSearchDoc: any[] = [];
  WardList:any=[];
  optionsWard: any[] = [];
  optionsCompany: any[] = [];
  CompanyList: any =[];
  vDescType=0;

  displayedColumns = [
    'ReportName'
  ];

  dataSource = new MatTableDataSource<ReportDetail>();
  constructor(
    // this.dataSource.data = TREE_DATA;
    public _IPReportService: IPReportService,
    
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    public datePipe: DatePipe,
        private _loggedUser: AuthenticationService,
    private formBuilder: FormBuilder
  ) {
    this.UserId = this._loggedUser.currentUserValue.user.id;
    this.UserName = this._loggedUser.currentUserValue.user.userName;
    console.log(this.UserId)
  }


  ngOnInit(): void {

        
    if (this._ActRoute.url == "/reports/ipreport") 
      this.Reportsection='IP Reports'
    if (this._ActRoute.url == "/reports/ipmisreports") 
    this.Reportsection='IPD MIS REPORT'
    if (this._ActRoute.url == "/reports/ipbillingreport") 
      this.Reportsection='IPBilling Reports'
     if (this._ActRoute.url =="/reports/doctorshare") 
      this.Reportsection='DoctorShare Report'


    this.bindReportData();
  
    this.getDischargetypelist();
    this.GetUserList();
    this.getWardList();
    this.getCompanyList();
    this.getDoctorList();

    const toSelect = this.UserList.find(c => c.UserId == this.UserId);
    this._IPReportService.userForm.get('UserId').setValue(toSelect);

  }

  bindReportData() {
    // let qry = "SELECT * FROM ReportConfigMaster WHERE IsActive=1 AND IsDeleted=0 AND ReportType=1";
var data={
  ReportSection:this.Reportsection//"IP Reports"
}
    this._IPReportService.getDataByQuery(data).subscribe(data => {
      this.dataSource.data = data as any[];

    });
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  ReportSelection(el) {
    this._IPReportService.userForm.get('DoctorId').reset;
    this._IPReportService.userForm.get('CompanyId').reset;
    this._IPReportService.userForm.get('RoomId').reset;


    this.ReportName = el.ReportName;
    this.ReportID = el.ReportId;
    if (this.ReportName == 'Admitted Patient List') {
            this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagDischargetypeIdSelected=false;
    } else if (this.ReportName == 'IP Patient CasePaper') {
      
      this.FlagAdmissionIdSelected=true
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagDischargetypeIdSelected=false;

    } else if (this.ReportName == 'IPD Admission List Company Wise Details') {
      
      this.FlagAdmissionIdSelected=true
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagDischargetypeIdSelected=false;

    }
    else if (this.ReportName == 'IPD Admission List Company Wise Summary') {
      
      this.FlagAdmissionIdSelected=true
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagDischargetypeIdSelected=false;

    }
    else if (this.ReportName == 'IPD Current Admitted List') {
      debugger
      this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = true;
      this.FlagWardSelected = true;
      this.FlagCompanySelected = true;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagDischargetypeIdSelected=false;

    }
    else if (this.ReportName == 'IPD Current Admitted - Ward Wise Charges') {
      
      this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = true;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagWardSelected = true;
      this.FlagCompanySelected = true;

    } 
    else if (this.ReportName == 'Department Wise Count Summary') {
      
      this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;


    } 
    else if (this.ReportName == 'Doctor Wise Count Summary') {
      
      this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagDischargetypeIdSelected=false;

    } 
   
    else if (this.ReportName == 'IPD Current Ref Admitted List') {
      
      this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagDischargetypeIdSelected=false;

    } 
    else if (this.ReportName == 'IPD Discharge Type Wise') {
      
      this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = true;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagDischargetypeIdSelected=true;
      this.FlagWardIdSelected=false;
    } 
    else if (this.ReportName == 'IPD Discharge Type Company Wise') {
      
      this.FlagAdmissionIdSelected=false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = true;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagDischargetypeIdSelected=true;

    }
    else if (this.ReportName == 'IPD Discharge Type Company Wise Count') {
      
      this.FlagAdmissionIdSelected=false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = true;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagDischargetypeIdSelected=true;
      this.FlagWardIdSelected=false;
    }  else if (this.ReportName == 'IPD RefDoctor Wise') {
      
      this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagDischargetypeIdSelected=false;

    }
    else if (this.ReportName == 'IPD Discharge Detail') {
      
      this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagDischargetypeIdSelected=true;

    }
    else if (this.ReportName == 'IPD Discharge Report with Mark Status') {
      
      this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagDischargetypeIdSelected=false;

    }
    else if (this.ReportName == 'IPD Discharge Report with Bill Summary') {
      
      this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagDischargetypeIdSelected=false;

    }
    else if (this.ReportName == 'OP to IP Converted List With Service availed') {
      
      this.FlagAdmissionIdSelected=false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagDischargetypeIdSelected=false;

    }

   else if (this.ReportName == 'IP Advance Receipt') {
      
      this.FlagAdmissionIdSelected=false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      
      this.FlagAdvanceIdSelected = true;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagDischargetypeIdSelected=false;
    }
     else if (this.ReportName == 'IP Lab Request Report') {
      
      this.FlagRequestIdSelected=true
      this.FlagAdmissionIdSelected=false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      
      this.FlagAdvanceIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagDischargetypeIdSelected=false;
    } 
    else if (this.ReportName == 'IP Settlement Receipt') {
      
      this.FlagPaymentIdSelected=true;
      this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagDischargetypeIdSelected=false;
    } else if (this.ReportName == 'Material Consumption Report') {
      
      this.FlagPaymentIdSelected=false;
      this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=true;
      this.FlagDischargetypeIdSelected=false;
    } 



    //IPMIS
  if (this.ReportName == 'Date wise Admission Count') {
      this.FlagDoctorSelected = false;
      this.FlagUserSelected = false;

    } else if (this.ReportName == 'Month Wise Admission Count') {
      this.FlagDoctorSelected = false;
      this.FlagUserSelected = false;
    } else if (this.ReportName == 'Date wise Dr wise Admission Count Detail') {
      this.FlagDoctorSelected = false;
      this.FlagUserSelected = false;

    } else if (this.ReportName == 'Date wise Dr wise Admission Count Summary') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Date wise Department Wise Admission Count Detail') {
      this.FlagDoctorSelected = false;
      this.FlagUserSelected = false;

    }
   else if (this.ReportName == 'Date wise Department Wise Admission Count Summary') {
    this.FlagDoctorSelected = false;
    this.FlagUserSelected = false;
  } else if (this.ReportName == 'Doctor wise collection Detail') {
    this.FlagDoctorSelected = false;
    this.FlagUserSelected = false;

  } else if (this.ReportName == 'Doctor wise collection Summary') {
    this.FlagUserSelected = false;
    this.FlagDoctorSelected = false;

  }
  else if (this.ReportName == 'Department wise collection Detail') {
    this.FlagDoctorSelected = false;
    this.FlagUserSelected = false;

  }
  else if (this.ReportName == 'Department wise collection Summary') {
    this.FlagDoctorSelected = false;
    this.FlagUserSelected = false;
  } else if (this.ReportName == 'Company wise admission count Detail') {
    this.FlagDoctorSelected = false;
    this.FlagUserSelected = false;

  } else if (this.ReportName == 'Company wise admission Summary') {
    this.FlagUserSelected = false;
    this.FlagDoctorSelected = false;

  }
  else if (this.ReportName == 'Company wise Bill detail Report') {
    this.FlagDoctorSelected = false;
    this.FlagUserSelected = false;

  } else if (this.ReportName == 'Company Wise Bill summary report') {
    this.FlagDoctorSelected = false;
    this.FlagUserSelected = false;

  } else if (this.ReportName == 'Company wise Credit Report Detail') {
    this.FlagUserSelected = false;
    this.FlagDoctorSelected = false;

  }
  else if (this.ReportName == 'Company wise Credit Report Summary') {
    this.FlagDoctorSelected = false;
    this.FlagUserSelected = false;
   
  } 
  debugger
  // Doctor share?
    if (this.ReportName == 'DoctorShareReport') {
    this.FlagDoctorSelected = true;
    this.FlagUserSelected = false;
    this.FlagGroupSelected=true;
    this.FlaOPIPTypeSelected=true;
  } else if (this.ReportName == 'DoctorWiseSummaryReport') {
    this.FlagDoctorSelected = true;
    this.FlagUserSelected = false;
    this.FlagGroupSelected=false;
    this.FlaOPIPTypeSelected=false;
  } else if (this.ReportName == 'Consultant Doctor ShareDetails') {
    this.FlagUserSelected = false;
    this.FlagDoctorSelected = true;
    this.FlagGroupSelected=true;
    this.FlaOPIPTypeSelected=true;
  }
  else if (this.ReportName == 'DoctorShare List WithCharges	') {
    this.FlagDoctorSelected = true;
    this.FlagUserSelected = false;
    this.FlagGroupSelected=true;
    this.FlaOPIPTypeSelected=true;
  }


  //IpBilling

  if (this.ReportName == 'Advance Report') {
    this.FlagUserSelected = false;
   

  } else if (this.ReportName == 'IP Bill Report') {
    this.FlagUserSelected = false;
   
  }else if (this.ReportName == 'OP IP Bill Summary') {
    this.FlagUserSelected = false;
   
  }  else if (this.ReportName == 'Bill Summary Report') {
    this.FlagUserSelected = true;
   } 
  if (this.ReportName == 'Credit Report') {
    this.FlagUserSelected = false;
     } else if (this.ReportName == 'Refund of Advance Report') {
    this.FlagUserSelected = false;
   
  } else if (this.ReportName == 'Refund of Bill Report') {
    this.FlagUserSelected = false;
   
  } 
  else if (this.ReportName == 'IP Daily Collection Report') {
    this.FlagUserSelected = true;
   
  } else if (this.ReportName == 'IP Discharge & Bill Generation Pending Report') {
    this.FlagUserSelected = false;
   
  } else if (this.ReportName == 'IP Bill Generation Payment Due report') {
    this.FlagUserSelected = false;
   
  } 

  

  }


  getWardList() {
    this._IPReportService.getWardCombo().subscribe(data => {
      this.WardList = data;
      this.optionsWard = this.WardList.slice();
      this.filteredOptionsWard = this._IPReportService.userForm.get('RoomId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterWard(value) : this.WardList.slice()),
      );

    });
  }
  private _filterWard(value: any): string[] {
    if (value) {
      const filterValue = value && value.RoomName ? value.RoomName.toLowerCase() : value.toLowerCase();
      return this.optionsWard.filter(option => option.RoomName.toLowerCase().includes(filterValue));
    }

  }

  getOptionTextCompany(option) {
    return option && option.CompanyName ? option.CompanyName : '';
  }
  getOptionTextWard(option) {
    return option && option.RoomName ? option.RoomName : '';
  }


  getOptionTextUser(option) {
    return option && option.UserName ? option.UserName : '';
  }


  getCompanyList() {
    this._IPReportService.getCompanyCombo().subscribe(data => {
      this.CompanyList = data;
      this.optionsCompany = this.CompanyList.slice();
      this.filteredOptionsCompany =this._IPReportService.userForm.get('CompanyId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCompany(value) : this.CompanyList.slice()),
      );

    });
  }


  private _filterCompany(value: any): string[] {
    if (value) {
      const filterValue = value && value.CompanyName ? value.CompanyName.toLowerCase() : value.toLowerCase();
      return this.optionsCompany.filter(option => option.CompanyName.toLowerCase().includes(filterValue));
    }

  }


  getOptionTextPaymentMode(option) {
    this.PaymentMode = option.PaymentMode;
    return option && option.PaymentMode ? option.PaymentMode : '';
  }


  private _filterUser(value: any): string[] {
    if (value) {
      const filterValue = value && value.UserName ? value.UserName.toLowerCase() : value.toLowerCase();
      return this.optionsUser.filter(option => option.UserName.toLowerCase().includes(filterValue));
    }
  }

  GetUserList() {
    var data = {
      "StoreId": this._loggedUser.currentUserValue.user.storeId
    }
    this._IPReportService.getUserdetailList(data).subscribe(data => {
      this.UserList = data;
      this.optionsUser = this.UserList.slice();
      // console.log(this.UserList);
      this.filteredOptionsUser = this._IPReportService.userForm.get('UserId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterUser(value) : this.UserList.slice()),
      );

    });
    const toSelect = this.UserList.find(c => c.UserId == this.UserId);
    this._IPReportService.userForm.get('UserId').setValue(toSelect);

  }

  getOptionTextsearchDoctor(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }

  getDoctorList() {
    this._IPReportService.getDoctorList().subscribe(data => {
      this.DoctorList = data;
       this.optionsSearchDoc = this.DoctorList.slice();
      this.filteredOptionsDoctorMode = this._IPReportService.userForm.get('DoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filtersearchdoc(value) : this.DoctorList.slice()),
      );
    });
  }

  private _filtersearchdoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.DoctorList.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }
  }

 
 
  getPrint() {

    
   if (this.ReportName == 'Admitted Patient List') {
      this.getAdmittedPatientListview();
    } else if (this.ReportName == 'IP Patient CasePaper') {
      this.getAdmittedPatientCasepaperview();
      
    } 
    else if (this.ReportName == 'IP Advance Receipt') {
      this.viewgetIPAdvanceReportPdf();
      
    } 
     else if (this.ReportName == 'IPD Admission List Company Wise Details') {
      this.getAdmissionlistcompanywiseview();
      
    } else if (this.ReportName == 'IPD Admission List Company Wise Summary') {
      this.viewgetAdmlistcompanywisesummaryReportPdf();
      
    }
     else if (this.ReportName == 'IPD Current Admitted List') {
      this.viewgetCurrentadmittedReportPdf();
    } 
    else if (this.ReportName == 'IPD Current Admitted - Ward Wise Charges') {
      this.getCurrentadmitwardwisechargsview();
    } else if (this.ReportName == 'Department Wise Count Summary') {
      this.getDeptwisecountsummarypdf();
      
    } 
    else if (this.ReportName == 'Doctor Wise Count Summary') {
      this.viewgetDoctorwisecountsummaryReportPdf();
    }
    else if (this.ReportName == 'IPD Current Ref Admitted List') {
      this.viewgetCurrRefdocAdmitlistReportPdf();
    }
    else if (this.ReportName == 'IPD Discharge Type Wise') {
      this.viewgetDischargeTypewiseReportPdf();
    }
    else if (this.ReportName == 'IPD Discharge Type Company Wise') {
      this.viewgetDischargetypecompanywisePdf();
    }
    else if (this.ReportName == 'IPD Discharge Type Company Wise Count') {
      this.viewgetDisctypecompanywisecountPdf();
    }
    else if (this.ReportName == 'IPD RefDoctor Wise') {
      this.viewgetRefDoctorwiseReportPdf();
    }
    else if (this.ReportName == 'IPD Discharge Detail') {
      this.viewgetDischargedetailReportPdf();
    }
    else if (this.ReportName == 'IPD Discharge Report with Mark Status') {
      this.viewgetDischareRptwithmarkstatusPdf();
    }
    else if (this.ReportName == 'IPD Discharge Report with Bill Summary') {
      this.viewgetDischargerptwithbillsummaryPdf();
    }
    else if (this.ReportName == 'OP to IP Converted List With Service availed') {
      this.viewgetOPTOIPConwithserviceavaliedPdf();
    }
     else if (this.ReportName == 'IP Lab Request Report') {
      this.viewgetLabrequestReportPdf();
    }
    else if (this.ReportName == 'IP Settlement Receipt') {
      this.getIpPaymentReceiptview();
    } else if (this.ReportName == 'Material Consumption Report') {
      this.viewgetMaterialConsumptionPdf();
    }
    else if (this.ReportName == ' IPD Discharge Type Wise') {
      this.viewgetDischaregTypewisePdf();
    }
    debugger

    //IPMIS
    if (this.ReportName == 'Date wise Admission Count') {
      this.viewDatewiseAdmissioncountPdf();
    }
    else if (this.ReportName == 'Month Wise Admission Count') {
      this.viewmonthwiseAdmissioncountPdf();
    } else if (this.ReportName == 'Date wise Dr wise Admission Count Detail') {
      this.viewDatewisedrwiseAdmissioncountPdf();
    }
    else if (this.ReportName == 'Date wise Dr wise Admission Count Summary') {
      this.viewDatewisedrwiseAdmissioncountsummaryPdf();
    } else if (this.ReportName == 'Date wise Department Wise Admission Count Detail') {
      this.viewDatewisedeptwiseadmissioncountPdf();
    }
    else if (this.ReportName == 'Date wise Department Wise Admission Count Summary') {
      this.viewDatewisedeptwiseadmissioncountsummaryPdf();
    }
    else if (this.ReportName == 'Doctor wise collection Detail') {
      this.getDoctorwisecolldetailview();
    } else if (this.ReportName == 'Doctor wise collection Summary') {
      this.getDoctorwisecollsummaryview();
    }
    else if (this.ReportName == 'Department wise collection Detail') {
      this.viewDeptwisecolldetailPdf();
    }
    else if (this.ReportName == 'Department wise collection Summary') {
      this.viewDeptwisecollSummaryPdf();
    } else if (this.ReportName == 'Company wise admission count Detail') {
      this.viewCompanywiseAdmissioncountPdf();
    }
    else if (this.ReportName == 'Company wise admission Summary') {
      this.viewCompanywiseAdmissioncountsummaryPdf();
    } else if (this.ReportName == 'Company wise Bill detail Report') {
      this.viewCompanywisebilldetailPdf();
    }
    else if (this.ReportName == 'Company Wise Bill summary report') {
      this.viewCompanywisebillsummaryPdf();
    } else if (this.ReportName == 'Company wise Credit Report Detail') {
      this.viewCompanywisecreditPdf();
    }
    else if (this.ReportName == 'Company wise Credit Report Summary') {
      this.viewCompanywisecreditsummaryPdf();
    }


    //IPBilling

    if (this.ReportName == 'Advance Report') {
      this.viewgetAdvanceReportPdf();
    } 
    else if (this.ReportName == 'IP Bill Report') {
      this.viewgetBillReportPdf();
    } else if (this.ReportName == 'Bill Summary Report') {
      this.viewgetBillSummaryReportPdf();
    }
    else if (this.ReportName == 'OP IP Bill Summary') {
      this.viewgetBillSummaryReportPdf();
    }
    
    else if (this.ReportName == 'Credit Report') {
      this.viewgetCreditReportPdf();
    }
    else if (this.ReportName == 'Refund of Advance Report') {
      this.viewgetRefundofadvanceReportPdf();
    }
    else if (this.ReportName == 'Refund of Bill Report') {
      this.viewgetRefundofbillReportPdf();
    }
   if (this.ReportName == 'IP Daily Collection Report') {
      this.viewIPDailyCollectionPdf();
    } else if (this.ReportName == 'IP Discharge & Bill Generation Pending report') {
      this.viewgetDiscbillgeneratingpendingReportPdf();
    } else if (this.ReportName == 'IP Bill Generation Payment Due Report') {
      this.viewgetBillgenepaymentdueReportPdf();
    }
    else if (this.ReportName == 'IP Discharge & Bill Generation Pending Report') {
      this.viewgetIpdischargebillgenependingPdf();
    }else if (this.ReportName == 'IP Bill Generation Payment Due report') {
      this.ViewgetIpbillgenepaymentdueview();
    }else
  if (this.ReportName == 'DoctorShareReport') {
      this.viewgetDoctorShareReportPdf();
    } 
    else if (this.ReportName == 'Consultant Doctor ShareDetails') {
      this.viewgetConsultantDoctorShareDetailsPdf();
    } else if (this.ReportName == 'DoctorWiseSummaryReport') {
      this.viewgetDoctorWiseSummaryReportReportPdf();
    }
    else if (this.ReportName == 'DoctorShare List WithCharges	') {
      this.viewgetDoctorSharewithchargesReportPdf();
    }
  }



  getAdmittedPatientListview() {
    let DoctorId=0
    if (this._IPReportService.userForm.get('DoctorId').value)
      DoctorId=this._IPReportService.userForm.get('DoctorId').value.DoctorId || 0;
    let WardId=0
    if (this._IPReportService.userForm.get('RoomId').value)
      WardId=this._IPReportService.userForm.get('RoomId').value.RoomId || 0;
 
    
    setTimeout(() => {
      
     this.AdList=true;
    this._IPReportService.getAdmittedPatientListView(
     
      this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
      this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",DoctorId
    ,WardId
      ).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Admission List  Viewer"
          }
        });

        matDialog.afterClosed().subscribe(result => {
          this.AdList=false;
          this.sIsLoading = ' ';
        });
    });
   
    },100);

  }

  
  getAdmittedPatientCasepaperview() {
    let AdmissionID
   if (this._IPReportService.userForm.get('AdmissionID').value)
     AdmissionID=this._IPReportService.userForm.get('AdmissionID').value || 0;

        
    setTimeout(() => {
      this.SpinLoading =true;
     this.AdList=true;
    this._IPReportService.getAdmittedPatientCasepaaperView(
      AdmissionID
      ).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Admission Paper  Viewer"
          }
        });

        matDialog.afterClosed().subscribe(result => {
          this.AdList=false;
          this.sIsLoading = ' ';
        });
    });
   
    },100);

  }

  
viewgetIPAdvanceReportPdf() {
  let AdvanceDetailID
  if (this._IPReportService.userForm.get('AdvanceDetailID').value )
    AdvanceDetailID=this._IPReportService.userForm.get('AdvanceDetailID').value || 0;


    setTimeout(() => {
      this.SpinLoading =true;
     this.AdList=true;
     
    this._IPReportService.getViewAdvanceReceipt(
   AdvanceDetailID
    ).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Ip advance Viewer"
          }
        });
        matDialog.afterClosed().subscribe(result => {
          this.AdList=false;
          this.SpinLoading = false;
        });
    });
   
    },100)
  }
 
  
  viewgetLabrequestReportPdf() {
    debugger
    let RequestId
    if (this._IPReportService.userForm.get('RequestId').value)
      RequestId=this._IPReportService.userForm.get('RequestId').value || 0;

    
    setTimeout(() => {
      this.SpinLoading =true;
    //  this.AdList=true;
    this._IPReportService.getLabrequestview(
      RequestId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Lab Request Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
    });
   
    },100);
  }

  getIpPaymentReceiptview() {
    let PaymentId
    if (this._IPReportService.userForm.get('PaymentId').value)
      PaymentId=this._IPReportService.userForm.get('PaymentId').value || 0;


    setTimeout(() => {
      this.SpinLoading =true;
    //  this.AdList=true;
    this._IPReportService.getIpPaymentReceiptView(
    PaymentId
      ).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "IP Payment Receipt Viewer"
          }
        });
  
        matDialog.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
    });
   
    },100);
  
   
  }

  getMaterialConsumptionpdf() {
    let MaterialConsumptionId=this._IPReportService.userForm.get('MaterialConsumptionId').value || 0;
    setTimeout(() => {
      this.SpinLoading =true;
    //  this.AdList=true;
    this._IPReportService.getMaterialconsumptionView(
      MaterialConsumptionId
      ).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Material Consumption Viewer"
          }
        });
  
        matDialog.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
    });
   
    },100);
  
   
  }



  viewgetCurrentadmittedReportPdf(){
    debugger

    let DoctorId = 0;
    if (this._IPReportService.userForm.get('DoctorId').value)
      DoctorId = this._IPReportService.userForm.get('UserId').value.DoctorId
    let RoomId = 0;
    if (this._IPReportService.userForm.get('RoomId').value)
      RoomId =  this._IPReportService.userForm.get('RoomId').value.RoomId
    let CompanyId = 0;
    if (this._IPReportService.userForm.get('CompanyId').value)
      CompanyId = this._IPReportService.userForm.get('CompanyId').value.CompanyId


    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getCurrentAdmittedPatientListView(
      this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
      this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
      DoctorId,RoomId,CompanyId
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Admission List  Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }

  
  getAdmissionlistcompanywiseview(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getAdmittedPatientListCompanywiseView(
      this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
     
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Admission List Company Wise Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetAdmlistcompanywisesummaryReportPdf(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getAdmittedPatientListCompanywisesummaryView(
      
       this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
     
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Admission List Company Wise Summary  Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  getCurrentadmitwardwisechargsview(){
    let DoctorId = 0;
    if (this._IPReportService.userForm.get('DoctorId').value)
      DoctorId = this._IPReportService.userForm.get('UserId').value.DoctorId
    let RoomId = 0;
    if (this._IPReportService.userForm.get('RoomId').value)
      RoomId =  this._IPReportService.userForm.get('RoomId').value.RoomId
    let CompanyId = 0;
    if (this._IPReportService.userForm.get('CompanyId').value)
      CompanyId = this._IPReportService.userForm.get('CompanyId').value.CompanyId

    setTimeout(() => {
   
      this.AdList=true;
     this._IPReportService.getCurrAdmitwardwisechargesView( 
      this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
      this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
      DoctorId,RoomId,CompanyId
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Admission List Ward Wise Charges Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  getDeptwisecountsummarypdf(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getDeptwisecountsummaryView(
      
       this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Department Wise  Count Summary  Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetDoctorwisecountsummaryReportPdf(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getDoctwisecountsummaryView(
      
       this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
      
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Doctor Wise  Count Summary  Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetCurrRefdocAdmitlistReportPdf(){
    let DoctorId=0
    if (this._IPReportService.userForm.get('DoctorId').value)
      DoctorId=this._IPReportService.userForm.get('DoctorId').value.DoctorId || 0;
    debugger

    this.SpinLoading =true;
    setTimeout(() => {
    
      this.AdList=true;
     this._IPReportService.getCurrRefDoctAdmitlistView(
      DoctorId
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Current RefDoctor Wise Admitted List Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetDischargeTypewiseReportPdf(){
    this.SpinLoading =true;
    
    let DoctorId=0
    if (this._IPReportService.userForm.get('DoctorId').value)
      DoctorId=this._IPReportService.userForm.get('DoctorId').value.DoctorId || 0;

    let DischargeTypeId=0
    if (this._IPReportService.userForm.get('DischargeTypeId').value)
      DischargeTypeId=this._IPReportService.userForm.get('DischargeTypeId').value.DischargeTypeId || 0;

    setTimeout(() => {
      
      this.AdList=true;
     this._IPReportService.getDischargetypewiseView(DoctorId,
      this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       DischargeTypeId
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Discharge Type Wise List Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetDisctypecompanywisecountPdf(){
     
    let DoctorId=0
    if (this._IPReportService.userForm.get('DoctorId').value)
      DoctorId=this._IPReportService.userForm.get('DoctorId').value.DoctorId || 0;

    let DischargeTypeId=0
    if (this._IPReportService.userForm.get('DischargeTypeId').value)
      DischargeTypeId=this._IPReportService.userForm.get('DischargeTypeId').value.DischargeTypeId || 0;


    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getDischargetypewisecompanycountView(
       this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       DoctorId,DischargeTypeId
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Discharge Type Wise Company Count List Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetRefDoctorwiseReportPdf(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getRefdocwiseView(
      
       this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Ref Doctor Wise List Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetDischargedetailReportPdf(){
   
    let DischargeTypeId =0;
    if (this._IPReportService.userForm.get('DischargeTypeId').value)
      DischargeTypeId=this._IPReportService.userForm.get('DischargeTypeId').value || 0;

    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getDischargedetailView(
       this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       DischargeTypeId,
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Discharge Detail Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetDischareRptwithmarkstatusPdf(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getDischargedetailwithmarkView(
      
       this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Discharge Detail With Mark Status Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetDischargerptwithbillsummaryPdf(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getDischargedetailwithbillsummaryView(
      
       this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Discharge Detail With Bill Summary Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetOPTOIPConwithserviceavaliedPdf(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getOptoIPconwithserviceavailedView(
      
       this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "OP To IP Converted List with Service Avalied Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetDischargetypecompanywisePdf(){
   debugger
    let DoctorId=0
    if (this._IPReportService.userForm.get('DoctorId').value)
      DoctorId=this._IPReportService.userForm.get('DoctorId').value.DoctorId || 0;

    let DischargeTypeId=0
    if (this._IPReportService.userForm.get('DischargeTypeId').value)
      DischargeTypeId=this._IPReportService.userForm.get('DischargeTypeId').value.DischargeTypeId || 0;

    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getDischargetypecompanywiseView(
      this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       DoctorId,DischargeTypeId
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Discharge Type Company Wise  Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }

  viewgetIpdcurAdmitwardwisechargesReportPdf(){
    let DoctorId = 0;
    if (this._IPReportService.userForm.get('DoctorId').value)
      DoctorId = this._IPReportService.userForm.get('DoctorId').value.DoctorId
    let RoomId = 0;
    if (this._IPReportService.userForm.get('RoomId').value)
      RoomId =  this._IPReportService.userForm.get('RoomId').value.RoomId
    let CompanyId = 0;
    if (this._IPReportService.userForm.get('CompanyId').value)
      CompanyId = this._IPReportService.userForm.get('CompanyId').value.CompanyId


    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getIpcurrAdmitwardwisedischargeView(
           DoctorId,RoomId,CompanyId
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Current Admitted Ward wise Discharge Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  

  
  viewgetMaterialConsumptionPdf() {
    this.sIsLoading = 'loading-data';
   let MaterialConsumptionId=0
     setTimeout(() => {
       this.AdList = true;
       this._IPReportService.getMaterialConsumptionReport(
        MaterialConsumptionId
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Material Consumption Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           this.AdList = false;
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }

   
   viewgetDischaregTypewisePdf() {
    this.sIsLoading = 'loading-data';
     
    let DoctorId=0;
    if (this._IPReportService.userForm.get('DoctorId').value)
      DoctorId=this._IPReportService.userForm.get('DoctorId').value.DoctorId || 0;

    let DischargeTypeId=0;
    if (this._IPReportService.userForm.get('DischargeTypeId').value)
      DischargeTypeId=this._IPReportService.userForm.get('DischargeTypeId').value || 0;

setTimeout(() => {
       this.AdList = true;
       this._IPReportService.getDischargetypewiseReport(
        DoctorId,
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
        DischargeTypeId
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "IPD Discharge Type Wise Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           this.AdList = false;
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }


//IPMIS


viewDatewiseAdmissioncountPdf() {
  this.SpinLoading =true;
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getDatewiseAdmissioncountView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Date Wise Admission Count Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}



viewmonthwiseAdmissioncountPdf() {
 
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getMonthwiseAdmissioncountView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Month Wise Admission Count Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}


viewDatewisedrwiseAdmissioncountPdf() {
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getdatedrwiseAdmissioncountView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Date Wise Doctor Wise Admission Count Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}



viewDatewisedrwiseAdmissioncountsummaryPdf() {
  // this.sIsLoading = 'loading-data';
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getdatedrwiseAdmissioncountsummaryView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Date Wise Doctor Wise Admission Count Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}



viewDatewisedeptwiseadmissioncountPdf() {
  // this.sIsLoading = 'loading-data';
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getdatedrwisedeptwiseAdmissioncountdetailView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Date Wise Department Wise Admission Count Detail Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}



getDoctorwisecolldetailview() {
  // this.sIsLoading = 'loading-data';
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getdoctorwisecolldetailView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Doctor Wise Collection Detail Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}


viewDatewisedeptwiseadmissioncountsummaryPdf() {
  // this.sIsLoading = 'loading-data';
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getdatedrwisedeptwiseAdmissioncountsummaryView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Date Wise Department Wise Admission Count Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}




getDoctorwisecollsummaryview() {
  // this.sIsLoading = 'loading-data';
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getDoctorwisecollsummaryView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Doctor Wise Collection Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}

viewDeptwisecolldetailPdf() {
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getDeptwisecolldetailView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Department Wise Collection Detail Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}

viewDeptwisecollSummaryPdf() {
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getDeptwisecollsummaryView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Department Wise Collection Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}

viewCompanywiseAdmissioncountPdf() {
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getCompanywiseAdmissioncountView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Company Wise Admission Count Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}


viewCompanywiseAdmissioncountsummaryPdf() {
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getCompanywiseAdmissioncountsummaryView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Company Wise Admission Count Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}

viewCompanywisebilldetailPdf() {
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getCompanywisebilldetailView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Company Wise Bill Detail Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}

viewCompanywisebillsummaryPdf() {
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getCompanywisebillsummaryView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Company Wise Bill Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}



viewCompanywisecreditPdf() {
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getCompanywisecreditView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Company Wise Credit Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}


viewCompanywisecreditsummaryPdf() {
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getCompanywisecreditsummaryView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Company Wise Credit Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}


//IPBilling



viewIPDailyCollectionPdf() {

  let AddUserId = 0;
  if (this._IPReportService.userForm.get('UserId').value)
  AddUserId = this._IPReportService.userForm.get('UserId').value.UserId

  setTimeout(() => {
    // this.sIsLoading = 'loading-data';
    this.AdList = true;
   
    this._IPReportService.getIPDailyCollection(
      this.datePipe.transform(this._IPReportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      this.datePipe.transform(this._IPReportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      AddUserId
      
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "IP Daily Collection Viewer"
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        this.AdList = false;
        this.sIsLoading = '';
      });
    });

  }, 100);
}

viewgetOPIPCommanReportPdf() {
  let AddUserId = 0;
if (this._IPReportService.userForm.get('UserId').value)
      AddUserId = this._IPReportService.userForm.get('UserId').value.UserId

    let DoctorId = 0;
  if (this._IPReportService.userForm.get('DoctorId').value)
  DoctorId = this._IPReportService.userForm.get('DoctorId').value.DoctorId


  setTimeout(() => {
    this.sIsLoading = 'loading-data';
    this.AdList = true;
    
    this._IPReportService.getOPIPCommanCollectionSummary(
      this.datePipe.transform(this._IPReportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      this.datePipe.transform(this._IPReportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      AddUserId,DoctorId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "OP IP Comman Report"
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        this.AdList = false;
        this.sIsLoading = ' ';
      });

    });

  }, 100);
}

viewgetOPIPBillSummaryReportPdf() {

  setTimeout(() => {
    this.sIsLoading = 'loading-data';
    this.AdList = true;
   
    this._IPReportService.getOPIPBillSummary(
      this.datePipe.transform(this._IPReportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      this.datePipe.transform(this._IPReportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
     
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "OPIP Bill Summary Viewer"
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        this.AdList = false;
        this.sIsLoading = '';
      });
    });

  }, 100);
}

viewgetCreditReportPdf(){
 
this._IPReportService.getCreditReceipt(
  this.datePipe.transform(this._IPReportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      this.datePipe.transform(this._IPReportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
     
).subscribe(res => {
  const dialogRef = this._matDialog.open(PdfviewerComponent,
    {
      maxWidth: "85vw",
      height: '750px',
      width: '100%',
      data: {
        base64: res["base64"] as string,
        title: "Ip Credit  Viewer"
      }
    });
});
}

viewgetAdvanceReportPdf() {

this._IPReportService.getViewAdvanceReport(
  this.datePipe.transform(this._IPReportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
  this.datePipe.transform(this._IPReportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
 
).subscribe(res => {
  const dialogRef = this._matDialog.open(PdfviewerComponent,
    {
      maxWidth: "85vw",
      height: '750px',
      width: '100%',
      data: {
        base64: res["base64"] as string,
        title: "Ip Advance Report Viewer"
      }
    });
});
}


viewgetBillReportPdf() {
let AddUserId = 0;
if (this._IPReportService.userForm.get('UserId').value)
  AddUserId = this._IPReportService.userForm.get('UserId').value.UserId

this._IPReportService.getIpBillReport(
  this.datePipe.transform(this._IPReportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
  this.datePipe.transform(this._IPReportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
  AddUserId
).subscribe(res => {
  const dialogRef = this._matDialog.open(PdfviewerComponent,
    {
      maxWidth: "85vw",
      height: '750px',
      width: '100%',
      data: {
        base64: res["base64"] as string,
        title: "Ip Bill  Viewer"
      }
    });
});
}




viewgetBillSummaryReportPdf(){

setTimeout(() => {
this.sIsLoading = 'loading-data';
this.AdList = true;

this._IPReportService.getIPBillSummary(
  this.datePipe.transform(this._IPReportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
  this.datePipe.transform(this._IPReportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
 
).subscribe(res => {
  const dialogRef = this._matDialog.open(PdfviewerComponent,
    {
      maxWidth: "85vw",
      height: '750px',
      width: '100%',
      data: {
        base64: res["base64"] as string,
        title: "IP Bill Summary Viewer"
      }
    });
  dialogRef.afterClosed().subscribe(result => {
    this.AdList = false;
    this.sIsLoading = '';
  });
});

}, 100);
}


viewgetRefundofadvanceReportPdf() {
setTimeout(() => {

  this.sIsLoading = 'loading-data';
  //  this.AdList=true;
  this._IPReportService.getRefundofAdvanceview(
    this.datePipe.transform(this._IPReportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
  this.datePipe.transform(this._IPReportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
 
  ).subscribe(res => {
    const dialogRef = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Refund Of Advance  Viewer"
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      // this.AdList=false;
      this.sIsLoading = '';
      // this.SpinLoading = false;
    });

  });

}, 100);
}

viewgetRefundofbillReportPdf(){
setTimeout(() => {

  this.sIsLoading = 'loading-data';

this._IPReportService.getRefundofbillview(
  this.datePipe.transform(this._IPReportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
  this.datePipe.transform(this._IPReportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
 
).subscribe(res => {
  const dialogRef = this._matDialog.open(PdfviewerComponent,
    {
      maxWidth: "85vw",
      height: '750px',
      width: '100%',
      data: {
        base64: res["base64"] as string,
        title: "Refund Of Bill  Viewer"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.AdList=false;
      this.sIsLoading = '';
      // this.SpinLoading = false;
    });
  
});

},100);
}



viewgetDiscbillgeneratingpendingReportPdf(){
setTimeout(() => {
 
  this.sIsLoading = 'loading-data';
//  this.AdList=true;
this._IPReportService.getIPDischargeBillgeneratependingview(
 this.datePipe.transform(this._IPReportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
 this.datePipe.transform(this._IPReportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'

).subscribe(res => {
  const dialogRef = this._matDialog.open(PdfviewerComponent,
    {
      maxWidth: "85vw",
      height: '750px',
      width: '100%',
      data: {
        base64: res["base64"] as string,
        title: "Discharge Bill Generate Pending Report View"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.AdList=false;
      this.sIsLoading = '';
      // this.SpinLoading = false;
    });
  
});

},100);
}
viewgetBillgenepaymentdueReportPdf(){
setTimeout(() => {
 
   this.sIsLoading = 'loading-data';
 //  this.AdList=true;
 this._IPReportService.getBillgeneratepaymentdueview(
  this.datePipe.transform(this._IPReportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
  this.datePipe.transform(this._IPReportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
 
 ).subscribe(res => {
   const dialogRef = this._matDialog.open(PdfviewerComponent,
     {
       maxWidth: "85vw",
       height: '750px',
       width: '100%',
       data: {
         base64: res["base64"] as string,
         title: "Bill Generated Payment Due Report View"
       }
     });
     dialogRef.afterClosed().subscribe(result => {
       // this.AdList=false;
       this.sIsLoading = '';
       // this.SpinLoading = false;
     });
   
 });

 },100);
}


viewgetIpdischargebillgenependingPdf(){
this.sIsLoading = 'loading-data';
setTimeout(() => {

this._IPReportService.getIdischargebillgenependingView(
  this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
  this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
  ).subscribe(res => {
  const matDialog = this._matDialog.open(PdfviewerComponent,
    {
      maxWidth: "85vw",
      height: '750px',
      width: '100%',
      data: {
        base64: res["base64"] as string,
        title: "Ip Discharge Bill Generated Pending  Viewer"
      }
    });

    matDialog.afterClosed().subscribe(result => {
      // this.AdList=false;
      this.sIsLoading = ' ';
    });
});

},100);
}

ViewgetIpbillgenepaymentdueview(){
this.sIsLoading = 'loading-data';
setTimeout(() => {

this._IPReportService.getIpbillgenepaymentdueView(
  this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
  this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
  ).subscribe(res => {
  const matDialog = this._matDialog.open(PdfviewerComponent,
    {
      maxWidth: "85vw",
      height: '750px',
      width: '100%',
      data: {
        base64: res["base64"] as string,
        title: "Ip Bill Generated Pament Due  Viewer"
      }
    });

    matDialog.afterClosed().subscribe(result => {
      // this.AdList=false;
      this.sIsLoading = ' ';
    });
});

},100);
}

//Doc share

viewgetDoctorShareReportPdf(){
  let DoctorId = 0;
  if (this._IPReportService.userForm.get('DoctorId').value)
    DoctorId = this._IPReportService.userForm.get('DoctorId').value.DoctorId
 
  setTimeout(() => {
    this.SpinLoading =true;
    this.AdList=true;
   this._IPReportService.getDoctorShareReportView(DoctorId,0,
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",0
         
     ).subscribe(res => {
     const matDialog = this._matDialog.open(PdfviewerComponent,
       {
         maxWidth: "85vw",
         height: '750px',
         width: '100%',
         data: {
           base64: res["base64"] as string,
           title: "Doctor Share  Viewer"
         }
       });

       matDialog.afterClosed().subscribe(result => {
         this.AdList=false;
         this.sIsLoading = ' ';
       });
   });
  
   },100);
}
viewgetConsultantDoctorShareDetailsPdf(){
  let DoctorId = 0;
  if (this._IPReportService.userForm.get('DoctorId').value)
    DoctorId = this._IPReportService.userForm.get('DoctorId').value.DoctorId
 
  setTimeout(() => {
    // this.SpinLoading =true;
    // this.AdList=true;
   this._IPReportService.getConDoctorSharesReportView(DoctorId,0,
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
         0
     ).subscribe(res => {
     const matDialog = this._matDialog.open(PdfviewerComponent,
       {
         maxWidth: "85vw",
         height: '750px',
         width: '100%',
         data: {
           base64: res["base64"] as string,
           title: "Consultant Doctor Share Details Viewer"
         }
       });

       matDialog.afterClosed().subscribe(result => {
         this.AdList=false;
         this.sIsLoading = ' ';
       });
   });
  
   },100);
}
viewgetDoctorWiseSummaryReportReportPdf(){
  // let DoctorId = 0;
  // if (this._IPReportService.userForm.get('DoctorId').value)
  //   DoctorId = this._IPReportService.userForm.get('DoctorId').value.DoctorId
 
  setTimeout(() => {
    this.SpinLoading =true;
    this.AdList=true;
   this._IPReportService.getDoctorSharesummaryReportView(
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
       
     ).subscribe(res => {
     const matDialog = this._matDialog.open(PdfviewerComponent,
       {
         maxWidth: "85vw",
         height: '750px',
         width: '100%',
         data: {
           base64: res["base64"] as string,
           title: "Doctor wise Summary Report Viewer"
         }
       });

       matDialog.afterClosed().subscribe(result => {
         this.AdList=false;
         this.sIsLoading = ' ';
       });
   });
  
   },100);
}
viewgetDoctorSharewithchargesReportPdf(){
  let DoctorId = 0;
  if (this._IPReportService.userForm.get('DoctorId').value)
    DoctorId = this._IPReportService.userForm.get('DoctorId').value.DoctorId
 
  setTimeout(() => {
    this.SpinLoading =true;
    this.AdList=true;
   this._IPReportService.getDoctorShareListWithChargesview(DoctorId,0,
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",0
         
     ).subscribe(res => {
     const matDialog = this._matDialog.open(PdfviewerComponent,
       {
         maxWidth: "85vw",
         height: '750px',
         width: '100%',
         data: {
           base64: res["base64"] as string,
           title: "Doctor Share with Charges  Viewer"
         }
       });

       matDialog.afterClosed().subscribe(result => {
         this.AdList=false;
         this.sIsLoading = ' ';
       });
   });
  
   },100);
}


optionsDischargeType: any[] = [];
getDischargetypelist() {
  this._IPReportService.getDischargetypeCombo().subscribe(data => {
    this.DischargeTypeList = data;
    this.optionsDischargeType = this.DischargeTypeList.slice();
    this.filteredOptionsDisctype = this._IPReportService.userForm.get('DischargeTypeId').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._filterDischargeType(value) : this.DischargeTypeList.slice()),
    );

  });
}


private _filterDischargeType(value: any): string[] {
  if (value) {
    const filterValue = value && value.DischargeTypeName ? value.DischargeTypeName.toLowerCase() : value.toLowerCase();
    return this.DischargeTypeList.filter(option => option.DischargeTypeName.toLowerCase().includes(filterValue));
  }
}
getOptionTextDisctype(option) {
  return option && option.DischargeTypeName ? option.DischargeTypeName : '';
}

  userChk(option) {
    this.UserId = option.UserID || 0;
    this.UserName = option.UserName;
  }

  PaymentModeChk(option) {
    this.PaymentMode = option.PaymentMode;
  }

  onClose() { }



}


export class ReportDetail {
  ReportName: any;
  ReportId: any;
  constructor(ReportDetail) {
    this.ReportName = ReportDetail.ReportName || '';
    this.ReportId = ReportDetail.ReportId || '';
  }
}