/* eslint
    "no-multi-spaces": "off"
 */
import Body from './Body';

var rect = function(options) {
    let B = Object.create(Body);
    B.init(options);
    B.type = 'rectangle';
    B._mode = options.mode || 'LEFT';

    // Define getters and setters for mode
    Object.defineProperty(B, 'mode', {
        get: function() {
            return this._mode;
        },
        set: function(m) {
            if (this._mode !== m && this.type === 'rectangle') {
                switch (m) {
                    case 'LEFT':
                    case 'CENTER':
                    case 'RIGHT':
                        this._mode = m;
                        this.updateVertices();
                        break;
                    default:
                        console.warn(`Cannot set mode to ${m}`);
                        break;
                }
            } else {
                console.warn(`'mode' is only available on rectangles`);
            }
        }
    });

    B.updateVertices = function() {
        let w = this.width,
            h = this.height,
            x, y;
        switch (this._mode) {
            case 'LEFT':
                x = this.position.x;
                y = this.position.y;
                break;
            case 'CENTER':
                x = this.position.x - w / 2;
                y = this.position.y - h / 2;
                break;
            case 'RIGHT':
                x = this.x - w;
                y = this.y;
                break;
            default:
                break;
        }
        this.vertices = [
            {x: x,     y: y},
            {x: x + w, y: y},
            {x: x + w, y: y + h},
            {x: x,     y: y + h}
        ];
    };

    B.updateSegments = function() {
        // What mode are we in?
        let x, y, w, h;
        //let pos = this.position;
        switch (this._mode) {
            case 'LEFT':
                x = this.position.x;
                y = this.position.y;
                w = this.width;
                h = this.height;
                break;
            case 'CENTER':
                w = this.width;
                h = this.height;
                x = this.position.x - w / 2;
                y = this.position.y - h / 2;
                break;
            case 'RIGHT':
                w = this.width;
                h = this.height;
                x = this.x - w;
                y = this.y;
                break;
            default:
                break;
        }

        //this.vertices = [
            //{x: x,     y: y},
            //{x: x + w, y: y},
            //{x: x + w, y: y + h},
            //{x: x,     y: y + h}
        //];
        this.segments = [
            [[x, y], [x + w, y]],
            [[x + w, y], [x + w, y + h]],
            [[x + w, y + h], [x, y + h]],
            [[x, y + h], [x, y]]
        ];
    };

    B.updateVertices();
    return B;
};

export default rect;
