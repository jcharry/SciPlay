import {degToRad} from '../math/math';
const Renderer = {};
Renderer.prototype = {
    init: function(params) {
        this.clearBackground = true;
        this.debug = params.debug || false;
        this.background = params.background || 'black';
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

        //this.canvas.width = params.width || 600;
        //this.canvas.height = params.height || 300;
        this.ctx = this.canvas.getContext('2d');
    },
    /**
     * Draw bodies and waves
     * @private
     * @param {object} system - phys.system object containing all objects
     */
    renderObjects: function(system) {
        system.objects.forEach(body => {
            this.draw(body);
            //body.draw(this.ctx);
        });

        system.waves.forEach(wave => {
            wave.trace(system, this.ctx);
            wave.draw(this.ctx);
        });

        //system.rays.forEach(ray => {
        //ray.draw(ctx);
        //});
    },
    drawBody: function(body) {
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
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(x + w, y);
                this.ctx.lineTo(x + w, y + h);
                this.ctx.lineTo(x, y + h);
                this.ctx.closePath();
                this.ctx.stroke();
                break;
            }
            case 'circle': {
                this.ctx.fillStyle = body.style.fillStyle;
                this.ctx.lineWidth = body.style.lineWidth;
                this.ctx.strokeStyle = body.style.strokeStyle;

                this.ctx.beginPath();
                this.ctx.ellipse(body.position.x, body.position.y, body.radius, body.radius, 0, 0, Math.PI * 2);
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.fill();
            }
                break;
            default:
                break;
        }
    },
    drawWave: function(wave) {
        // No matter what the angle mode, always use radians
        let angle = wave.mode === 'DEGREES' ? degToRad(wave.direction) : wave.direction;
        this.ctx.fillStyle = wave.style.fillStyle;
        this.ctx.lineWidth = wave.style.lineWidth;
        this.ctx.strokeStyle = wave.style.strokeStyle;
        this.ctx.beginPath();

        // If debug == true, draw waves in certain colors
        if (this.debug) {
            if (wave.type === 'incident') {
                // Draw starting circle
                this.ctx.strokeStyle = 'yellow';
                this.ctx.fillStyle = 'yellow';
                this.ctx.beginPath();
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

        //this.ctx.globalAlpha = map(wave.intensity, 0, 1, 0.3, 1);
        this.ctx.moveTo(wave.position.x, wave.position.y);

        // If the wave intersects an object ahead, then
        // only draw to that object. Otherwise draw an arbitrary length
        if (wave.ray.intersectionPoint) {
            this.ctx.lineTo(wave.ray.intersectionPoint.x, wave.ray.intersectionPoint.y);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'red';
            this.ctx.ellipse(wave.ray.intersectionPoint.x, wave.ray.intersectionPoint.y, 3, 3, 0, 0, Math.PI * 2);
            //this.ctx.stroke();
        } else {
            this.ctx.lineTo(2000 * Math.cos(angle) + wave.position.x, 2000 * Math.sin(angle) + wave.position.y);
            this.ctx.stroke();
        }
    },

    render: function(system) {
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
            self.render(system);
        });

        // Clear background
        if (this.clearBackground) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        // Draw background
        this.ctx.beginPath();
        this.ctx.fillStyle = this.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update the system
        system.update();

        // Draw all objects + waves
        system.objects.forEach(obj => {
            this.drawBody(obj);
        });

        system.waves.forEach(wave => {
            this.drawWave(wave);
        });

        system.childWaves.forEach(wave => {
            this.drawWave(wave);
        });

        if (this.debug === true) {
            let cellSize = system.hash.cellSize;
            for (let i = 0; i < system.hash.width; i+=cellSize) {
                for (let j = 0; j < system.hash.height; j+=cellSize) {
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
                    this.ctx.strokeStyle = 'green';
                    if (system.hash.contents[row][col].length !== 0) {
                        this.ctx.strokeStyle = 'red';
                    }
                    this.ctx.rect(col * cellSize, row * cellSize, cellSize, cellSize);
                    this.ctx.stroke();
                });
            });
        }
        // Render bodies
        //this.renderObjects(system);
    },
    /**
     * Set's size of renderers canvas
     * @param {number} width - width of canvas
     * @param {number} height - height of canvas
     */
    setSize: function(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        //if (shouldUpdateStyle) {
        //canvas.style.width = `${width}px`;
        //canvas.style.height = `${height}px`;
        //}
    },
    /**
     * Stop animation cycle
     * @public
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
