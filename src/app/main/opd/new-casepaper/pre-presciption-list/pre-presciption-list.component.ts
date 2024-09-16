import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CasepaperService } from '../casepaper.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MedicineItemList } from '../new-casepaper.component';

import {LiveAnnouncer} from '@angular/cdk/a11y';
 
import {ChangeDetectionStrategy,    inject} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';

interface Prescription {
  date: string;
  medication: string;
  dosage: string;
}
interface VisitDetails {
  VisitDate: string; 
  prescriptions: Prescription[];
}

export interface UserData {
  id: number;
  name: string;
  age: number;
  email: string; 
}

const ELEMENT_DATA: UserData[] = [
  { id: 1, name: 'John Doe', age: 28, email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Smith', age: 34,  email: 'jane.smith@example.com' },
  { id: 3, name: 'Alice Johnson', age: 45, email: 'alice.johnson@example.com' },
  { id: 4, name: 'Bob Brown', age: 23,email: 'bob.brown@example.com' },
];



@Component({
  selector: 'app-pre-presciption-list',
  templateUrl: './pre-presciption-list.component.html',
  styleUrls: ['./pre-presciption-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PrePresciptionListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'age', 'email'];
  dataSource = ELEMENT_DATA;

  displayedItemColumn: string[] = [
    'ItemName',
    'DoseName',
    'Days',
    'Remark', 
    'Action'
  ]
  

  dsItemList = new MatTableDataSource<MedicineItemList>();
  
  constructor(
    private _CasepaperService: CasepaperService, 
    private _formBuilder: FormBuilder, 
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe, 
  ) {}

  ngOnInit(): void {
    this.getPrescriptionListFill1();
  }

  getPrescriptionListFill1() { 
    // var vdata ={
    //   "visitId":194660
    // }
    // this._CasepaperService.RtrvPreviousprescriptionDetails(vdata).subscribe(Visit => {
    //   this.dsItemList.data = Visit as MedicineItemList[];   
    //   console.log(this.dsItemList.data);   
    // })
  }

 

    VisitDetails: VisitDetails[] = [
      {
        VisitDate: "2024-09-1",
        
        prescriptions: [
          { date: "2024-08-01", medication: "Medication A", dosage: "500mg" },
          { date: "2024-08-01", medication: "Medication B", dosage: "250mg" },
          { date: "2024-08-01", medication: "Medication C", dosage: "100mg" }
        ]
      },
      {
        VisitDate: "2024-09-2", 
        prescriptions: [
          { date: "2024-08-01", medication: "Medication C", dosage: "100mg" }
        ]
      },
      {
        VisitDate: "2024-09-3",
       
        prescriptions: [
          { date: "2024-08-02", medication: "Medication D", dosage: "200mg" }
        ]
      },
      {
        VisitDate: "2024-09-4",
    
        prescriptions: [
          { date: "2024-08-01", medication: "Medication E", dosage: "300mg" },
          { date: "2024-08-02", medication: "Medication F", dosage: "150mg" }
        ]
      }
    ];

   
}
