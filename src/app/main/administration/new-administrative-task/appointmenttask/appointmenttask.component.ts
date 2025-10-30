import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { AdministrationService } from '../../administration.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appointmenttask',
  templateUrl: './appointmenttask.component.html',
  styleUrls: ['./appointmenttask.component.scss']
})
export class AppointmenttaskComponent {
  myForm: FormGroup;
  vRegId = 0
  vRegNo=0
  OPIPType = 1
  opiptype = true
vPatientName=''
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
  @ViewChild('actionsTemplate2') actionsTemplate2!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    // this.gridConfig.columnsList.find(col => col.key === 'companyId')!.template = this.actionsTemplate;
    // this.gridConfig.columnsList.find(col => col.key === 'balanceAmt')!.template = this.actionsTemplate2;
    // this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  AllColumns = [
   
    { heading: "VisitId", key: "VisitId", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "VisitTime", key: "VisitTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 9 },
    { heading: "OPDNo", key: "OPDNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "DoctorName", key: "DoctorName", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount ,width: 400},
    
    {
      heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]
  gridConfig: gridModel = {
    apiUrl: "Common",
    columnsList: this.AllColumns,
    sortField: "BillNo",
    sortOrder: 0,
    filters: [
      { fieldName: "RegId", fieldValue: String(this.vRegId), opType: OperatorComparer.Equals },
      { fieldName: "OPIPType", fieldValue: String(this.OPIPType), opType: OperatorComparer.Equals }
    ]
  }

  constructor(public _AdministrativetaskService: AdministrationService,
    private _loggedService: AuthenticationService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe, private _fuseSidebarService: FuseSidebarService,) { }

  ngOnInit(): void {
    this.myForm = this.createSearchForm();


  }
  createSearchForm() {
    return this.formBuilder.group({
      RegID: 0,
      // AppointmentDate: [(new Date()).toISOString()],
    });
  }

  VisitDateUpdate(contact){}

    getSelectedObj(obj) {
      console.log(obj)
        this.vRegId = obj.value;
         this.vRegNo = obj.regNo
        // this.vPatientName=obj.P
    }

     GetDetails(RegId1) {
        this.gridConfig = {
            apiUrl: "Common",
            columnsList: this.AllColumns,
            sortField: "RegId",
            sortOrder: 0,
            filters: [
                { fieldName: "RegId", fieldValue: String(this.vRegId), opType: OperatorComparer.Equals },
      { fieldName: "OPIPType", fieldValue: String(this.OPIPType), opType: OperatorComparer.Equals }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

  onChangeRadio(event) {

    if (this.myForm.get('opiptype').value == "0") {
      this.opiptype = false
      this.OPIPType = 0
      this.myForm.get('RegID').setValue('')

    }
    else {
      this.opiptype = true
      this.OPIPType = 1
      this.myForm.get('RegID').setValue('')

    }
  }

}
