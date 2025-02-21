// app/models/db.js

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('smart', 'root', '', {
  host: 'localhost', // or your MySQL host
  dialect: 'mysql',
});

export { sequelize };
