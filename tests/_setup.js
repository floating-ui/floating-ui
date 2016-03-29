var baseTemplate = window.document.body.innerHTML;
var wrapper = document.createElement('div');
wrapper.id = 'jasmineWrapper';
document.body.appendChild(wrapper);

beforeEach(function() {
    jasmineWrapper.innerHTML = '';
});
