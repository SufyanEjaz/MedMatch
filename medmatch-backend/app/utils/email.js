const environment = process.env.NODE_ENV || 'development';
const awsConfigFile = require('../config/aws');
const notificationCnfigFile = require('../config/notification');
const awsConfig = awsConfigFile[environment];
const notiificaitonConfig = notificationCnfigFile[environment];
const Queue = require("./queue");
const nodemailer = require("nodemailer");
const {email_Otp_Content} = require("../../jobs/resources/email-otp");
const mandrill = require('mandrill-api');
const fs = require('fs');
const mandrillClient = new mandrill.Mandrill('md-Dx-PfqncxLmIlYeMMslFkw');
const {company_user_Content,medmatch_admin_Content_new,add_booth_user_content_eft,export_leads_content,sync_start_email,sync_complete_email,add_booth_user_content_new} = require("../../jobs/resources/email-company");

class Email {

    /**
     * @returns string
     */
    getQueueUrl() {
        return awsConfig.queue.urls.email;
    }

    /**
     * @param attributes
     * @param type
     * @returns {Promise<void>}
     */
    async sendEmailToQueue(attributes, type) {

        try {
            if (typeof attributes !== 'object') {
                throw "Invalid email attribute object";
            }

            if (!type) {
                throw "Invalid email type";
            }

            const messageAttributes = this.parseAttributes(attributes);
            const queueUrl = this.getQueueUrl();

            console.info("Send message to queue2: ", JSON.stringify(messageAttributes), queueUrl);

            // schedule email
            await Queue.sendMessage(queueUrl, messageAttributes, type);

        } catch (error) {
            console.log(error)
        }
    }

    /**
     * @param attributes
     * @returns {{}}
     */
    parseAttributes(attributes) {

        let messageAttributes = {};

        try {
            const keys = Object.keys(attributes);
            keys.forEach((value, index) => {

                if (!messageAttributes[value]) {
                    messageAttributes[value] = {};
                }

                messageAttributes[value].DataType = "String";
                messageAttributes[value].StringValue = attributes[value].toString();
            })

        } catch (error) {
            console.log(error)
        }

        return messageAttributes;
    }

    /**
     * @param fromEmail
     * @param toEmail
     * @param subject
     * @param emailContent
     * @returns {Promise<void>}
     */
    async sendEmailUsingSMTP(fromEmail, toEmail, subject, emailContent, attachments) {

        try {

            let transporter = nodemailer.createTransport({
                host: notiificaitonConfig.smtp.host,
                port: notiificaitonConfig.smtp.port,
                auth: {
                    user: "apikey",
                    pass: notiificaitonConfig.smtp.api
                }
            })

             // Prepare the email options
            const emailOptions = {
                from: fromEmail, // verified sender email
                to: toEmail, // recipient email
                subject: subject, // Subject line
                html: emailContent, // HTML body
            };
        
            // Add attachments if provided
            if (attachments && attachments.length > 0) {
                emailOptions.attachments = attachments;
            }
            console.log(emailOptions);
            // Send the email
            const emailInfo = await transporter.sendMail(emailOptions);

            console.info(JSON.stringify(emailInfo))

        } catch (error) {
            console.error(error);
        }
    }

    async sendEmailUsingMandrill(fromEmail, toEmail, subject, emailContent, attachments) {
        try {
            console.log("attachments++", attachments);
    
            let messageAttachments = []; // Initialize messageAttachments array
    
            // Check if attachments are provided
            if (attachments && attachments.length > 0) {
                // Process attachments only if they are provided
                const attachmentPromises = attachments.map(async attachment => {
                    // Read the content of the file asynchronously
                    const content = await fs.promises.readFile(attachment.path);
    
                    // Convert the content to base64 encoding
                    const base64Content = content.toString('base64');
    
                    // Return an object representing the attachment
                    return {
                        type: 'application/octet-stream', // Adjust type according to the file type if needed
                        name: attachment.filename,
                        content: base64Content
                    };
                });
    
                // Wait for all attachment promises to resolve
                const attachmentResults = await Promise.all(attachmentPromises);
    
                // Assign attachmentResults to messageAttachments
                messageAttachments = attachmentResults;
            }
    
            const message = {
                html: emailContent,
                subject: subject,
                from_email: fromEmail,
                to: [{
                    email: toEmail,
                    type: 'to'
                }],
                attachments: messageAttachments // Attachments array to be included in the message
            };
    
            return new Promise((resolve, reject) => {
                mandrillClient.messages.send({ message: message }, function(result) {
                    resolve(result); // Resolve the promise with the Mandrill response
                }, function(error) {
                    reject(error); // Reject the promise if there's an error
                });
            });
        } catch (error) {
            console.error("Failed to send email:", error);
            // Handle the error appropriately
            throw error; // Re-throw the error to be caught by the caller
        }
    }
    

    /**
     *
     * @param fromEmail
     * @param toEmail
     * @param name
     * @param code
     * @returns {Promise<void>}
     */
    async sendOTPEmail(fromEmail, toEmail, name, code) {

        try {

            fromEmail = (fromEmail) ? fromEmail : notiificaitonConfig.smtp.from_email
            toEmail = (toEmail) ? toEmail : null;
            const subject = "OTP | Lead Capture"
            if (toEmail === null) {
                throw "Invalid to email-address";
            }

            let emailContent = email_Otp_Content.text;
            emailContent = emailContent.replace("{name}", name);
            emailContent = emailContent.replace("{code}", code);

            console.info(emailContent);
            const response = await this.sendEmailUsingMandrill(fromEmail, toEmail, subject, emailContent);
            return response;
        } catch (error) {
            console.log(error)
        }
    }

    /**
     *
     * @param fromEmail
     * @param toEmail
     * @param userName
     * @param companyName
     * @param type
     * @returns {Promise<void>}
     */
    async sendCompanyUserEmail(fromEmail, toEmail, userName, EventName, Role) {

        try {

            fromEmail = (fromEmail) ? fromEmail : notiificaitonConfig.smtp.from_email
            if (!toEmail) {
                throw new Error("Invalid to email address");
            }

            const userSubject = `Your Company ${Role} Access for the ${EventName} Lead Capture App`;
            let emailUserContent = company_user_Content.text;
            emailUserContent = emailUserContent.replace("{first_name}", userName);
            emailUserContent = emailUserContent.replace(/{event_name}/g, EventName);
            emailUserContent = emailUserContent.replace("{role}", Role.toLowerCase());
            emailUserContent = emailUserContent.replace("{email_address}", toEmail);

            console.log(emailUserContent);
            await this.sendEmailUsingMandrill(fromEmail, toEmail, userSubject, emailUserContent);

        if (Role === 'Owner') {
            const medmatch_admin_subject = `New Company ${EventName} is created in Lead Capture`;
            let emailmedmatchContent = medmatch_admin_Content_new.text;
            emailmedmatchContent = emailmedmatchContent.replace("{first_name}", userName);
            emailmedmatchContent = emailmedmatchContent.replace(/{event_name}/g, EventName);
            emailmedmatchContent = emailmedmatchContent.replace("{owner_email}", toEmail);

            // await this.sendEmailUsingMandrill(fromEmail, "mfarhan@medmatch.com", medmatch_admin_subject, emailmedmatchContent);
            // await this.sendEmailUsingMandrill(fromEmail, "sabrina@medmatch.com", medmatch_admin_subject, emailmedmatchContent);
            // await this.sendEmailUsingMandrill(fromEmail, "hamzaz@medmatch.com", medmatch_admin_subject, emailmedmatchContent);
            // await this.sendEmailUsingMandrill(fromEmail, "anmol@medmatch.com", medmatch_admin_subject, emailmedmatchContent);
            // await this.sendEmailUsingMandrill(fromEmail, "younas@medmatch.com", medmatch_admin_subject, emailmedmatchContent);
            // await this.sendEmailUsingMandrill(fromEmail, "mojaved@medmatch.com", medmatch_admin_subject, emailmedmatchContent);
            // await this.sendEmailUsingMandrill(fromEmail, "salman@medmatch.com", medmatch_admin_subject, emailmedmatchContent);
            // await this.sendEmailUsingMandrill(fromEmail, "mumair@medmatch.com", medmatch_admin_subject, emailmedmatchContent);
        }

        } catch (error) {
            console.log(error)
        }
    }

    /**
     *
     * @param fromEmail
     * @param toEmail
     * @param name
     * @param code
     * @returns {Promise<void>}
     */
    async sendLeadsEmail(fromEmail, toEmail, content, csvFilePath) {

        try {
                fromEmail = fromEmail ? fromEmail : notiificaitonConfig.smtp.from_email;
                toEmail = toEmail ? toEmail : null;
                const subject = "Your leads from " + content.eventName;
            
                // let emailContent = content;
                let emailContent = export_leads_content.text;
                emailContent = emailContent.replace("{Name}", content.first_name);

            
                // Prepare the attachments array
                const attachments = [];
                if (csvFilePath) {
                    attachments.push({
                        filename: 'leads_report.xlsx',
                        path: csvFilePath,
                    });
                }
                console.log(content,subject,csvFilePath);
            
                // Send the email with attachments

                await this.sendEmailUsingMandrill(fromEmail, toEmail, subject, emailContent, attachments);
                await this.sendEmailUsingMandrill(fromEmail, "mfarhan@medmatch.com", subject, emailContent, attachments);
                await this.sendEmailUsingMandrill(fromEmail, "m.jawad@medmatch.com", subject, emailContent, attachments);
            } catch (error) {
                console.log(error);
            }
    }

    /**
     *
     * @param fromEmail
     * @param toEmail
     * @param userName
     * @param companyName
     * @param type
     * @returns {Promise<void>}
     */
    async sendBoothUserEmail(fromEmail, toEmail, userName, BoothName, EventName,Role, eventId) {

        try {

            fromEmail = (fromEmail) ? fromEmail : notiificaitonConfig.smtp.from_email
            if (!toEmail) {
                throw new Error("Invalid to email address");
            }

            let emailContent; // Declare emailContent outside if-else

            const subject = `Your Booth ${Role} Access for the ${EventName} Lead Capture App`;
            if (eventId == 82) {
                emailContent = add_booth_user_content_eft.text;
            } else {
                emailContent = add_booth_user_content_new.text;
            }
            
            emailContent = emailContent.replace("{first_name}", userName);
            emailContent = emailContent.replace("{exhibitor_name}", BoothName);
            emailContent = emailContent.replace(/{event_name}/g, EventName);
            emailContent = emailContent.replace("{role}", Role.toLowerCase());
            emailContent = emailContent.replace("{email_address}", toEmail);

            console.info(emailContent,subject,toEmail);
            await this.sendEmailUsingMandrill(fromEmail, toEmail, subject, emailContent);
        } catch (error) {
            console.log(error)
        }
    }

    async SyncStartEmail(fromEmail, toEmail, userName, EventName) {

        try {

            fromEmail = (fromEmail) ? fromEmail : notiificaitonConfig.smtp.from_email
            if (!toEmail) {
                throw new Error("Invalid to email address");
            }

            const subject = "User | Sync Start VCapture";
            let emailContent = sync_start_email.text;
            
            emailContent = emailContent.replace("{first_name}", userName);
            emailContent = emailContent.replace("{event_name}", EventName);

            console.info(emailContent,subject,toEmail);
            await this.sendEmailUsingMandrill(fromEmail, toEmail, subject, emailContent);
        } catch (error) {
            console.log(error)
        }
    }

    async SyncCompleteEmail(fromEmail, toEmail, userName, EventName) {

        try {

            fromEmail = (fromEmail) ? fromEmail : notiificaitonConfig.smtp.from_email
            if (!toEmail) {
                throw new Error("Invalid to email address");
            }

            const subject = "User | Sync Complete VCapture";
            let emailContent = sync_complete_email.text;
            
            emailContent = emailContent.replace("{first_name}", userName);
            emailContent = emailContent.replace("{event_name}", EventName);

            console.info(emailContent,subject,toEmail);
            await this.sendEmailUsingMandrill(fromEmail, toEmail, subject, emailContent);
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new Email;
