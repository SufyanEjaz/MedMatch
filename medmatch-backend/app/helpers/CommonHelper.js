const moment = require('moment');
class CommonHelper {

    static getDaysBetweenDates(startDate, endDate, format = 'YYYY-MM-DD') {

        startDate = moment(startDate)
        endDate = moment(endDate)
        let now = startDate.clone(), dates = [];
        while (now.isSameOrBefore(endDate)) {
            dates.push(now.format(format));
            now.add(1, 'days');
        }
        return dates;
    }
}

module.exports = CommonHelper;
