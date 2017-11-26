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
        .padding(.04);

        var padding = (chart.grps.length - 1) * 20;
      
        // The arc generator, for the groups.
        var arc = d3.svg.arc()
        .innerRadius(chart.innerRadius - padding)
        .outerRadius(chart.outerRadius);
  
        // The chord generator (quadratic Bézier), for the chords.
        chord.radius(chart.innerRadius - padding);
        
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
        .attr('id', function(d, i) { return 'group' + d.index + '-' + i; })
        .attr('d', arc)
        .on("mouseover", _handleMouseOver)
        .on("mouseout", _handleMouseOut)
        .append('title')
        .text(function(d) { 
          return chart.grps[d.index];
        });

        chart.grps.forEach((grp, i) => {
          var padding = 20 * i;
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
            var perc = chart.percs[i][d.index];
            arc2.endAngle(d.startAngle + (size * perc));
            return arc2(d);
          })
          .on("mouseover", _handleMouseOver)
          .on("mouseout", _handleMouseOut)
          .append('title')
          .text(function(d) { 
            return chart.grps[i];
          });
        });

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
      .style('fill', function(d) { return chart.scale(d.source.subindex); })
      .style('opacity', function(d) {
        if (typeof chart.focus == 'number' && 
          d.source.index != chart.focus &&
          d.source.subindex != chart.focus) {
          return '0.25';
        }
        return '1';
      })
      .style('stroke', function(d) { return d3.rgb(chart.scale(d.source.subindex)).darker(); })
      .attr('d', chord)
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
  // Calculates radius
  radius: function() {
    this.outerRadius = Math.min(this.w, this.h) / 2 - 4;
    this.innerRadius = this.outerRadius - 20;
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
  // Updates or sets matrix
  matrix : function(newMatrix) {
    if (!arguments.length) {
      return this.mtx;
    }
    // save new matrix
    this.mtx = newMatrix;
    var totals = this.mtx.map(row => row.reduce((a, b) => a + b));
    this.percs = this.mtx.map((row, i) => row.map((col) => col / totals[i]));
    // only repaint if we have data (in this case the scale)
    if (this.scale) { this.draw(this.scale); }

    return this;
  }
});