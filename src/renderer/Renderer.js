import * as math from '../math/math';
const Renderer = {};
Renderer.prototype = {
    init: function(system, params) {
        this.clearBackground = true;
        this.background = params.background || 'black';
        this.system = system;
        // this.loop = loop;

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

        // Set canvas based on system size
        this.canvas.width = this.system.width;
        this.canvas.height = this.system.height;
        this.ctx = this.canvas.getContext('2d');

        // Timing for render loop
        this.frameTimestep = 0;
        this.fps = 60;
        this.dt = 1000 / this.fps;

        // Debug Params
        this.debug = params.debug || false;
        if (this.debug) {
            window.renderer = this;
            window.ctx = this.canvas.getContext('2d');
        }
    },

    /**
     * Resize the canvas
     * @param {number} width - new width of canvas
     * @param {number} height - new height of canvas
     * @param {number} [cellSize] - optional. set a new cell size for the
     * spatial hash
     */
    resize: function(width, height, cellSize) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.system.width = width;
        this.system.height = height;
        this.system.cellSize = this.system.calculateCellSize(cellSize || this.system.cellSize);
        this.system.hash = this.system.initializeHash(this.system.cellSize, width, height);
    },

    /**
     * Draw a body object
     * @private
     * @param {Body} body - phys.system object containing all objects
     */
    drawBody: function(body, pct) {
        if (body.debug) {
            if (body.type === 'circle') {
                this.ctx.beginPath();
                let cx = body.position.x;
                let cy = body.position.y;
                let rx = Math.cos(body.rotation) * body.radius;
                let ry = Math.sin(body.rotation) * body.radius;
                this.ctx.moveTo(cx, cy);
                this.ctx.lineTo(cx + rx, cy + ry);
                this.ctx.strokeStyle = 'red';
                this.ctx.stroke();
            }
            this.ctx.beginPath();
            let aabb = body.aabb;
            let x = aabb.min.x;
            let y = aabb.min.y;
            let w = aabb.max.x - x;
            let h = aabb.max.y - y;
            this.ctx.rect(x, y, w, h);
            this.ctx.strokeStyle = 'red';
            this.ctx.lineWidth = .5;
            this.ctx.stroke();
        }
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

            if (body.vertices) {
                body.vertices.forEach(vert => {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = 'magenta';
                    this.ctx.lineWidth = 2;
                    this.ctx.ellipse(vert.x, vert.y, 4, 4, 0, 0, Math.PI * 2);
                    this.ctx.stroke();
                });
            }
            if (body.centroid) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = 'red';
                this.ctx.lineWidth = 3;
                this.ctx.ellipse(body.centroid.x, body.centroid.y, 3, 3, 0, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        }

        // Start a new path for each body
        this.ctx.beginPath();
        this.ctx.globalAlpha = 1;
        switch (body.type) {
            case 'rectangle': {
                this.ctx.fillStyle = body.style.fillStyle;
                this.ctx.lineWidth = body.style.lineWidth;
                this.ctx.strokeStyle = body.style.strokeStyle;
                this.ctx.lineJoin = 'miter';
                if (body.debug) {
                    if (body.colliderList.length > 0) {
                        this.ctx.strokeStyle = 'green';
                    } else {
                        this.ctx.strokeStyle = 'white';
                    }
                }
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
            case 'circle': {
                this.ctx.fillStyle = body.style.fillStyle;
                this.ctx.lineWidth = body.style.lineWidth;
                this.ctx.strokeStyle = body.style.strokeStyle;

                if (body.debug) {
                    if (body.colliderList.length > 0) {
                        this.ctx.strokeStyle = 'green';
                    } else {
                        this.ctx.strokeStyle = 'white';
                    }
                }

                this.ctx.ellipse(
                    body.position.x,
                    body.position.y,
                    body.scaledRadius,
                    body.scaledRadius,
                    0,
                    0,
                    Math.PI * 2
                );
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
        this.ctx.globalAlpha = math.map(wave.intensity, 0, 1, 0.1, 1);

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

    // Combined Patterns from Matter.js
    // - https://github.com/liabru/matter-js/blob/master/src/core/Runner.js
    // and this tutorial:
    // https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-core-engine--gamedev-7493#timestepping
    run: function() {
        let self = this;
        this.lastTick = 0;
        let animate = time => {
            this._requestID = window.requestAnimationFrame(animate);

            if (time) {
                this.tick(time);
            }
        };
        animate();
    },

    // Clamping frameTimestep make a gigantic difference
    tick: function(time) {
        // Get time between this and the previous ticks
        let elapsedTime = time - this.lastTick;

        // Add the time to a counter
        this.frameTimestep += elapsedTime;

        // Update previous tick time
        this.lastTick = time;

        // Magic happens here
        // if the elapsed time between this tick and the last tick is large
        // (because the update or render code took a long time), then the
        // engine would stall out.  Nothing would update while we're waiting
        // for the long running code to finish.  So we clamp down the frame
        // timestep to a small value.
        if (this.frameTimestep > 50) {
            this.frameTimestep = 50;
        }

        // If there's a large difference between the time of this frame and the
        // previous frame, then this code will run a bunch of times,
        // essentially stalling the renderer.  The engine can't render while
        // the physics is updating, after all.  To combat this, we clamp down
        // the frameTimestep above so that only a few updates run before
        // everything renders.
        while (this.frameTimestep > this.dt) {
            this.system.update(this.dt);
            this.frameTimestep -= this.dt;
        }

        // In the case where the frameTimestep is some in between value between
        // 0 and dt, we can linearly interpolate rendered values of the bodies
        // this won't actually effect the physics, but it'll make things look
        // smoother
        // pct is the fraction between 0 and dt, thus we should interpolate
        // the position by that percentage
        let pct = this.frameTimestep / this.dt;
        // Render the system
        this.render(pct);
    },

    render: function(pct) {
        // Clear background
        if (this.clearBackground) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        // Draw backgroun
        this.ctx.beginPath();
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = this.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update the system
        // FIXME: this.laststate isn't doing anything right now
        // this.lastState = this.system.update(this.timing);

        // Draw all objects + waves
        this.system.bodies.forEach(body => {

            this.drawBody(body, pct);
        });

        // Update all waves
        this.system.waves.forEach(wave => {
            this.drawWave(wave, pct);
        });

        // Update all child waves
        this.system.childWaves.forEach(wave => {
            this.drawWave(wave, pct);
        });

        // If in debug mode, draw spatial hash
        // and highlight nodes that contain items in red
        if (this.debug === true) {
            let cellSize = this.system.hash.cellSize;
            this.ctx.globalAlpha = 1;
            this.ctx.lineWidth = 1;
            for (let i = 0; i < this.system.hash.width; i += cellSize) {
                for (let j = 0; j < this.system.hash.height; j += cellSize) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = 'green';
                    this.ctx.rect(i, j, cellSize, cellSize);
                    this.ctx.stroke();
                }
            }
            Object.keys(this.system.hash.contents).forEach(row => {
                Object.keys(this.system.hash.contents[row]).forEach(col => {
                    // Draw all squares
                    this.ctx.beginPath();
                    // this.ctx.strokeStyle = 'green';
                    if (this.system.hash.contents[row][col].length !== 0) {
                        this.ctx.strokeStyle = 'red';
                        this.ctx.lineWidth = 1;
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
        cancelAnimationFrame(this._requestID);
    },

    /**
     * Restart animation cycle
     */
    start: function() {
        this.render(this.system);
    }
};

var renderer = function(system, params) {
    let R = Object.create(Renderer.prototype);
    R.init(system, params);
    return R;
};

export default renderer;
