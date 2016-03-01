var partialRoute = 'email/partials/';

var fs = require('fs');
var path = require('path');

var handlebars = require('handlebars');

var files = fs.readdirSync(partialRoute);

var compileTemplate = function  (file) {
    var source = fs.readFileSync(file, 'utf-8');

    var outputDir = process.argv[3] || 'email/output/';
    var outputFile = outputDir + path.basename(file).replace(/\.hbs$/, '.html')

    var settings = process.argv[4] || 'email/settings.json';

    var template = handlebars.compile(source);
    var context = JSON.parse(fs.readFileSync(settings, 'utf8'));
    var html = template(context);

    // write file
    fs.writeFileSync(outputFile, html);
};

var walkIntoPath = function (dir, callback) {
    var list = fs.readdirSync(dir);
    var partialName = '';

    list.forEach(function (file) {
        file = path.resolve(dir, file);
        var stat = fs.statSync (file);
        if (stat && stat.isDirectory()) {
            walkIntoPath(file);
        } else {
            if (callback) {
                callback(file);
            }
        }
    });
};

// Create partial templates
walkIntoPath(partialRoute, function (file) {
    var partialName = file.match(/(_[A-Za-z]+)\.hbs$/);
    var content = '';

    if (!!partialName[1]) {
        partialName = partialName[1];
        content = fs.readFileSync(file, 'utf-8');
        handlebars.registerPartial(partialName, content);
    }
});

// Compile template file(s)
var template = process.argv[2];
var stat = fs.statSync(template);
if (stat.isDirectory()) {
    walkIntoPath(template, function (file) {
        compileTemplate(file);
    });
} else {
    compileTemplate(template);
}
