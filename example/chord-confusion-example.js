(function() {
    var colorScale = d3.scale.ordinal()
    .domain([0, 1, 2])
    .range(["#d93240", "#638ca6", "#bfd4d9", "#0f5959", "#17a697"]);
  
    var matrix = [
      [26, 1, 0, 0, 1],
      [1, 21, 3, 1, 4],
      [0, 0, 20, 3, 2],
      [0, 1, 2, 15, 12],
      [9, 5, 7, 2, 7]
    ];
  
    var groups = ['A', 'B', 'C', 'D', 'E'];
  
    var chord = d3.select("#vis")
      .append("svg")
      .chart("ChordConfusionMatrix")
      .width(700)
      .height(700)
      .groups(groups)
      .matrix(matrix)
      .labels(true)
      .edgesColor('gray');
  
    chord.draw(colorScale);
  }());