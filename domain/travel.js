const travel = {
  coords: { x: 0, y: 0, z: 0 },
  coordsInner: { x: 0, y: 0, z: 0 },
  directionToCoords: {
    'N': {
      delta: { x: 0, y: 1, z: 0 },
      inner: { x: result.coordsInner.x, y: inner.maxY }
    },
    'S': {
      delta: { x: 0, y: -1, z: 0 },
      inner: { x: result.coordsInner.x, y: inner.minY }
    },
    'E': {
      delta: { x: 1, y: 0, z: 0 },
      inner: { x: inner.minX, y: result.coordsInner.y }
    },
    'W': {
      delta: { x: -1, y: 0, z: 0 },
      inner: { x: inner.maxX, y: result.coordsInner.y }
    },
    'UP': {
      delta: { x: 0, y: 0, z: -1 },
      inner: result.coordsInner
    },
    'DOWN': {
      delta: { x: 0, y: 0, z: 1 },
      inner: result.coordsInner
    }
  },
  Init = function (coords, coordsInner) {
    this.coords = coords
    this.coordsInner = coordsInner
  },
  MoveInner: function (direction) {
    const translate = this.directionToCoords[direction].delta

    // onsole.table(result.coordsInner)
    this.coordsInner.x += translate.x;
    // console.table(result.coordsInner)
    this.coordsInner.x = Math.max(Math.min(this.coordsInner.x, this.GetInnerConstraints().maxX), this.GetInnerConstraints().minX);

    this.coordsInner.y += translate.y;
    this.coordsInner.y = Math.max(Math.min(this.coordsInner.y, this.GetInnerConstraints().maxY), this.GetInnerConstraints().minY);
  },
  MoveGlobal: function (direction) {
    const translate = this.directionToCoords[direction].delta
    this.coords.x += translate.x;
    this.coords.y += translate.y;
    this.coords.z += translate.z;
    // console.log(this.coords.z)
    if (isNaN(this.coords.z))
      this.coords.z = 0;

    this.coordsInner = translate.inner
  },
  GetInnerConstraints = function () {
    return { minX: 0, maxX: 9, minY: 0, maxY: 9 }
  },
  GetZeroCoords = function () {
    return {
      coords: { x: 0, y: 0, z: 0 },
      coordsInner: { x: 0, y: 0, z: 0 }
    }
  }
}

module.export = travel