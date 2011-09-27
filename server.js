var http = require('http')
  , fs = require('fs');

var inc = fs.readFileSync('inc.csv').toString().split('\r\n');
inc.shift();

var cache = {};
function csv(line, delim, quote, quote_escape) {
    if (typeof delim === 'undefined' || delim === 'csv') {
        delim = ',';
    } else if (delim === 'tsv') {
        delim = '\t';
    }
    quote = quote || '"';
    quote_escape = quote_escape || '"';

    //Check for cached regex patterns
    var match, clean, q;
    if (typeof cache[''+delim+quote+quote_escape] !== 'undefined') {

        var patterns = cache[''+delim+quote+quote_escape];
        match = patterns[0];
        clean = patterns[1];
        q = patterns[2];

    } else {

        //Escape special regex chars
        var d, escape = function (str) {
            return str.replace(new RegExp('[.*+?|()\\[\\]{}]', 'g'), '\\$&');
        }

        d = escape(delim);
        e = escape(quote_escape);
        q = escape(quote);

        match = new RegExp(
            '(' + d + '|^)' +
            '(?:' + q + '([^' + q + ']*(?:' + e + q + '[^' + q + ']*)*)' + q + '|' +
            '([^' + q + d + ']*))'
        , 'g');

        clean = new RegExp(e + q, 'g');

        //Cache the patterns for subsequent calls
        cache[delim+quote+quote_escape] = [match, clean, q];
    }

    var matches = null, value, csv = [];

    while (matches = match.exec(line)) {
        if (!matches[1] && csv.length) {
            break;
        } else if (matches[2]) {
            value = matches[2].replace(clean, q);
        } else {
            value = matches[3] || '';
        }
        csv.push(value);
    }

    return csv;
}

var parsed = [], total;
inc.forEach(function (line) {
    parsed.push(csv(line));
});
total = parsed.length;

function rand() {
    var listing = parsed[Math.round(total * Math.random())];
    return {
        rank            : listing[0]
      , company         : listing[1]
      , growth3year     : listing[2] + '%'
      , revenue2009     : listing[3]
      , industry        : listing[4]
      , city            : listing[5]
      , state           : listing[6]
      , profile         : listing[7]
      , website         : listing[8]
      , description     : listing[9]
      , revenue2006     : listing[10]
      , employees       : listing[11]
      , founded         : listing[12]
      , industryrank    : listing[13]
    };
}

http.createServer(function (request, response) {
    response.writeHead(200, {'content-type': 'application/json'});
    response.end(JSON.stringify(rand()));
}).listen(process.env.PORT || 3000);

