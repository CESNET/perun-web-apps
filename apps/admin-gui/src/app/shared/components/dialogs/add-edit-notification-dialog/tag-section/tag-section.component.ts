import { TranslateModule } from '@ngx-translate/core';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  imports: [CommonModule, MatIconModule, MatExpansionModule, MatDivider, TranslateModule],
  standalone: true,
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
