/* globals Enbridge */

window.Enbridge.DateUtils = window.Enbridge.DateUtils || {};

Enbridge.DateUtils.addDaysToDate = function(date, number) {
  var result = true,
    currentDate = date.getDate();

  if (!parseInt(number, 10)) {
    result = false;
  }

  date.setDate(currentDate + number);

  return result;
};

/*Date Formater*/
Enbridge.DateUtils.dateFormater = function (stringDate) {
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
    case '1':
    case '21':
    case '31':
      dateValue += (' ' + splitDates[2] + 'st');
      break;
    case '2':
    case '22':
      dateValue += (' ' + splitDates[2] + 'nd');
      break;
    case '3':
    case '23':
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
};

Enbridge.DateUtils.getTotalDays = function (year, month) {
  return 32 - new Date(year, month - 1, 32).getDate();
};
