/* global sciplay */
window.addEventListener('load', function() {
    var sci = sciplay();
    window.sci = sci;

    var system = sci.system();
    window.system = system;
    var renderer = sci.renderer({
        canvas: 'canvas',
        width: 900,
        height: 600
        //debug: true
    });

    renderer.render(system);

    var r = sci.rect({
        x: 300,
        y: 300,
        width: 100,
        mode: 'CENTER',
        height: 100
    });
    var w = sci.wave({
        x: 10,
        y: 300,
        direction: 0.5,
        lineWidth: 0.5,
        strokeStyle: 'green'
    });

    window.w = w;
    window.r = r;
    system.addObject(r);
    system.addWave(w);

    var squareDown = false;
    var circleDown = false;
    var waveDown = false;
    var addRect = document.getElementById('rectangle');
    var addCircle = document.getElementById('circle');
    var addWave = document.getElementById('wave');
    addRect.addEventListener('mousedown', function(e) {
        squareDown = true;
    });
    addCircle.addEventListener('mousedown', function(e) {
        circleDown = true;
    });
    addWave.addEventListener('mousedown', function(e) {
        waveDown = true;
    });
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
                    mirror: true
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
    });
    document.addEventListener('mousemove', function(e) {
        if (move) {
            r.position.x = e.clientX;
            r.position.y = e.clientY;
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
    });
});
