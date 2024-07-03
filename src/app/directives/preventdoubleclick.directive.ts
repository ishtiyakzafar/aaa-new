import { Subject, Subscription } from 'rxjs';
import { Directive, Input, ElementRef, Renderer2, Output, HostListener, EventEmitter } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appDebounceClick]' //To prevent double click on button
})
export class PreventDoubleClickDirective {
  @Input()
  debounceTime = 500;

  @Output()
  debounceClick = new EventEmitter();

  private clicks = new Subject();
  private subscription: Subscription | undefined;

  constructor() { }

  ngOnInit() {
    this.subscription = this.clicks.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(e => this.debounceClick.emit(e));
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}
