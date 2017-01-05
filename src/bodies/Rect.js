/* eslint
    "no-multi-spaces": "off"
 */
import Body from './Body';
import aabb from '../geometries/AABB';
import vector from '../math/Vector';

var rect = function(options) {
    options = options || {};

    let B = Object.create(Body);
    B.init(options);
    B.type = 'rectangle';
    B._mode = options.mode || 'LEFT';

    B.inertia = (B.mass / 12) * (B.height * B.height + B.width * B.width);
    B.invInertia = 1 / B.inertia;

    // Define getters and setters for mode
    Object.defineProperty(B, 'mode', {
        get: function() {
            return this._mode;
        },
        set: function(m) {
            if (this._mode !== m && this.type === 'rectangle') {
                switch (m) {
                    case 'LEFT':
                    case 'CENTER':
                    case 'RIGHT':
                        this._mode = m;
                        this.updateVertices();
                        break;
                    default:
                        console.warn(`Cannot set mode to ${m}`);
                        break;
                }
            } else {
                console.warn(`'mode' is only available on rectangles`);
            }
        }
    });

    /**
     * Update location of vertices - used in update loop
     * @todo Move this onto the Body
     */
    // B.updateVertices = function() {
    //     let w = this.width,
    //         h = this.height,
    //         x = this.position.x,
    //         y = this.position.y;
    //     switch (this._mode) {
    //         case 'CENTER':
    //             x -= (w / 2);
    //             y -= (h / 2);
    //             break;
    //         case 'RIGHT':
    //             x -= w;
    //             break;
    //         default:
    //             break;
    //     }
    //
    //     //Get centroid
    //     let centroid = vector(
    //         (x + (x + w)) / 2,      // <-- x value
    //         (y + (y + h)) / 2       // <-- y value
    //     );
    //     B.centroid = centroid;
    //
    //     B.vertices = [
    //         vector(x, y),
    //         vector(x + w, y),
    //         vector(x + w, y + h),
    //         vector(x, y + h)
    //     ];
    //
    //     // To perform a rotation, we have to first translate to the origin,
    //     // then rotate, then translate back to the centroid
    //     if (B.angularVelocity !== 0 || B._rotation !== 0 || B._scale !== 0) {
    //         B.vertices.forEach(vertex => {
    //             vertex.translate(-centroid.x, -centroid.y)
    //                 .rotate(this._rotation)
    //                 .multiply(this._scale)
    //                 .translate(centroid.x, centroid.y);
    //         });
    //     }
    // };

    B.isPointInterior = function(x, y) {
        let bx = B.position.x,
            by = B.position.y;

        if (x >= bx &&
            x <= bx + B.width &&
            y >= by &&
            y <= by + B.height) {
            return true;
        }
        return false;
    };

    B.updateVertices();
    B.aabb = aabb(B);
    return B;
};

export default rect;
