'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {

    static associate(models) {
      // define association here
      // User.hasOne(models.UserProfile)
      Order.belongsTo(models.User)
      Order.hasMany(models.OrderMenu)
    }
    get formatDate(){
      const now = Date.now();
      const createdTime = new Date(this.createdAt).getTime();
      const menit = now - createdTime;
      const convertMenit = Math.floor(menit / 60000); // 60.000 ms per menit

      if (convertMenit < 1) {
        return 'just now'
      }
      return `${convertMenit} minutes ago`;
    }
  }
  Order.init({
    statusOrder: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};