const {pagination} = require("../config/common");

module.exports = {

    getPagination: (request) => {

        let limit = pagination.limit;
        if (request.query.limit && request.query.limit > 0) {
            limit = parseInt(request.query.limit)
        }
        let offset = 0;

        // calculate offset
        try {

            let page = parseInt(request.query.page || 1) - 1;
            if (page < 0) {
                page = 0;
            }

            offset = page * limit;

        } catch (error) {
            console.log(error);
        }

        return {
            limit: limit,
            offset: offset,
            page: request.query.page,
        };
    },

    getPaginationResponse: (request, total_count) => {
        let limit = pagination.limit;
        let current_page = 1;
        let last_page;
        try {

            if (request.query.page && request.query.page > 0) {
                current_page = parseInt(request.query.page)
            }

            if (request.query.limit && request.query.limit > 0) {
                limit = parseInt(request.query.limit)
            }

            last_page = Math.ceil(total_count/limit);
        } catch (error) {
            console.log(error);
        }
        return {
            current_page: current_page,
            last_page: last_page,
            per_page: limit,
            total: total_count,
        }
    }
}
