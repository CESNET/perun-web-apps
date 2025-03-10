import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tag-section',
  templateUrl: './tag-section.component.html',
  styleUrls: ['./tag-section.component.scss'],
})
export class TagSectionComponent {
  @Input()
  tags: string[][] = [];

  setDraggedText(event: DragEvent, tag: string): void {
    event.dataTransfer.setData('text/plain', '{' + tag + '}');
  }
}
