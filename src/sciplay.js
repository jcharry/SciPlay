/* MATH OBJECTS */
import vector, {Vector} from './math/Vector';
import ray from './geometries/Ray';

/* CORE OBJECTS */
import system from './system/System';
import renderer from './renderer/Renderer';

/* BODIES */
import rect from './bodies/Rect';
import wave from './bodies/Wave';
import circle from './bodies/Circle';
import polygon from './bodies/Polygon';

let sciplay = function() {
    return {
        Vector, // for operations that return a new vector
        vector, // actual vector constructor
        renderer,
        ray,
        system,
        wave,
        rect,
        polygon,
        circle
    };
};

export default sciplay;
