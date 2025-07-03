'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Menu.hasMany(models.OrderMenu)
    }
    // get formatDate(){
    //   return new Date(this.createdAt).toLocaleString('en-CA', {
    //         year: 'numeric',
    //         month: 'numeric',
    //         day: 'numeric'
    //     })
    // }
  }
  Menu.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    statusMenu: DataTypes.STRING,
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Menu',
  });
  return Menu;
};