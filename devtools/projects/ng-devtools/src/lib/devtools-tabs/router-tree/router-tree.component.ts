/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {Events, MessageBus, Route} from 'protocol';

@Component({
  selector: 'ng-router-tree',
  templateUrl: './router-tree.component.html',
  styleUrls: ['./router-tree.component.scss'],
  standalone: true,
})
export class RouterTreeComponent implements AfterViewInit {
  @ViewChild('svgContainer', {static: false}) private svgContainer!: ElementRef;
  @ViewChild('mainGroup', {static: false}) private g!: ElementRef;

  @Input()
  set routes(routes: Route[]) {
    this._routes = routes;
    this.renderGraph();
  }

  showGraph = true;
  flattenedRoutes: any[] = [];
  private _routes: Route[] = [];
  private tree!: d3.TreeLayout<{}>;
  private tooltip: any;
  private searchString: string | undefined;
  private filterRegex = new RegExp('.^');

  constructor(private _messageBus: MessageBus<Events>) {}

  ngAfterViewInit(): void {
    this._messageBus.emit('getRoutes');
  }

  viewGraph($event: any): void {
    this.showGraph = $event.value === 'graph';
    if (this.showGraph) {
      setTimeout(() => this.renderGraph());
    } else {
      this.renderTable();
    }
  }

  renderTable() {
    this.flattenedRoutes = this.flattenedRoutes.map((r) => {
      const isMatched =
        this.filterRegex.test(r.path.toLowerCase()) || this.filterRegex.test(r.path.toLowerCase());
      if (isMatched) {
        return {...r, class: {'selected-route': true, 'active-route': r.isActive}};
      }
      return {...r, class: {'active-route': r.isActive}};
    });
  }

  searchRoutes($event: any) {
    this.searchString = $event.target.value;
    if (this.searchString) {
      this.filterRegex = new RegExp(this.searchString.toLowerCase() || '.^');
    } else {
      this.filterRegex = new RegExp('.^');
    }

    if (this.showGraph) {
      setTimeout(() => this.renderGraph());
    } else {
      this.renderTable();
    }
  }

  flattenRoutes(route: Route) {
    this.flattenedRoutes.push({...route, class: {'active-route': route?.isActive}});
    if (route.children && route.children?.length > 0) {
      route.children?.forEach((r) => this.flattenRoutes(r));
    }
  }

  renderGraph(): void {
    this.flattenedRoutes = [];
    if (this._routes && this._routes[0]) {
      this.flattenRoutes(this._routes[0]);
    }

    if (this._routes.length === 0 || !this.g) {
      return;
    }

    // cleanup old render
    this.tooltip?.remove?.();
    d3.select(this.g.nativeElement).selectAll('*').remove();

    this.tree = d3.tree();
    const svg = d3.select(this.svgContainer.nativeElement);
    svg.attr('height', 500).attr('width', 500);

    const g = d3.select(this.g.nativeElement);

    const svgPadding = 20;

    // Compute the new tree layout.
    this.tree.nodeSize([75, 200]);

    const root: any = this._routes[0];

    const nodes = this.tree(
      d3.hierarchy(
        root.children.length === 0 || root.children.length > 1 ? root : root.children[0],
        (d) => d.children,
      ),
    );

    // Define the div for the tooltip
    this.tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('padding', '0');

    g.selectAll('.link')
      .data(nodes.descendants().slice(1))
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr(
        'd',
        (d) => `
            M${d.y},${d.x}
            C${(d.y + (d as any).parent.y) / 2},
              ${d.x} ${(d.y + (d as any).parent.y) / 2},
              ${(d as any).parent.x} ${(d as any).parent.y},
              ${(d as any).parent.x}`,
      );

    // Declare the nodes
    const node = g
      .selectAll('g.node')
      .data(nodes.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .on('mouseover', (e: any, n: any) => {
        const content = `
          <b>Path:</b> ${n.data.path}<br/>
          <b>Title:</b> ${n.data.title || ''}<br/>
          <b>Path Match:</b> ${n.data.pathMatch}<br/>
          <b>Component:</b> ${n.data.component}<br/>
          <b>Providers:</b> ${n.data.providers || ''}<br/>
          <b>Children:</b> ${n.data.children?.length || ''}<br/>
          <b>Data:</b> ${n.data.data || ''}<br/>
          <b>Aux:</b> ${n.data.isAux}<br/>
          <b>Lazy:</b> ${n.data.isLazy}<br/>
        `;
        this.tooltip.style('padding', '6px 8px').transition().style('opacity', 0.9);
        this.tooltip.style('border', '1px solid #9dbced');
        this.tooltip
          .html(content)
          .style('left', e.pageX + 8 + 'px')
          .style('top', e.pageY + 8 + 'px');
      })
      .on('mouseout', () => this.tooltip.transition().style('opacity', 0))
      .attr('transform', (d) => `translate(${d.y},${d.x})`);

    node
      .append('circle')
      .attr('class', (d: any) => {
        let cssClass = 'node-route';
        if ((d.data as any).isAux) {
          cssClass = 'node-aux-route';
        } else if ((d.data as any).isLazy) {
          cssClass = 'node-lazy-route';
        }
        return cssClass;
      })
      .attr('r', 6);

    node
      .append('text')
      .attr('dy', (d) => (d.depth === 0 || !d.children ? '0.35em' : '-1.50em'))
      .attr('dx', (d: any): any => {
        if (d.parent && d.children) {
          return 6;
        } else if (!d.parent && d.children) {
          return -13;
        } else if (d.parent && !d.children) {
          return 13;
        }
      })
      .attr('class', (d: any) => {
        if (d.data.isActive) {
          return 'node-active';
        }

        const isMatched =
          this.filterRegex.test(d.data.path.toLowerCase()) ||
          this.filterRegex.test(d.data.path.toLowerCase());
        return isMatched ? 'node-search ' : '';
      })
      .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
      .text((d) => {
        const label = (d.data as any).path;
        // return label.length > 25 ? label.slice(0, 22) + '...' : label;
        return label;
      });

    // reset transform
    g.attr('transform', 'translate(0, 0)');

    const svgRect = this.svgContainer.nativeElement.getBoundingClientRect();
    const gElRect = this.g.nativeElement.getBoundingClientRect();

    g.attr(
      'transform',
      `translate(
        ${svgRect.left - gElRect.left + svgPadding},
        ${svgRect.top - gElRect.top + svgPadding}
      )`,
    );
    const height = gElRect.height + svgPadding * 2;
    const width = gElRect.width + svgPadding * 2;
    svg.attr('height', height).attr('width', width);
  }
}
