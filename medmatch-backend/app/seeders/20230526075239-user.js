'use strict';

const moment = require("moment/moment");
const User = require("../models/User");
const UserRole = require("../models/UsersRoles");
const {generateHash} = require("../services/AuthService");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        /**
         * Todo: Add alphanumeric password before moving to prod
         */
        const userSeeds = [
            {
                id: 1,
                first_name: 'Super',
                last_name: 'admin',
                email: 'jawad@medmatch.com',
                password: await generateHash('123456'),
                phone_number: '+123',
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            },
        ];

        const userRoleSeeds = [
            {
                id: 1,
                user_id: 1,
                role_id: 1,
                entity_id: 1,
                entity_type: 'users',
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            }
        ]

        try {
            // seed users
            for (const user of userSeeds) {
                await User.upsert(user);
            }

            // seed user roles
            for (const userRole of userRoleSeeds) {
                await UserRole.upsert(userRole);
            }

            console.log('Seed data upserted successfully!');
        } catch (error) {
            console.error('Error upserting seed data:', error);
        }

    },

    async down(queryInterface, Sequelize) {

    }
};
