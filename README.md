# Chord Matrix

Chord chart to represent relationship results from a matrix.

### Sample Use

> TBD

### API

> TBD 

Sample API Documentation:

#### `<instance>.highlight(value)`

**Description:**

Allows the highlighting of a specific value

**Parameters:**

* `value` - The value to highlight.

**Uses:**

Example:

```javascript
var chart = d3.select("#vis")
  .append("svg")
  .chart("MyEpicChart")
  .higlight(12);
```

### Events

Sample Event Documentation:

#### `brush`

**Description:**

Broadcast when a circle on the chart is being mousedover

**Arguments:**

* `value` - The value corresponding to the circle being mousedover.

**Uses:**

Example:

```javascript
var chart = d3.select("#vis")
  .append("svg")
  .chart("MyEpicChart");

chart.on("brush", function(value) {
  // handle event...
});
```