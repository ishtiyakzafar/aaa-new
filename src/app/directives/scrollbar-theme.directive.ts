import { NgModule, Directive, ElementRef } from '@angular/core';
@Directive({
  selector: '[appScrollbarTheme]'
})
export class ScrollbarThemeDirective {
  constructor(el: ElementRef) {
    const stylesheet = `
      ::-webkit-scrollbar {
        width: 4px;
        height: 4px;
        background-color: #F5F5F5;
      }
      ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: #F5F5F5;
      }
      ::-webkit-scrollbar-thumb {
        background-color: #2D197F;
      }
      ::-webkit-scrollbar-thumb:hover {
      }
    `;

    const styleElmt = el.nativeElement.shadowRoot.querySelector('style');

    if (styleElmt) {
      styleElmt.append(stylesheet);
    } else {
      const barStyle = document.createElement('style');
      barStyle.append(stylesheet);
      el.nativeElement.shadowRoot.appendChild(barStyle);
    }

  }
}


