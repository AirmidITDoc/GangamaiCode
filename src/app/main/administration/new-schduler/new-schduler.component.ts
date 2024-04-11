import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-schduler',
  templateUrl: './new-schduler.component.html',
  styleUrls: ['./new-schduler.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewSchdulerComponent implements OnInit {
  searchFormGroup: FormGroup;
  Dailydisplay:boolean=true;
  Weeklydisplay:boolean=false;
  Monthlydisplay:boolean=false;
  Customdisplay:boolean=false;
  Weekdaysdisplay:'';
   weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  constructor(private formBuilder: FormBuilder,
    private _ActRoute: Router,
    private dialogRef: MatDialogRef<NewSchdulerComponent>,) { }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();
    // this.highlightCurrentWeekday();
  }


  createSearchForm() {
    return this.formBuilder.group({
      schduleRadio: ['1'],
      DailyHours:[''],
      Weekdays: [''],
      WeekHours: [''],
      Monthdate: [''],
      MonthHours: [''],
      Customdate: [''],
      CustomHours: [''],
      Query:['']

    });
  }
  
  // highlightCurrentWeekday() {
  //   var weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  //   var currentWeekday = weekdays[new Date().getDay()];
  //   var span = document.getElementById(currentWeekday);
  //   span.classList.add('highlight');
  // }

   getValue($event) {
    console.log($event.value)
   }



  onChangeschduleRadio(event){

      if (event.value == '1') {
      this.Dailydisplay = true;
      this.Weeklydisplay = false;
      this.Monthlydisplay = false;
      this.Customdisplay = false;
      } 
      else if (event.value == '2') {
      this.Weeklydisplay = true;
      this.Monthlydisplay = false;
      this.Dailydisplay = false;
      this.Customdisplay = false;

      } 
      else if (event.value == '3') {
      this.Monthlydisplay = true;
      this.Weeklydisplay = false;
      this.Dailydisplay = false;
      this.Customdisplay = false;


      } else if(event.value == '4') {
      this.Customdisplay = true;
      this.Weeklydisplay = false;
      this.Monthlydisplay = false;
      this.Dailydisplay = false;
     

      }
  }

  onSubmit(){}

  onClear(){
   this.searchFormGroup.reset();
  }

  onClose(){
    this.dialogRef.close();
  }
}
