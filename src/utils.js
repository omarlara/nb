/***********************General functions***********************/

/* Format a date for display in a literal */
function formatDisplayStreet(unitNumber, streetNumber, suffix, streetName, city, province, postalCode) {
    var address = [];

    if (!!unitNumber) {
        address.push(unitNumber + ' - ');
    }

    address.push(streetNumber);

    if (!!suffix) {
        address.push(suffix + ' ');
    }

    address.push(streetName + ' <br /> ' + city + ', ' + province + '<br />' + postalCode);

    return address.join('').toUpperCase();
}

/*Date Formater*/
function dateFormater(stringDate) {
    var splitDates = stringDate.split('-'),
        dateValue = '';

    switch (splitDates[1]) {
        case '1':
            dateValue = 'January';
            break;
        case '2':
            dateValue = 'February';
            break;
        case '3':
            dateValue = 'March';
            break;
        case '4':
            dateValue = 'April';
            break;
        case '5':
            dateValue = 'May';
            break;
        case '6':
            dateValue = 'June';
            break;
        case '7':
            dateValue = 'July';
            break;
        case '8':
            dateValue = 'August';
            break;
        case '9':
            dateValue = 'September';
            break;
        case '10':
            dateValue = 'October';
            break;
        case '11':
            dateValue = 'November';
            break;
        case '12':
            dateValue = 'December';
            break;
    }

    switch (splitDates[2]) {
        case '1': case '21': case '31':
            dateValue += (' ' + splitDates[2] + 'st');
            break;
        case '2': case '22':
            dateValue += (' ' + splitDates[2] + 'nd');
            break;
        case '3': case '23':
            dateValue += (' ' + splitDates[2] + 'rd');
            break;
        case '1':
            dateValue += (' ' + splitDates[2] + 'st');
            break;
        default:
            dateValue += (' ' + splitDates[2] + 'th');
            break;
    }

    return dateValue;
}

function getTotalDays(year, month) {
    return 32 - new Date(year, month - 1, 32).getDate();
}
