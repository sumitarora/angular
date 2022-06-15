declare const vis: any;
import * as d3 from 'd3';

export interface InjectorTreeGraphNode {}
export interface InjectorTreeGraphEdges {}

const typeToClass = {
  Module: 'node-module',
  Element: 'node-element',
  NullInjector: 'node-null'
}


export class InjectorTreeGraph {
  nodes: InjectorTreeGraphNode[] = []
  edges: InjectorTreeGraphEdges[] = [];

  constructor(private _containerElement: HTMLElement, private _graphElement: HTMLElement) {}

  update(injectorGraph: any) {
    this.render(injectorGraph);
  }

  render(injectorGraph): void {
    // cleanup old render
    d3.select(this._graphElement).selectAll('*').remove();

    const tree = d3.tree();
    const svg = d3.select(this._containerElement);
    svg.attr('height', 500).attr('width', 500);

    const g = d3.select(this._graphElement);
    (window as any).g = g;

    const svgPadding = 20;

    // Compute the new tree layout.
    tree.nodeSize([50, 145]);

    const root: any = injectorGraph[0];

    const nodes = tree(d3.hierarchy(root, (d) => d.children));

    g.selectAll('.link')
        .data(nodes.descendants().slice(1))
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', (d) => {return `
              M${d.y},${d.x}
              C${(d.y + (d as any).parent.y) / 2},
                ${d.x} ${(d.y + (d as any).parent.y) / 2},
                ${(d as any).parent.x} ${(d as any).parent.y},
                ${(d as any).parent.x}`});

    // Declare the nodes
    const node = g.selectAll('g.node')
                     .data(nodes.descendants())
                     .enter()
                     .append('g')
                     .attr('class', 'node')
                     .on('mouseover',
                         (n) => {
                             // const content = `<b>Name:</b> ${n.injector.owner}<br/>`;
                         })
                     .attr('transform', (d) => `translate(${d.y},${d.x})`);

    node.append('circle')
        .attr(
            'class',
            (d) => {
              console.log(d);
              return typeToClass[d.data.injector.type] ?? ''
            })
        .attr('r', 6);

    node.append('text')
        .attr('dy', (d) => (d.depth === 0 || !d.children ? '0.35em' : '-1.50em'))
        .attr(
            'dx',
            (d: any):
                any => {
                  if (d.parent && d.children) {
                    return 6;
                  } else if (!d.parent && d.children) {
                    return -13;
                  } else if (d.parent && !d.children) {
                    return 13;
                  }
                })
        .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
        .text((d) => {
          const label = d.data.injector.owner;
          return label.length > 20 ? label.slice(0, 17) + '...' : label;
        });

    // reset transform
    g.attr('transform', 'translate(0, 0)');

    const svgRect = this._containerElement.getBoundingClientRect();
    const gElRect = this._graphElement.getBoundingClientRect();

    g.attr('transform', `translate(
          ${svgRect.left - gElRect.left + svgPadding},
          ${svgRect.top - gElRect.top + svgPadding}
        )`);
    const height = gElRect.height + svgPadding * 2;
    const width = gElRect.width + svgPadding * 2;
    svg.attr('height', height).attr('width', width);
  }
}