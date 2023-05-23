import { Directive, ElementRef, HostListener, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Directive({
  selector: '[appCharmaxLength]',
  
})
export class CharmaxLengthDirective {
  @Input() appCharmaxLength: string;
  

  @Input() otherInput: string;
  @Input('appCharmaxLength') limitTo; 

  constructor(private el: ElementRef    
    ) {
    console.log(this.otherInput);
    console.log(this.appCharmaxLength);
    
  }

  // @HostListener("keydown", ["$event"]) onKeydown(event) {
  //   const value = event.target.value;
  //   const maxLength = parseInt(this.appMaxLength);
  //   if (value.length > maxLength -1) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //   }
  // }



  // @HostListener("window:keyup") ngOnChanges(event) {

  //   let count = this.el.nativeElement.value.length
  //   console.log(this.el.nativeElement.value.length);
  //   if(count < 5) {
  //       this.el.nativeElement.style.backgroundColor = 'red'
  //   } else if(count >= 5 && count <= 10) {
  //       this.el.nativeElement.style.backgroundColor = 'green'
  //   } else if(count > 10) {
  //       this.el.nativeElement.style.backgroundColor = 'purple'
  //   }

  // }

  @HostListener("keydown", ["$event"]) onKeydown(event) {
    debugger;
    // console.log(event);
    let count = this.el.nativeElement.value.length;
    console.log(this.el.nativeElement.value.length);
    if(count >12) {
        // this.el.nativeElement.style.backgroundColor = 'red'
        event.preventDefault();
            event.stopPropagation();
    } 

  }

}
