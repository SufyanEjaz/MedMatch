const {validateRequest} = require("../utils/request");
const {
    errorWithMessageBag,
    successWithData,
    serverError,
    errorWithMessagesAndData,
    errorWithMessage,
    successWithMessage
} = require("../utils/response");
const User = require('./../models/User');
const {UserService, UserRolesService,OtpService,BoothService} = require("./../services/index");
const {RoleDictionary} = require("../dictionaries/RoleDictionary");
const {RoleEntityTypeDictionary} = require("../dictionaries/RoleEntityTypeDictionary");
const Email = require("../utils/email");
const {EmailTypeDictionary} = require("../dictionaries/EmailTypeDictionary");
const Upload = require('./../models/Upload');

module.exports = {
    /**
     * Get all users
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    getAll: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }

            // get all users
            const serviceResponse = await UserService.getAll(req);
            if (serviceResponse.status === false) {
                return errorWithMessage(res,serviceResponse.messages);
            }
            // build response
            let resposne = [];
            serviceResponse.data.users_data.forEach((user) => {
                    if (user.other_info && user.other_info.trim() !== '') {
                        user.other_info = user.other_info.replace(/\\n\s*/g, '\n');
                        // Split the other_info string by '@@@' and join with newlines
                        user.other_info = user.other_info.split('@@@')
                          .map(entry => entry.trim()) // Trim each entry to remove leading/trailing whitespace
                          .join('\n\n');
                      }

                resposne.push({
                    "id": user.id,
                    "name": `${user.first_name} ${user.last_name}`,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "phone_number": user.phone_number,
                    "title": user.title,
                    "company": user.company,
                    "state": user.state,
                    "other_info": user.other_info,
                    "user_details": user.dataValues.user_details,
                });
            })

            const responseData = {
                pagination: serviceResponse.data.pagination,
                users: resposne
            };

            // return response
            return successWithData(res, serviceResponse.messages, responseData);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

    /**
     * Get user by ID
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    getByID: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }

            // get user by id
            const serviceResponse = await UserService.getByID(req);
            if (serviceResponse.status === false) {
                return errorWithMessage(res,serviceResponse.messages);
            }

            const upload_id = serviceResponse.data.profile_image_upload_id;
            // build response
            let resposne = {
                "id": serviceResponse.data.id,
                "name": `${serviceResponse.data.first_name} ${serviceResponse.data.last_name}`,
                "email": serviceResponse.data.email,
                "first_name": serviceResponse.data.first_name,
                "last_name": serviceResponse.data.last_name,
                "phone_number": serviceResponse.data.phone_number,
                "profile_image_upload_id_url": upload_id ? await Upload.getURLbyID(upload_id) : serviceResponse.data.profile_image_upload_id_url,
            };

            const responseData = {
                user: resposne
            };

            // return response
            return successWithData(res, serviceResponse.messages, responseData);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

    /**
     * Get user by ID
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    getAttendeeByID: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }

            // get user by id
            const serviceResponse = await UserService.getAttendeeByID(req);
            if (serviceResponse.status === false) {
                return errorWithMessage(res,serviceResponse.messages);
            }

            const upload_id = serviceResponse.data.profile_image_upload_id;
            // build response
            let resposne = {
                "id": serviceResponse.data.id,
                "name": `${serviceResponse.data.first_name} ${serviceResponse.data.last_name}`,
                "email": serviceResponse.data.email,
                "first_name": serviceResponse.data.first_name,
                "last_name": serviceResponse.data.last_name,
                "phone_number": serviceResponse.data.phone_number,
                "profile_image_upload_id_url": upload_id ? await Upload.getURLbyID(upload_id) : serviceResponse.data.profile_image_upload_id_url,
                "user_details": serviceResponse.data.user_details,
            };

            const responseData = {
                user: resposne
            };

            // return response
            return successWithData(res, serviceResponse.messages, responseData);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

    /**
     * Create User
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    create: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }

            // create user
            const serviceResponse = await UserService.create(req.body);
            if (serviceResponse.status === false) {
                return errorWithMessage(res, serviceResponse.data);
            }

            // build response
            let resposne = {
                "name": `${serviceResponse.data.first_name} ${serviceResponse.data.last_name}`,
                "email": serviceResponse.data.email,
            };

            // return response
            return successWithData(res, serviceResponse.messages, resposne);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

    /**
     * Update User by id
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    updateByID: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }

            // update user
            const serviceResponse = await UserService.updateByID(req);
            if (serviceResponse.status === false) {
                return errorWithMessage(res, serviceResponse.data);
            }

            // return response
            return successWithMessage(res, serviceResponse.data);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

    /**
     * Update User by id
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    removeByID: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }

            // delete user
            const serviceResponse = await UserService.removeByID(req);
            if (serviceResponse.status === false) {
                return errorWithMessage(res, serviceResponse.data);
            }

            // return response
            return successWithMessage(res, serviceResponse.data);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

    /**
     * Login user
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    login: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }

            // authenticate user
            const serviceResponse = await UserService.authenicate(req.body);
            if (serviceResponse.status === false) {
                return errorWithMessage(res, serviceResponse.messages);
            }

            const roleId = serviceResponse.data.roleId;
            const companyIds = serviceResponse.data.companyIds;

            const upload_id = UserService.getAuth().profile_image_upload_id;

            const response = {
                access_token: serviceResponse.data.access_token,
                refresh_token: serviceResponse.data.refresh_token,
                role: roleId,
                company_ids: companyIds,
                user: {
                    id: UserService.getAuth().id,
                    first_name: UserService.getAuth().first_name,
                    last_name: UserService.getAuth().last_name,
                    email: UserService.getAuth().email,
                    phone_number: UserService.getAuth().phone_number,
                    profile_image_upload_id_url: upload_id ? await Upload.getURLbyID(upload_id) : UserService.getAuth().profile_image_upload_id_url,
                },
            };

            // return response
            return successWithData(res, [], response);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

    /**
     * Refresh API tokens
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    refreshToken: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }

            const serviceResponse = await UserService.refreshToken(req.body);
            if (serviceResponse.status === false) {
                return errorWithMessage(res, serviceResponse.messages);
            }

            // return response
            return successWithData(res, [], serviceResponse.data);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

    /**
     * Logout user
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    logout: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }

            const serviceResponse = await UserService.logout();

            // return response
            return successWithData(res, [], []);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

    /**
     * Verify if user has logged-in first time
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    verifyUser: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }

            const serviceResponse = await UserService.verifyUser(req.body.email);
            if (serviceResponse.status === false) {
                return errorWithMessageBag(res, serviceResponse.messages);
            }

            const response = {
                is_first_login: serviceResponse.data.is_first_login,
            }

            // return response
            return successWithData(res, [], response);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

    /**
     * Check company owner
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    isOwner: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }
            // get owner
            const serviceResponse = await UserService.isOwner(req);
            if (serviceResponse.status === false) {
                return errorWithMessage(res,serviceResponse.messages);
            }
            // return response
            return successWithMessage(res,serviceResponse.messages);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

        /**
     * Create password
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    createPassword: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }

            // authenticate user
            const serviceResponse = await UserService.createPassword(req.body);
            if (serviceResponse.status === false) {
                return errorWithMessageBag(res, serviceResponse.messages);
            }

            const serviceResponses = await UserService.authenicate(req.body);
            if (serviceResponses.status === false) {
                return errorWithMessage(res, serviceResponses.messages);
            }

            const authId = UserService.getAuth().id;
            const topLevelRoleResponse = await UserRolesService.getTopLevelRoleByUserId(authId);
            const roleId = topLevelRoleResponse.data.role_id;
            let companyIds = [];

            if (roleId === 2 || roleId === 3) {
                if (companyDetails) {
                    companyIds.push(topLevelRoleResponse.data.entity_id);
                }
            }

            const upload_id = UserService.getAuth().profile_image_upload_id;
            const response = {
                access_token: serviceResponses.data.access_token,
                refresh_token: serviceResponses.data.refresh_token,
                role: roleId,
                company_ids: companyIds,
                user: {
                    "id": UserService.getAuth().id,
                    "first_name": UserService.getAuth().first_name,
                    "last_name": UserService.getAuth().last_name,
                    "email": UserService.getAuth().email,
                    "phone_number": UserService.getAuth().phone_number,
                    "profile_image_upload_id_url": upload_id ? await Upload.getURLbyID(upload_id) : UserService.getAuth().profile_image_upload_id_url,
                }
            }

            // return response
            return successWithData(res, serviceResponse.messages, response);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

       /**
     * Create Booth User
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    createBoothUser: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }

            // create booth reps or admins
            const serviceResponse = await UserService.createBoothUser(req);
            if (serviceResponse.status === false) {
                return errorWithMessage(res,serviceResponse.messages);
            }
            ResponseData = {
                users: serviceResponse.data
            }
            // return response
            return successWithData(res, serviceResponse.messages,ResponseData);
        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

    /**
     * Get all Booth users
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    getBoothUser: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }

            // get all users
            const serviceResponse = await UserService.getAllBoothUsers(req);
            if (serviceResponse.status === false) {
                return errorWithMessage(res,serviceResponse.messages);
            }
            // build response
            let resposne = [];
            serviceResponse.data.users_data.forEach((user) => {
                resposne.push({
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "phone_number": user.phone_number,
                    "is_booth_admin": user.is_booth_admin,
                });
            })

            const responseData = {
                pagination: serviceResponse.data.pagination,
                users: resposne,
                is_booth_rep: serviceResponse.data.is_booth_rep
            };

            // return response
            return successWithData(res, serviceResponse.messages, responseData);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

    /**
     * Login user
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    testEmail: async (req, res, next) => {

        try {


            const emailAttributes = {
                from: "info@medmatch.com",
                to: "jawad@medmatch.com",
                name: "abd",
                code: "123456"
            }

            console.info("Send message to queue1: ", JSON.stringify(emailAttributes));

            // Email.sendEmailToQueue(emailAttributes, EmailTypeDictionary.OTP);
            await Email.sendOTPEmail(emailAttributes.from, emailAttributes.to, emailAttributes.name, emailAttributes.code);

            return successWithData(res, [], []);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

      /**
     * Update company admin by id
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    updateCompanyAdmin: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }

            // update user
            const serviceResponse = await UserService.updateAdmin(req);
            if (serviceResponse.status === false) {
                return errorWithMessage(res,serviceResponse.messages);
            }

            const user = {
                'id' : serviceResponse.data.user.id,
                'first_name' : serviceResponse.data.user.first_name,
                'last_name' : serviceResponse.data.user.last_name,
                'email' : serviceResponse.data.user.email,
            }

            return successWithData(res,serviceResponse.messages,{user});

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

       /**
     * Forget password
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    forgetPassword: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }
            
            const response = await UserService.getByEmail(req.body.email);
            if(response.status === false){
                return errorWithMessageBag(res,[{'msg': 'user not found'}]);
            }    

            const user = response.data.dataValues;

            const hasUserRole = await UserRolesService.getTopLevelRoleByUserId(user.id); 
            if(hasUserRole === false){
                return errorWithMessageBag(res,[{'msg': 'user not found'}]);
            }

            const serviceResponse = await OtpService.generateOtp(user.id);

            const user_name = `${user.first_name} ${user.last_name}`
            const emailResponse = await Email.sendOTPEmail('info@medmatch.com', req.body.email, user_name, serviceResponse.data.dataValues.code);

            const msg = {
                msg : "OTP successfully send to your email"
            }

            // return response
            return successWithData(res,msg,serviceResponse.data,200,emailResponse);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

           /**
     * Forget password
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    updatePassword: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }

            // authenticate user
            const serviceResponse = await UserService.createPassword(req.body);
            if (serviceResponse.status === false) {
                return errorWithMessageBag(res, serviceResponse.messages);
            }

            // return response
            return successWithData(res, serviceResponse.messages, []);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },


          /**
     * Update Booth user by id
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    updateBoothUser: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }

            // update user
            const serviceResponse = await UserService.updateBoothUser(req);
            if (serviceResponse.status === false) {
                return errorWithMessage(res,serviceResponse.messages);
            }

            const user = {
                'id' : serviceResponse.data.user.id,
                'first_name' : serviceResponse.data.user.first_name,
                'last_name' : serviceResponse.data.user.last_name,
                'email' : serviceResponse.data.user.email,
                'phone_number' : serviceResponse.data.user.phone_number,
            }

            return successWithData(res,serviceResponse.messages,{user});

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

              /**
     * Delete booth user by id
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    deleteBoothUser: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }

            // update user
            const serviceResponse = await BoothService.removeBoothUser(req);
            if (serviceResponse.status === false) {
                return errorWithMessage(res,serviceResponse.messages);
            }

            // return response
            return successWithMessage(res,serviceResponse.messages);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

        /**
     * Forget password
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    changePassword: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }
            
            const serviceResponse = await UserService.changePassword(req.body);
            if (serviceResponse.status === false) {
                return errorWithMessage(res,serviceResponse.messages);
            }

            // return response
            return successWithData(res, serviceResponse.messages, []);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

    
    /**
     * Hearbeat user
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    heartbeat: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }
            const authId = UserService.getAuth().id;
            const topLevelRoleResponse = await UserRolesService.getTopLevelRoleByUserId(authId);
            const roleId = topLevelRoleResponse.data.role_id;

            let companyIds = [];
            if (roleId === 2 || roleId === 3) {
                companyIds.push(topLevelRoleResponse.data.entity_id);
            }

            const upload_id = UserService.getAuth().profile_image_upload_id;
            const response = {
                role: roleId,
                company_ids: companyIds,
                user: {
                    "id": UserService.getAuth().id,
                    "first_name": UserService.getAuth().first_name,
                    "last_name": UserService.getAuth().last_name,
                    "email": UserService.getAuth().email,
                    "phone_number": UserService.getAuth().phone_number,
                    "profile_image_upload_id_url": upload_id ? await Upload.getURLbyID(upload_id) : UserService.getAuth().profile_image_upload_id_url,
                }
            }

            // return response
            return successWithData(res, [], response);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

    /**
     * Import users
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    importUsers: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }

            // authenticate user
            const serviceResponse = await UserService.importUsers(req.body);
            if (serviceResponse.status === false) {
                return errorWithMessage(res,serviceResponse.messages);
            }

            // return response
            return successWithData(res, serviceResponse.messages, []);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },

    /**
     * Import users
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    importBoothsData: async (req, res, next) => {

        try {
            const errors = validateRequest(req, res);
            if (errors.length !== 0) {
                return errorWithMessageBag(res, errors);
            }

            // authenticate user
            const serviceResponse = await UserService.importBoothsData(req.body);
            if (serviceResponse.status === false) {
                return errorWithMessage(res,serviceResponse.messages);
            }

            // return response
            return successWithData(res, serviceResponse.messages, []);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    },
};
