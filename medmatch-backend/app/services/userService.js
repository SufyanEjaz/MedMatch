const User = require('./../models/User');
const UsersRoles = require('./../models/UsersRoles');
const Upload = require('./../models/Upload');
const UserDetail = require('./../models/UserDetail');
const Booth = require('./../models/Booth');
const CustomLeadField = require('./../models/CustomLeadField');
const {serviceResponse} = require("../utils/service");
const {getPagination} = require("../utils/common");
const {ActivityTypeDictionary} = require("../dictionaries/ActvityTypeDictionary");
const {getPaginationResponse} = require("../utils/common");
const Service = require('./Service')
const Email = require("../utils/email");
const { Op } = require('sequelize');
const bcrypt = require("bcrypt");
const ExcelJS = require('exceljs');
const fetch = require('node-fetch');
const moment = require('moment');

    function extractEmail(value) {
        if (typeof value === 'object' && value.text) {
            // If it's an object (hyperlink), extract email from the 'text' property
            return value.text.replace('mailto:', '');
        } else if (typeof value === 'string') {
            // If it's a string (plain email), return the value
            return value;
        } else {
            // Return an empty string if the format is not recognized
            return '';
        }
    }

class UserService extends Service {

    authUser = false;

    /**
     * Get all users
     *
     * @param req
     * @returns {Promise<{status, data}>}
     */
    async getAll(req) {
        try {
            // Get pagination
            const pagination = getPagination(req);
    
            let whereClause = {}; 
            const searchTerm = req.query.search || '';
            const eventId = req.query.event_id || '';
    
            if (searchTerm !== '') {
                whereClause.first_name = { [Op.like]: `%${searchTerm}%` };
            }
            if (eventId !== '') {
                whereClause.event_id = eventId;
            }
    
            // Get all users
            const users = await User.findAndCountAll({
                where: whereClause,
                offset: pagination.offset,
                limit: pagination.limit,
                order: [['createdAt', 'DESC']]
            });
    
            if (!users) {
                return serviceResponse(false, [], 'No data found');
            }
    
            // Extract user IDs from the users result
            const userIds = users.rows.map(user => user.id);

            // Fetch UserDetail data for all users
            const userDetails = await UserDetail.findAll({
                where: {
                    user_id: {
                        [Op.in]: userIds
                    },
                    event_id: eventId
                },
                attributes: ['id', 'field_name', 'field_value', 'user_id'],
            });
            console.log("userDetails",userDetails)
            // Group UserDetail records by user_id
            const userDetailsMap = userDetails.reduce((map, detail) => {
                const userId = detail.user_id;
    
                // If user_id does not exist in map, initialize it with an empty array
                if (!map[userId]) {
                    map[userId] = [];
                }
    
                // Push the detail to the array corresponding to the user_id
                map[userId].push(detail);
    
                return map;
            }, {});
    
            // Map UserDetail data against each user
            const usersWithData = users.rows.map(user => {
                // Add user_detail object to each user
                user.dataValues.user_details = userDetailsMap[user.id] || []; // If no user details exist, assign an empty array
                return user;
            });
            const dataRes = {
                total_count: users.count,
                users_data: usersWithData,
                pagination: getPaginationResponse(req, users.count),
            };
    
            // Return response
            return serviceResponse(true, dataRes, 'Data found successfully');
    
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get user by ID
     *
     * @param req
     * @returns {Promise<{status, data}>}
     */
    async getByID(req) {

        try {

            // get user by id
            const userId = req.params.id;
            const user = await User.findOne({where: {id: userId}});
            if (!user) {
                return serviceResponse(false, [], 'No user exist.');
            }

            // return response
            return serviceResponse(true, user, 'Data found successfully');

        } catch (error) {
            throw error;
        }
    }

     /**
     * Get user by ID
     *
     * @param req
     * @returns {Promise<{status, data}>}
     */
     async getAttendeeByID(req) {

        try {

            // get user by id
            const qrCode = req.params.id;
            const eventId = req.params.event_id;
            const user = await User.findOne({where: {qr_code: qrCode,event_id: eventId}});
            if (!user) {
                return serviceResponse(false, [], 'No user exist.');
            }

            const userDetails = await UserDetail.findAll({
                where: {
                    user_id: user.id,
                    event_id: eventId
                },
                attributes: ['id', 'field_name', 'field_value'],
            });
            user.user_details = userDetails;

            // return response
            return serviceResponse(true, user, 'Data found successfully');

        } catch (error) {
            throw error;
        }
    }

    /**
     * Get user by email
     *
     * @param email
     * @returns {Promise<{status, data}>}
     */
    async getByEmail(email) {

        try {

            // get user by email
            const user = await User.findOne({where: {email: email, event_id: null}});
            if (!user) {
                return serviceResponse(false, [], [{"msg": "User not found"}]);
            }

            // return response
            return serviceResponse(true, user);

        } catch (error) {
            throw error;
        }
    }

    /**
     * Create User
     *
     * @param req
     * @returns {Promise<{status, data}>}
     */
    async create(req) {

        try {

            // request data
            const first_name = req.first_name;
            const last_name = req.last_name;
            const email = req.email;
            // const password = await this.services.AuthService.generateHash(req.password);
            const phone_number = req.phone_number;

            // validations
            const hasUser = await User.findOne({where: {email: email, event_id: null}});
            if (hasUser) {
                return serviceResponse(false, "User already exists");
            }

            // create user
            const user = await User.create({
                first_name: first_name,
                last_name: last_name,
                email: email,
                // password: password,
                phone_number: phone_number,
            });

            // return response
            return serviceResponse(true, user);

        } catch (error) {
            throw error;
        }
    }

    /**
     * Update User by id
     *
     * @param req
     * @returns {Promise<{status, data}>}
     */
    async updateByID(req) {

        try {
            // request data
            const userId = req.params.id;
            const first_name = req.body.first_name;
            const last_name = req.body.last_name;
            const phone_number = req.body.phone_number;
            const profile_image_upload_id = req.body.profile_image_upload_id;

            // get user
            const user = await User.findOne({where: {id: userId}});
            if (!user) {
                return serviceResponse(false, "User not found");
            }

            user.first_name = first_name;
            user.last_name = last_name;
            user.phone_number = phone_number;
            // Conditionally update profile_image_upload_id
            if (profile_image_upload_id) {
                user.profile_image_upload_id = profile_image_upload_id;
            }
            await user.save();

            // return response
            return serviceResponse(true, "User updated successfully");

        } catch (error) {
            throw error;
        }
    }

    /**
     * Update User by id
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    async removeByID(req) {

        try {
            // get user by id
            const userId = req.params.id;
            const user = await User.findOne({where: {id: userId}});
            if (!user) {
                return serviceResponse(false, "User not found");
            }

            // delete user
            await user.destroy();

            // return response
            return serviceResponse(true, "Removed successfully");

        } catch (error) {
            throw error;
        }
    }

    /**
     * Authenticate user
     *
     * @param req
     * @returns {Promise<{status, data}>}
     */
    async authenicate(req) {

        try {

            // get user
            const { email, password } = req;

            const response = await this.getByEmail(email);

            if (response.status === false) {
                return serviceResponse(false, [], "Email or Password is not correct");
            }

            const user = response.data.dataValues;
            
            const hasRole = await this.services.UserRolesService.getTopLevelRoleByUserId(user.id);
            if (hasRole.status === false) {
                return serviceResponse(false, [], "Email or Password is not correct");
            }

            const roleId = hasRole.data.role_id;
            let companyIds = [];

            if (roleId === 2 || roleId === 3) {
                companyIds.push(hasRole.data.entity_id);
            }

            // Generate token
            const tokens = await this.services.AuthService.generateTokens(email, password, user.password);
            if (tokens.status === false) {
                return serviceResponse(false, [], "Email or Password is not correct");
            }

            // create activity
            const activityLogDto = {
                user_id: user.id,
                activity_type_id: ActivityTypeDictionary.LOGIN
            };
            await this.services.ActivityService.createActivityLogs(activityLogDto);

            // set auth
            await this.setAuth(email);

            // return response
            return serviceResponse(true, {
                access_token: tokens.data.access_token,
                refresh_token: tokens.data.refresh_token,
                roleId,
                companyIds
            });

        } catch (error) {
            throw error;
        }
    }

    /**
     * Set auth user
     * @param {string} email
     * @returns {Promise<void>}
     */
    async setAuth(email) {

        try {
            // set auth user
            const authResponse = await this.getByEmail(email);
            if (authResponse.status === true) {
                this.authUser = authResponse.data;
            } else {
                this.authUser = false;
                throw authResponse.messages;
            }

        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Auth user
     * @returns {User} user
     */
    getAuth() {

        try {

            return this.authUser;

        } catch (error) {
            throw error;
        }
    }

    /**
     * Authenticate user
     *
     * @param req
     * @returns {Promise<{status, data}>}
     */
    async refreshToken(req) {

        try {

            const res = this.services.AuthService.refreshAuthTokens(req.refresh_token);
            if (res.status === false) {
                return serviceResponse(false, [], res.messages);
            }

            // return response
            return serviceResponse(true, res.data);

        } catch (error) {
            throw error;
        }
    }

    /**
     * Authenticate user
     *
     * @param req
     * @returns {Promise<{status, data}>}
     */
    async getUserById(Id) {

        try {

            const userDetail = await User.findOne({where: {id: Id}});

            return userDetail;

        } catch (error) {
            throw error;
        }
    }

    /**
     * @param Ids
     * @returns {Promise<User[]>}
     */
    async getUserByIds(Ids,searchTerm) {

        try {
            const userDetails = await User.findAll({
                where: {
                    id: Ids,
                    [Op.or]: {
                        first_name: {
                            [Op.like]: `%${searchTerm}%`
                        },
                        last_name: {
                            [Op.like]: `%${searchTerm}%`
                        },
                        email: {
                            [Op.like]: `%${searchTerm}%`
                        }
                    }
                },
                order: [['createdAt', 'DESC']]
            });

            return userDetails;

        } catch (error) {
            throw error;
        }
    }


    /**
     * Check if user is a admin
     *
     * @param req
     * @returns {Promise<{status, data}>}
     */
    async isOwner(req) {

        try {

            const Email = req.body.email;
            const user = await User.findOne({where: {email: Email, event_id: null}});
            if (!user) {
                return serviceResponse(false, [], "User not Found.");
            }
            const hasUserOwner = await this.services.UserRolesService.getByUserIDRoleIDOne(user.id, 2);  
            const hasUserAdmin = await this.services.UserRolesService.getByUserIDRoleIDOne(user.id, 3);  
            const hasSuperAdmin = await this.services.UserRolesService.getByUserIDRoleIDOne(user.id, 1);  
            
            if (hasSuperAdmin) {
                return serviceResponse(true, [], "You are super admin.");
            }

            if (hasUserOwner || hasUserAdmin) {
                return serviceResponse(true, [], "You are already an owner or admin of a company.");
            }

            return serviceResponse(false, [], "User is not belong to any company.");

        } catch (error) {
            throw error;
        }
    }

    /**
     * Verify if user is signing in first time
     *
     * @param email
     * @returns {Promise<{status, data}>}
     */
    async verifyUser(email) {

        try {

            const userResponse = await this.getByEmail(email);
            if (userResponse.status === false) {
                return serviceResponse(userResponse.status, userResponse.data, userResponse.messages);
            }

            const user = userResponse.data.dataValues;

            if (user.password) { 
                return serviceResponse(true, {
                    is_first_login: false
                });
            }   

            // generate otp
            const otpResponse = await this.services.OtpService.generateOtp(userResponse.data.id);

            // send OTP email
            const emailAttributes = {
                to: userResponse.data.email,
                name: `${userResponse.data.first_name} ${userResponse.data.last_name}`,
                code: otpResponse.data.code
            }
            await Email.sendOTPEmail(false, emailAttributes.to, emailAttributes.name, emailAttributes.code);

            return serviceResponse(true, {
                    is_first_login: true
                },
                {
                    msg: `Welcome ${userResponse.data.first_name},\nWe have send you otp on email, please enter it in next screen along with your password.`
                }
            );

        } catch (error) {
            throw error;
        }
    }

    /**
     * Create password for user
     *
     * @param createPasswordDto
     * @returns {Promise<{status, data}>}
     */
    async createPassword(createPasswordDto) {

        try {

            const email = createPasswordDto.email;
            const code = createPasswordDto.code;
            const password = createPasswordDto.password.toString();
            const confirm_password = createPasswordDto.confirm_password.toString();

            const userResponse = await this.getByEmail(email);
            if (userResponse.status === false) {
                return serviceResponse(userResponse.status, userResponse.data, userResponse.messages);
            }

            const otpResponse = await this.services.OtpService.verifyOtp(userResponse.data.id, code);
            if (otpResponse.status === false) {
                return serviceResponse(otpResponse.status, otpResponse.data, otpResponse.messages);
            }

            // update user password
            if (password !== confirm_password) {
                return serviceResponse(false, [], [{msg: "password and confirm password doesn't matched"}]);
            }

            const userObj = userResponse.data;
            userObj.password = await this.services.AuthService.generateHash(password);
            await userObj.save();

            // generate otp and send email to user
            await this.services.OtpService.invalidateOtp(otpResponse.data);

            return serviceResponse(true, [], [{msg: `Your password has been created, you can now login to your account`}]);

        } catch (error) {
            throw error;
        }
    }

    async changePassword(changePasswordDto) {

        try {

            const password = changePasswordDto.existing_password.toString();
            const new_password = changePasswordDto.new_password.toString();

            const userId = this.getAuth().id;
            const user = await User.findByPk(userId);
            const isMatch = await bcrypt.compare(password, user.dataValues.password);
            if (isMatch) {
                const userObj = user;
                userObj.password = await this.services.AuthService.generateHash(new_password);
                await userObj.save();
                return serviceResponse(true, [], [{msg: `Your password has been changed`}]);

              } else {

                return serviceResponse(false, [], "Old password is wrong.");
              }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Logout user
     * @returns {Promise<{status, data}>}
     */
    async logout() {

        try {
            const userId = this.getAuth().id;

            // remove access token cache
            // await deleteCache(`user_${userId}_access_token`);
            // await deleteCache(`user_${userId}_refresh_token`);

            /**
             * TODO: add user logout activity
             */

            return serviceResponse(true, [], []);

        } catch (error) {
            throw error;
        }
    }

    /**
     * create Booth users
     *
     * @param req
     * @returns {Promise<{status, data}>}
     */
    async createBoothUser(req) {
        try {
            const { event_id, booth_id } = req.params;
    
            const hasBooths = await this.services.BoothService.getBoothById(req);
            const hasEvent = await this.services.EventService.eventExist(req);
    
            if (!hasBooths) {
                return serviceResponse(false, [], "Booth not exist.");
            }
    
            if (!hasEvent) {
                return serviceResponse(false, [], "Event not exist.");
            }
    
            const RolesAllBoothAdmin = await this.services.UserRolesService.getByEntityIdEntityTypeRoleIdAll(5, booth_id, 'booths');
            const RolesAllBoothReps = await this.services.UserRolesService.getByEntityIdEntityTypeRoleIdAll(6, booth_id, 'booths');
            const totalBoothRoles = RolesAllBoothAdmin.length + RolesAllBoothReps.length;
            if(totalBoothRoles >= hasBooths.dataValues.booth_reps){
                return serviceResponse(false, [], "Booth Users Limit Exceeded");
            }
    
            const { first_name, last_name, email, phone_number, is_booth_admin } = req.body;
            const role_id = (is_booth_admin == 1) ? 5 : 6;
            const role_name = (is_booth_admin == 1) ? 'Admin' : 'Rep';
    
            let user_id;
            const existingUser = await User.findOne({ where: { email, event_id: null } });

            if (existingUser) {
                const userRole = await this.services.UserRolesService.getByUserIdEntityIDentityTypeOne(existingUser.id, booth_id, 'booths');
                if(userRole){
                    return serviceResponse(false, [], "User already attach with this booth.");
                }
                user_id = existingUser.id;
            } else {
                await User.create({
                    first_name,
                    last_name,
                    email,
                    phone_number,
                });
                const currentUser = await User.findOne({ where: { email, event_id: null } });
                user_id = currentUser.dataValues.id;
            }

            const userRolesData = {
                user_id,
                event_id,
                role_id,
                entity_id: booth_id,
                entity_type: 'booths',
            };
            await Email.sendBoothUserEmail(false, email, first_name, hasBooths.dataValues.name, hasEvent.dataValues.name, role_name, event_id);

            const userRole = await this.services.UserRolesService.getByAllCriteriaOne(user_id, role_id, booth_id, 'booths');
            if (!userRole) {
                await this.services.UserRolesService.create(userRolesData);
            }

            const userId = this.services.UserService.getAuth().dataValues.id;
            const activityLogDto = {
                user_id: userId,
                event_id: event_id,
                activity_type_id: ActivityTypeDictionary.BOOTH_USER_CREATED
            };
            await this.services.ActivityService.createActivityLogs(activityLogDto);

            const responseData = {
                id: user_id,
                first_name,
                last_name,
                email,
                phone_number,
                is_booth_admin,
            };

            return serviceResponse(true, responseData, "Data added successfully");
        } catch (error) {
            throw error;
        }
    }
    

    /**
     * Get all Booth users
     *
     * @param req
     * @returns {Promise<{status, data}>}
     */
    async getAllBoothUsers(req) {

        try {

            const {company_id, event_id, booth_id} = req.params;

            const hasBooths = await this.services.BoothService.getBoothById(req);
            const hasEvent = await this.services.EventService.eventExist(req);
            const hasCompany = await this.services.CompanyService.companyExist(req);
            const user_id = this.getAuth().dataValues.id;
             
            if (!hasBooths) {
                return serviceResponse(false, [], "Booth not exist.");
            }

            if (!hasEvent) {
                return serviceResponse(false, [], "Event not exist.");
            }

            if (!hasCompany) {
                return serviceResponse(false, [], "Company not exist.");
            }

            const boothUsers = await this.services.UserRolesService.getByEntityIdentityTypesAll(booth_id, 'booths');

            if (boothUsers.length === 0) {
                return serviceResponse(false, [], 'No data founds');
            }

            const userRoles = boothUsers.map((boothUser) => {
                return {
                    user_id: boothUser.dataValues.user_id,
                    role_id: boothUser.dataValues.role_id
                };
            });
            const userIds = userRoles.map((userRole) => userRole.user_id);

            // get pagination
            const pagination = getPagination(req);

            const whereClause = {
                id: userIds
            };
            let searchTerm = req.query.search || '';
            if (searchTerm !== '') {
                whereClause[Op.or] = [
                  { first_name: { [Op.like]: `%${searchTerm}%` } },
                  { last_name: { [Op.like]: `%${searchTerm}%` } },
                  { email: { [Op.like]: `%${searchTerm}%` } },
                  { phone_number: { [Op.like]: `%${searchTerm}%` } }
                ];
            }
            // get all users
            const users = await User.findAndCountAll({
                where: whereClause,
                attributes: ['id', 'first_name', 'last_name', 'email', 'phone_number'],
                offset: pagination.offset,
                limit: 100
            });

            const updatedUsers = users.rows.map((user) => {
                const matchingRole = userRoles.find((role) => role.user_id === user.dataValues.id);
                const isBoothAdmin = matchingRole && matchingRole.role_id === 5 ? 1 : 0;
                return {
                    ...user.dataValues,
                    is_booth_admin: isBoothAdmin
                };
            });

            const userRole = await this.services.UserRolesService.getByAllCriteriaOne(user_id, 6, booth_id, 'booths');
            let is_booth_rep_user = 0;
            if(userRole){
                is_booth_rep_user = 1;
            }

            const dataRes = {
                total_count: users.count,
                users_data: updatedUsers,
                is_booth_rep: is_booth_rep_user,
                pagination: getPaginationResponse(req, users.count),
            };
            return serviceResponse(true, dataRes, 'Data found successfully');

        } catch (error) {
            throw error;
        }
    }

    /**
     * Update company admin by id
     *
     * @param req
     * @returns {Promise<{status, data}>}
     */
    async updateAdmin(req) {

        try {
            // request data
            const {first_name, last_name} = req.body;
            const userId = req.params.user_id;

            const hasCompany = await this.services.CompanyService.companyExist(req);
            if (!hasCompany) {
                return serviceResponse(false, [], "Company not exist.");
            }

            const user = await User.findOne({where: {id: userId}});
            if(!user){
                return serviceResponse(false,[],"admin not found.");
            }

            user.first_name = first_name;
            user.last_name = last_name;
            await user.save();
            // return response
            const msg = [
                {
                    msg: 'Company admin updated successfully'
                }
            ]
            return serviceResponse(true,{user},msg);

        } catch (error) {
            throw error;
        }
    }

        /**
     * Update booth user by id
     *
     * @param req
     * @returns {Promise<{status, data}>}
     */
    async updateBoothUser(req) {

        try {
            // request data
            const {first_name, last_name, email, phone_number, is_booth_admin} = req.body;
            const role_id = (is_booth_admin == 1) ? 5 : 6;
            const userId = req.params.user_id;
            const boothId = req.params.booth_id;

            // const hasBooths = await this.services.BoothService.getBoothById(req);
            // const hasEvent = await this.services.EventService.eventExist(req);
            // const hasCompany = await this.services.CompanyService.companyExist(req);

            // if (!hasBooths) {
            //     return serviceResponse(false, [], "Booth not exist.");
            // }

            // if (!hasEvent) {
            //     return serviceResponse(false, [], "Event not exist.");
            // }

            // if (!hasCompany) {
            //     return serviceResponse(false, [], "Company not exist.");
            // }
            
            const user = await User.findOne({where: {id: userId}});
            if(!user){
                return serviceResponse(false,[],"User not found.");
            }

            const response = await this.getByEmail(email);
            if (response.status === true) {
                if(response.data.dataValues.id != userId){
                    return serviceResponse(false,[],"Email already exist.");
                }
            }
            const userRole = await this.services.UserRolesService.getByUserIdEntityIDentityTypeOne(userId, boothId, 'booths');
            
            if(userRole.dataValues.role_id !== role_id){
                 await UsersRoles.updateRoleById(userRole.dataValues.id,role_id);
            }

            user.email  = email;
            user.first_name = first_name;
            user.last_name = last_name;
            user.phone_number = phone_number;
            await user.save();

            const activityLogDto = {
                user_id: this.services.UserService.getAuth().dataValues.id,
                event_id: req.params.event_id,
                activity_type_id: ActivityTypeDictionary.BOOTH_USER_UPDATED
            };
            await this.services.ActivityService.createActivityLogs(activityLogDto);
            
            const msg = [
                {
                    msg: 'Booth user updated successfully'
                }
            ]
            return serviceResponse(true,{user},msg);

        } catch (error) {
            throw error;
        }
    }

     /**
     * Import Users
     *
     * @param req
     * @returns {Promise<{status, data}>}
     */
    async importUsers(req) {
        try {
            const UploadId = req.file;
            const eventId = req.event_id;
    
            if (!eventId) {
                return serviceResponse(true, {}, [{ msg: 'Event Id is required' }]);
            }
    
            const Url = await Upload.getURLbyID(UploadId);
            if(!Url){
                return serviceResponse(true, {}, [{ msg: 'Invalid URL' }]);
            }

            const response = await fetch(Url);
            const buffer = await response.buffer();
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);
    
            const expectedHeaders = ["User Id", "Name", "Email Address", "Phone Number", "Other Info"];
    
            const usersArray = [];
            const emailArray = [];
            const otherFieldsArray = []; // Array to store other fields

            let msg = [{ msg: 'Users Imported successfully' }];
    
            let headersMatch = 1;
            const worksheet = workbook.getWorksheet(1);
    
            if (worksheet.rowCount > 502) {
                return serviceResponse(true, {}, [{ msg: 'Records must be less or equal to 500.' }]);
            }

            let qrCodeIndex = -1; // Define qrCodeIndex outside of the if block
            worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                let rowData = row.values;
                rowData = rowData.slice(1);
                if (rowNumber === 1) {
                    qrCodeIndex = rowData.findIndex(header => header === "QR Code");
                    const trimmedHeaders = rowData
                    .filter(header => header !== null && header.trim() !== "")
                    .map(header => (header === "Notes" ? "Other Info" : header)) // Treat "Notes" as "Other Info"
                    .slice(0, 5);    
                    const isValidHeaders = JSON.stringify(trimmedHeaders) === JSON.stringify(expectedHeaders);
                    headersMatch = !isValidHeaders ? 2 : headersMatch;
                } else {
                    const emailValue = extractEmail(rowData[2]);
                    if (emailValue !== "") {
                        let qrCodeValue = "";
                        if (qrCodeIndex !== -1) {
                            qrCodeValue = rowData[qrCodeIndex];
                        }
                        const userArray = [eventId, rowData[0], rowData[1], emailValue, rowData[3], rowData[4], qrCodeValue];
                        usersArray.push(userArray);
                        emailArray.push(emailValue);
                        const otherFields = [];
                        rowData.slice(5).forEach((field, index) => {
                            const headerName = worksheet.getRow(1).getCell(index + 6).value; // Adjust index for headers
                            otherFields.push({ event_id: eventId, field_name: headerName, field_value: field });
                        });
                        otherFieldsArray.push({ email: emailValue, fields: otherFields });
                    }
                }
            });
            if (headersMatch === 1) {
                const existingUsers = await User.findAll({ where: { email: emailArray, event_id: eventId } });
                const usersWithEmailId = {};
                existingUsers.forEach(user => {
                    usersWithEmailId[user.email] = user.id;
                });
    
                const bulkUpdateData = [];
                const bulkCreateData = [];
    
                for (const user of usersArray) {
                    const existingUserId = usersWithEmailId[user[3]];
                    if (existingUserId) {
                        bulkUpdateData.push({
                            event_id: user[0],
                            ref_user_id: user[1],
                            first_name: user[2],
                            phone_number: user[4],
                            other_info: user[5],
                            qr_code: user[6],
                            id: existingUserId 
                        });
                    } else {
                        bulkCreateData.push({
                            event_id: user[0],
                            ref_user_id: user[1],
                            first_name: user[2],
                            email: user[3],
                            phone_number: user[4],
                            other_info: user[5],
                            qr_code: user[6]
                        });
                    }
                }

                await User.bulkCreate(bulkCreateData);
                await User.bulkCreate(bulkUpdateData, { updateOnDuplicate: ['event_id', 'ref_user_id', 'first_name', 'phone_number', 'other_info', 'qr_code'] });

               // Delete existing user details for users that already exist
                await UserDetail.destroy({
                    where: {
                        user_id: Object.values(usersWithEmailId)
                    }
                });

                const userDetailData = [];

                const allUsers = await User.findAll({ where: { email: emailArray, event_id: eventId  } });
                const allUsersWithEmailId = {};
                allUsers.forEach(user => {
                    allUsersWithEmailId[user.email] = user.id;
                });

                for (const entry of otherFieldsArray) {
                    const userId = allUsersWithEmailId[entry.email];
                    if (userId) {
                        entry.fields.forEach(field => {
                            field.user_id = userId; 
                            userDetailData.push(field); 
                        });
                    }
                }
                await UserDetail.bulkCreate(userDetailData);
                
                const userId = this.services.UserService.getAuth().dataValues.id;
                const activityLogDto = {
                    user_id: userId,
                    event_id: eventId,
                    activity_type_id: ActivityTypeDictionary.IMPORT_ATTENDEES
                };
                await this.services.ActivityService.createActivityLogs(activityLogDto);
            } else {
                msg = [{ msg: 'Headers do not match expected fields.' }];
            }
    
            return serviceResponse(true, {}, msg);
        } catch (error) {
            throw error;
        }
    }

    async importBoothsData(req) {
        try {
            const uploadId = req.file;
            const eventId = req.event_id;
            const authUserId = this.services.UserService.getAuth().dataValues.id;

            if (!eventId) {
                return serviceResponse(true, {}, [{ msg: 'Event Id is required' }]);
            }
    
            const url = await Upload.getURLbyID(uploadId);
            if (!url) {
                return serviceResponse(true, {}, [{ msg: 'Invalid URL' }]);
            }
    
            const response = await fetch(url);
            const buffer = await response.buffer();
            const workbook = new ExcelJS.Workbook();

            try {
                await workbook.xlsx.load(buffer);
            } catch (error) {
                return serviceResponse(true, {}, [{ msg: 'Failed to load Excel file. Please ensure the file is a valid .xlsx file.' }]);
            }

    
            const expectedHeaders = ["Booth Name", "Description", "Website", "Twitter", "Facebook", "Linkedin", "Headquarter", "Booth Number", "Booth Reps Allowed", "Exhibitor Logo", "Allow Custom Form", "Booth Reps", "Booth Admins"];
            const boothsArray = [];
            const usersArray = [];
            const userRoleMappings = [];
    
            let msg = [{ msg: 'Booths and Users Imported successfully' }];
            let headersMatch = 1;
            const worksheet = workbook.getWorksheet(1);
    
            if (worksheet.rowCount > 502) {
                return serviceResponse(true, {}, [{ msg: 'Records must be less or equal to 500.' }]);
            }
    
            const emailSet = new Set();
    
            worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                let rowData = row.values.slice(1);
                if (rowNumber === 1) {
                    const trimmedHeaders = rowData.filter(header => header !== null && header.trim() !== "").slice(0, expectedHeaders.length);
                    const isValidHeaders = JSON.stringify(trimmedHeaders) === JSON.stringify(expectedHeaders);
                    headersMatch = !isValidHeaders ? 2 : headersMatch;
                } else {

                    if (!rowData[0] || rowData[0].trim() === "") {
                        return;
                    }
                    const boothRepsCell = rowData[11];
                    const boothAdminsCell = rowData[12];

                const boothReps = boothRepsCell
                    ? (typeof boothRepsCell === 'object' ? boothRepsCell.text : boothRepsCell).split(',').map(email => email.trim())
                    : [];
                const boothAdmins = boothAdminsCell
                    ? (typeof boothAdminsCell === 'object' ? boothAdminsCell.text : boothAdminsCell).split(',').map(email => email.trim())
                    : [];

                    let allowCustomFormValue = 0;
                    if (rowData[10] !== undefined) {
                        if (rowData[10] === 1 || rowData[10] === 0) {
                            allowCustomFormValue = rowData[10];
                        } else {
                            allowCustomFormValue = rowData[10].toLowerCase() === 'yes' ? 1 : 0;
                        }
                    }
                        
                    console.log("allowCustomFormValue",allowCustomFormValue)
                    const booth = {
                        event_id: eventId,
                        name: rowData[0],
                        description: rowData[1],
                        company_url: typeof rowData[2] === 'object' ? rowData[2].text : rowData[2],
                        twitter: typeof rowData[3] === 'object' ? rowData[3].text : rowData[3],
                        facebook: typeof rowData[4] === 'object' ? rowData[4].text : rowData[4],
                        linkedin: typeof rowData[5] === 'object' ? rowData[5].text : rowData[5],
                        location: typeof rowData[6] === 'object' ? rowData[6].text : rowData[6],
                        booth_number: rowData[7], 
                        booth_reps: rowData[8], 
                        upload_id_url: typeof rowData[9] === 'object' ? rowData[9].text : rowData[9],
                        custom_form_field: allowCustomFormValue,
                        is_import: 1,
                        email_send: 0,
                        created_by: authUserId, 
                        updated_by: authUserId, 
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };
    
                    boothsArray.push(booth);
    
                    const uniqueBoothReps = new Set(boothReps);
                    const uniqueBoothAdmins = new Set(boothAdmins);

                    uniqueBoothAdmins.forEach(email => {
                        if (uniqueBoothReps.has(email)) {
                            uniqueBoothReps.delete(email);
                        }
                    });

                    uniqueBoothReps.forEach(email => {
                        if (!emailSet.has(email)) {
                            emailSet.add(email);
                            usersArray.push({
                                email: email,
                                first_name: email.split('@')[0],
                                last_name: '',
                                password: '', 
                            });
                        }
                        userRoleMappings.push({
                            email: email,
                            role_id: 6, 
                            booth_name: rowData[0]
                        });
                    });
    
                    uniqueBoothAdmins.forEach(email => {
                        if (!emailSet.has(email)) {
                            emailSet.add(email);
                            usersArray.push({
                                email: email,
                                first_name: email.split('@')[0],
                                last_name: '',
                                password: '',
                            });
                        }
                        userRoleMappings.push({
                            email: email,
                            role_id: 5, // Booth admins role_id is 5
                            booth_name: rowData[0]
                        });
                    });
                }
            });
    
            if (headersMatch === 1) {
                // Step 2: Insert booths into the database
                const createdBooths = await Booth.bulkCreate(boothsArray);

                if(createdBooths.length > 0){
                    const existingRecords = await CustomLeadField.findAll({
                        where: { event_id: eventId, booth_id: 0 },
                        attributes: { exclude: ['id'] }
                    });
                
                    if (existingRecords.length > 0) {
                        const allModifiedRecordsArray = [];
                
                        for (const createdBooth of createdBooths) {
                            const modifiedRecordsArray = existingRecords.map(existingRecord => ({
                                ...existingRecord.dataValues,
                                booth_id: createdBooth.id,
                                created_by: authUserId,
                                updated_by: authUserId
                            }));
                            allModifiedRecordsArray.push(...modifiedRecordsArray);
                        }
                
                        await CustomLeadField.bulkCreate(allModifiedRecordsArray);
                    }
                }
    
                // Fetch existing users with event_id null
                const userEmails = usersArray.map(user => user.email);
                const existingUsers = await User.findAll({
                    where: {
                        email: userEmails,
                        event_id: null
                    }
                });
    
                const existingUsersMap = {};
                existingUsers.forEach(user => {
                    existingUsersMap[user.email] = user.id;
                });
    
                // Create new users (do not update existing users)
                const newUsers = usersArray.filter(user => !existingUsersMap[user.email]);
    
                await User.bulkCreate(newUsers);
    
                // Fetch all users after creation
                const allUsers = await User.findAll({
                    where: {
                        email: userEmails,
                        event_id: null
                    }
                });
                const allUsersMap = {};
                allUsers.forEach(user => {
                    allUsersMap[user.email] = user.id;
                });
    
                // Step 4: Create relationships in users_roles table if they don't already exist
                const existingUserRoles = await UsersRoles.findAll({
                    where: {
                        user_id: Object.values(allUsersMap),
                        entity_type: 'booths'
                    }
                });
    
                const existingUserRolesMap = {};
                existingUserRoles.forEach(role => {
                    const key = `${role.user_id}-${role.role_id}-${role.entity_id}`;
                    existingUserRolesMap[key] = true;
                });
    
                const userRolesData = [];
                createdBooths.forEach(booth => {
                    const boothId = booth.id;
                    userRoleMappings.forEach(mapping => {
                        if (mapping.booth_name === booth.name) { // Ensure only row-wise relationships
                            const userId = allUsersMap[mapping.email];
                            if (userId) {
                                const key = `${userId}-${mapping.role_id}-${boothId}`;
                                if (!existingUserRolesMap[key]) {
                                    userRolesData.push({
                                        user_id: userId,
                                        event_id: eventId,
                                        role_id: mapping.role_id,
                                        entity_id: boothId,
                                        entity_type: 'booths',
                                        createdAt: new Date(),
                                        updatedAt: new Date()
                                    });
                                }
                            }
                        }
                    });
                });
    
                await UsersRoles.bulkCreate(userRolesData);

                const activityLogDto = {
                    user_id: authUserId,
                    event_id: eventId,
                    activity_type_id: ActivityTypeDictionary.IMPORT_BOOTHS
                };
                await this.services.ActivityService.createActivityLogs(activityLogDto);
    
            } else {
                msg = [{ msg: 'Headers do not match expected fields.' }];
            }
    
            return serviceResponse(true, {}, msg);
        } catch (error) {
            throw error;
        }
    }

    async updateUsers(req) {

        try {

            const {from_booth, to_booth} = req.body;

            if (!from_booth || !to_booth) {
                return serviceResponse(false, [], 'Parameters missing');
            }
            
            const boothUsers = await this.services.UserRolesService.getByEntityIdentityTypesAll(from_booth, 'booths');

            const new_booth = await Booth.findOne({
                where: { id: to_booth },
            });

            const updatedUserRoles = boothUsers.map((boothUser) => {
                return {
                    event_id: new_booth.dataValues.event_id,
                    user_id: boothUser.dataValues.user_id,
                    role_id: boothUser.dataValues.role_id,
                    entity_id: to_booth,
                    entity_type: 'booths', 
                };
            });

            UsersRoles.bulkCreate(updatedUserRoles);
            
            const booth = await Booth.findOne({where: {id: to_booth}});

            const activityLogDto = {
                user_id: this.services.UserService.getAuth().dataValues.id,
                event_id: booth.dataValues.event_id,
                activity_type_id: ActivityTypeDictionary.BOOTH_USERS_COPIED
            };
            await this.services.ActivityService.createActivityLogs(activityLogDto);

            return serviceResponse(true, "Users copied successfully");

        } catch (error) {
            throw error;
        }
    }   
}

module.exports = new UserService;