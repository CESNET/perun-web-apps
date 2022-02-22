import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { MatInput } from '@angular/material/input';
import { FromEventTarget } from 'rxjs/internal/observable/fromEvent';

@Component({
  selector: 'perun-web-apps-debounce-filter',
  templateUrl: './debounce-filter.component.html',
  styleUrls: ['./debounce-filter.component.scss'],
})
export class DebounceFilterComponent implements OnInit {
  @Input() placeholder: string;
  @Output() filter = new EventEmitter<string>();
  @ViewChild('groupFilterInput', { static: true }) groupFilterInput: ElementRef;

  ngOnInit(): void {
    fromEvent(this.groupFilterInput.nativeElement as FromEventTarget<KeyboardEvent>, 'keyup')
      .pipe(
        map((event: KeyboardEvent) => {
          const target: MatInput = event.target as unknown as MatInput;
          return target.value;
        }),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        this.filter.emit(text);
      });
  }
}
