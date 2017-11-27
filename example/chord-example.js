(function() {
  var colorScale = d3.scale.ordinal()
  .domain([0, 1, 2])
  .range(["#233237", "#18121e", "#984b43", "#eac67a"]);
  
  var matrix = [
    [1, 0, 4, 2],
    [1, 2, 3, 4],
    [4, 1, 0, 2],
    [0, 1, 3, 4]
  ];

  var groups = ['A', 'B', 'C', 'D'];

  var chord = d3.select("#vis")
    .append("svg")
    .chart("ChordMatrix")
    .width(700)
    .height(700)
    .groups(groups)
    .matrix(matrix);

  chord.draw(colorScale);
}());