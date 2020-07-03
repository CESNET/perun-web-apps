import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { graphviz } from 'd3-graphviz';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
let VisualizerAttrModulesComponent = class VisualizerAttrModulesComponent {
    constructor(attributesManager) {
        this.attributesManager = attributesManager;
    }
    ngOnInit() {
        this.attributesManager.getAttributeModulesDependenciesGraphText('DOT').subscribe(data => {
            const graphData = data.graph
                .replace('\\t', '')
                .replace('\\n', '')
                .replace('\\', '');
            graphviz('#dependenciesGraph', { zoom: false })
                .renderDot(graphData);
        });
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], VisualizerAttrModulesComponent.prototype, "true", void 0);
VisualizerAttrModulesComponent = __decorate([
    Component({
        selector: 'app-visualizer-attr-modules',
        templateUrl: './visualizer-attr-modules.component.html',
        styleUrls: ['./visualizer-attr-modules.component.scss']
    }),
    __metadata("design:paramtypes", [AttributesManagerService])
], VisualizerAttrModulesComponent);
export { VisualizerAttrModulesComponent };
//# sourceMappingURL=visualizer-attr-modules.component.js.map