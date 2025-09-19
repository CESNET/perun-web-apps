import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
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
import { MatInput, MatInputModule } from '@angular/material/input';
import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { GlobalSearchValueService } from '@perun-web-apps/perun/services';

@Component({
  imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-debounce-filter',
  templateUrl: './debounce-filter.component.html',
  styleUrls: ['./debounce-filter.component.scss'],
})
export class DebounceFilterComponent implements OnInit {
  @Input() placeholder: string;
  @Input() autoFocus = false;
  @Input() control: UntypedFormControl = new UntypedFormControl();
  @Input() error: string;
  @Input() linkGlobalSearch = false;
  @Output() filter = new EventEmitter<string>();
  @ViewChild('input', { static: true }) input: ElementRef<HTMLInputElement>;

  constructor(private globalSearchValueService: GlobalSearchValueService) {}

  ngOnInit(): void {
    if (this.linkGlobalSearch) {
      this.globalSearchValueService.getSearchString().subscribe((searchString: string) => {
        if (searchString?.length > 0) {
          this.control.setValue(searchString);
          this.filter.emit(searchString);
        }
      });
    }
    if (!this.linkGlobalSearch && this.autoFocus) this.input.nativeElement.focus();
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        map((event: KeyboardEvent) => {
          const target: MatInput = event.target as unknown as MatInput;
          return target.value;
        }),
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe((text: string) => {
        if (!this.control.invalid) {
          this.filter.emit(text.trim());
        }
      });
  }
}
