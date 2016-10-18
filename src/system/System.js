const System = function() {
    this.frames = [];
    this.objects = [];
    this.waves = [];
    this.childWaves = [];
    this.rays = [];
};
System.prototype = {
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
        this.objects.forEach(body => {
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

var system = function() {
    return new System();
};
export default system;
