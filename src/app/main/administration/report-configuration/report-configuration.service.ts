import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';


@Injectable({
  providedIn: 'root'
})
export class ReportConfigurationService {

  MySearchGroup: FormGroup;
  MyForm: FormGroup;

  constructor(
    public _formBuilder: FormBuilder,
    public _httpClient: HttpClient,
    public _loaderService: LoaderService
  ) {
    this.MySearchGroup = this.createseacrhform();
    this.MyForm = this.createForm();
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      reportSectionId: [''],

      reportId: [0],
      menuId: [''],
      reportSection: ["", []],
      reportName: ["",
        [
          Validators.required,
          Validators.maxLength(500),
          Validators.pattern("^[A-Za-z @#&]+$")
        ]
      ],
      parentid: ["",
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$')
        ]
      ],
      reportMode: ["",
        [
          Validators.required,
          Validators.maxLength(500),
          Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
        ]
      ],
      reportTitle: ["",
        [
          Validators.required,
          Validators.maxLength(500),
          Validators.pattern("^[A-Za-z @#&]+$")
        ]
      ],
      reportHeader: ["",
        [
          Validators.required,
          // Validators.maxLength(2000),
        ]
      ],
      reportColumn: ["",
        [
          Validators.required,
        ]
      ],

      reportTotalField: [""],
      summaryLabel: [""],
      reportGroupByLabel: [""],
      reportColumnWidths: [""],
      reportHeaderFile: ["",
        [
          Validators.required,
          Validators.maxLength(500),
          Validators.pattern("^[A-Za-z .,@$&]+$") //.html
        ]
      ],
      reportBodyFile: ["MultiTotalReportFormat.html",
        [
          Validators.required,
          Validators.maxLength(500),
        ]
      ],
      reportFolderName: ["",
        [
          Validators.required,
          Validators.maxLength(500),
        ]
      ],
      reportFileName: ["",
        [
          Validators.required,
          Validators.maxLength(500),
        ]
      ],
      reportSpname: ["",
        [
          Validators.required,
          Validators.maxLength(500),
        ]
      ],
      reportPageOrientation: ["", [Validators.required]],
      reportPageSize: ["", [Validators.required]],
      // isActive:[true,[Validators.required]],
      reportFilter: ["",
        [
          Validators.maxLength(500),
        ]
      ],
    });
  }

  createseacrhform(): FormGroup {
    return this._formBuilder.group({
      reportName: [""],
      MenuName: [''],
      menuId:['']
    });
  }

  public getReportList(param, loader = true) {
    if (loader) {
      this._loaderService.show()
    }
    return this._httpClient.post("Generic/GetDataSetByProc?procName=ps_ReportConfigList", param);
  }

  public getMenuMasterComboList() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_menumasterdropdown", {})
  }

   public getReportSectionCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_ReportConfigdropdown", {})
  }

   public ReportInsert(employee)
   {    
     return this._httpClient.post("Administration/ReportConfigsave",employee);
   }
   public ReportUpdate(employee)
   {    
     return this._httpClient.post("Administration/ReportConfigUpdate",employee);
   }
    public getReportGetList(param,loader = true) {
      if (loader) {
          this._loaderService.show();
      }
      return this._httpClient.post("Generic/GetDataSetByProc?procName=ps_get_ProcedureCol",param)
  } 
  public getReportRetriveList(param,loader = true) {
      if (loader) {
          this._loaderService.show();
      }
      return this._httpClient.post("Generic/GetDataSetByProc?procName=ps_getReportDetaillist",param)
  } 
}
