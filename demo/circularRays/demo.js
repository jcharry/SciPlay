/* global sciplay */
window.addEventListener('load', function() {
    // Create top level instance
    var sci = sciplay();

    // Create system, with cellSize for spatial hashing
    var system = sci.system({
        width: 860,
        height: 600,
        cellSize: 100
    });

    // Create renderer and start rendering system
    var renderer = sci.renderer({
        canvas: 'canvas',
        debug: false
    });
    renderer.render(system);

    var p = sci.polygon({
        x: 100,
        y: 100,
        vertices: [
            {x: 0, y: 0},
            {x: 100, y: 40},
            {x: 85, y: 65},
            {x: 42, y: 84},
            {x: 10, y: 35}
        ],
        strokeStyle: 'orange',
        fillStyle: 'orange',
        lineWidth: 2,
        refractiveIndex: 1.66
    });

    let numPoints = 300;
    let step = (Math.PI * 2) / numPoints;
    for (let i = 0; i < numPoints; i++) {
        let wave = sci.wave({
            x: system.width / 2,
            y: system.height / 2,
            direction: i * step,
            strokeStyle: 'white',
            lineWidth: 0.5
        });
        system.addWave(wave);
    }

    // Add objects to system
    system.addObject(p);

    renderer.canvas.addEventListener('mousedown', function(e) {
        p.position.x = e.clientX;
        p.position.y = e.clientY;
    });
});
