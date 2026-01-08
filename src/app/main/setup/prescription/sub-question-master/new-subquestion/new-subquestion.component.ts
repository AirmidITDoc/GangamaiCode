import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { SubquestionMasterService } from '../subquestion-master.service';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import Swal from 'sweetalert2';
import { I } from '@angular/cdk/keycodes';
import { element } from 'protractor';

@Component({
  selector: 'app-new-subquestion',
  templateUrl: './new-subquestion.component.html',
  styleUrls: ['./new-subquestion.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewSubquestionComponent {

  SubQuestionForm: FormGroup;
  isActive: boolean = true;
  SubresultvaluesForm: FormGroup;
  public SubQueList: SubQuesList[] = [];
  public SubQueList1: SubQuesList[] = [];
  vsubQuestionId = 0
  vquestionId = 0
  vsubQuestionValId = 0


  displayedIsubQColumn: string[] = [
    // 'questionId',
    'sequenceNo',
    'shortcutValues',
    'subQuestionValName',
    'Action',
    // 'Add'
  ]

  dsQuesList = new MatTableDataSource<SubQuesList>();
  autocompleteModesQuesiontatus: string = "QuestionMaster";
  constructor(
    public _SubquestionMasterService: SubquestionMasterService,
    public dialogRef: MatDialogRef<NewSubquestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.SubQuestionForm = this.createSubQuestionForm();
    this.SubQuestionForm.markAllAsTouched();

    this.SubresultvaluesForm = this.createsubresultForm();
    this.mSubQuestionValuesMastersArray.push(this.createsubresultFormarray());


    if ((this.data?.subQuestionId ?? 0) > 0) {
      console.log(this.data)
      this.isActive = this.data.isActive
      this.vsubQuestionId = this.data.subQuestionId
      this.vquestionId = this.data.questionId


      this.SubQuestionForm.patchValue(this.data);
      this.geResultbyId(this.data.subQuestionId)


    }
  }

  createSubQuestionForm(): FormGroup {
    return this._formBuilder.group({
      subQuestionId: [this.vsubQuestionId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      questionId: [this.vquestionId,
      [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]
      ],
      subQuestionName: ["",
        [
          Validators.required, Validators.maxLength(50),
          this._FormvalidationserviceService.allowEmptyStringValidator()
        ]
      ],
      sequenceNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      mSubQuestionValuesMasters: this._formBuilder.array([]),
    });
  }


  createsubresultForm(): FormGroup {
    return this._formBuilder.group({
      subQuestionValId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      subQuestionId: [this.vsubQuestionId, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
      subQuestionValName: ["",
        [
          Validators.required, Validators.maxLength(50),
          this._FormvalidationserviceService.allowEmptyStringValidator()
        ]
      ],
      sequenceNo: [0],
      shortcutValues: [''],

    });
  }

  createsubresultFormarray(item: any = {}): FormGroup {
    return this._formBuilder.group({
      subQuestionValId: [this.vsubQuestionValId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      subQuestionId: [this.vsubQuestionId,
      [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]
      ],
      subQuestionValName: [item.SubQuestionValName,
      [
        Validators.required, Validators.maxLength(50),
        this._FormvalidationserviceService.allowEmptyStringValidator()
      ]
      ],
      sequenceNo: [parseInt(item.SequenceNo)],
      shortcutValues: [item.ShortcutValues],

    });
  }

  get mSubQuestionValuesMastersArray(): FormArray {
    return this.SubQuestionForm.get('mSubQuestionValuesMasters') as FormArray;
  }

  geResultbyId(Id) {
    debugger

    let param = {
      "searchFields": [
        {
          "fieldName": "SubQuestionId",
          "fieldValue": String(Id),
          "opType": "Equals"
        }
      ],
      "mode": "subQuestionValueList"
    }

    this._SubquestionMasterService.getSubresult(param).subscribe(data => {
      console.log(data)
      this.dsQuesList.data = data as SubQuesList[]
      if(this.dsQuesList.data .length >0)
      this.SubQueList = data
    });
  }
  onAddResult(): void {

    debugger
    if (this.SubresultvaluesForm.get('subQuestionValName').value == '') {
      this.toastr.warning('Please select SubQuestionValName.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (this.SubresultvaluesForm.get('sequenceNo').value == '') {
      this.toastr.warning('Please select SequenceNo.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }


    //  ? if (!this.SubresultvaluesForm.invalid) {



    const newRow = {
      SubQuestionValId: 0,
      SubQuestionId: 0,
      SubQuestionValName: this.SubresultvaluesForm.get('subQuestionValName').value,
      SequenceNo: this.SubresultvaluesForm.get('sequenceNo').value,
      ShortcutValues: this.SubresultvaluesForm.get('shortcutValues').value,
    };
debugger
    const newCharge = new SubQuesList(newRow);
    this.SubQueList.push(newCharge);
    this.dsQuesList.data = this.SubQueList;
    this.resetForm();

    // } else {
    //   Swal.fire({
    //     title: 'Message',
    //     text: "Please Enter Result Detail.. !",
    //     icon: "warning"
    //   });
    // }
  }

  save() {
    debugger
    if (this.SubQuestionForm.get('questionId').value == '') {
      this.toastr.warning('Please select QuestionId.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (this.SubQuestionForm.get('subQuestionName').value == '') {
      this.toastr.warning('Please select SubQuestionName.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }


    this.onSubmit()

  }

  onSubmit() {
if (this.SubQuestionForm.get('questionId').value == '') {
      this.toastr.warning('Please select QuestionId.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (this.SubQuestionForm.get('subQuestionName').value == '') {
      this.toastr.warning('Please select SubQuestionName.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    this.SubQuestionForm.get('questionId').setValue(parseInt(this.SubQuestionForm.get('questionId').value))
    this.SubQuestionForm.get('sequenceNo').setValue(parseInt(this.SubQuestionForm.get('sequenceNo').value))

    debugger
    this.mSubQuestionValuesMastersArray.clear();
    this.dsQuesList.data.forEach(item => {
      this.mSubQuestionValuesMastersArray.push(this.createsubresultFormarray(item as SubQuesList));
    });

    //  this.SubQuestionForm.get('mSubQuestionValuesMasters').setValue(this.mSubQuestionValuesMastersArray)


    console.log(this.SubQuestionForm.value)
    this._SubquestionMasterService.SubQuestionMasterSave(this.SubQuestionForm.value).subscribe((response) => {
      this.onClear(true);
    });

  }
  onChangeques(e) {
    console.log(e)
    this.vquestionId = e.questionId

  }
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  resetForm() {
    this.SubresultvaluesForm.reset();
  }


  ondel(index: number, element) {
    this.SubQueList.splice(index, 1);
    this.dsQuesList.data = this.SubQueList;

    Swal.fire({
      title: 'List Row Deleted Successfully',
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Ok!"
    }).then((result) => {
    
    });
  }


  onClear(val: boolean) {
    this.SubQuestionForm.reset();
    this.dialogRef.close(val);
  }

  getValidationMessages() {
    return {
      subQuestionName: [
        { name: "required", Message: "subQuestionName is required" },
        { name: "maxlength", Message: "subQuestionName should not be greater than 50 char." },
        { name: "pattern", Message: "Special char not allowed." }
      ],
      questionId: [],
      sequenceNo: [],
      sequenceNo1: [],
    };
  }
}





export class SubQuesList {
  subQuestionValId: any;
  questionId: any;
  subQuestionValName: any;
  sequenceNo: any;
  resultValues: any;
  shortcutValues: any;
  subQuestionId: any;
  ShortcutValues: any;
  SubQuestionId: any;
  SubQuestionValId: any;
  SubQuestionValName: any;
  SequenceNo: any;

  constructor(SubQuesList) {
    this.subQuestionValId = SubQuesList.subQuestionValId || 0;
    this.questionId = SubQuesList.questionId || 0;
    this.subQuestionValName = SubQuesList.subQuestionValName || '';
    this.sequenceNo = SubQuesList.sequenceNo || 0;

    this.resultValues = SubQuesList.resultValues || '';
    this.shortcutValues = SubQuesList.shortcutValues || '';
    this.SequenceNo = SubQuesList.SequenceNo || 0;

    this.ShortcutValues = SubQuesList.ShortcutValues || '';
    this.SubQuestionId = SubQuesList.SubQuestionId || 0;

    this.SubQuestionValId = SubQuesList.SubQuestionValId || 0;
    this.SubQuestionValName = SubQuesList.SubQuestionValName || '';
  }
}