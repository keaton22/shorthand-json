var json = '';
var inputElement = document.querySelector('#input'); 
var outputElement = document.querySelector('#output'); 
//var matchRemainingCharacters = '(\^|\;|\,)?(?<remaining>.*)';           // match a ">", ";", or ",", as well as any remaining shorthand
var matchObjectOpening = new RegExp(`^\>(?<remaining>.*)$`, '');
var matchObjectKey = new RegExp(`^(?<key>[^\>\#\;\,]+?)\:(?<remaining>.*)$`, '');
//var matchObjectClosing = new RegExp(`^\^(?<remaining>.*)$`, '');
var matchObjectClosing = /^\^(?<remaining>.*)$/;
var matchArrayOpening = new RegExp(`^\#(?<remaining>.*)$`, '');
var matchArrayClosing = new RegExp(`^\;(?<remaining>.*)$`, '');
var matchComma = new RegExp(`^\,(?<remaining>.*)$`, '');
var matchString = new RegExp(`^((?<string>[^\`\>\^\#\;\,]+)|(?<stringLiteral>\`.+?\`))(?<remaining>[\^\;\,]?.*)$`, 'i');
//var matchNumber = new RegExp(`^(?<number>\-?\\d+(\.\\d*)?)(?<remaining>[\^\;\,]?.*)$`, '');
var matchNumber = /^(?<number>\-?\d+(\.\d*)?)(?<remaining>[\^\;\,]?.*)$/;
var matchBoolean = new RegExp(`^(?<boolean>(true|false))(?<remaining>.*)$`, '');
var matchNull = new RegExp(`^(?<null>null)(?<remaining>.*)$`, '');



function parse(input) {
    
    if (input === '') {                                         // if we've parsed the entire shorthand expression
        returnOutput(json);
    } else if (matchObjectOpening.exec(input)) {                // if input begins with an object opening
        parseObjectOpening(matchObjectOpening.exec(input));
    } else if (matchObjectKey.exec(input)) {                    // if input begins with an object key
        parseObjectKey(matchObjectKey.exec(input));
    } else if (matchObjectClosing.exec(input)) {                // if input begins with an object closing
        parseObjectClosing(matchObjectClosing.exec(input));
    } else if (matchArrayOpening.exec(input)) {                 // if input begins with an array opening
        parseArrayOpening(matchArrayOpening.exec(input));
    } else if (matchComma.exec(input)) {                        // if input begins with a comma
        parseComma(matchComma.exec(input));
    } else if (matchArrayClosing.exec(input)) {                 // if input begins with an array closing
        parseArrayClosing(matchArrayClosing.exec(input));
    } else if (matchNull.exec(input)) {                         // if input begins with null
        parseNull(matchNull.exec(input));
    } else if (matchBoolean.exec(input)) {                      // if input begins with a boolean
        parseBoolean(matchBoolean.exec(input));
    } else if (matchNumber.exec(input)) {                       // if input begins with a number
        parseNumber(matchNumber.exec(input));
    } else if (matchString.exec(input)) {                       // if input begins with a string
        parseString(matchString.exec(input));
    }
}

function parseObjectOpening(input) {
    console.log('parse object opening:');
    console.log(input);
    json += '{';
    parse(input.groups.remaining);
}

function parseObjectKey(input) {
    console.log('parse object key:');
    console.log(input);
    json += `"${input.groups.key}":`;
    parse(input.groups.remaining);
}

function parseObjectClosing(input) {
    console.log('parse object closing:');
    console.log(input);
    json += '}';
    checkIsParseComplete(input);    
}

function parseArrayOpening(input) {
    console.log('parse array opening:');
    console.log(input);
    json += '[';
    parse(input.groups.remaining);
}

function parseComma(input) {
    console.log('parse comma:');
    console.log(input);
    json += ',';
    checkIsParseComplete(input);
}

function parseArrayClosing(input) {
    console.log('parse array closing:');
    console.log(input);
    json += ']';
    checkIsParseComplete(input);
}

function parseString(input) {
    console.log('parse string:');
    console.log(input);
    var string = !!input.groups.string ? 
        input.groups.string : 
        input.groups.stringLiteral.replace(/^\`.+\`$/, '');

    json += `"${string}"`;
    checkIsParseComplete(input);
}

function parseNumber(input) {
    console.log('parse number:');
    console.log(input);
    json += `${input.groups.number}`;
    checkIsParseComplete(input);
}

function parseBoolean(input) {
    console.log('parse boolean:');
    console.log(input);
    json += `${input.groups.boolean}`;
    checkIsParseComplete(input);
}

function parseNull(input) {
    console.log('parse null:');
    console.log(input);
    json += 'null';
    checkIsParseComplete(input);
}

function checkIsParseComplete(input) {

    if (input.groups.remaining) {
        parse(input.groups.remaining);
    } else {
        returnOutput(json);
    }
}

inputElement.addEventListener('keyup', function (e) {           // if any key is pressed
    parse(inputElement.value);                                      // begin parsing
});

function returnOutput(output) {
    json = '';
    outputElement.value = output;
}