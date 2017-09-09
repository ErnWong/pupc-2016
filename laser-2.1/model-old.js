let sgn = Math.sign;
let round = Math.round;

function createConfig() {
  return {
    xmax: 10,
    xres: 1000,
    d: 1,
    mass: 1,
    charge: 1,
    density: 1
  };
}

function createState() {
  return {
    x: [],
    v: []
  };
}

function initState(config) {
  let state = createState;
  config.step = 2 * config.xmax / config.xres;
  for (let i = 0; i < config.xres; i++) {
    let x = -config.xmax + i * config.step;
    state.x.push(x + sgn(x) * config.d);
    state.v.push(0);
  }
  return state;
}

function findMonotonicSegments(data) {

  // 1. Find turning points
  let turningPoints = [];
  let prev = data[0];
  let prevSign = sgn(data[1] - data[0]);
  for (let [i, value] of data.entries()) {
    let currSign = sgn(value - prev);
    if (currSign !== prevSign)
      turningPoints.push(i);
    prevSign = currSign;
  }

  // 2. Pair turning points into rising segments
  let segments = [];
  for (let [i, end] of turningPoints.entries()) {
    if (i == 0) continue;
    let start = turningPoints[i-1]; 
    if (data[end] < data[start])
      [start, end] = [end, start];
    segments.push({start, end});
  }

  // 3. Sort segments by lowest value
  segments.sort(function (a, b) {
    return data[a.start] - data[b.start];
  });

  return segments;
}

function getDerivative(state, config) {

}

function getDerivativeTheSillyWay(state, config) {
  let overlaps = [];
  let prevx = state.x[0];
  let prevsgn = sgn(state.x[1] - state.x[0])
  for (let [i, x] of state.x.entries()) {
    let currsgn = sgn(x - xprev);
    if (currsgn !== prevsgn) {
      overlaps.push(i);
    }
    prevsgn = currsgn;
  }


  // populate the prefix 
  let prevPrefixCount = 0;
  let prefixSumCount = [];
  for (let i = 0; i < config.xres; i++) {
    let iterx = -config.xmas + i* config.step;
    let inverseGradientSums = 0;

    for (let j = 1; j < overlaps.length; j++) {

      let start = overlaps[j - 1];
      let end = overlaps[j];

      // swap if negative gradient
      if (state.x[start] > state.x[end]) {
        [start, end] = [end, start];
      }

      // skip if the overlap doesnt contain our iterx
      if (iterx < state.x[start] || state.x[end] < iterx) {
        continue;
      }

      // now 'binary search' to find root
      while (start + 1 < end) {
        let mid = round((start + end) / 2);
        if (state.x[mid] < iterx)
          start = mid;
        else
          end = mid;
      }

      // original plan: calculate the left gradient and the right gradient, then interpolate the gradient
      // current method: cheat: approximate gradient like this:
      let xgradient = (state.x[end] - state.x[start]) / (start - end) / step; 
      inverseGradientSums += 1 / xgradient;
    }
    let newPrefixCount = prevPrefixCount + 1 - inverseGradientSums;
    prefixSumCount.push(newPrefixCount);
    prevPrefixCount = newPrefixCount;
  }
  let prefixLastCount = prevPrefixCount;

  // Return the derivatives
  let derivative = createState();
  for ([i,x] of state.x.entries()) {
    let prefixCriticalIndex = round((x + config.xmax) / step);
    derivative.v[i] = config.charge*config.charge*config.density/2/config.mass/config.permittivity * (prefixLastCount - 2 * prefixSumCount[i]);
    derivative.x[i] = state.v[i];
  }
  return derivative;
}
