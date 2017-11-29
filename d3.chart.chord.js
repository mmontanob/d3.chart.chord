/*! d3.chart.chord - v0.0.1
 *  License: MIT
 *  Date: 2017-11-28
 */
d3.chart('ChordMatrix', {
  initialize: function() {
    var chart = this;

    // assign a top level class to the chart
    chart.base.classed('ChordMatrix', true);

    // default height and width from container.
    chart.w = chart.base.attr('width');
    chart.h = chart.base.attr('height');
    chart.focus = null;

    // default matrix
    chart.mtx = chart.mtx? chart.mtx : [];

    // Draw chart
    var chordBase = chart.base
      .append('g')
      .classed('chart', true);
    var chord = d3.svg.chord();
    chart.total = 100;

    chart.grps = chart.grps? chart.grps : [];

    // Arc Centers
    chart.centers = [];
    chart.selfTotals = [];
    chart.edgColor = 'gray';

    // Labels
    chart.hasLabels = false;
    
    var chordLayer = chart.layer('chart', chordBase, {
      
      // the data is a d3 color scale!
      dataBind : function(scale) {

        // save scale
        chart.scale = scale;
        chordBase.attr('transform', 'translate(' + chart.w / 2 + ',' + chart.h / 2 + ')');
        chart.radius();

        var layout = d3.layout.chord()
        .sortGroups(d3.descending)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending)
        .padding(0.04);

        var padding = (chart.grps.length - 1) * 10;
        var labels = chart.hasLabels? 10 : 0;
        // The arc generator, for the groups.
        var arc = d3.svg.arc()
        .innerRadius(chart.innerRadius - padding - labels)
        .outerRadius(chart.outerRadius - labels);
  
        // The chord generator (quadratic Bézier), for the chords.
        chord.radius(chart.innerRadius - padding - labels);
        
        layout.matrix(chart.mtx);

        // Add groups.
        var g = this.selectAll('.group')
        .data(layout.groups)
        .enter().append('g')
        .attr('class', 'group');

        function _handleMouseOver(d) {
          chart.focus = d.index;
          chart.draw(chart.scale);
        }

        function _handleMouseOut() {
          chart.focus = null;
          chart.draw(chart.scale);
        }

        // Add the group arc.
        g.append('path')
        .style('fill', '#e6e9f0')
        .attr('id', function(d) { return 'group' + d.index; })
        .attr('d', function(d) {
          chart.centers[d.index] = [d.startAngle, d.endAngle];
          return arc(d);
        })
        .on("mouseover", _handleMouseOver)
        .on("mouseout", _handleMouseOut)
        .append('title')
        .text(function(d) { 
          return chart.grps[d.index];
        });

        chart.grps.forEach((grp, i) => {
          var padding = 10 * (i + (chart.hasLabels? 1 : 0));
          var arc2 = d3.svg.arc()
          .innerRadius(chart.innerRadius - padding)
          .outerRadius(chart.outerRadius - padding);
          // Add the group arc.
          g.append('path')
          .style('fill', function(d) {
            return chart.scale(i);
          })
          .style('stroke', function(d) {
            return d3.rgb(chart.scale(i)).darker();
          })
          .attr('id', function(d) { return 'group-bar' + d.index + '-' + i; })
          .attr('d', function(d) {
            var size = d.endAngle - d.startAngle;
            var perc = chart.percs[d.index][i];
            arc2.endAngle(d.startAngle + (size * perc));
            return arc2(d);
          })
          .on("mouseover", _handleMouseOver)
          .on("mouseout", _handleMouseOut)
          .append('title')
          .text(function(d) { 
            return chart.grps[i] + " = " + (
              i == d.index? chart.selfTotals[i] :
              chart.mtx[d.index][i]
            );
          });
        });

        // Add labels
        if (chart.hasLabels) {
          g.append("text")
          .attr("font-family", "sans-serif")
          .attr("x", function(d) {
            var angle = (d.endAngle - d.startAngle) / (2 * Math.PI);
            return Math.PI * chart.innerRadius * angle;
          })
          .attr("dy", -2)
          .filter(function(d) { 
            return 0.1 <= (d.value / chart.total);
           })
          .append("textPath")
          .attr("xlink:href", function(d) { return '#group' + d.index; })
          .text(function(d) { return chart.grps[d.index]; });
        }

        return this.selectAll('.chord')
        .data(layout.chords);
        
      },
      insert: function() {
        // Add chords
        return this.append('path')
        .attr('class', 'chord');
      }
    });  

    function _onMatrixEnter() {
      return this
      .style('fill', chart.edgColor)
      .style('opacity', function(d) {
        if (typeof chart.focus == 'number' && 
          d.source.index != chart.focus &&
          d.source.subindex != chart.focus) {
          return '0.1';
        }
        return '0.75';
      })
      .filter(chart.filterPaths)
      .attr('d', function(d) {
        return chart.createChord(d, chord);
      })
      .append('title')
      .text(function(d) {
        var txt = d.source.value + ' ' + chart.grps[d.source.index] + ' as ' + chart.grps[d.source.subindex]; 
        if (d.source.index != d.target.index) {
          txt += ', ' + d.target.value + ' ' + chart.grps[d.target.index] + ' as ' + chart.grps[d.target.subindex]; 
        } 
        return txt;
      });
    }
    chordLayer.on('enter', _onMatrixEnter);
    chordLayer.on('update', _onMatrixEnter);
  },
  // Sets or gets edges color
  edgesColor: function(newColor) {
    if (!arguments.length) {
      return this.edgColor;
    }
    this.edgColor = newColor;
    
    // only repaint if we have data (in this case the scale)
    if (this.scale) { this.draw(this.scale); }

    return this;
  },
  // Creates a chord 
  createChord: function(d, chord) {
    return chord(d);
  },
  // Filter paths
  filterPaths: function(d) {
    return true;
  },
  // Calculates radius
  radius: function() {
    this.outerRadius = Math.min(this.w, this.h) / 2 - 4;
    this.innerRadius = this.outerRadius - 10;
  },
  // Sets the groups
  groups: function(newGroups) {
    if (!arguments.length) {
      return this.groups;
    }
    this.grps = newGroups;
    
    // only repaint if we have data (in this case the scale)
    if (this.scale) { this.draw(this.scale); }

    return this;
  },
  // Updates or sets width 
  width : function(newWidth) {
    if (!arguments.length) {
      return this.w;
    }
    // save new width
    this.w = newWidth;

    // adjust the x scale range
    this.x =  d3.scale.linear()
      .range([0, this.w]);

    // adjust the base width
    this.base.attr('width', this.w);

    // only repaint if we have data (in this case the scale)
    if (this.scale) { this.draw(this.scale); }

    return this;
  },
  // Updates or sets height
  height : function(newHeight) {
    if (!arguments.length) {
      return this.h;
    }

    // save new height
    this.h = newHeight;

    // adjust the base width
    this.base.attr('height', this.h);

    // only repaint if we have data (in this case the scale)
    if (this.scale) { this.draw(this.scale); }

    return this;
  },
  calcMaxError: function() {
    this.maxError = 0;
    this.selfTotals = this.mtx.map((r, i) => r[i]);
  },
  // Updates or sets matrix
  matrix : function(newMatrix) {
    if (!arguments.length) {
      return this.mtx;
    }
    // save new matrix
    this.mtx = newMatrix.map(r => r.slice());
    var totals = this.mtx.map(row => row.reduce((a, b) => a + b));
    this.percs = this.mtx.map((row, i) => row.map((col) => col / totals[i]));
    this.total = totals.reduce((a, b) => a + b);
    this.calcMaxError();
    // only repaint if we have data (in this case the scale)
    if (this.scale) { this.draw(this.scale); }

    return this;
  },
  labels: function(value) {
    if (!arguments.length) {
      return this.hasLabels;
    }
    this.hasLabels = value;
    // only repaint if we have data (in this case the scale)
    if (this.scale) { this.draw(this.scale); }
    
    return this;
  }
});
d3.chart("ChordMatrix").extend("ChordConfusionMatrix", {
  calcMaxError: function() {
    this.selfTotals = [];
    this.mtx = this.mtx.map((r, i) => {
      this.selfTotals[i] = r[i];
      r[i] = 0;
      return r;
    });
    var sum = (a, b) => a + b;
    this.maxError = this.mtx.map((r, i) => r.reduce(sum))
      .reduce((a, b) => Math.max(a, b));
    this.total = this.mtx.map(r => r.reduce(sum)).reduce(sum);
  },
  // Creates a chord 
  createChord: function(d, chord) {
    // Source
    var sourceCnt = this.centers[d.source.index];
    var srcFullSize = sourceCnt[1] - sourceCnt[0];
    var srcSize = Math.min(0.25, srcFullSize);
    var srcStart = sourceCnt[0] + (srcFullSize / 2) - (srcSize / 2);
    d.source.startAngle = srcStart;
    d.source.endAngle = srcStart + (srcSize * (d.source.value / this.maxError));
    // Target
    var tgCnt = this.centers[d.target.index];
    var tgFullSize = tgCnt[1] - tgCnt[0];
    var tgSize = Math.min(0.25, tgFullSize);
    var tgStart = tgCnt[0] + (tgFullSize / 2) - (tgSize / 2);
    d.target.startAngle = tgStart;
    d.target.endAngle = tgStart + (tgSize * (d.target.value / this.maxError));
    return chord(d);
  },
  // Filter paths
  filterPaths: function(d) {
    return d.source.index != d.source.subindex;
  }
});