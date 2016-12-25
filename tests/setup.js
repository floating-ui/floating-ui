var wrapper = document.createElement('div');
wrapper.id = 'jasmineWrapper';
document.body.appendChild(wrapper);

beforeEach(function() {
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

    const jasmineWrapper = document.getElementById('jasmineWrapper');
    document.body.style.margin = 0;
    document.body.style.paddingTop = '0.1px';
    jasmineWrapper.innerHTML = '';
    jasmineWrapper.style.minHeight = '100vh';
});
