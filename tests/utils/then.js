export default function then(callback) {
    setTimeout(callback, jasmine.THEN_DELAY);
    jasmine.THEN_DELAY += 100;
}

beforeEach(() => jasmine.THEN_DELAY = 0);
