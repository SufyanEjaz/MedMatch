const EmailListener = require("jobs/listeners/emailListener");

/**
 * Triggered by AWS lambda on SQS message receive
 * @param event
 * @returns {Promise<void>}
 */
const consumer = async (event) => {
    await EmailListener.sendEmail(event)
};

module.exports = {
    consumer,
};
