const environment = process.env.NODE_ENV || 'development';
const config = require('./../../app/config/notification');
const envConfig = config[environment];
const {EmailTypeDictionary} = require("../../app/dictionaries/EmailTypeDictionary");
const Email = require("./../../app/utils/email");

class EmailListener {

    /**
     * @param event
     * @returns {Promise<void>}
     */
    async sendEmail(event) {

        try {

            // console.log(event);
            for (const record of event.Records) {

                let type = record.body;
                let attributes = record.messageAttributes;

                // send otp email
                if (type === EmailTypeDictionary.OTP) {

                    const fromEmail = (attributes.from) ? attributes.from.stringValue : envConfig.smtp.from_email
                    const toEmail = (attributes.to) ? attributes.to.stringValue : null;
                    const name = attributes.name.stringValue;
                    const code = attributes.code.stringValue;
                    await Email.sendOTPEmail(fromEmail, toEmail, name, code);
                }
            }

        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new EmailListener;
