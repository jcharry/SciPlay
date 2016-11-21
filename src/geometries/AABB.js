/* eslint
    "no-else-return": "off"
 */
let AABB = {
    init: function(body) {
        this.body = body;
        let bounds = this.findMinMax(body);
        this.max = bounds.max;
        this.min = bounds.min;
    },
    /**
     * Finds bounds of AABB
     * Does not set any properties
     * If you want to find and set, call AABB.update()
     * @return {object} bounds
     */
    findMinMax: function() {
        // Only deal with two types of bodies...Those with vertices, and
        // circles
        if (this.body.vertices) {
            let minx,
                miny,
                maxx,
                maxy;
            this.body.vertices.forEach(v => {
                let x = v.x,
                    y = v.y;

                // If nothing has been set, then set it
                if (typeof minx === 'undefined') {
                    minx = x;
                } else if (typeof minx !== 'undefined' && x < minx) {
                    // Something's already there, only update if x < minx
                    minx = x;
                }

                if (typeof miny === 'undefined') {
                    miny = y;
                } else if (typeof miny !== 'undefined' && y < miny) {
                    miny = y;
                }

                if (typeof maxx === 'undefined') {
                    maxx = x;
                } else if (typeof maxx !== 'undefined' && x > maxx) {
                    maxx = x;
                }

                if (typeof maxy === 'undefined') {
                    maxy = y;
                } else if (typeof maxy !== 'undefined' && y > maxy) {
                    maxy = y;
                }
            });

            return {
                max: {
                    x: maxx,
                    y: maxy
                },
                min: {
                    x: minx,
                    y: miny
                }
            };
        } else {
            // Assume it's a circle
            let cx = this.body.position.x,
                cy = this.body.position.y,
                r = this.body.radius;
            return {
                max: {
                    x: cx + r,
                    y: cy + r
                },
                min: {
                    x: cx - r,
                    y: cy - r
                }
            };
        }
    },

    /**
     * Returns true of point is inside AABB
     * @param {Point} point - must contain x and y props
     * @return {bool} true if point is inside AABB
     */
    contains: function(point) {
        let x = point.x,
            y = point.y;
        if (x >= this.min.x &&
            x <= this.max.x &&
            y >= this.min.y &&
            y <= this.max.y) {
            return true;
        }

        return false;
    },

    /**
     * Updates the AABB
     */
    update: function() {
        let bounds = this.findMinMax();
        this.max = bounds.max;
        this.min = bounds.min;
    }
};

let aabb = function(body) {
    let ab = Object.create(AABB);
    ab.init(body);
    return ab;
};

export default aabb;