import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SchdulerComponent } from '../scheduler.component';

@Component({
  selector: 'app-managescheduler',
  templateUrl: './managescheduler.component.html',
  styleUrls: ['./managescheduler.component.scss']
})
export class ManageschedulerComponent implements OnInit {
  searchFormGroup: FormGroup;
  Dailydisplay:boolean=true;
  Weeklydisplay:boolean=false;
  Monthlydisplay:boolean=false;
  Customdisplay:boolean=false;
  Weekdaysdisplay:'';
   weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  constructor(private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<SchdulerComponent>) { }

  ngOnInit(): void {
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
