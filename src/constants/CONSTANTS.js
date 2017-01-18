// Physical Constants
const GRAVITY = {
    LIGHT: 0.00004,
    MEDIUM: 0.0001,
    HEAVY: 0.0004
};
const MATERIALS = {
    Rock: {density: 0.6, restitution: 0.1},
    Wood: {density: 0.3, restitution: 0.2},
    Metal: {density: 1.2, restitution: 0.05},
    BouncyBall: {density: 0.3, restitution: 0.8},
    SuperBall: {density: 0.3, restitution: 0.95},
    Pillow: {density: 0.1, restitution: 0.2},
    Static: {density: 0.0, restitution: 0.4}
};

export {
    MATERIALS,
    GRAVITY
};

