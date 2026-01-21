import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LabPatientRegService } from '../lab-patient-reg.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-estimate-for-patient',
  templateUrl: './estimate-for-patient.component.html',
  styleUrls: ['./estimate-for-patient.component.scss']
})
export class EstimateForPatientComponent {
  myformSearch: FormGroup;

      constructor(public _LabPatientRegService: LabPatientRegService,
          public _matDialog: MatDialog, private commonService: PrintserviceService,
          public datePipe: DatePipe, public _formBuilder: UntypedFormBuilder,
          public toastr: ToastrService,) { }
  
      ngOnInit(): void {
          this.myformSearch = this.createSearchForm()
          // this.GetSampleCollectiondetail()
      }
  
       createSearchForm(): FormGroup {
          return this._formBuilder.group({
            RegNo: [],
            FirstName: ['', [
              Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
            ]],
            LastName: ['', [
            Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
            ]],
            // BillNo:[''],
            // BillDate:[''],
            PatientTypeSearch: ['1'],
            StatusSearch: ['0'],
            Istype:['2'],
            CategoryId: [''],
            start: [new Date().toISOString()],
            end: [new Date().toISOString()],
            TestStatusSearch:['1']
          });
        }

          onChangeFirst() {
                debugger
                // this.isShowDetailTable = false;
                // this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
                // this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
                // this.f_name = this.myformSearch.get('FirstName').value + "%"
                // this.l_name = this.myformSearch.get('LastName').value + "%"
                // this.regNo = this.myformSearch.get('RegNo').value || ""
                // this.status = this.myformSearch.get('StatusSearch').value
                // this.Ptype = this.myformSearch.get('PatientTypeSearch').value
                // this.getfilterdata();
            }
        
            getfilterdata() {
                // debugger
                // this.gridConfig = {
                //     apiUrl: "PathlogySampleCollection/SampleCollectionPatientList",
                //     columnsList: this.allcolumns,
                //     sortField: "RegNo",
                //     sortOrder: 0,
                //     filters: [
                //         { fieldName: "F_Name ", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
                //         { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
                //         { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                //         { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                //         { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                //         { fieldName: "IsCompleted", fieldValue: this.status, opType: OperatorComparer.Equals },
                //         { fieldName: "OP_IP_Type", fieldValue: this.Ptype, opType: OperatorComparer.Equals }
        
                //     ]
                // }
                // this.grid.gridConfig = this.gridConfig;
                // this.grid.bindGridData();
                // this.GetSampleCollectiondetail()
        
            }

            
    Clearfilter(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myformSearch.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myformSearch.get('LastName').setValue("")
        if (event == 'RegNo')
            this.myformSearch.get('RegNo').setValue("")

        this.onChangeFirst();
}
}
