/* global sciplay */
window.addEventListener('load', function() {
    var sci = sciplay();
    window.sci = sci;

    var system = sci.system({
        width: 860,
        height: 600,
        cellSize: 100
    });
    window.system = system;
    var renderer = sci.renderer({
        canvas: 'canvas',
        debug: true
    });

    window.renderer = renderer;
    renderer.render(system);

    var r = sci.rect({
        x: 10,
        y: 90,
        width: 100,
        mode: 'LEFT',
        height: 100,
        strokeStyle: 'white',
        refractiveIndex: 2
    });
    var r2 = sci.rect({
        x: 300,
        y: 100,
        width: 100,
        height: 100
    });

    var c = sci.circle({
        x: 100,
        y: 100,
        radius: 100,
    });
    window.c = c;

    setTimeout(() => {
        c.velocity = sci.vector(1,1);
    }, 4000);

    setTimeout(() => {
        c.freeze();
    }, 8000);

    var w = sci.wave({
        x: 10,
        y: 20,
        direction: 0.5,
        lineWidth: 1,
        strokeStyle: 'green'
    });
    var w1 = sci.wave({
        x: 10,
        y: 520,
        direction: -0.5,
        lineWidth: 1,
        strokeStyle: 'white'
    });
    var w2 = sci.wave({
        x: 800,
        y: 20,
        direction: 3.14 - 0.5,
        lineWidth: 1,
        strokeStyle: 'green'
    });
    var w3 = sci.wave({
        x: 800,
        y: 520,
        direction: 3.14 + 0.5,
        lineWidth: 1,
        strokeStyle: 'green'
    });

    window.w = w;
    window.w1 = w1;
    window.w2 = w2;
    window.w3 = w3;
    window.r = r;
    system.addObject(r);
    //system.addObject(r2);
    //system.addObject(c);
    system.addWave(w);
    //system.addWave(w1);
    //system.addWave(w2);
    //system.addWave(w3);


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
    })
    let move = false;
    renderer.canvas.addEventListener('mousedown', function(e) {
        move = !move;
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
                    strokeStyle: 'transparent'

                });
                system.addObject(rect);
            }
            squareDown = false;
        }
        if (circleDown) {
            let circ = sci.circle({
                x: e.clientX,
                y: e.clientY,
                radius: 50,
                refractiveIndex: 1.3,
                lineWidth: 0.3
            });
            addCircle.style.position = 'static';
            if (e.clientY < window.innerHeight - 100) {
                system.addObject(circ);
            }
            circleDown = false;
        }
        if (waveDown) {
            addWave.style.position = 'static';
            if (e.clientY < window.innerHeight - 100) {
                system.addWave(sci.wave({
                    x: e.clientX,
                    y: e.clientY,
                    mode: 'RADIANS',
                    direction: 0,
                    strokeStyle: 'magenta',
                    lineWidth: 1
                }));
            }
            waveDown = false;
        }
        if (sunDown) {
            addSun.style.position = 'static';
            sunDown = false;
            if (e.clientY < window.innerHeight - 100) {
                let numPoints = 2000;
                let step = (Math.PI * 2 ) / numPoints;
                for (var i = 0; i < numPoints; i++) {
                    let wave = sci.wave({
                        x: e.clientX,
                        y: e.clientY,
                        direction: i * step,
                        strokeStyle: 'white',
                        lineWidth: 0.1
                    });
                    system.addWave(wave);
                }
            }
        }
        if (colDown) {
            addCol.style.position = 'static';
            colDown = false;
            if (e.clientY < window.innerHeight - 100) {
                let numPoints = 100;
                let step = 100 / numPoints;
                for (var i = 0; i < numPoints; i++) {
                    let wave = sci.wave({
                        x: e.clientX,
                        y: e.clientY + i,
                        direction: 0,
                        strokeStyle: 'white',
                        lineWidth: 0.1
                    });
                    system.addWave(wave);
                }
            }

        }
    });
    document.addEventListener('mousemove', function(e) {
        if (move) {
            r.position.x = e.clientX;
            r.position.y = e.clientY;
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
