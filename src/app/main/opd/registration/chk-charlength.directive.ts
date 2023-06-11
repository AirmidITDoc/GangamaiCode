import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appChkCharlength]'
})
export class ChkCharlengthDirective {
  @Input() appChkCharlength: string;
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
    console.log(this.appChkCharlength);

    let count = this.el.nativeElement.value.length
    console.log(this.el.nativeElement.value.length);
       if(count >= this.appChkCharlength) {
      this.el.nativeElement.style.backgroundColor = 'pink'
      event.preventDefault();
          event.stopPropagation();
          // this.el.nativeElement.nextElementSibling.focus;
          // event.nextElementSibling();
  } 

  }


// debugger;
//   @HostListener('keyup', ['$event']) onKeyDown(keyboardEvent: KeyboardEvent) {
//     const target = keyboardEvent.target as
//       | HTMLInputElement
//       | HTMLTextAreaElement
//       | null;

//     if (!target || target.maxLength !== target.value.length) return;

//     keyboardEvent.preventDefault();

//     const { type } = target;
//     let { nextElementSibling } = target;

//     while (nextElementSibling) {
//       if (
//         (nextElementSibling as HTMLInputElement | HTMLTextAreaElement).type ===
//         type
//       ) {
//         (nextElementSibling as HTMLInputElement | HTMLTextAreaElement).focus();
//         return;
//       }

//       nextElementSibling = nextElementSibling.nextElementSibling;
//     }
//   }
}
