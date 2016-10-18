/* MATH OBJECTS */
import vector, {Vector} from './math/Vector';
import ray from './math/Ray';

/* CORE OBJECTS */
import system from './system/System';
import renderer from './renderer/Renderer.js';

/* BODIES */
import rect from './bodies/Rect';
import wave from './bodies/Wave';
import circle from './bodies/Circle';

let sciplay = function() {
    return {
        Vector, // for operations that return a new vector
        vector, // actual vector constructor
        renderer,
        ray,
        system,
        wave,
        rect,
        circle
    };
};

export default sciplay;
