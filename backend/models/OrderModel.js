const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./UserModel');

const Order = sequelize.define('Order', {
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('created', 'funded', 'inProgress', 'completed', 'disputed', 'refunded'),
    defaultValue: 'created'
  }
}, {
  timestamps: true
});

// Define associations
Order.belongsTo(User, { as: 'buyer', foreignKey: 'buyerId' });
Order.belongsTo(User, { as: 'seller', foreignKey: 'sellerId' });

module.exports = Order;