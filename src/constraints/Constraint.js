// import {Vector} from '../math/Vector';

const Constraint = {
    init: function(body1, body2, bounds, distance, forces) {
        this.body1 = body1;
        this.body2 = body2;
        this.bounds = bounds;
        this.distance = distance;
        this.forces = forces;
    }
    // enable: function() {
    //     if (this.body1) {
    //         this.body1.constraints.push(this);
    //     }
    //     if (this.body2) {
    //         this.body2.constraints.push(this);
    //     }
    // }
};

const constraint = function(...args) {
    let type = args[0];
    let c = Object.create(Constraint);
    c.type = args[0];

    switch (type) {
        case 'boundary':
            c.init(args[1], null, args[3], null, null);
            break;
        case 'link':
            c.init(args[1], args[2], null, args[3], null);
            break;
        default:
            throw new Error('I don\'t know how to handle that kind of constraint!');
    }

    return c;
};

export default constraint;
