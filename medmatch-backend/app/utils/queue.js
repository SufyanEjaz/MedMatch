const environment = process.env.NODE_ENV || 'development';
const config = require('../config/aws');
const awsConfig = config[environment];
const { SendMessageCommand, SQSClient } = require("@aws-sdk/client-sqs");

class Queue {

    client = null;

    /**
     * @returns {Promise<null>}
     */
    async getConnection() {

        try {

            // create new SQS connection
            if(this.client === null) {
                this.client = new SQSClient({
                    region: awsConfig.region
                });
            }

            return this.client;

        } catch (error) {

            console.log(error)
        }
    }

    /**
     * @param queueUrl
     * @param messageAttributes
     * @param MessageBody
     * @returns {Promise<void>}
     */
    async sendMessage(queueUrl, messageAttributes, MessageBody) {

        try {

            if (!queueUrl) {
                throw 'Invalid queue url';
            }

            console.info("In Send message to queue3: ");

            const client = await this.getConnection();
            const command = new SendMessageCommand({
                QueueUrl: queueUrl,
                DelaySeconds: awsConfig.queue.delay_seconds,
                MessageAttributes: messageAttributes,
                MessageBody: MessageBody,
            });

            const response = await client.send(command);
            console.info("Send message to queue3: ", JSON.stringify(response));


        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = new Queue;
