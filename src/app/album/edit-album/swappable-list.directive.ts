import { Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

const ID_ATTR = 'swapItemId';
const TARGET_IDENTIFIER = 'target_id';
const RANGE_CHECK = 150;
const STEP = 20;

@Directive({
  selector: '[appSwappableList]'
})
export class SwappableListDirective implements OnChanges {
  @Input() id!: number;
  @Input() dataList: unknown[] = [];
  el: HTMLElement;
  stop!: boolean;

  constructor(private ref: ElementRef) {
    this.el = ref.nativeElement;
    this.el.setAttribute('draggable', 'true');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.id) {
      this.el.setAttribute(ID_ATTR, String(this.id));
    }
  }

  @HostListener('drag', ['$event'])
  onDrag(event: DragEvent): void {
    // this.stop = true;
    // if (event.clientY < RANGE_CHECK) {
    //   // console.log('1');
    //   this.stop = false;
    //   this.scroll(-STEP);
    // }
    //
    // if (event.clientY > window.innerHeight - RANGE_CHECK) {
    //   // console.log('2');
    //   this.stop = false;
    //   this.scroll(+STEP);
    // }
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent): void {
    this.stop = true;
  }

  scroll(step: number): void {
    const scrollY = window.scrollY;
    window.scrollTo({ top: scrollY + step });
    if (!this.stop) {
      setTimeout(() => {
        this.scroll(step);
      }, 20);
    }
  }

  @HostListener('dragstart', ['$event'])
  onDragstart(event: DragEvent): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData(TARGET_IDENTIFIER, this.el.getAttribute(ID_ATTR) as string);
      event.dataTransfer.dropEffect = 'move';
      (event.currentTarget as HTMLElement).setAttribute('sourceSwap', '');
    }
  }

  @HostListener('dragend', ['$event'])
  onDragend(event: DragEvent): void {
    // console.log('end', event.currentTarget);
    // (event.currentTarget as HTMLElement).classList.remove('on-drag-enter');
    (event.currentTarget as HTMLElement).removeAttribute('sourceSwap');
  }

  @HostListener('dragenter', ['$event'])
  onDragenter(event: DragEvent): void {
    if (event.dataTransfer?.types.includes(TARGET_IDENTIFIER)) {
      if (event.target === event.currentTarget && !(event.currentTarget as HTMLElement).hasAttribute('sourceSwap')) {
        console.log('enter', event.currentTarget, event.dataTransfer.getData(TARGET_IDENTIFIER));
        (event.currentTarget as HTMLElement).classList.add('on-drag-enter');
        event.preventDefault();
      }
    }
  }

  @HostListener('dragleave', ['$event'])
  onDragleave(event: DragEvent): void {
    if (event.dataTransfer?.types.includes(TARGET_IDENTIFIER)) {
      if (event.target === event.currentTarget) {
        console.log('leave', event.currentTarget);
        (event.currentTarget as HTMLElement).classList.remove('on-drag-enter');
        event.preventDefault();
      }
    }
  }

  @HostListener('dragover', ['$event'])
  onDragover(event: DragEvent): void {
    if (event.dataTransfer?.types.includes(TARGET_IDENTIFIER)) {
      // (event.currentTarget as HTMLElement).classList.add('on-drag-enter');
      event.preventDefault();
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    const drop_target = event.currentTarget as HTMLElement;
    const drag_target_id = event.dataTransfer?.getData(TARGET_IDENTIFIER);
    const sourceIndex = Number(drag_target_id);
    const targetIndex = Number(drop_target.getAttribute(ID_ATTR));
    const tmp = this.dataList[targetIndex];
    this.dataList[targetIndex] = this.dataList[sourceIndex];
    this.dataList[sourceIndex] = tmp;
  }
}
