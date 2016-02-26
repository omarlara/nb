var handlebars = require('handlebars');
var fs = require('fs');

var compileTemplate = process.argv[2];
var contentTemplate = fs.readFileSync(compileTemplate, 'utf-8');

var template = handlebars.compile(contentTemplate);
var html = template({ hola: 'hola!' });

