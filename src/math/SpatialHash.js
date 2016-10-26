const SpatialHash = {};
SpatialHash.prototype = {
    init: function(cellSize, width, height) {
        this.cellSize = cellSize;
        this.width = width;
        this.height = height;
        this.numRows = Math.ceil(height / cellSize);
        this.numCols = width / cellSize;
    },

    /**
     * Return location that should store this point
     * @param {object} point - object with x and y properties
     * @return {object} - bucket which th epoint falls into
     */
    hash: function(point) {
        return {col: Math.floor(point.x / this.cellSize), row: Math.floor(point.y / this.cellSize)};
    },
    insertBody: function(body) {
        // Hash the vertices of the AABB
        let min = this.hash(body.aabb.min);
        let max = this.hash(body.aabb.max);

        // Iterate over rectangular region
        // And put the object in all buckets that
        // it hits
        for (let r = min.row; r < max.row + 1; r++) {
            for (let c = min.col; c < max.col + 1; c++) {
                if (this.contents[r]) {
                    if (this.contents[r][c]) {
                        this.contents[r][c].push(body);
                    } else {
                        this.contents[r][c] = [body];
                    }
                } else {
                    this.contents[r] = {};
                    this.contents[r][c] = [body];
                }
            }
        }
    },
    removeBody: function(body) {
        let min = this.hash(body.aabb.min);
        let max = this.hash(body.aabb.max);

        // Iterate over rectangular region
        // And remove the object from all found buckets
        for (let r = min.row; r < max.row + 1; r++) {
            for (let c = min.col; c < max.col + 1; c++) {
                let idx = this.contents[r][c].indexOf(body);
                if (idx !== -1) {
                    this.contents[r][c].splice(idx, 1);
                }
            }
        }
    },
    queryBody: function(body) {
        let min = this.hash(body.aabb.min);
        let max = this.hash(body.aabb.max);
        let nearby = [];

        // Iterate over rectangular region
        // And put the object in all buckets that
        // it hits
        for (let r = min.row; r < max.row + 1; r++) {
            for (let c = min.col; c < max.col + 1; c++) {
                this.contents[r][c].forEach(b => {
                    if (nearby.indexOf(b) === -1 && b !== body) {
                        nearby.push(b);
                    }
                });
            }
        }
        return nearby;
    },
    queryPoint: function(point) {
        let hash = this.hash(point);
        return hash;
    },
    clear: function() {
        this.contents = {};
    }
};

const hash = function(cellSize, width, height) {
    let h = Object.create(SpatialHash.prototype);
    h.init(cellSize, width, height);
    return h;
};

export default hash;
