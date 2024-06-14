import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appFormfieldrequired]'
})
export class FormfieldrequiredDirective implements OnInit {

  @Input('appFormfieldrequired') errorMessage: string = 'This field is required'
  private errorSpan:any
  constructor(
    private el: ElementRef,
    private control: NgControl,
    private renderer:Renderer2
  ) { }

  ngOnInit(): void {
    this.errorSpan = this.renderer.createElement('span')
    this.renderer.addClass(this.errorSpan, 'error-message')
  this.renderer.setStyle(this.errorSpan, 'color', 'red');
    this.renderer.setStyle(this.errorSpan, 'font-size', '12px');
    this.renderer.setStyle(this.errorSpan, 'display', 'none');
    this.renderer.appendChild(this.el.nativeElement.parentElement,this.errorSpan)
  }

  @HostListener('blur')
  onBlur() {
    if ((this.control.hasError('required'))) {
      this.showError()
    } else {
      this.hideError()
    }
  }

  private showError() {
    this.renderer.setProperty(this.errorSpan, 'textContent', this.errorMessage)
    this.renderer.setStyle(this.errorSpan,'display','block')
  }
  private hideError() {
    this.renderer.setStyle(this.errorSpan,'display','none')
  }
}
