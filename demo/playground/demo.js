/* global sciplay */
/* eslint
    "require-jsdoc": "off"
 */

window.addEventListener('load', function() {
    var sci = sciplay();
    window.sci = sci;

    var system = sci.system({
        width: 900,
        height: 600,
        cellSize: 100
    });
    window.system = system;
    var renderer = sci.renderer({
        canvas: 'canvas',
        debug: false,
        background: 'white'
    });

    window.renderer = renderer;

    var r = sci.rect({
        x: 10,
        y: 90,
        width: 100,
        mode: 'LEFT',
        // velocity: new sci.Vector(2, 0),
        height: 100,
        strokeStyle: 'black',
        refractiveIndex: 2
    });

    let circles = [];
    let numCircles = 200;
    let spacing = {
        height: (system.height - 30) / numCircles,
        width: (system.width - 20) / numCircles
    }
    for (let i = 0; i < numCircles; i++) {
        circles.push(sci.circle({
            x: system.width / 2 + Math.random() * 200 - 100,
            y: system.height / 2 + Math.random() * 200 - 100,
            velocity: new sci.Vector(Math.random() * 6 - 3, Math.random() * 6 - 3),
            radius: 15,
            strokeStyle: 'blue',
            lineWidth: 0.5,
            alpha: 0.5
        }));
    }

    let rects = [];
    for (let i = 0; i < numCircles; i++) {
        rects.push(sci.rect({
            x: 10 + spacing * i,
            y: Math.random() * system.height,
            width: 60,
            velocity: new sci.Vector(Math.random() * 6 - 3, Math.random() * 3 - 1.5),
            height: 30,
            strokeStyle: 'orange',
            lineWidth: 0.5,
            mirror: true,
            angularVelocity: Math.random() * 0.02 - 0.01
        }));
    }

    let p = sci.polygon({
        x: 100,
        y: 100,
        vertices: [
            {x: 0, y: 0},
            {x: 100, y: 40},
            {x: 85, y: 65},
            {x: 42, y: 84},
            {x: 10, y: 35}
        ],
        velocity: new sci.Vector(Math.random() * 6 - 3, Math.random() * 3 - 1.5),
        angularVelocity: Math.random() * 0.02 - 0.01,
        strokeStyle: 'orange',
        lineWidth: 2,
        refractiveIndex: 1.66
    });

    var r2 = sci.rect({
        x: 350,
        y: 150,
        width: 100,
        height: 100,
        strokeStyle: 'yellow',
        lineWidth: 2,
        rotation: 0.3,
        angularVelocity: 0.01,
        mirror: true
    });

    var c = sci.circle({
        x: 100,
        y: 100,
        radius: 100
    });

    var w = sci.wave({
        x: 10,
        y: 20,
        direction: 0.5,
        lineWidth: 1,
        strokeStyle: 'green'
    });

    // system.add(rects);
    // system.add(circles);
    // system.add(p);
    system.add(r);
    // system.add(r2);


    window.w = w;
    window.r = r;
    window.r2 = r2;
    window.p = p;
    window.c = c;

    let angle = 0;
    function loop() {
        // Move the polygon in a little circle
        // angle += 0.1;
        // let x = 3 * Math.cos(angle);
        // let y = 3 * Math.sin(angle);
        // p.velocity.x = x;
        // p.velocity.y = y;

        for (let i = 0; i < system.bodies.length; i++) {
            let b = system.bodies[i];
            if (b.aabb.max.x >= system.width || b.aabb.min.x <= 0) {
                b.velocity.x *= -1;
                b.position.add(b.velocity);
            }

            if (b.aabb.max.y >= system.height || b.aabb.min.y <= 0) {
                b.velocity.y *= -1;
                b.position.add(b.velocity);
            }
        }

        if (p.colliderList.length > 0) {
            p.colliderList.forEach(collider => {
                system.remove(collider.body2);
                p.scale += 0.1;
            });
        }
    }
    renderer.render(system, loop);

    var squareDown = false;
    var circleDown = false;
    var waveDown = false;
    var sunDown = false;
    var colDown = false;
    var addRect = document.getElementById('rectangle');
    var addCircle = document.getElementById('circle');
    var addWave = document.getElementById('wave');
    var addSun = document.getElementById('sun');
    var addCol = document.getElementById('col');
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
                    height: 100,
                    refractiveIndex: 1,
                    mirror: true,
                    strokeStyle: 'red'

                });
                system.add(rect);
            }
            squareDown = false;
        }
        if (circleDown) {
            let circ = sci.circle({
                x: e.clientX,
                y: e.clientY,
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
                let numPoints = 1000;
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
    });

});
