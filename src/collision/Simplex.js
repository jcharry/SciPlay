/*
 * Simplex.js
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import vector, {Vector} from '../math/Vector';

let calculateSupportPoint = function(d, vertices) {
}

/// Simplex used by the GJK algorithm.
export const Simplex = {
    evolve: function(point) {
        debugger;
        // We can only put three points onto the simplex
        if (this.count < 2) {
            if (this.vertexA === undefined) {
                this.vertexA = simplexVertex(point);
            } else if (this.vertexB === undefined) {
                this.vertexB = simplexVertex(point);
            } else if (this.vertexC === undefined) {
                this.vertexC = simplexVertex(point);
            }
            this.count++;
        } else {
            throw new Error('cannot evolve a simplex beyond 3 points');
        }
    },

    getSupportPoint: function(d, vertices) {
        let index = 0;
        let maxValue = vertices[index].dot(d);
        for (let i = 1; i < vertices.length; i++) {
            let value = vertices[i].dot(d);
            if (value > maxValue) {
                index = i;
                maxValue = value;
            }
        }
        return index;
    },

    getSearchDirection: function() {
        switch (this.count) {
            case 1:
                return Vector.negate(this.vertexA);
            case 2:
                let edgeAB = Vector.subtract(vertexB.point, vertexA.point);
                // let sgn = edgeAb.cross()
        }
        // return vector
    },
    getClosestPoint: function() {
        // return vector
    },
    getWitnessPoints: function(point1, point2) {

    },
    solve2: function(P) {

    },
    solve3: function(P) {

    },
    divisor: 0,
    count: 0
};

let simplexVertex = function(point1, point2, u, index1, index2) {
    return {
        point1,
        point2,
        point: Vector.subtract(point1, point2),
        index1,
        index2
    }
};

/// Output for the distance function.
// struct Output
// {
//     enum
//     {
//         e_maxSimplices = 20
//     };
//
//     Vec2 point1;		///< closest point on polygon 1
//     Vec2 point2;		///< closest point on polygon 2
//     float distance;
//     int iterations;		///< number of GJK iterations used
//
//     Simplex simplices[e_maxSimplices];
//     int simplexCount;
// };
