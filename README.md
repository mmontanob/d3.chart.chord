# Chord Matrix

Chord chart to represent relationship results from a matrix. See examples in the `example` folder.

For example:
<div>
  <img src="https://imgur.com/Q3Z8vLk.png" width="300" style="display: inline-block" />
  <img src="https://imgur.com/sLzmKC2.png" width="300" style="display: inline-block" />
</div>

### Sample Use

```javascript
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
```

### API

Sample API Documentation:

#### `<instance>.groups(newGroups)`

**Description:**

If it has `newGroups` as parameter it sets `newGroups` as the name of the groups in the chart; otherwise, it returns the current groups.

**Parameters:**

* `newGroups` - String array with the name of the groups in the chart.

**Uses:**

Example:

```javascript
var chart = d3.select("#vis")
  .append("svg")
  .chart("ChordMatrix")
  .groups(['A', 'B', 'C', 'D']);
```

#### `<instance>.matrix(newMatrix)`

**Description:**

If it has `newMatrix` as parameter it sets `newMatrix` as the data to create the chart; otherwise, it returns the current matrix.

**Parameters:**

* `newMatrix` - Square numeric matrix.

**Uses:**

Example:

```javascript
var chart = d3.select("#vis")
  .append("svg")
  .chart("ChordMatrix")
  .matrix([
    [1423,574,1049,483],
    [1003,1658,1202,195],
    [635,1917,1604,1693],
    [958,206,1682,1220]
  ]);
```

#### `<instance>.labels(value)`

**Description:**

Sets if the chart should display the labels for the groups.

**Parameters:**

* `value` - A boolean.

**Uses:**

Example:

```javascript
var chart = d3.select("#vis")
  .append("svg")
  .chart("ChordMatrix")
  .labels(true);
```

### Events

There're no events defined for this chart.

## Extensions

### Chord Confusion Matrix

#### Sample Use

```javascript
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
  .edgesColor('gray');

chord.draw(colorScale);
```