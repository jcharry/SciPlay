import Body from './Body';

let circle = function(options) {
    let B = Object.create(Body);
    B.init(options);

    B.radius = options.radius || 0;
    B.type = 'circle';

    return B;
};

export default circle;
