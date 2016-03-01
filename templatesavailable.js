var fs = require('fs');
var handlebars = require('handlebars');

var filename = 'email/templates-available.html';
var stream = fs.createWriteStream(filename);

stream.once('open', function () {
    var html = 
        '<h1>Available Templates</h1>' +
        '<ul>' +
            '{{#each files}}' +
                '<li><a href="output/{{ this }}" target="preview">{{ this }}</a></li>' +
            '{{/each}}' +
        '</ul>';

    var dir = 'email/output';
    var list = fs.readdirSync(dir);
    
    var template = handlebars.compile(html);
    stream.end(
        template({
            files: list
        })
    );
});
