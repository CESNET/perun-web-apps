import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
let UiMaterialModule = class UiMaterialModule {
};
UiMaterialModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            MatCardModule,
            MatDividerModule,
            MatExpansionModule,
            MatButtonModule,
            MatGridListModule,
            MatCheckboxModule,
            MatIconModule,
            MatTableModule,
            MatDialogModule,
            MatProgressSpinnerModule,
            MatFormFieldModule,
            MatInputModule,
            ScrollingModule,
            FormsModule,
            ReactiveFormsModule,
            MatStepperModule,
        ],
        exports: [
            MatCardModule,
            MatDividerModule,
            MatExpansionModule,
            MatButtonModule,
            MatGridListModule,
            MatCheckboxModule,
            MatIconModule,
            MatTableModule,
            MatDialogModule,
            MatProgressSpinnerModule,
            MatFormFieldModule,
            MatInputModule,
            ScrollingModule,
            FormsModule,
            ReactiveFormsModule,
            MatStepperModule,
        ]
    })
], UiMaterialModule);
export { UiMaterialModule };
//# sourceMappingURL=ui-material.module.js.map