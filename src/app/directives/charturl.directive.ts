import { Directive,Input,ElementRef,Renderer2} from '@angular/core';

@Directive({
  selector: '[cachedSrc]'
})
export class CharturlDirective {
  @Input() 
  public get cachedSrc(): string {
     // console.log(this.elRef.nativeElement.src);
      return this.elRef.nativeElement.src;
  }
  public set cachedSrc(src: string) {
    if (this.elRef.nativeElement.src !== src) {
       // console.log(this.elRef.nativeElement);
         this.renderer.setAttribute(this.elRef.nativeElement, 'src', src);
          this.elRef.nativeElement.contentWindow.location.replace(src);
      }
  }

     constructor(
      private elRef: ElementRef,
      private renderer : Renderer2
      ) { }

}
