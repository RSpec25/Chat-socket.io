const moment = require('moment');

function formatMsg(username, msg) {
    return {
        username,
        message: msg,
        time: moment().format('h:mm a')
    }
}
module.exports = formatMsg 