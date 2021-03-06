const colors = {
  '00': '#2f1e2e',
  '01': '#41323f',
  '02': '#4f424c',
  '03': '#776e71',
  '04': '#8d8687',
  '05': '#a39e9b',
  '06': '#b9b6b0',
  '07': '#e7e9db',
  '08': '#ef6155',
  '09': '#f99b15',
  '0A': '#fec418',
  '0B': '#48b685',
  '0C': '#5bc4bf',
  '0D': '#06b6ef',
  '0E': '#815ba4',
  '0F': '#e96ba8'
};

function range(start, max, step) {
  let len = Math.floor((max - start) / step);
  return Array.from(new Array(len), (x,i) => start + i * step);
}

function createConfig() {
  return {
    xmax: 10,
    xres: 1000,
    d: 0.3,
    mass: 1,
    charge: 1,
    density: 1,
    permittivity: 1
  };
}

function createState() {
  return {
    x: [],
    v: []
  };
}

function initState(config) {
  let state = createState();
  config.width = 2 * config.xmax;
  config.step = config.width / config.xres;
  config.coeff = config.charge * config.charge * config.density / config.mass / config.permittivity;
  config.range = range(-config.xmax, config.xmax, config.step);
  for (let x of config.range){
    state.x.push(x + Math.sign(x?x:1) * config.d);
    state.v.push(0);
  }
  return state;
}

function binarySearch(array, value) {
  let start = 0;
  let end = array.length - 1;
  while (start + 1 < end) {
    let mid = Math.floor((start + end) / 2);
    if (array[mid] < value)
      start = mid;
    else
      end = mid;
  }
  if (array[start] === value)
    return start;
  else
    return end;
}

function getDerivative(state, config) {
  let sortedLocations = state.x.slice(0).sort((a,b)=>a-b);
  let derivative = createState();
  let sortedId = binarySearch(sortedLocations, state.x[0]);
  let prev = state.x[0];
  for (let i of config.range.keys()) {
    let direction = Math.sign(state.x[i] - prev);
    prev = state.x[i];
    while (sortedLocations[sortedId] !== state.x[i])
      sortedId += direction;
    derivative.v[i] = config.coeff * (sortedId * config.step - (state.x[i] + config.xmax));
    derivative.x[i] = state.v[i];
  }
  return derivative;
}

function eulerStep(state, config, dt) {
  let derivative = getDerivative(state, config);
  for (let i of config.range.keys()) {
    state.x[i] += derivative.x[i] * dt;
    state.v[i] += derivative.v[i] * dt;
  }
  return derivative;
}

function createVisual(state, config) {
  let draw = SVG('display');
  document.body.style.backgroundColor = colors['00'];

  let xscale = 10;
  let fieldScale = 10;
  let fieldMax = 10;
  let distributionHeight = 100;

  let xoffset = xscale * config.xmax;
  let width = xscale * config.width;
  let displacementHeight = width;
  let fieldHeight = fieldScale * 2 * fieldMax;
  let displacementOrigin = 0;
  let distributionSeparator = displacementOrigin + displacementHeight;
  let distributionOrigin = distributionSeparator + distributionHeight / 2;
  let fieldSeparator = distributionSeparator + distributionHeight;
  let fieldOrigin = fieldSeparator + fieldHeight / 2;
  let veryverytop = fieldSeparator + fieldHeight;

  function plotx(val) {
    return val * xscale + xoffset;
  }

  // left axis
  draw
    .line(0, 0, 0, veryverytop)
    .fill('none')
    .stroke(colors['06']);

  // displacement axis
  draw
    .line(0, 0, width, 0)
    .fill('none')
    .stroke(colors['06']);

  // distribution separator
  draw
    .line(0, distributionSeparator, width, distributionSeparator)
    .fill('none')
    .stroke(colors['06']);

  // field separator
  draw
    .line(0, fieldSeparator, width, fieldSeparator)
    .fill('none')
    .stroke(colors['06']);

  // field origin
  draw
    .line(0, fieldOrigin, width, fieldOrigin)
    .fill('none')
    .stroke(colors['0B']);

  let distributionDots = [];
  let displacementDots = [];

  for (let i of config.range.keys()) {

    displacementDots[i] = draw
      .circle(4)
      .stroke('none')
      .fill(colors['0A'])
      .cx(plotx(state.x[i]))
      .cy(plotx(state.x[i]));

    distributionDots[i] = draw
      .rect(3,distributionHeight)
      .stroke('none')
      .fill(colors['0D'])
      .opacity(0.03)
      .cx(plotx(state.x[i]))
      .cy(distributionOrigin + 0*(Math.random()-0.5) * distributionHeight);

  }

  // field line
  let fieldLine = draw
    .polyline([[0,fieldOrigin], [width,fieldOrigin]])
    .fill('none')
    .stroke(colors['08']);

  return function update(newstate, derivative) {
    for (let i of config.range.keys()) {
      displacementDots[i]
        .cx(plotx(newstate.x[i]));
      distributionDots[i]
        .cx(plotx(newstate.x[i]));
    }
    let fieldData = Array.from(config.range.entries())
      .sort((a,b) => a[1] - b[1])
      .map(([i,x]) => [plotx(x), derivative.v[i] * fieldScale + fieldOrigin])
    fieldLine.plot(fieldData);
  }
}

window.onload = function () {
  let config = createConfig();
  let state = initState(config);
  let updateVisual = createVisual(state, config);
  setInterval(function() {
    let derivative = eulerStep(state, config, 0.1);
    updateVisual(state, derivative);
  }, 20);
}
