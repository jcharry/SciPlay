import vector, {Vector} from '../math/Vector';
import {Simplex} from './Simplex';

const GJK = {
    intersect: function(body1, body2) {
        if (body1.type === 'rectangle') {
            if (body2.type === 'rectangle' || body2.type === 'polygon') { return this.polypoly(body1, body2); }
            if (body2.type === 'circle') { return this.polycircle(body1, body2); }
        }

        if (body1.type === 'circle') {
            if (body2.type === 'rectangle' || body2.type === 'polygon') { return this.polycircle(body2, body1); }
            if (body2.type === 'circle') { return this.circlecircle(body1, body2); }
        }

        if (body1.type === 'polygon') {
            if (body2.type === 'rect' || body2.type === 'polygon') { return polypoly(body1, body2); }
            if (body2.type === 'circle') { return this.polycircle(body1, body2); }
        }
    },

    polypoly: function(b1, b2) {

    },

    polycircle: function(b1, b2) {

    },

    circlecircle: function(b1, b2) {

    },

    pointPoly: function(body, x, y) {
        debugger;
        // Steps

        // Create a simplex and query point
        let simplex = Object.create(Simplex);
        let q = vector(x, y);
        let vertices = body.vertices;

        // 1. Pick a random vertex on the body
        let randVertex = Math.floor(Math.random() * vertices.length);

        // Evolve the simplex for the first time
        simplex.evolve(vertices[randVertex]);

        // 2. Build a search vector from vertex to point
        let searchVector = simplex.getSearchDirection();

        // 3. Determine support point by taking dot product with each vertex
        //    and search vector, and take the largest one
        let supportIndex = simplex.calculateSupportPoint(searchVector, vertices);

        // 4. Evolve the simplex
        simplex.evolve(vertices[supportIndex]);

        // 5. Find the closest point on the 1-simplex (i.e. straight line
        //    between 0-simplex and support point
        let p = simplex.line(x, y);

        // 6. Build a line from p to q
        searchVector = Vector.subtract(q, p);

        // 7. Get new support point and evolve the simplex to a 2-simplex
        support = this.calculateSupportPoint(searchVector, vertices);
        simplex.vertexC = support.clone();

        debugger;
    },

    calculateSupportPoint: function(d, vertices) {
        let index = 0;
        let maxValue = vertices[index].dot(d);
        for (let i = 1; i < vertices.length; i++) {
            let value = vertices[i].dot(d);
            if (value > maxValue) {
                index = i;
                maxValue = value;
            }
        }
        return vertices[index];
    },


    getVoronoiRegions: function(b) {
        // Implementation
    }
};

// const Simplex = {
//     init: function(vertexA, vertexB, vertexC) {
//         this.vertexA = vertexA;
//         this.vertexB = vertexB;
//         this.vertexC = vertexC;
//     },
//
//     point: function(x, y) {
//         if (this.vertexA) {
//             return this.vertexA;
//         }
//     },

//     line: function(x, y) {
//         if (this.vertexA && this.vertexB) {
//             // Return the closest point on the line
// //             First, we compute the barycentric coordinates.
// // From those we determine the Voronoi region and the closest point P.
//
//             // v = (q - a) dot n / (B - A).mag
//             // u = (b - q) dot n / (B - A).mag
//             let q = vector(x, y);
//             let diff = Vector.subtract(this.vertexB, this.vertexA);
//             let diffMag = diff.magnitude();
//             let n = diff.clone();
//             n.normalize();
//             let v = (Vector.subtract(q, this.vertexA)).dot(n) / diffMag;
//             let u = (Vector.subtract(this.vertexB, q)).dot(n) / diffMag;
//
//             if (u <= 0) {
//                 return this.vertexB;
//             }
//             else if (v <= 0) {
//                 return this.vertexA;
//             }
//             else {
//                 let g1 = Vector.multiply(this.vertexA, u)
//                 let g2 = Vector.multiply(this.vertexB, v);
//
//                 return Vector.add(g1, g2);
//             }
//
//             debugger;
//         }
//     },

    // Voronoi regions A, B, C, AB, BC, CA, ABC
//     triangle: function(x, y) {
//         let q = vector(x, y);
//
//         let A = this.vertexA,
//             B = this.vertexB,
//             C = this.vertexC;
//
//         let qb = Vector.subtract(q, B),
//             qa = Vector.subtract(q, A),
//             qc = Vector.subtract(q, C),
//             ab = Vector.subtract(A, B),
//             ba = Vector.subtract(B, A),
//             bc = Vector.subtract(B, C),
//             cb = Vector.subtract(C, B),
//             ca = Vector.subtract(C, A),
//             ac = Vector.subtract(A, C);
//
//         // Compute edge barycentric coordinates (pre-division)
//         // float uAB = Dot(Q - B, A - B);
//         // float vAB = Dot(Q - A, B - A);
//         //
//         // float uBC = Dot(Q - C, B - C);
//         // float vBC = Dot(Q - B, C - B);
//         //
//         // float uCA = Dot(Q - A, C - A);
//         // float vCA = Dot(Q - C, A - C);
//         let uAB = Vector.dot(qb, ab),
//             vAB = Vector.dot(qa, ba);
//
//         let uBC = Vector.dot(qc, bc),
//             vBC = Vector.dot(qb, cb);
//
//         let uCA = Vector.dot(qa, ca),
//             vCA = Vector.dot(qc, ac);
//
//         // Region A
//     if (vAB <= 0 && uCA <= 0) {
//     {
//         m_vertexA.u = 1.0f;
//         m_divisor = 1.0f;
//         m_count = 1;
//         return;
//     }
//
//     // Region B
//     if (uAB <= 0 && vBC <= 0) {
//         // m_vertexA = m_vertexB;
//         // m_vertexA.u = 1.0f;
//         // m_divisor = 1.0f;
//         // m_count = 1;
//         return;
//     }
//
//     // Region C
//     if (uBC <= 0.0f && vCA <= 0.0f)
//     {
//         m_vertexA = m_vertexC;
//         m_vertexA.u = 1.0f;
//         m_divisor = 1.0f;
//         m_count = 1;
//         return;
//     }
//     }
// };

export default GJK;
