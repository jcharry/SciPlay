import chai from 'chai';
import SAT from '../../src/collision/SAT';
import rect from '../../src/bodies/Rect';

chai.expect();
const expect = chai.expect;

describe('SAT', () => {
    it('should determine if two lines overlap', () => {
        let p1 = {min: 200, max: 350};
        let p2 = {min: 250, max: 400};
        let overlap = SAT.lineOverlap(p1.min, p1.max, p2.min, p2.max);
        console.log(overlap);
        expect(overlap).to.not.equal(0);

        p2 = {min: 200, max: 350};
        p1 = {min: 250, max: 400};
        overlap = SAT.lineOverlap(p1.min, p1.max, p2.min, p2.max);
        console.log(overlap);
        expect(overlap).to.not.equal(0);

        p1 = {min: -900, max: -700};
        p2 = {min: -800, max: -600};
        overlap = SAT.lineOverlap(p1.min, p1.max, p2.min, p2.max);
        console.log(overlap);
        expect(overlap).to.not.equal(0);

        p2 = {min: -900, max: -700};
        p1 = {min: -800, max: -600};
        overlap = SAT.lineOverlap(p1.min, p1.max, p2.min, p2.max);
        console.log(overlap);
        expect(overlap).to.not.equal(0);

        p2 = {min: -900, max: -700};
        p1 = {min: -699, max: -600};
        overlap = SAT.lineOverlap(p1.min, p1.max, p2.min, p2.max);
        console.log(overlap);
        expect(overlap).to.equal(0);
    });

    it('should handle rect-rect intersection', () => {
        let r1 = rect({x: 100, y: 100, width: 100, height: 100});
        let r2 = rect({x: 199, y: 199, width: 10, height: 10});

        let collision = SAT.rectrect(r1, r2);
        expect(collision).to.equal(true);

        // Order of args shouldn't matter
        collision = SAT.rectrect(r2, r1);
        expect(collision).to.equal(true);

        // Test 2 - non overlapping
        r1 = rect({x: 100, y: 100, width: 100, height: 100});
        r2 = rect({x: 201, y: 199, width: 10, height: 10});
        collision = SAT.rectrect(r1, r2);
        expect(collision).to.equal(false);

        // Test 3 - containment
        // TODO: Doesn't work yet
        // r1 = rect({x: 100, y: 100, width: 100, height: 100});
        // r2 = rect({x: 110, y: 110, width: 10, height: 10});
        // collision = SAT.rectrect(r1, r2);
        // expect(collision).to.equal(false);

        // Test 4 - collision
        r1 = rect({x: 85.25, y: 103.47, width: 23.1, height: 18.9});
        r2 = rect({x: 83.1, y: 90.5, width: 4, height: 14});
        collision = SAT.rectrect(r1, r2);
        expect(collision).to.equal(true);
    });
});

