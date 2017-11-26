(function() {
  var colorScale = d3.scale.ordinal()
  .domain([0, 1, 2])
  .range(["#233237", "#18121e", "#984b43", "#eac67a"]);

  var matrix = [
    [1423,574,1049,483],
    [1003,1658,1202,195],
    [635,1917,1604,1693],
    [958,206,1682,1220]
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