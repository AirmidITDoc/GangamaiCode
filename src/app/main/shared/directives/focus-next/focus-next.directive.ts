import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[appFocusNext]'
})
export class FocusNextDirective implements AfterViewInit {
  private formElements: Array<HTMLElement> = [];

  @Input() name: string; // FormControlName
  @Input() formGroup: FormGroup;
  constructor(private el: ElementRef) {
  }

  ngAfterViewInit(): void {
    const modalElement = document.querySelector("mat-dialog-container");
    const parentElement = modalElement ? modalElement : document.body;

    this.formElements = Array.from(parentElement.querySelectorAll("input, mat-select, button"));
  }
  @HostListener("keydown.enter", ['$event'])
  handleEnter(event: KeyboardEvent): void {
    event.preventDefault();
    this.focusNext();
  }

  @HostListener("selectionChange", ['$event'])
  handleSelectionChange(): void {
    this.focusNext();
  }

  // focusNext(): void {
  //   if (!this.formElements.length) return;

  //   const control = this.formGroup?.get(this.name);
  //   if (control && !control.valid) return;

  //   let currentIndex = this.formElements.indexOf(this.el.nativeElement);
  //   let nextElement: HTMLElement | null = null;
  //   // Loop to find the next non-readonly, focusable element

  //   while (currentIndex < this.formElements.length - 1) {
  //     currentIndex++;
  //     const potentialElement = this.formElements[currentIndex];

  //     // Skip elements that are readonly or disabled
  //     if (potentialElement  && !potentialElement.hasAttribute('readonly') && !potentialElement.hasAttribute('disabled')) {
  //       nextElement = potentialElement;
  //       break;
  //     }

  //     // If no valid element is found, nextElement remains null
  //     nextElement = null;

  //   }
  //   if (nextElement) {
  //     setTimeout(() => {
  //       if (nextElement.tagName.toLowerCase() === 'input' || nextElement.tagName.toLowerCase() === 'button') {
  //         nextElement.focus();
  //       } else if (nextElement.tagName.toLowerCase() === 'mat-select') {
  //         nextElement.click();
  //       }
  //     }, 100);
  //   }
  // }
  focusNext(): void {
    if (!this.formElements.length) return;

    const control = this.formGroup?.get(this.name);
    if (control?.invalid) return;

    // Findin the next element.
    let nextElement = this.formElements
      .slice(this.formElements.indexOf(this.el.nativeElement) + 1)
      .find(el => el && !el.hasAttribute('readonly') && !el.hasAttribute('disabled'));

    if (nextElement) {
      setTimeout(() => {
        const tagName = nextElement.tagName.toLowerCase();
        if (['input', 'textarea', 'button'].includes(tagName)) {
          nextElement.focus();
        } else if (tagName === 'mat-select') {
          nextElement.click();
        }
      }, 100);
    }
  }

}
