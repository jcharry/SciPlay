import * as math from '../math/math';
const Renderer = {};
Renderer.prototype = {
    init: function(params) {
        this.clearBackground = true;
        this.debug = params.debug || false;
        this.background = params.background || 'black';

        // Initialize Canvas element
        // Pardon the ugly ternary...
        this.canvas = (typeof params.canvas === 'undefined') ?
            (function() {
                let c = document.createElement('canvas');
                c.id = 'canvas';
                // Set default size
                document.body.appendChild(c);
                return c;
            })() : (function() {
                // Default values for canvas size
                let c = document.getElementById(params.canvas);
                return c;
            })();

        if (this.debug) {
            window.renderer = this;
            window.ctx = this.canvas.getContext('2d');
        }

        //this.canvas.width = params.width || 600;
        //this.canvas.height = params.height || 300;
        this.ctx = this.canvas.getContext('2d');
    },

    /**
     * Resize the canvas
     * @param {number} width - new width of canvas
     * @param {number} height - new height of canvas
     */
    resize: function(width, height, cellSize) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.system.width = width;
        this.system.height = height;
        this.system.cellSize = system.calculateCellSize(cellSize || this.system.cellSize);
        this.system.hash = this.system.initializeHash(this.system.cellSize, width, height);
    },

    /**
     * Draw a body object
     * @private
     * @param {Body} body - phys.system object containing all objects
     */
    drawBody: function(body) {
        if (this.debug) {
            this.ctx.beginPath();
            this.ctx.globalAlpha = 1;
            this.ctx.strokeStyle = 'red';
            this.ctx.lineWidth = 1;

            let aabb = body.aabb;
            let x = aabb.min.x;
            let y = aabb.min.y;
            let w = aabb.max.x - x;
            let h = aabb.max.y - y;
            this.ctx.rect(x, y, w, h);
            this.ctx.stroke();
        }

        // Start a new path for each body
        this.ctx.beginPath();
        this.ctx.globalAlpha = 1;
        switch (body.type) {
            case 'rectangle': {
                this.ctx.fillStyle = body.style.fillStyle;
                this.ctx.lineWidth = body.style.lineWidth;
                this.ctx.strokeStyle = body.style.strokeStyle;
                let x, y, w, h;
                switch (body._mode) {
                    case 'LEFT': {
                        x = body.position.x;
                        y = body.position.y;
                        w = body.width;
                        h = body.height;
                        break;
                    }
                    case 'CENTER':
                        w = body.width;
                        h = body.height;
                        x = body.position.x - w / 2;
                        y = body.position.y - h / 2;
                        break;
                    case 'RIGHT':
                        w = body.width;
                        h = body.height;
                        x = body.position.x - w;
                        y = body.position.y;
                        break;
                    default:
                        break;
                }
                this.ctx.lineJoin = 'miter';
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(x + w, y);
                this.ctx.lineTo(x + w, y + h);
                this.ctx.lineTo(x, y + h);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
                break;
            }
            case 'circle': {
                this.ctx.fillStyle = body.style.fillStyle;
                this.ctx.lineWidth = body.style.lineWidth;
                this.ctx.strokeStyle = body.style.strokeStyle;

                this.ctx.ellipse(body.position.x, body.position.y, body.radius, body.radius, 0, 0, Math.PI * 2);
                // this.ctx.closePath();
                this.ctx.stroke();
                // this.ctx.fill();
                break;
            }
            case 'polygon': {
                this.ctx.fillStyle = body.style.fillStyle;
                this.ctx.lineWidth = body.style.lineWidth;
                this.ctx.strokeStyle = body.style.strokeStyle;
                this.ctx.lineJoin = 'miter';
                this.ctx.moveTo(body.vertices[0].x, body.vertices[0].y);
                for (let i = 1; i < body.vertices.length; i++) {
                    let v = body.vertices[i];
                    this.ctx.lineTo(v.x, v.y);
                }
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
                break;
            }
            default:
                break;
        }
    },
    drawWave: function(wave) {
        // No matter what the angle mode, always use radians
        let angle = wave.mode === 'DEGREES' ? math.degToRad(wave.direction) : wave.direction;

        // Set wave style properties
        this.ctx.fillStyle = wave.style.fillStyle;
        this.ctx.lineWidth = wave.style.lineWidth;
        this.ctx.strokeStyle = wave.style.strokeStyle;
        this.ctx.globalAlpha = math.map(wave.intensity, 0, 1, 0.3, 1);

        // If debug == true, draw waves in certain colors
        if (this.debug) {
            if (wave.type === 'incident') {
                // Draw starting circle
                this.ctx.beginPath();
                this.ctx.fillStyle = 'yellow';
                this.ctx.ellipse(wave.position.x, wave.y, 3, 3, 0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.strokeStyle = 'green';
            } else if (wave.type === 'refracted') {
                this.ctx.strokeStyle = 'blue';
            } else if (wave.type === 'reflected') {
                this.ctx.strokeStyle = 'orange';
            }
        }

        this.ctx.beginPath();
        this.ctx.moveTo(wave.position.x, wave.position.y);

        // If the wave intersects an object ahead, then
        // only draw to that object. Otherwise draw an arbitrary length
        if (wave.ray.intersectionPoint) {
            this.ctx.lineTo(wave.ray.intersectionPoint.x, wave.ray.intersectionPoint.y);
            this.ctx.stroke();

            // Draw intersection points as circles
            // when in debug mode
            if (this.debug) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = 'red';
                this.ctx.lineWidth = 0.5;
                this.ctx.ellipse(wave.ray.intersectionPoint.x, wave.ray.intersectionPoint.y, 3, 3, 0, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        } else {
            this.ctx.lineTo(2000 * Math.cos(angle) + wave.position.x, 2000 * Math.sin(angle) + wave.position.y);
            this.ctx.stroke();
        }
    },

    render: function(system, updateFn) {
        // The first time the system renders,
        // capture a local reference to it
        // to be used to restart the renderer later
        // if it's ever stopped
        if (!this.system) {
            this.system = system;
            this.canvas.width = this.system.width;
            this.canvas.height = this.system.height;
        }

        // In order to pass 'system' into render
        // we have to wrap it in a function before
        // passing it to requestAnimationFrame
        let self = this;
        this._requestID = requestAnimationFrame(function() {
            self.render(system, updateFn);
        });

        // Clear background
        if (this.clearBackground) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        // Draw background
        this.ctx.beginPath();
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = this.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Call user draw code
        updateFn();

        // Update the system
        // FIXME: this.laststate isn't doing anything right now
        this.lastState = system.update();

        // Draw all objects + waves
        system.bodies.forEach(body => {
            this.drawBody(body);
        });

        // Update all waves
        system.waves.forEach(wave => {
            this.drawWave(wave);
        });

        // Update all child waves
        system.childWaves.forEach(wave => {
            this.drawWave(wave);
        });

        // If in debug mode, draw spatial hash
        // and highlight nodes that contain items in red
        if (this.debug === true) {
            let cellSize = system.hash.cellSize;
            this.ctx.globalAlpha = 1;
            this.ctx.lineWidth = 0.5;
            for (let i = 0; i < system.hash.width; i += cellSize) {
                for (let j = 0; j < system.hash.height; j += cellSize) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = 'green';
                    this.ctx.rect(i, j, cellSize, cellSize);
                    this.ctx.stroke();
                }
            }
            Object.keys(system.hash.contents).forEach(row => {
                Object.keys(system.hash.contents[row]).forEach(col => {
                    // Draw all squares
                    this.ctx.beginPath();
                    // this.ctx.strokeStyle = 'green';
                    if (system.hash.contents[row][col].length !== 0) {
                        this.ctx.strokeStyle = 'red';
                    }
                    this.ctx.rect(col * cellSize, row * cellSize, cellSize, cellSize);
                    this.ctx.stroke();
                });
            });
        }
    },

    /**
     * Set's size of renderers canvas
     * @param {number} width - width of canvas
     * @param {number} height - height of canvas
     */
    setSize: function(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    },
    /**
     * Stop animation cycle
     */
    stop: function() {
        cancelAnimationFrame(this.requestID);
    },

    /**
     * Restart animation cycle
     */
    start: function() {
        this.render(this.system);
    }
};

var renderer = function(params) {
    let R = Object.create(Renderer.prototype);
    R.init(params);
    return R;
};

export default renderer;
