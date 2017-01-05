const Constraint = {
    init: function(body, system, type) {
        this.type = type;
        this.system = system;
        this.body = body;
    },
    solve: function() {
        switch (this.type) {
            case 'bounds': {
                this.solveBoundaryConstraint(this.body.type);
                break;
            }
            default: {
                break;
            }
        }
    },
    solveBoundaryConstraint: function(bodyType) {
        let minX = this.body.aabb.min.x;
        let minY = this.body.aabb.min.y;
        let maxX = this.body.aabb.max.x;
        let maxY = this.body.aabb.max.y;
        switch (bodyType) {
            case 'circle': {
                let minX = this.body.aabb.min.x;
                let minY = this.body.aabb.min.y;
                let maxX = this.body.aabb.max.x;
                let maxY = this.body.aabb.max.y;
                let radius = this.body.radius;
                if (minX < 0) { this.body.setX(radius); }
                if (minY < 0) { this.body.setY(radius); }
                if (maxX > this.system.width) { this.body.setX(this.system.width - radius); }
                if (maxY > this.system.height) { this.body.setY(this.system.height - radius); }
                break;
            }
            case 'rectangle': {
                let width = maxX - minX;
                let height = maxY - minY;
                if (minX < 0) { this.body.setX((width - this.body.width) / 2); }
                if (minY < 0) { this.body.setY(height - this.body.height) / 2; }
                if (maxX > this.system.width) { this.body.setX(this.system.width - this.body.width - (width - this.body.width ) / 2); }
                if (maxY > this.system.height) { this.body.setY(this.system.height - this.body.height - (height - this.body.height ) / 2); }
                break;
            }
            case 'polygon': {
                let width = maxX - minX;
                let height = maxY - minY;
                if (minX < 0) { this.body.setX(0); }
                if (minY < 0) { this.body.setY(0); }
                if (maxX > this.system.width) { this.body.setX(this.system.width - this.body.width - (width - this.body.width ) / 2); }
                if (maxY > this.system.height) { this.body.setY(this.system.height - this.body.height - (height - this.body.height ) / 2); }
                break;
            }
            default:
                break;
        }
    }
};

const constraint = function(body, system, type) {
    let c = Object.create(Constraint);
    c.init(body, system, type);
    return c;
};

export default constraint;
