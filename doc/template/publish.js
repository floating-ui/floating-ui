/*eslint no-nested-ternary:0, space-infix-ops: 0 */
/**
    @overview Builds a tree-like JSON string from the doclet data.
    @version 0.0.3
 */

// MODIFIED TO WRITE THE OUTPUT TO FILE

'use strict';

var path = require('jsdoc/path');
var fs = require('jsdoc/fs');

var hasOwnProp = Object.prototype.hasOwnProperty;

function graft(parentNode, childNodes, parentLongname, parentName) {
    childNodes
    .filter(function (element) {
        return (element.memberof === parentLongname);
    })
    .forEach(function (element, index) {
        var i,
            len;

        if (element.kind === 'namespace') {
            if (!parentNode.namespaces) {
                parentNode.namespaces = [];
            }

            var thisNamespace = {
                'name': element.name,
                'description': element.description || '',
                'access': element.access || '',
                'virtual': !!element.virtual
            };

            parentNode.namespaces.push(thisNamespace);

            graft(thisNamespace, childNodes, element.longname, element.name);
        }
        else if (element.kind === 'mixin') {
            if (!parentNode.mixins) {
                parentNode.mixins = [];
            }

            var thisMixin = {
                'name': element.name,
                'description': element.description || '',
                'access': element.access || '',
                'virtual': !!element.virtual
            };

            parentNode.mixins.push(thisMixin);

            graft(thisMixin, childNodes, element.longname, element.name);
        }
        else if (element.kind === 'function') {
            if (!parentNode.functions) {
                parentNode.functions = [];
            }

            var thisFunction = {
                'name': element.name,
                'access': element.access || '',
                'virtual': !!element.virtual,
                'description': element.description || '',
                'parameters': [ ],
                'examples': []
            };

            parentNode.functions.push(thisFunction);

            if (element.returns) {
                thisFunction.returns = {
                    'type': element.returns[0].type? element.returns[0].type.names : [],
                    'description': element.returns[0].description || ''
                };
            }

            if (element.examples) {
                for (i = 0, len = element.examples.length; i < len; i++) {
                    thisFunction.examples.push(element.examples[i]);
                }
            }

            if (element.params) {
                for (i = 0, len = element.params.length; i < len; i++) {
                    thisFunction.parameters.push({
                        'name': element.params[i].name,
                        'type': element.params[i].type? element.params[i].type.names : [],
                        'description': element.params[i].description || '',
                        'default': hasOwnProp.call(element.params[i], 'defaultvalue') ? element.params[i].defaultvalue.toString() : '',
                        'optional': typeof element.params[i].optional === 'boolean'? element.params[i].optional : '',
                        'nullable': typeof element.params[i].nullable === 'boolean'? element.params[i].nullable : ''
                    });
                }
            }
        }
        else if (element.kind === 'member') {
            if (!parentNode.properties) {
                parentNode.properties = [];
            }
            parentNode.properties.push({
                'name': element.name,
                'access': element.access || '',
                'virtual': !!element.virtual,
                'description': element.description || '',
                'type': element.type? element.type : []
            });
        }

        else if (element.kind === 'event') {
            if (!parentNode.events) {
                parentNode.events = [];
            }

            var thisEvent = {
                'name': element.name,
                'access': element.access || '',
                'virtual': !!element.virtual,
                'description': element.description || '',
                'parameters': [],
                'examples': []
            };

            parentNode.events.push(thisEvent);

            if (element.returns) {
                thisEvent.returns = {
                    'type': element.returns.type? element.returns.type.names : [],
                    'description': element.returns.description || ''
                };
            }

            if (element.examples) {
                for (i = 0, len = element.examples.length; i < len; i++) {
                    thisEvent.examples.push(element.examples[i]);
                }
            }

            if (element.params) {
                for (i = 0, len = element.params.length; i < len; i++) {
                    thisEvent.parameters.push({
                        'name': element.params[i].name,
                        'type': element.params[i].type? element.params[i].type.names : [],
                        'description': element.params[i].description || '',
                        'default': hasOwnProp.call(element.params[i], 'defaultvalue') ? element.params[i].defaultvalue.toString() : '',
                        'optional': typeof element.params[i].optional === 'boolean'? element.params[i].optional : '',
                        'nullable': typeof element.params[i].nullable === 'boolean'? element.params[i].nullable : ''
                    });
                }
            }
        }
        else if (element.kind === 'class') {
            if (!parentNode.classes) {
                parentNode.classes = [];
            }

            var thisClass = {
                'name': element.name,
                'description': element.classdesc || '',
                'extends': element.augments || [],
                'access': element.access || '',
                'virtual': !!element.virtual,
                'fires': element.fires || '',
                'constructor': {
                    'name': element.name,
                    'description': element.description || '',
                    'parameters': [
                    ],
                    'examples': []
                }
            };

            parentNode.classes.push(thisClass);

            if (element.examples) {
                for (i = 0, len = element.examples.length; i < len; i++) {
                    thisClass.constructor.examples.push(element.examples[i]);
                }
            }

            if (element.params) {
                for (i = 0, len = element.params.length; i < len; i++) {
                    thisClass.constructor.parameters.push({
                        'name': element.params[i].name,
                        'type': element.params[i].type? element.params[i].type.names : [],
                        'description': element.params[i].description || '',
                        'default': hasOwnProp.call(element.params[i], 'defaultvalue') ? element.params[i].defaultvalue.toString() : '',
                        'optional': typeof element.params[i].optional === 'boolean'? element.params[i].optional : '',
                        'nullable': typeof element.params[i].nullable === 'boolean'? element.params[i].nullable : ''
                    });
                }
            }

            graft(thisClass, childNodes, element.longname, element.name);
       }
    });
}

/**
    @param {TAFFY} data
    @param {object} opts
 */
exports.publish = function(data, opts) {
    var root = {},
        docs;

    data({undocumented: true}).remove();
    docs = data().get(); // <-- an array of Doclet objects

    graft(root, docs);

    var output;
    if (opts.query && opts.query.format === 'xml') {
        var xml = require('js2xmlparser');
        output = xml('jsdoc', root);
    }
    else {
        output = require('jsdoc/util/dumper').dump(root);
    }
    fs.writeFileSync(path.join(opts.destination, 'documentation.' + (opts.query.format || 'json')), output, 'utf8');
};
