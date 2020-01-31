import * as d3 from 'd3';
import { tokenizr } from './tokenizr';
import { parse } from './parser';
import { rpn_exec } from './rpn';
import { tree_build } from './tree';
import { isValidSyntax, isOperator } from './utils';
import { RPN } from './types';

const input = <HTMLInputElement>document.getElementById('expression');
const result = <HTMLDivElement>document.getElementById('result');

input.addEventListener('input', function () {
  render(this.value);
});

window.addEventListener('resize', () => {
  render(input.value);
})

render(input.value);

function render(input: string) {
  const tokens = tokenizr(input);

  if (!isValidSyntax(tokens)) {
    return;
  }

  const rpn = parse(tokens);
  const root = rpnToD3Tree(rpn);
  const value = rpn_exec(rpn);

  console.log('Tokens', tokens);
  console.log('RPN', rpn);
  console.log('Tree', tree_build(rpn))

  document.querySelectorAll('svg').forEach((selector) => selector.remove());
  result.textContent = String(value);

  var margin = { top: 60, right: 10, bottom: 60, left: 10 },
    width = document.body.clientWidth - 60 - margin.left - margin.right,
    height = document.body.clientHeight - 60 - margin.top - margin.bottom;

  var orientations = {
    "bottom-to-top": {
      size: [width, height],
      x: function (d: any) { return d.x; },
      y: function (d: any) { return height - d.y; }
    }
  };

  var svg = d3.select("body").selectAll("svg")
    .data(d3.entries(orientations))
    .enter().append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.each(function (orientation) {
    var svg = d3.select(this),
      o = orientation.value;

    // Compute the layout.
    var treemap = d3.tree().size([o.size[0], o.size[1]]);

    var nodes = d3.hierarchy(root);
    nodes = treemap(nodes);

    var links = nodes.descendants().slice(1);

    // Create the link lines.
    svg.selectAll(".link")
      .data(links)
      .enter().append("path")
      .attr("class", "link")
      .attr("d", function (d: any) {
        return "M" + d.x + "," + o.y(d)
          + "C" + d.x + "," + (o.y(d) + o.y(d.parent)) / 2
          + " " + d.parent.x + "," + (o.y(d) + o.y(d.parent)) / 2
          + " " + d.parent.x + "," + o.y(d.parent);
      });

    // Create the node circles.
    var node = svg.selectAll(".node")
      .data(nodes.descendants())
      .enter()
      .append("g")
    node.append("circle")
      .attr("class", "node")
      .attr("r", 4.5)
      .attr("cx", o.x)
      .attr("cy", o.y);


    node.append("text")
      .text(function (d) { return d.data.name; })
      .attr('class', (d: any) => typeof d.data.name === 'number' ? 'operand' : 'operator')
      .attr("x", o.x)
      .attr("dx", 10)
      .attr("y", o.y)
      .attr('dy', 4)
  });
}

function rpnToD3Tree(rpn: RPN) {
  let stack: any[] = [];

  for (let t of rpn) {
    if (typeof t === "number") {
      stack.push(t);
    } else {
      let r = stack.pop();
      let l = stack.pop();
      let name;

      if (isOperator(t)) {
        name = ({
          '*': 'mul',
          '+': 'sum',
          '-': 'sub',
          '/': 'div',
          '^': 'pow'
        })[t];
      } else {
        name = t;
      }

      stack.push({
        name,
        children: [typeof l === 'number' ? { name: l } : l, typeof r === 'number' ? { name: r } : r]
      });
    }
  }

  return stack[0];
}