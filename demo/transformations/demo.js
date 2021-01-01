var sci = sciplay()

var system = sci.system(loop, {
  width: 900,
  height: 600,
})
var renderer = sci.renderer(system, {
  canvas: 'canvas',
  background: 'black',
})

var r = sci.rect({
  x: 200,
  y: 300,
  width: 100,
  height: 100,
  strokeStyle: 'orange',
  velocity: {
    x: 4,
    y: 2.5,
  },
  canCollide: false,
  debug: true,
})

system.add(r)
system.loop = loop

let scaleDir = 1
function loop() {
  r.rotation += 0.03

  // Bounce off walls
  if (r.aabb.max.x >= system.width || r.aabb.min.x < 0) {
    r.velocity.x *= -1
    r.position.x += r.velocity.x * r.scale
  }

  if (r.aabb.max.y >= system.height || r.aabb.min.y < 0) {
    r.velocity.y *= -1
    r.position.y += r.velocity.y * r.scale
  }

  // Scale up and down
  if (r.scale > 2) {
    scaleDir = -scaleDir
  } else if (r.scale < 0.5) {
    scaleDir = -scaleDir
  }

  r.scale += 0.01 * scaleDir
}

renderer.render(system, loop)
