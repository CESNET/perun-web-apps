import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LinkerResult } from '@perun-web-apps/lib-linker';
import { ConsolidationResultComponent } from '@perun-web-apps/lib-linker';

@Component({
  imports: [CommonModule, MatButtonModule, TranslateModule, ConsolidationResultComponent],
  standalone: true,
  selector: 'perun-web-apps-show-result-page',
  templateUrl: './show-result-page.component.html',
  styleUrls: ['./show-result-page.component.css'],
})
export class ShowResultPageComponent implements OnInit {
  linkerResult: LinkerResult;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.linkerResult = params['result'] as LinkerResult;
    });
  }

  onClick(): void {
    void this.router.navigate(['/consolidate'], {
      queryParamsHandling: 'merge',
    });
  }
}
