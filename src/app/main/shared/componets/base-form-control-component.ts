import { Directive, ElementRef, HostListener } from '@angular/core';
@Directive()
export abstract class BaseFormControlComponent {
  constructor(private el: ElementRef) {}

  @HostListener('keydown.enter', ['$event'])
  handleEnter(event: KeyboardEvent) {
    event.preventDefault();
    this.focusNextControl();
  }

  protected focusNextControl() {
    const formControls = Array.from(
      document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        'input, select, textarea, [tabindex]'
      )
    ).filter(el => !el.hasAttribute('disabled')&&!el.classList.contains('mdc-icon-button') && el.tabIndex >= 0);

    const current = this.el.nativeElement.querySelector('input, select, textarea, [tabindex]');
    const currentIndex = formControls.indexOf(current);
    if (currentIndex > -1 && currentIndex < formControls.length - 1) {
      formControls[currentIndex + 1].focus();
    }
  }
}