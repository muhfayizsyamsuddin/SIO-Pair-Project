'use strict';
const { UserProfile } = require('./index')
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Store.hasMany(models.Employee, {foreignKey: 'StoreId'})
      User.hasOne(models.UserProfile)
      User.hasMany(models.Order)
    }

    static async greeting(id){
      return await User.findByPk(id, {
        include: 'UserProfile'
      });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Username is required!'
        }, 
        notNull: {
          msg: 'Username is required!'
        },
        isLowercase: {
          args: true,
          msg: ' Username must be lowercase!'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Email must be unique'
      },
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: ' Email is required!'
        }, 
        notNull: {
          msg: ' Email is required!'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: ' Password is required!'
        }, 
        notNull: {
          msg: ' Password is required!'
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: ' Role is required!'
        }, 
        notNull: {
          msg: ' Role is required!'
        }
      }
    }
  }, {
    hooks: {
      async beforeCreate(instance, options){
        console.log(instance, '<<<<<');
        const salt = await bcrypt.genSalt(8);
        const hash = await bcrypt.hash(instance.password, salt);
        instance.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};