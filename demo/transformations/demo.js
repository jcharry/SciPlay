var sci = sciplay();

var system = sci.system({
    width: 900,
    height: 600
});
var renderer = sci.renderer({
    canvas: 'canvas',
    background: 'black'
});

var r = sci.rect({
    x: 200,
    y: 300,
    width: 100,
    height: 100,
    strokeStyle: 'orange',
    velocity: {
        x: 4, y: 2.5
    },
    canCollide: false
});

system.add(r);

let scaleDir = 1;
function loop() {
    r.rotation += .03;

    // Bounce off walls
    if (r.position.x + r.width > system.width || r.position.x < 0) {
        r.velocity.x *= -1;
    }

    if (r.position.y + r.height > system.height || r.position.y < 0) {
        r.velocity.y *= -1;
    }

    // Scale up and down
    if (r.scale > 2) {
        scaleDir = -scaleDir;
    } else if (r.scale < 0.5) {
        scaleDir = -scaleDir;
    }

    r.scale += .01 * scaleDir;
}

renderer.render(system, loop);

