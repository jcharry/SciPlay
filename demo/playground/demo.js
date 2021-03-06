/* global sciplay */
/* eslint
    "require-jsdoc": "off"
    */

window.addEventListener('load', function () {
  var sci = sciplay()
  window.sci = sci

  var system = sci.system({
    width: 600,
    height: 600,
    cellSize: 100,
    collideBoundary: true,
  })

  //   system.loop = loop
  //   system.gravityOn = true
  //   setTimeout(function () {
  //     system.gravity = sci.constants.GRAVITY.HEAVY
  //     console.log(system.bodies[0].force)
  //     setTimeout(function () {
  //       system.gravity = -sci.constants.GRAVITY.LIGHT
  //       console.log(system.bodies[0].force)
  //     }, 3000)
  //   }, 3000)

  window.system = system
  var renderer = sci.renderer(system, {
    canvas: 'canvas',
    debug: true,
    // background: 'rgba(60, 60, 60, 1)',
    background: 'rgba(240, 240, 240, 1)',
    clearBackground: true,
  })

  window.renderer = renderer

  // createSun(system.width / 2, 10, 800);

  var r = sci.rect({
    x: 10,
    y: 90,
    width: 100,
    mode: 'LEFT',
    // velocity: new sci.Vector(2, 0),
    height: 100,
    strokeStyle: 'black',
    refractiveIndex: 2,
  })

  let circles = []
  let numCircles = 100
  let spacing = {
    height: (system.height - 30) / numCircles,
    width: (system.width - 20) / numCircles,
  }
  for (let i = 0; i < numCircles; i++) {
    circles.push(
      sci.circle({
        mass: 1,
        debug: false,
        // canCollide: false,
        x: 20 + spacing.width * i,
        y: 10 + Math.random() * system.height,
        // force: {
        //   x: Math.random() * 0.00004 - 0.00002,
        //   y: Math.random() * 0.00004 - 0.00002,
        // },
        // velocity: new sci.Vector(Math.random() * 6 - 3, Math.random() * 6 - 3),
        radius: Math.random() * 25 + 5,
        strokeStyle: 'white',
        lineWidth: 2,
      })
    )
  }
  window.circles = circles

  let rects = []
  for (let i = 0; i < numCircles; i++) {
    rects.push(
      sci.rect({
        mass: Math.random() * 5 + 5,
        debug: false,
        x: 10 + spacing.width * i,
        y: Math.random() * system.height,
        width: 20,
        // velocity: new sci.Vector(
        //   Math.random() * 6 - 3,
        //   Math.random() * 3 - 1.5
        // ),
        height: 30,
        torque: 0.0001,
        strokeStyle: 'white',
        lineWidth: 0.5,
        mirror: true,
        angularVelocity: Math.random() * 0.02 - 0.01,
        // collisionType: sci.collisionTypes.INELASTIC
      })
    )
  }
  window.rects = rects

  let p = sci.polygon({
    x: 100,
    y: 100,
    vertices: [
      { x: 0, y: 0 },
      { x: 100, y: 40 },
      { x: 85, y: 65 },
      { x: 42, y: 84 },
      { x: 10, y: 35 },
    ],
    // velocity: new sci.Vector(Math.random() * 6 - 3, Math.random() * 3 - 1.5),
    angularVelocity: Math.random() * 0.02 - 0.01,
    strokeStyle: 'orange',
    lineWidth: 2,
    refractiveIndex: 1.66,
  })

  var r2 = sci.rect({
    x: 350,
    y: 150,
    width: 100,
    height: 100,
    strokeStyle: 'yellow',
    lineWidth: 2,
    rotation: 0.3,
    angularVelocity: 0.01,
    mirror: true,
  })

  var c = sci.circle({
    x: 100,
    y: 100,
    radius: 100,
  })

  var w = sci.wave({
    x: 10,
    y: 20,
    direction: 0.5,
    debug: true,
    lineWidth: 1,
    strokeStyle: 'magenta',
  })

  // system.add(rects);
  system.add(circles)
  // system.add(p);
  // system.add(r);
  // system.add(r2);

  window.w = w
  window.r = r
  window.r2 = r2
  window.p = p
  window.c = c

  // let angle = 0;
  function loop() {
    // Move the polygon in a little circle
    // angle += 0.1;
    // let x = 3 * Math.cos(angle);
    // let y = 3 * Math.sin(angle);
    // p.velocity.x = x;
    // p.velocity.y = y;

    // for (let i = 0; i < system.bodies.length; i++) {
    //     let b = system.bodies[i];
    //     if (b.aabb.max.x >= system.width || b.aabb.min.x <= 0) {
    //         b.velocity.x *= -1;
    //         // b.position.add(b.velocity);
    //         b.position.x +=  1.1 * b.velocity.x;
    //     }
    //
    //     if (b.aabb.max.y >= system.height || b.aabb.min.y <= 0) {
    //         b.velocity.y *= -1;
    //         b.position.y +=  1.1 * b.velocity.y;
    //     }
    // }

    if (p.colliderList.length > 0) {
      p.colliderList.forEach((collider) => {
        system.remove(collider.body2)
        p.scale += 0.1
      })
    }
  }

  renderer.run()

  function createSun(x, y, numLines) {
    let numPoints = numLines
    let step = Math.PI / numPoints
    for (let i = 0; i < numPoints; i++) {
      let wave = sci.wave({
        x: x,
        y: y,
        debug: true,
        direction: i * step,
        strokeStyle: 'blue',
        lineWidth: 1,
        intensity: 0.1,
      })
      system.add(wave)
    }
  }

  let squareDown = false
  let circleDown = false
  let waveDown = false
  let sunDown = false
  let colDown = false
  let polyDown = false
  let addRect = document.getElementById('rectangle')
  let addCircle = document.getElementById('circle')
  let addWave = document.getElementById('wave')
  let addSun = document.getElementById('sun')
  let addCol = document.getElementById('col')
  let addPoly = document.getElementById('poly')
  addRect.addEventListener('mousedown', function (e) {
    squareDown = true
  })
  addCircle.addEventListener('mousedown', function (e) {
    circleDown = true
  })
  addWave.addEventListener('mousedown', function (e) {
    waveDown = true
  })
  addSun.addEventListener('mousedown', function (e) {
    sunDown = true
  })
  addCol.addEventListener('mousedown', function (e) {
    colDown = true
  })
  addPoly.addEventListener('mousedown', function (e) {
    polyDown = true
  })
  let move = false
  renderer.canvas.addEventListener('mousedown', function (e) {
    move = !move
    console.log(system.hash.hash({ x: e.clientX, y: e.clientY }))
    let contents = system.hash.contents
    let bucket = system.hash.hash({ x: e.clientX, y: e.clientY })
    let objs = []
    if (contents[bucket.row] && contents[bucket.row][bucket.col]) {
      objs = contents[bucket.row][bucket.col]
    }

    for (let i = 0; i < objs.length; i++) {
      let obj = objs[i]
      if (obj.isPointInterior(e.clientX, e.clientY)) {
        console.log(obj)
        break
      }
    }
  })
  document.addEventListener('mouseup', function (e) {
    if (squareDown) {
      addRect.style.position = 'static'
      if (e.clientY < window.innerHeight - 100) {
        var rect = sci.rect({
          x: e.clientX,
          y: e.clientY,
          mode: 'LEFT',
          width: 100,
          height: 100,
          // torque: .0001,
          debug: true,
          // refractiveIndex: 1,
          // mirror: true,
          strokeStyle: 'red',
          lineWidth: 1,
        })
        system.add(rect)
      }
      squareDown = false
    }
    if (circleDown) {
      let circ = sci.circle({
        x: e.clientX,
        y: e.clientY,
        torque: 0.0001,
        debug: true,
        radius: 50,
        refractiveIndex: 1.3,
        lineWidth: 1,
        strokeStyle: 'orange',
      })
      addCircle.style.position = 'static'
      if (e.clientY < window.innerHeight - 100) {
        system.add(circ)
      }
      circleDown = false
    }
    if (waveDown) {
      addWave.style.position = 'static'
      var angle = prompt('Enter an angle')
      if (e.clientY < window.innerHeight - 100) {
        window.w = sci.wave({
          x: e.clientX,
          y: e.clientY,
          mode: 'RADIANS',
          direction: angle,
          strokeStyle: 'magenta',
          lineWidth: 1,
        })
        system.add(window.w)
      }
      waveDown = false
    }
    if (sunDown) {
      addSun.style.position = 'static'
      sunDown = false
      if (e.clientY < window.innerHeight - 100) {
        let numPoints = 600
        let step = (Math.PI * 2) / numPoints
        for (let i = 0; i < numPoints; i++) {
          let wave = sci.wave({
            x: e.clientX,
            y: e.clientY,
            direction: i * step,
            strokeStyle: 'magenta',
            lineWidth: 1,
            intensity: 0.1,
          })
          system.add(wave)
        }
      }
    }
    if (colDown) {
      addCol.style.position = 'static'
      colDown = false
      if (e.clientY < window.innerHeight - 100) {
        let numPoints = 30
        //let step = 100 / numPoints;
        for (var i = 0; i < numPoints; i++) {
          let wave = sci.wave({
            x: e.clientX,
            y: e.clientY + i,
            direction: 0,
            strokeStyle: 'black',
            lineWidth: 0.5,
            intensity: 0.1,
          })
          system.add(wave)
        }
      }
    }
    if (polyDown) {
      addPoly.style.position = 'static'
      polyDown = false
      if (e.clientY < window.innerHeight - 100) {
        let p = sci.polygon({
          x: e.clientX,
          y: e.clientY,
          debug: true,
          vertices: [
            { x: 50, y: 50 },
            { x: 100, y: 40 },
            { x: 85, y: 65 },
            { x: 42, y: 84 },
            { x: 10, y: 35 },
          ],
          // velocity: new sci.Vector(Math.random() * 6 - 3, Math.random() * 3 - 1.5),
          // angularVelocity: Math.random() * 0.02 - 0.01,
          strokeStyle: 'orange',
          lineWidth: 2,
          refractiveIndex: 1.66,
        })
        system.add(p)
      }
    }
  })
  document.addEventListener('mousemove', function (e) {
    if (move) {
      p.position.x = e.clientX
      p.position.y = e.clientY
      //r.position.x = e.clientX;
      //r.position.y = e.clientY;
    }
    if (sunDown) {
      addSun.style.position = 'fixed'
      addSun.style.left = e.clientX - 50 + 'px'
      addSun.style.top = e.clientY - 50 + 'px'
    }
    if (squareDown) {
      addRect.style.position = 'fixed'
      addRect.style.left = e.clientX - 50 + 'px'
      addRect.style.top = e.clientY - 50 + 'px'
    }
    if (circleDown) {
      addCircle.style.position = 'fixed'
      addCircle.style.left = e.clientX - 50 + 'px'
      addCircle.style.top = e.clientY - 50 + 'px'
    }
    if (waveDown) {
      addWave.style.position = 'fixed'
      addWave.style.left = e.clientX - 50 + 'px'
      addWave.style.top = e.clientY - 50 + 'px'
    }
    if (colDown) {
      addCol.style.position = 'fixed'
      addCol.style.left = e.clientX - 50 + 'px'
      addCol.style.top = e.clientY - 50 + 'px'
    }
    if (polyDown) {
      addPoly.style.position = 'fixed'
      addPoly.style.left = e.clientX - 50 + 'px'
      addPoly.style.top = e.clientY - 50 + 'px'
    }
  })
})
