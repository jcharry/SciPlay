/*
 * demo.js
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */

let sci = sciplay();
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

