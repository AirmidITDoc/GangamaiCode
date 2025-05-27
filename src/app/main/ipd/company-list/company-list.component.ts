import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AdvanceDataStored } from '../advance';
import { CompanyBillComponent } from '../ip-search-list/company-bill/company-bill.component';
import { AdvanceDetailObj } from '../ip-search-list/ip-search-list.component';
import { CompanyListService } from './company-list.service';


@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CompanyListComponent implements OnInit {
  myFilterform:FormGroup;
  fromDate ="01/01/1900"// this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate ="01/01/1900"// this.datePipe.transform(Date.now(), 'yyyy-MM-dd');
  f_name:any = "" 
  regNo:any="0"
  l_name:any="" 
  m_name:any="" 
  IPDNo:any="" 
   @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  menuActions: Array<string> = [];
  constructor(
    public _CompanyListService: CompanyListService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    private _ActRoute: Router,
     private commonService: PrintserviceService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored
  ) { }

  autocompleteModedeptdoc: string = "ConDoctor";
    optionsSearchDoc: any[] = [];
  
  
    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    // @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  
    ngAfterViewInit() {
      // Assign the template to the column dynamically
      this.gridConfig.columnsList.find(col => col.key === 'patientTypeID')!.template = this.actionsTemplate;
      // this.gridConfig.columnsList.find(col => col.key === 'isMLC')!.template = this.actionsTemplate1;
      this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  
    }

    allcolumns=[
      { heading: "PatientType", key: "patientTypeID", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width:100},
      { heading: "-", key: "isOpToIpconv", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width:40 },
      { heading: "IsMLC", key: "isMLC", sort: true, align: 'left', emptySign: 'NA',type: gridColumnTypes.template, width: 80},
      { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA'},
      { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
      { heading: "Date", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', width: 170, type: 8 },
      { heading: "DoctorName", key: "doctorname", sort: true, align: 'left', emptySign: 'NA', width: 200 },
      { heading: "RefDocName", key: "refDocName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
      { heading: "IPDNo", key: "ipdno", sort: true, align: 'left', emptySign: 'NA'},
      { heading: "PatientType", key: "patientType", sort: true, align: 'left', emptySign: 'NA'},
      { heading: "WardName", key: "roomName", sort: true, align: 'left', emptySign: 'NA', type: 14 },
      { heading: "TariffName", key: "tariffName", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "ClassName", key: "className", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
      { heading: "RelativeName", key: "relativeName", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 14 },
      {
        heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
         // Assign ng-template to the column
      }

    ];
  
    gridConfig: gridModel = {
      apiUrl: "Admission/AdmissionList",
      columnsList: this.allcolumns,
      sortField: "AdmissionId",
      sortOrder: 0,
      filters: [{ fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "Doctor_Id", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue:this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "Admtd_Dschrgd_All", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "M_Name", fieldValue: "%", opType: OperatorComparer.Equals },
      { fieldName: "IPNo", fieldValue: "0", opType: OperatorComparer.Equals }
      ]
  
    }
  

  ngOnInit(): void {
    this.myFilterform = this._CompanyListService.filterForm();
    if (this._ActRoute.url == '/ipd/companylist') {
      this.menuActions.push('Company Bill'); 
    }
  }

  getRecord(contact, m): void { 
    if(contact.CompanyId){
      if (m == "Company Bill") {
        
        this.advanceDataStored.storage = new AdvanceDetailObj(contact); 
        if (!contact.IsBillGenerated) {
        const dialogRef = this._matDialog.open(CompanyBillComponent,
          {
            maxWidth: "90%",
            width: '98%',
            height: '95%',
          });
        dialogRef.afterClosed().subscribe(result => {
         
        });
        }else Swal.fire("Bill already Generated")
      }
    }
   else{
    
      Swal.fire({
        title: 'Selected Patient is not company patient',
        text: "Please Select Compnay Patient!",
        icon: "warning",  
        cancelButtonColor: "#d33",
        confirmButtonText: "Ok" 
      });
    }
  }
 

  onChangeFirst() {
          debugger
          // this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
          // this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd")
          this.f_name = this.myFilterform.get('FirstName').value + "%"
          this.l_name = this.myFilterform.get('LastName').value + "%"
          this.regNo = this.myFilterform.get('RegNo').value || "0"
          this.m_name = this.myFilterform.get('MiddleName').value + "%"
          this.IPDNo = this.myFilterform.get('IPDNo').value || "0"
  
          this.getfilterdata();
      }
  
      getfilterdata() {
          debugger
          this.gridConfig = {
              apiUrl: "Admission/AdmissionList",
              columnsList: this.allcolumns,
              sortField: "AdmissionId",
              sortOrder: 0,
              filters: [
                  { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
                  { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
                  { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                  { fieldName: "Doctor_Id", fieldValue: "0", opType: OperatorComparer.Equals },
                  { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                  { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                  { fieldName: "Admtd_Dschrgd_All", fieldValue: "0", opType: OperatorComparer.Equals },
                  { fieldName: "M_Name", fieldValue: this.m_name, opType: OperatorComparer.Equals },
                  { fieldName: "IPNo", fieldValue: this.IPDNo, opType: OperatorComparer.Equals },
                  { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
                  { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
              ],
              row: 25
          }
          this.grid.gridConfig = this.gridConfig;
          this.grid.bindGridData();
      }


      getAdmittedPatientCasepaperview(element) {
    
        console.log('Third action clicked for:', element);
        this.commonService.Onprint("AdmissionId", element.admissionId, "IpCasepaperReport"); 
      }
    
    
      Clearfilter(event) {
          console.log(event)
          if (event == 'FirstName')
              this.myFilterform.get('FirstName').setValue("")
          else
              if (event == 'LastName')
                  this.myFilterform.get('LastName').setValue("")
              else
                  if (event == 'MiddleName')
                      this.myFilterform.get('MiddleName').setValue("")
          if (event == 'RegNo')
              this.myFilterform.get('RegNo').setValue("")
          if (event == 'IPDNo')
              this.myFilterform.get('IPDNo').setValue("")
  
          this.onChangeFirst();
      }
  

  getValidationdoctorMessages() {
    return {
      searchDoctorId: [
        { name: "required", Message: "Doctor Name is required" }
      ]
    };
  }

}
