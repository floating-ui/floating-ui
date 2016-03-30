var baseTemplate = window.document.body.innerHTML;
var wrapper = document.createElement('div');
wrapper.id = 'jasmineWrapper';
document.body.appendChild(wrapper);

beforeEach(function() {
    jasmineWrapper.innerHTML = '';

    this.addMatchers({
        toBeNear: function(expected, within) {
            within = within || 1;
            return (this.actual >= (expected - within)) && (this.actual <= (expected + within));
        }
    });
});
