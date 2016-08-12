var wrapper = document.createElement('div');
wrapper.id = 'jasmineWrapper';
document.body.appendChild(wrapper);

beforeEach(function() {
    jasmineWrapper.innerHTML = '';

    jasmine.addMatchers({
        toBeApprox: function() {
            return {
                compare: function(actual, expected, within) {
                    within = within || 1.5;
                    return { pass: (actual >= (expected - within)) && (actual <= (expected + within)) };
                }
            };
        }
    });
});
