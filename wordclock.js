//=========================================================
// Word clock module
//=========================================================
var WordClock = function() {
    // In English there is no such thing as ten-two, it has to be twelve instead.
    this.oneToTwenty = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 
                        'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 
                        'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    this.tenToFixty = ['O', 'ten', 'twenty', 'thirty', 'forty', 'fifty'];
    this.now = new Date();
    this.hour = this.now.getHours();
    this.minute = this.now.getMinutes();

    wordSpace = ' ';
    returnPrefix = 'It\'s';
}

WordClock.prototype.wordHours = function() {
    // hours can be 0 or 12. By setting hours with % 12, hours 12 / 24 both will return 0.
    var wordHour = this.hour % 12;
    var wordUnit = '';

    // display o'clock when there is no minutes.
    if (this.minute == 0) {
        wordUnit = ' o\'clock';
    }
    return this.oneToTwenty[wordHour] + wordUnit;
}

WordClock.prototype.timePeriod = function() {
    var prefix = wordSpace + 'in the' + wordSpace;

    if (this.hour == 12 && this.minute == 0) { return 'at noon'; }
    else if (this.hour >= 12 && this.hour <= 18) { return prefix + 'afternoon.'; }
    else if (this.hour > 18 && this.hour <= 23) { return prefix + 'evening.'; }
    else if (this.hour == 0 && this.minute == 0) { return 'on midnight.'; }
    else if (this.hour >= 0 && this.hour <= 11) { return prefix + 'morning.'; }
}

WordClock.prototype.wordMinute = function(min, offset) {
    var firstDigit = min % 10;
    var secondDigit = parseInt(min / 10);
    var returnMinutes = '';     // in the case of no 0 minute

    if (secondDigit > 0 && secondDigit < 2) {
        // if less than 20, map to the correct number in Engish
        returnMinutes = this.oneToTwenty[min];
    } 
    else if (secondDigit >= 2) {
        // second digits are tenth, appending single digits after.
        returnMinutes = this.tenToFixty[secondDigit];
        if (firstDigit > 0) {
            returnMinutes += '-' + this.oneToTwenty[firstDigit];
        }
    } else if (secondDigit == 0 && firstDigit != 0) {
        if (!offset) {
            // 8:05 - It's eight O-five (the O is said like the letter O)
            returnMinutes = this.tenToFixty[secondDigit] + '-' + this.oneToTwenty[firstDigit];
        } else {
            returnMinutes = this.oneToTwenty[firstDigit];
        }
    }
    return returnMinutes;
}

WordClock.prototype.pastTo = function() {
    var offset, firstDigit, secondDigit, returnString = '', offsetHr = 1;
    var self = this;
    var hour = this.hour % 12;

    // past or to (1-30 we use PAST after the minutes / 31-59 we use TO after the minutes)
    if (this.minute > 30) {
        offsetHr += hour;
        returnTime(60-this.minute, offsetHr, ' to ');
    } else {
        offsetHr = hour;
        returnTime(this.minute, offsetHr, ' past ');
    }

    function returnTime(offset, offsetHr, toOrPast) {
        returnString = self.wordMinute(offset, true);
        returnString += toOrPast + self.oneToTwenty[offsetHr];
    }
    return returnString;
}

WordClock.prototype.quarter = function() {
    var hourMap = this.oneToTwenty;
    var hour = this.hour % 12;

    // defined wich quarter by minutes
    var quarter = parseInt(this.minute / 15);
    var remainMinutes = parseInt(this.minute % 15) ? true : false;
    var returnString = '';

    if (!remainMinutes) {
        switch (quarter) {
            case 1 : // 7:15 - It's quarter past seven (15 minutes past)
                returnString = 'quarter past ' + hourMap[hour];
                break;
            case 2 : // 3:30 - It's half past three (half past)
                returnString = 'half past ' + hourMap[hour];
                break;
            case 3 : // 12:45 - It's quarter to one (15 minutes before)
                returnString = 'quarter to ' + hourMap[hour];
                break;
        }
    } else {
        returnString = this.pastTo();
    }
    return returnString
}

WordClock.prototype.opinionated = function() {
    // adding chatty personality
    var hour = this.hour, returnString = '';

    switch (hour) {
        case 7 :
            returnString = 'Rise and shine! Sleepy head.';
            break;
        case 8 :
            returnString = 'What\'s for the breakfast?';
            break;
        case 14 :
            returnString = 'You don\'t have to be an English to have afternoon tea';
            break;
        case 18 :
            returnString = 'What\'s are you having for dinner?';
            break;
        case 23 :
            returnString = 'It\'s getting late! Shouldn\'t you be sleeping?';
            break;
    }
    return returnString;
}

WordClock.prototype.refresh = function() {
    this.now = new Date();
    this.hour = this.now.getHours();
    this.minute = this.now.getMinutes();
}

WordClock.prototype.tellTime1 = function() {
    // This will return regular time in words
    this.refresh();
    return returnPrefix + wordSpace + this.wordHours() + wordSpace + 
            this.wordMinute(this.minute, false) + 
            this.timePeriod();
};

WordClock.prototype.tellTime2 = function() {
    // This will return regular time in (Minutes + PAST / TO + Hour)
    this.refresh();
    return returnPrefix + wordSpace + this.pastTo() + this.timePeriod();
};

WordClock.prototype.tellTime3 = function() {
    // This will return regular time in (Minutes + PAST / TO + Hour)
    this.refresh();
    return returnPrefix + wordSpace + this.quarter() + this.timePeriod();
};

WordClock.prototype.tellTime4 = function() {
    // adding chatty personality
    this.refresh();
    return returnPrefix + wordSpace + this.quarter() + this.timePeriod() + wordSpace + this.opinionated();
};

module.exports = WordClock;