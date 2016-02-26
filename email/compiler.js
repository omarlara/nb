var fs = require('fs');
var handlebars = require('handlebars');
var files = fs.readdirSync('partials');

var partialRoute = 'partials/';

var partialName = '';
var content = '';

files.forEach(function (f) {
    partialName = f.replace(/\.hbs$/, '');
    content = fs.readFileSync(partialRoute + f, 'utf-8');
    handlebars.registerPartial(partialName, content);
});

var templateFile = process.argv[2];
var source = fs.readFileSync(templateFile, 'utf-8');

var settings = process.argv[3] || 'data.json';
var template = handlebars.compile(source);
var context = JSON.parse(fs.readFileSync(settings, 'utf8'));
var html = template(context);
console.log(html);
