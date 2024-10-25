module.exports = {

    development: {
        region: 'us-west-1',
        bucketName: "medmatch-api",

        queue: {
            delay_seconds: 10,
            urls: {
                email: 'https://sqs.us-west-1.amazonaws.com/614488574123/lead-capture-dev-queue'
            }
        }
    },

    qa: {
        region: 'us-west-1',
        bucketName: "medmatch-api",

        queue: {
            delay_seconds: 10,
            urls: {
                email: 'https://sqs.us-west-1.amazonaws.com/614488574123/lead-capture-dev-queue'
            }
        }
    },

    preprod: {
        region: 'us-west-1',
        bucketName: "medmatch-api",

        queue: {
            delay_seconds: 10,
            urls: {
                email: 'https://sqs.us-west-1.amazonaws.com/614488574123/lead-capture-dev-queue'
            }
        }
    },

    production: {
        region: 'us-west-1',
        bucketName: "medmatch-api",

        queue: {
            delay_seconds: 10,
            urls: {
                email: 'https://sqs.us-west-1.amazonaws.com/614488574123/lead-capture-dev-queue'
            }
        }
    },
};