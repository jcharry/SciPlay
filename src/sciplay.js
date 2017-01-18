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
import anchor from './geometries/Anchor';
import * as constants from './constants/CONSTANTS';

/* Constraints */
import boundaryConstraint from './constraints/BoundaryConstraint';
import linkConstraint from './constraints/LinkConstraint';

import GJK from './collision/GJK';

/* CONSTANTS */
import collisionTypes from './collision/collisionTypes.js';

let sciplay = function() {
    return {
        Vector, // for operations that return a new vector
        vector, // actual vector constructor
        renderer,
        ray,
        system,
        wave,
        rect,
        anchor,
        polygon,
        circle,
        collisionTypes,
        constants,
        boundaryConstraint,
        linkConstraint,
        dev: {
            GJK
        }
    };
};

export default sciplay;
