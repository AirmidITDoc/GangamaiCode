import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { TestFormMasterComponent } from "./test-form-master/test-form-master.component";
import { TestmasterService } from "./testmaster.service";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "app/core/services/authentication.service";
import { ExcelDownloadService } from "app/main/shared/services/excel-download.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";

import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import Swal from "sweetalert2";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-testmaster",
  templateUrl: "./testmaster.component.html",
  styleUrls: ["./testmaster.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class TestmasterComponent implements OnInit {
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('actionsIsSubTest') actionsIsSubTest!: TemplateRef<any>;
  @ViewChild('actionsisTemplateTest') actionsisTemplateTest!: TemplateRef<any>;
  testName:any="";   
   searchFormGroup: FormGroup;
  
  ngAfterViewInit() {
    // Assign the template to the column dynamically
    this.gridConfig.columnsList.find(col => col.key === 'isSubTest')!.template = this.actionsIsSubTest;
    this.gridConfig.columnsList.find(col => col.key === 'isTemplateTest')!.template = this.actionsisTemplateTest;
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  allColumns=[
    { heading: "IsTemplateTest", key: "isTemplateTest", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 150 },
    { heading: "Code", key: "testId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "TestName", key: "testName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "PrintTestName", key: "printTestName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Category Name", key: "categoryName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "BillingServiceName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Technique Name", key: "techniqueName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Machine Name", key: "machineName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "IsSub Test", key: "isSubTest", sort: true, align: 'left', type: gridColumnTypes.template, width: 100 },
    { heading: "Added By", key: "addedBy", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 100 },
    {
      heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]

  filters=[
    { fieldName: "ServiceName", fieldValue: "%", opType: OperatorComparer.StartsWith }
  ]

  constructor(
    public _TestService: TestmasterService,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
    private reportDownloadService: ExcelDownloadService,
    private _fuseSidebarService: FuseSidebarService,
    private accountService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.searchFormGroup = this._TestService.createSearchForm();
  }

  gridConfig: gridModel = {
    apiUrl: "PathTestMaster/PathTestList", //"Pathology/PathologyTestList",
    columnsList: this.allColumns,
    sortField: "TestId",
    sortOrder: 0,
    filters: this.filters
  }

  Clearfilter(event) {
    console.log(event)
    if (event == 'TestNameSearch')
        this.searchFormGroup.get('TestNameSearch').setValue("")
   
    this.onChangeFirst();
  }
  
onChangeFirst() {
    this.testName = this.searchFormGroup.get('TestNameSearch').value + "%"
    this.getfilterdata();
}

getfilterdata(){
    
    this.gridConfig = {
      apiUrl: "PathTestMaster/PathTestList",
      columnsList: this.allColumns,
      sortField: "TestId",
      sortOrder: 0,
      filters: [
        { fieldName: "ServiceName", fieldValue: this.testName, opType: OperatorComparer.StartsWith }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData(); 
}

  onSave(row: any = null) {

    let that = this;
    const dialogRef = this._matDialog.open(TestFormMasterComponent,
      {
        maxWidth: "100vw",
        height: '100%',
        width: '90%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        that.grid.bindGridData();
      }
    });
  }

  deactivateTestMaster(row) {
    Swal.fire({
      title: 'Confirm Status',
      text: 'Are you sure you want to Change Active Status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Change Status!'
    }).then((result) => {
      
      if (result.isConfirmed) {
        this._TestService.deactivateTheStatus(row.testId).subscribe(
          (response) => {
            if (response) {
              this.toastr.success('Status has been Changed Successfully.', 'Status!', {
                toastClass: 'tostr-tost custom-toast-success',
              });
            } else {
              this.toastr.error('Failed to Change TestMaster Status! Please check API error..', 'Error!', {
                toastClass: 'tostr-tost custom-toast-error',
              });
            }
          },
          (error) => {
            this.toastr.error('An error occurred while Changing the Status.', 'Error!', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          }
        );
      }
    });
  }

}

export class TestMaster {
  TestId: number;
  TestName: string;
  PrintTestName: String;
  CategoryId: number;
  IsSubTest: boolean;
  TechniqueName: string;
  MachineName: string;
  SuggestionNote: string;
  FootNote: string;
  ServiceID: number;
  ServiceName: any;
  IsTemplateTest: number;
  IsCategoryPrint: boolean;
  IsPrintTestName: boolean;
  Isdeleted: boolean;
  UpdatedBy: number;
  AddedBy: number;
  IsDeletedSearch: number;
  /**
   * Constructor
   *
   * @param TestMaster
   */
  constructor(TestMaster) {
    {
      this.TestId = TestMaster.TestId || 0;
      this.TestName = TestMaster.TestName || "";
      this.PrintTestName = TestMaster.PrintTestName || "";
      this.CategoryId = TestMaster.CategoryId || 0;
      this.IsSubTest = TestMaster.IsSubTest || "";
      this.TechniqueName = TestMaster.TechniqueName || "";
      this.MachineName = TestMaster.MachineName || "";
      this.SuggestionNote = TestMaster.SuggestionNote || "";
      this.FootNote = TestMaster.FootNote || "";
      this.Isdeleted = TestMaster.Isdeleted || "false";
      this.ServiceID = TestMaster.ServiceID || 0;
      this.ServiceName = TestMaster.ServiceName || "";
      this.IsTemplateTest = TestMaster.IsTemplateTest || "";
      this.IsCategoryPrint = TestMaster.IsCategoryPrint || "false";
      this.IsPrintTestName = TestMaster.IsPrintTestName || "false";
      this.UpdatedBy = TestMaster.UpdatedBy || 0;
      this.AddedBy = TestMaster.AddedBy || 0;
      this.IsDeletedSearch = TestMaster.IsDeletedSearch || "true";
    }
  }
}
export class TestList {
  TestId: number;
  TestName: any;
  ParameterName: any;
  parameterName: any;
  ParameterID: number;
  Isdeleted: any;
  IsDeleted: any;
  ParameterId: any;
  /**
   * Constructor
   *
   * @param TestList
   */
  constructor(TestList) {
    {
      this.ParameterName = TestList.ParameterName || "";
      this.parameterName = TestList.parameterName || "";
      this.TestId = TestList.TestId || "";
      this.TestName = TestList.TestName || "";
      this.Isdeleted = TestList.Isdeleted || "";
      this.IsDeleted = TestList.IsDeleted || "true";
    }
  }
}


export class TemplatedetailList {
  templateId: number;
  templateName: any;
  constructor(TemplateList) {
    {
      this.templateId = TemplateList.templateId || 0;
      this.templateName = TemplateList.templateName || "";

    }
  }
} 
