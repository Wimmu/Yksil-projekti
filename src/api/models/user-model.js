import promisePool from '../../utils/database.js';

// TESTED
const listAllUsers = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM wsk_users');
    console.log('rows', rows);
    return rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// TESTED
const findUserById = async (id) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM wsk_users WHERE user_id = ?', [id]);
    console.log('rows', rows);
    if (rows.length === 0) {
      return false;
    }
    return rows[0];
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
};

// TESTED
const addUser = async (user) => {
  try {
    const {name, username, email, password, role} = user;
    const sql = `INSERT INTO wsk_users (name, username, email, password, role)
                 VALUES (?, ?, ?, ?, ?)`;
    const params = [name, username, email, password, role];
    const rows = await promisePool.execute(sql, params);
    if (rows[0].affectedRows === 0) {
      return false;
    }
    return {user_id: rows[0].insertId};
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// TESTED
const modifyUser = async (user, id) => {
  try {
    const sql = promisePool.format(`UPDATE wsk_users SET ? WHERE user_id = ?`, [user, id]);
    const [rows] = await promisePool.execute(sql);
    console.log('rows', rows);
    if (rows.affectedRows === 0) {
      return false;
    }
    return {message: 'success'};
  } catch (error) {
    console.error('Error modifying user:', error);
    throw error;
  }
};

// TESTED
const removeUser = async (id) => {
  let connection;
  try {
    connection = await promisePool.getConnection();
    await connection.beginTransaction(); // Start transaction

    // Delete associated cats
    await connection.execute('DELETE FROM wsk_cats WHERE owner = ?', [id]);

    // Delete user
    const [userDeleteRows] = await connection.execute('DELETE FROM wsk_users WHERE user_id = ?', [id]);
    console.log('Deleted user rows:', userDeleteRows);

    // Commit transaction
    await connection.commit();

    return { message: 'success' };
  } catch (error) {
    // Rollback transaction if there is an error
    if (connection) {
      await connection.rollback();
    }
    console.error('Error removing user:', error);
    throw error;
  } finally {
    // Release connection
    if (connection) {
      connection.release();
    }
  }
};

const login = async (username) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM wsk_users WHERE username = ?', [username]);
    return rows[0];
  } catch (error) {
    console.error('Error finding user by username:', error);
    throw error;
  }
};

export {
  listAllUsers,
  findUserById,
  addUser,
  modifyUser,
  removeUser,
  login
};
