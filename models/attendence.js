'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendence extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       Attendence.belongsTo(models.Intern, {
        foreignKey: 'intern_id',
        as: 'att_to_intern',
        onDelete: 'CASCADE'
      });
    }
  }
  Attendence.init({
     id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    intern_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    check_in: DataTypes.DATE,
    check_out: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Attendence',
    tableName:'attendences'
  });
  return Attendence;
};