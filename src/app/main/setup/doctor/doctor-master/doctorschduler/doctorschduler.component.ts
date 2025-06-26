import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctorschduler',
  templateUrl: './doctorschduler.component.html',
  styleUrls: ['./doctorschduler.component.scss']
})
export class DoctorschdulerComponent {
  startTime: string = '09:00'; // default 9:00 AM
  endTime: string = '00:00';  // default 12:00 AM
  timeSlots: string[] = [];
  screenFromString = 'Common-form';
  updateTimeSlots(): void {
    this.timeSlots = []; // Clear previous

    const [startH, startM] = this.startTime.split(':').map(Number);
    const [endH, endM] = this.endTime.split(':').map(Number);

    const start = new Date();
    start.setHours(startH, startM, 0, 0);

    const end = new Date();
    end.setHours(endH, endM, 0, 0);

    // If end time is midnight (00:00), move to next day
    if (endH === 0 && endM === 0) {
      end.setDate(end.getDate() + 1);
    }

    while (start < end) {
      const hours = start.getHours();
      const minutes = start.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hr12 = hours % 12 === 0 ? 12 : hours % 12;
      const minStr = minutes.toString().padStart(2, '0');
      const timeStr = `${hr12}:${minStr} ${ampm}`;
      this.timeSlots.push(timeStr);
      start.setMinutes(start.getMinutes() + 15);
    }

    //  if(){
    //   this.chkstatus=true
    //  }
  }
  chkstatus: boolean = false
  appointmentForm: FormGroup;
  departments = ['Diabetology', 'Cardiology', 'Neurology'];
  physicians = ['Dr. Jotsna', 'Dr. Arun', 'Dr. Mehta'];
  visitTypes = ['Clinic', 'Video', 'Home Visit With Physician', 'Home Visit Without Physician'];
  availableSlots =
    [
      '2:45 PM', '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM',
      '4:00 PM', '4:15 PM', '4:30 PM', '4:45 PM', '5:00 PM',
      '5:15 PM', '5:30 PM', '6:00 PM', '6:15 PM',
      '6:45 PM', '7:00 PM', '7:15 PM'
    ];

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<DoctorschdulerComponent>) {
    this.appointmentForm = this.fb.group({
      department: [''],
      physician: [''],
      date: [''],
      visitType: ['']
    });
  }

  selectSlot(time: string) {
    debugger
    console.log('Selected time slot:', time);
    Swal.fire('Selected time slot:', time)

    // if (time = '11')
    //   this.chkstatus = true
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }


  onClose() {
    this.dialogRef.close();
  }
}
