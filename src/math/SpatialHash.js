let SpatialHash = {
    init: function(cellSize) {
        this.cellSize = cellSize;
        this.contents = {}:
    },
    hash: function(point) {
        return {x: point.x / this.cellSize, y: point.y / this.cellSize}
    }
}
