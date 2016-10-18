import chai from 'chai';
//import Body from '../../src/bodies/Body';
import circle from '../../src/bodies/Circle';
import rect from '../../src/bodies/Rect';

chai.expect();
const expect = chai.expect;

describe('Body', () => {
    //let body;
    //beforeEach(function() {
        //body = Object.create(Body);
    //});

    it('should test for interior points on circle', () => {
        // Circle test
        let c = circle({
            x: 100,
            y: 100,
            radius: 50
        });

        // Center point
        expect(c.isPointInterior(100, 100)).to.equal(true);

        // On edge
        expect(c.isPointInterior(50, 100)).to.equal(true);
        expect(c.isPointInterior(100, 50)).to.equal(true);
        expect(c.isPointInterior(150, 100)).to.equal(true);
        expect(c.isPointInterior(100, 150)).to.equal(true);

        expect(c.isPointInterior(49.99, 100)).to.equal(false);
        expect(c.isPointInterior(50, 99.99)).to.equal(false);
    });

    it('should test for interior points on rect', () => {
        // Rect test
        let r = rect({
            x: 100,
            y: 100,
            width: 100,
            height: 100
        });

        expect(r.isPointInterior(100, 100)).to.equal(true);
        expect(r.isPointInterior(101, 101)).to.equal(true);

        // False case
        expect(r.isPointInterior(99, 101)).to.equal(false);

        r.mode = 'CENTER';
        //expect(r.isPointInterior(99, 101)).to.equal(false);
    });
});
