// app/models/soutenanceModel.js

import { DataTypes } from 'sequelize';
import { sequelize } from './db'; // Import the sequelize instance from db.js

const Soutenance = sequelize.define('Soutenance', {
  location: {
    type: DataTypes.STRING,  // Adjust according to your actual column type
    allowNull: false,
  },
  idJury: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idGroupe: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Add other fields here as per your schema
}, {
  tableName: 'soutenance', // Ensure the table name matches exactly
  timestamps: false, // Set to true if your table has createdAt/updatedAt columns
});

export default Soutenance;
