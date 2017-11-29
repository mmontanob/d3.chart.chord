d3.chart('ChordMatrix').extend('ChordConfusionMatrix', {
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