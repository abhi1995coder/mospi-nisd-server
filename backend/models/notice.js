// models/notice.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Notice = sequelize.define('Notice', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    publish_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'notices',
    underscored: true,
    timestamps: true
  });

  Notice.associate = models => {
    // Add associations here if needed, e.g., Notice.belongsTo(models.User,...)
  };

  return Notice;
};
