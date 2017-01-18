/* global sciplay */
/* eslint
    "require-jsdoc": "off"
    */
var sci = sciplay();
window.sci = sci;

var system = sci.system({
    width: 600,
    height: 600,
    cellSize: 100,
    collideBoundary: true
});

system.loop = loop;
system.gravityOn = true;
system.gravity = sci.constants.GRAVITY.LIGHT;

var renderer = sci.renderer(system, {
    canvas: 'canvas',
    debug: false,
    background: 'white',
    borderColor: 'black'
});

var r = sci.rect({
    x: 10,
    y: 90,
    width: 100,
    mode: 'LEFT',
    // velocity: new sci.Vector(2, 0),
    height: 100,
    strokeStyle: 'black',
    refractiveIndex: 2,
    static: true
});

var anchor = sci.anchor(system.width / 2, system.height / 2);

// let c = sci.circle({
//     x: 100, y: 100,
//     debug: true
// });
// system.add(c);
system.add(anchor);
system.add(r);

let link = sci.linkConstraint(r, anchor, 100);
system.add(link);

function loop() {
}

renderer.run();

let squareDown = false;
let circleDown = false;
let waveDown = false;
let sunDown = false;
let colDown = false;
let polyDown = false;
let addRect = document.getElementById('rectangle');
let addCircle = document.getElementById('circle');
let addWave = document.getElementById('wave');
let addSun = document.getElementById('sun');
let addCol = document.getElementById('col');
let addPoly = document.getElementById('poly');
addRect.addEventListener('mousedown', function(e) {
    squareDown = true;
});
addCircle.addEventListener('mousedown', function(e) {
    circleDown = true;
});
addWave.addEventListener('mousedown', function(e) {
    waveDown = true;
});
addSun.addEventListener('mousedown', function(e) {
    sunDown = true;
});
addCol.addEventListener('mousedown', function(e) {
    colDown = true;
});
addPoly.addEventListener('mousedown', function(e) {
    polyDown= true;
});
let move = false;
renderer.canvas.addEventListener('mousedown', function(e) {
    move = !move;
    console.log(system.hash.hash({x: e.clientX, y: e.clientY}));
    let contents = system.hash.contents;
    let bucket = system.hash.hash({x: e.clientX, y: e.clientY});
    let objs = [];
    if (contents[bucket.row] && contents[bucket.row][bucket.col]) {
        objs = contents[bucket.row][bucket.col];
    }

    for (let i = 0; i < objs.length; i++) {
        let obj = objs[i];
        if (obj.isPointInterior(e.clientX, e.clientY)) {
            console.log(obj);
            break;
        }
    }
});
document.addEventListener('mouseup', function(e) {
    if (squareDown) {
        addRect.style.position = 'static';
        if (e.clientY < window.innerHeight - 100) {
            var rect = sci.rect({
                x: e.clientX,
                y: e.clientY,
                mode: 'CENTER',
                width: 100,
                mass: 20,
                height: 100,
                // torque: .0001,
                debug: true,
                // refractiveIndex: 1,
                // mirror: true,
                strokeStyle: 'red',
                lineWidth: 1

            });
            system.add(rect);
        }
        squareDown = false;
    }
    if (circleDown) {
        let circ = sci.circle({
            x: e.clientX,
            y: e.clientY,
            torque: 0.00001,
            debug: true,
            radius: 50,
            refractiveIndex: 1.3,
            lineWidth: 1,
            strokeStyle: 'orange'
        });
        addCircle.style.position = 'static';
        if (e.clientY < window.innerHeight - 100) {
            system.add(circ);
        }
        circleDown = false;
    }
    if (waveDown) {
        addWave.style.position = 'static';
        var angle = prompt('Enter an angle');
        if (e.clientY < window.innerHeight - 100) {
            window.w = sci.wave({
                x: e.clientX,
                y: e.clientY,
                mode: 'RADIANS',
                direction: angle,
                strokeStyle: 'magenta',
                lineWidth: 1
            });
            system.add(window.w);
        }
        waveDown = false;
    }
    if (sunDown) {
        addSun.style.position = 'static';
        sunDown = false;
        if (e.clientY < window.innerHeight - 100) {
            let numPoints = 600;
            let step = (Math.PI * 2) / numPoints;
            for (let i = 0; i < numPoints; i++) {
                let wave = sci.wave({
                    x: e.clientX,
                    y: e.clientY,
                    direction: i * step,
                    strokeStyle: 'black',
                    lineWidth: 1,
                    intensity: 0.1
                });
                system.add(wave);
            }
        }
    }
    if (colDown) {
        addCol.style.position = 'static';
        colDown = false;
        if (e.clientY < window.innerHeight - 100) {
            let numPoints = 30;
            //let step = 100 / numPoints;
            for (var i = 0; i < numPoints; i++) {
                let wave = sci.wave({
                    x: e.clientX,
                    y: e.clientY + i,
                    direction: 0,
                    strokeStyle: 'black',
                    lineWidth: 0.5,
                    intensity: 0.1
                });
                system.add(wave);
            }
        }
    }
    if (polyDown) {
        addPoly.style.position = 'static';
        polyDown = false;
        if (e.clientY < window.innerHeight - 100) {
            let p = sci.polygon({
                x: e.clientX,
                y: e.clientY,
                debug: true,
                vertices: [
                    {x: 50, y: 50},
                    {x: 100, y: 40},
                    {x: 85, y: 65},
                    {x: 42, y: 84},
                    {x: 10, y: 35}
                ],
                // velocity: new sci.Vector(Math.random() * 6 - 3, Math.random() * 3 - 1.5),
                // angularVelocity: Math.random() * 0.02 - 0.01,
                strokeStyle: 'orange',
                lineWidth: 2,
                refractiveIndex: 1.66
            });
            system.add(p);
        }
    }
});
document.addEventListener('mousemove', function(e) {
    if (move) {
        p.position.x = e.clientX;
        p.position.y = e.clientY;
        //r.position.x = e.clientX;
        //r.position.y = e.clientY;
    }
    if (sunDown) {
        addSun.style.position = 'fixed';
        addSun.style.left = e.clientX - 50 + 'px';
        addSun.style.top = e.clientY - 50 + 'px';
    }
    if (squareDown) {
        addRect.style.position = 'fixed';
        addRect.style.left = e.clientX - 50 + 'px';
        addRect.style.top = e.clientY - 50 + 'px';
    }
    if (circleDown) {
        addCircle.style.position = 'fixed';
        addCircle.style.left = e.clientX - 50 + 'px';
        addCircle.style.top = e.clientY - 50 + 'px';
    }
    if (waveDown) {
        addWave.style.position = 'fixed';
        addWave.style.left = e.clientX - 50 + 'px';
        addWave.style.top = e.clientY - 50 + 'px';
    }
    if (colDown) {
        addCol.style.position = 'fixed';
        addCol.style.left = e.clientX - 50 + 'px';
        addCol.style.top = e.clientY - 50 + 'px';
    }
    if (polyDown) {
        addPoly.style.position = 'fixed';
        addPoly.style.left = e.clientX - 50 + 'px';
        addPoly.style.top = e.clientY - 50 + 'px';

    }
});
