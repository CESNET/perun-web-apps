import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[perunWebAppsAutoFocus]',
})
export class AutoFocusDirective implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    const elem: HTMLInputElement = this.elementRef.nativeElement as HTMLInputElement;
    elem.focus();
  }
}
