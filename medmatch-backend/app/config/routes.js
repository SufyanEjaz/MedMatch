module.exports = {

    routes: {

        // routes without authentication
        non_auth: [
            '/',
            '/login',
            '/refreshToken',
            '/users/verify',
            '/users/password/create',
            '/users/password/creates',
            '/users/password/forget',
            '/users/password/update',
            '/testemail',
            '/fileupload',
            '/booth-sync',
            '/booth-reps-sync',
            '/add-booth-reps',
            '/sync-logs',
            '/zapier-vcapture-leads',
            '/create-vcapture-leads',
            '/vcapture-leadtypes',
        ],
    }
};