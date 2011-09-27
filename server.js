var parsed = [], total = 0, inc, current;

function csv(line) {
    var matches, value, csv = []
      , match = /(,|^)(?:"([^"]*(?:""[^"]*)*)"|([^",]*))/g;
    while (matches = match.exec(line)) {
        if (!matches[1] && csv.length) {
            break;
        } else if (matches[2]) {
            value = matches[2].replace(/""/g, '"');
        } else {
            value = matches[3] || '';
        }
        csv.push(value);
    }
    return csv;
}

inc = require('fs').readFileSync('inc.csv').toString().split('\r\n');

inc.shift(); //Header

inc.forEach(function (line) {
    current = csv(line);
    parsed.push({
        rank            : current[0]
      , company         : current[1]
      , growth3year     : current[2] + '%'
      , revenue2006     : current[10]
      , revenue2009     : current[3]
      , industry        : current[4]
      , industryrank    : current[13].replace('#', '')
      , city            : current[5]
      , state           : current[6]
      , profile         : current[7]
      , website         : current[8]
      , description     : current[9]
      , employees       : current[11]
      , founded         : current[12]
    });
    ++total;
});

require('http').createServer(function (request, response) {

    response.writeHead(200, {'content-type': 'application/json'});
    response.end(JSON.stringify(
        parsed[Math.round(total * Math.random())]
    ));

}).listen(process.env.PORT || 3000);

