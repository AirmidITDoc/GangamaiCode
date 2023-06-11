import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appValidateCharlength]'
})
export class ValidateCharlengthDirective {

  @Input() appValidateCharlength: string;
  constructor(private el: ElementRef ) { }


  // @HostListener("keydown", ["$event"]) onKeydown(event) {
  //   const value = event.target.value;
  //   const maxLength = parseInt(this.appChkCharlength);
  //   if (value.length > maxLength -1) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //   }
  // }

  
  @HostListener("keydown", ["$event"]) onKeydown(event) {
debugger;
    console.log(this.appValidateCharlength);

    let count = this.el.nativeElement.value.length
    console.log(this.el.nativeElement.value.length);
    // if(count < 5) {
    //     this.el.nativeElement.style.backgroundColor = 'red'
    // } else if(count >= 5 && count <= 10) {
    //     this.el.nativeElement.style.backgroundColor = 'green'
    // } else if(count > 10) {
    //     this.el.nativeElement.style.backgroundColor = 'purple'
    // }


    if(count >= this.appValidateCharlength) {
      // this.el.nativeElement.style.backgroundColor = 'red'
      event.preventDefault();
          event.stopPropagation();
  } 

  }
}