const {DataTypes, Model, Op} = require('sequelize');
const {sequelize} = require('./../utils/database');
const UserDetail = require('./../models/UserDetail');

class User extends Model {

    static async getUsersByUserIds(user_ids, query = '') {

        let where = {
            id: user_ids,
        }

        if (query !== '') {

            where = {
                id: user_ids,
                [Op.or]: [{first_name: query}, {last_name: query}, {email: query}]
            }
        }
        return await User.findAll({
            where: where,
            raw: true
        });
    }

    static async getUsersNamesByUserIds(user_ids) {
        let where = {
          id: user_ids,
        }
      
        const users = await User.findAll({
          where: where,
          attributes: ['id', 'first_name', 'last_name'], // Specify the attributes you want to retrieve
          raw: true
        });
      
        const usersMap = {};
        const nameCountMap = {}; // To keep track of name occurrences
      
        users.forEach((user) => {
          const { id, first_name, last_name } = user;
          const fullName = `${first_name} ${last_name}`;
      
          if (!nameCountMap[fullName]) {
            nameCountMap[fullName] = 1;
            usersMap[id] = fullName; // First occurrence, no suffix needed
          } else {
            // If the combination already exists, add a numeric suffix
            const suffix = ` (${nameCountMap[fullName]})`;
            usersMap[id] = `${fullName}${suffix}`;
            nameCountMap[fullName]++;
          }
        });
      
        return usersMap;
      }

    static async getUsersByIds(Ids) {
        try {
            const usersData = await User.findAll({
                attributes: ['id', 'email'],
                where: {
                    id: Ids
                }
            });

            const user_data_hash = {}

            for (const user of usersData) {
                user_data_hash[user.id] = user.email;
            }
            return user_data_hash;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async getUsersByIdsNames(Ids) {
        try {
            const usersData = await User.findAll({
                attributes: ['id', 'first_name','last_name'],
                where: {
                    id: Ids
                }
            });

            const user_data_hash = {}

            for (const user of usersData) {
                user_data_hash[user.id] = `${user.first_name} ${user.last_name}`;
            }
            return user_data_hash;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async getUsersByEventId(eventId, limit) {
        try {
            const usersData = await User.findAll({
                attributes: ['id', 'first_name', 'email', 'company', 'title', 'other_info', 'state','phone_number'],
                where: {
                    event_id: eventId
                },
                limit: limit
            });
    
            const userIds = usersData.map(user => user.id);
    
            const userDetails = await UserDetail.findAll({
                where: {
                    user_id: {
                        [Op.in]: userIds
                    },
                    event_id: eventId
                },
                attributes: ['id', 'field_name', 'field_value', 'user_id'],
            });
    
            const userDetailsMap = userDetails.reduce((map, detail) => {
                const userId = detail.user_id;
    
                if (!map[userId]) {
                    map[userId] = [];
                }
    
                map[userId].push(detail);
    
                return map;
            }, {});
    
            const usersWithReplacedInfo = usersData.map(user => {
                if (user.other_info && user.other_info.trim() !== '') {
                    user.other_info = user.other_info.replace(/\\n\s*/g, '\n');
                    user.other_info = user.other_info.split('@@@')
                        .map(entry => entry.trim())
                        .join('\n\n');
                }
    
                user.dataValues.user_details = userDetailsMap[user.id] || []; 
                return user;
            });
    
            const totalCount = await User.count({
                where: {
                    event_id: eventId
                }
            });
    
            return { count: totalCount, users: usersWithReplacedInfo };
    
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    

    static async getUsersCountByEventIds(eventIds) {

        const countsMap = {};

        const users = await User.findAll({
            attributes: ['event_id', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            where: {
              event_id: {
                [Op.in]: eventIds
              }
            },
            group: ['event_id']
          });
      
          users.forEach(user => {
            const eventId = user.event_id;
            const count = user.dataValues.count;
            countsMap[eventId] = count;
          });
      
          // Set counts to 0 for eventIds that have no booths
          eventIds.forEach(eventId => {
            if (!(eventId in countsMap)) {
              countsMap[eventId] = 0;
            }
          });
        return countsMap;
    }

    static async getUsersDataByIds(Ids) {
        try {
            const usersData = await User.findAll({
                attributes: ['id', 'first_name', 'last_name', 'email'],
                where: {
                    id: {
                        [Op.in]: Ids
                    }
                }
            });
    
            const user_data_hash = {}
    
            for (const user of usersData) {
                user_data_hash[user.id] = {
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email
                };
            }
            return user_data_hash;
    
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    profile_image_upload_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    profile_image_upload_id_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ref_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    booth_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    title: DataTypes.STRING,
    company: DataTypes.TEXT,
    address: DataTypes.TEXT,
    other_info: DataTypes.TEXT,
    qr_code: DataTypes.TEXT,
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
});

module.exports = User;