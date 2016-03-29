describe('Near.js', function() {
    // define modules paths
    require.config({
        paths: {
            near: 'base/src/near'
        }
    });

    var TestNear;

    it('should load the AMD module', function(done) {
        require(['near'], function(Near) {
            TestNear = Near;
            expect(Near).toBeDefined();
            done();
        });
    });

    it('can access the AMD module to create a new instance', function() {
        // append popper element
        var popper = document.createElement('div');
        popper.style.width = '100px';
        popper.style.height = '100px';
        jasmineWrapper.appendChild(popper);

        // append trigger element
        var trigger = document.createElement('div');
        jasmineWrapper.appendChild(trigger);

        // initialize new popper instance
        var pop = new TestNear(trigger, popper);

        expect(pop).toBeDefined();
    });

    it('should init a bottom popper', function() {
        var reference = appendNewRef(1);
        var popper    = appendNewPopper(2);

        var pop = new TestNear(reference, popper);

        var top     = popper.getBoundingClientRect().top;
        var local   = 43;
        var ci      = 44;
        console.log(top);
        expect(top === local || top === ci).toBeTruthy();

        pop.destroy();
    });

    it('should init a right popper', function() {
        var reference = appendNewRef(1);
        var popper    = appendNewPopper(2);

        var pop = new TestNear(reference, popper, {
            placement: 'right'
        });

        var left    = popper.getBoundingClientRect().left;
        var local   = 93;
        var ci      = 102;
        console.log(left);
        expect(left === local || left === ci).toBeTruthy();

        pop.destroy();
    });

    it('should create a popper inside a scrolling div, contained in a relative div', function() {
        var relative = document.createElement('div');
        relative.style.height = '800px';
        relative.style.width = '800px';
        jasmineWrapper.appendChild(relative);

        var scrolling = document.createElement('div');
        scrolling.style.width = '800px';
        scrolling.style.height = '800px';
        scrolling.style.overflow = 'auto';
        relative.appendChild(scrolling);

        var superHigh = document.createElement('div');
        superHigh.style.width = '800px';
        superHigh.style.height = '1600px';
        scrolling.appendChild(superHigh);

        var ref = appendNewRef(1, 'ref', superHigh);
        var popper = appendNewPopper(2, 'popper', superHigh);


        scrolling.scrollTop = 500;
        var pop = new TestNear(ref, popper);

        var top     = popper.getBoundingClientRect().top;
        var local   = -457;
        var ci      = -456;
        expect(top === local || top === ci).toBeTruthy();
        pop.destroy();

    });

    it('should init a popper and destroy it using its callback', function(done) {
        var reference = appendNewRef(1);
        var popper    = appendNewPopper(2);

        new TestNear(reference, popper, function(pop) {
            pop.destroy();
            expect(popper.style.top).toBe('');
            done();
        });
    });
});
