import hash from '../math/SpatialHash';

const System = {};
System.prototype = {
    init: function(params) {
        this.frames = [];
        this.objects = [];
        this.waves = [];
        this.childWaves = [];
        this.rays = [];
        this.width = params.width || 600;
        this.height = params.height || 300;

        let divisor = params.cellSize ? params.cellSize : 100;

        let cellSize = this.width / Math.floor(this.width / divisor);
        this.hash = hash(cellSize, this.width, this.height);
    },
    addFrame: function(frame) {
        this.frames.push(frame);
    },
    addRay: function(ray) {
        this.rays.push(ray);
    },
    addWave: function(wave) {
        this.waves.push(wave);
    },
    addChildWave: function(wave) {
        this.childWaves.push(wave);
    },

    /**
     * Add objects to the system
     * Objects not added will not be rendered
     * or updated
     *
     * @param {Body|Body[]} b - a body object, or array of body objects
     */
    addObject: function(b) {
        if (typeof b === 'object' && b.length !== undefined) {
            // b is an array
            b.forEach(body => {
                this.objects.push(body);
            });
        } else {
            this.objects.push(b);
        }
    },
    update: function() {
        this.hash.clear();
        this.objects.forEach(body => {
            this.hash.insertBody(body);
            body.update();
        });

        this.childWaves = [];
        this.waves.forEach(wave => {
            wave.update(this);
            this.traverseWaves(wave);
        });
    },
    traverseWaves: function(wave) {
        if (wave.children.length !== 0) {
            wave.children.forEach(child => {
                this.addChildWave(child);
                this.traverseWaves(child);
            });
        }
    }
};

const system = function(params) {
    const s = Object.create(System.prototype);
    s.init(params);
    return s;
};

export default system;
