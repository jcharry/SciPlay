import Body from './Body';
import aabb from '../geometries/AABB';
import vector from '../math/Vector';

var polygon = function(options) {
    options = options || {};

    var B = Object.create(Body);
    if (!options.vertices) {
        throw new Error('Polygons MUST be initialized with vertices. See docs.');
    }
    B.init(options);

    // Set type
    B.type = 'polygon';

    //Initialize vetices as vectors
    // private vertices, relative to x and y
    B._relativeVertices = [];

    // public vertices, (contain world coords);
    B.vertices = [];

    options.vertices.forEach(vert => {
        B._relativeVertices.push(vector(vert.x, vert.y));
        B.vertices.push(vector(options.x + vert.x, options.y + vert.y));
    });

    // Update all vertices based on position
    B.updateVertices = function() {
        B.centroid = {x: 0, y: 0};
        B.vertices.forEach((vert, index) => {
            let relVert = B._relativeVertices[index];
            vert.x = relVert.x + B.position.x;
            vert.y = relVert.y + B.position.y;

            B.centroid.x += vert.x;
            B.centroid.y += vert.y;
        });

        B.centroid.x /= B.vertices.length;
        B.centroid.y /= B.vertices.length;

        // Update rotate vertices if necessary
        if (B.angularVelocity !== 0 || B._rotation !== 0 || B._scale !== 0) {
            B.vertices.forEach(vert => {
                vert.translate(-B.centroid.x, -B.centroid.y)
                    .rotate(this._rotation)
                    .multiply(this._scale)
                    .translate(B.centroid.x, B.centroid.y);
            });
        }
    };

    B.isPointInterior = function(x, y) {
        var inside = false;
        for (var i = 0, j = B.vertices.length - 1; i < B.vertices.length; j = i++) {
            let vi = B.vertices[i];
            let vj = B.vertices[j];
            var xi = vi.x,
                yi = vi.y;
            var xj = vj.x,
                yj = vj.y;

            var intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) {
                inside = !inside;
            }
        }
        return inside;
    };

    // Initialize...
    B.updateVertices();
    B.aabb = aabb(B);
    return B;
};

export default polygon;
