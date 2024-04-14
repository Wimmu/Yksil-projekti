import promisePool from '../../utils/database.js';

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

const addUser = async (user) => {
  try {
    console.log('Received user data:', user);
    const {name, username, email, password, role} = user;
    const sql = `INSERT INTO wsk_users (name, username, email, password, role)
                 VALUES (?, ?, ?, ?, ?)`;
    if (!name || !username || !email || !password || !role) {
      throw new Error(`Missing required user properties ${name} ${username} ${email} ${password} ${role}`);
    }
    const params = [name, username, email, password, role];
    const rows = await promisePool.execute(sql, params);
    console.log('rows', rows);
    if (rows[0].affectedRows === 0) {
      return false;
    }
    return {user_id: rows[0].insertId};
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

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

const removeUser = async (id) => {
  let connection;
  try {
    connection = await promisePool.getConnection();
    await connection.beginTransaction(); // Start transaction

    // Delete user
    const [userDeleteRows] = await connection.execute('DELETE FROM wsk_users WHERE user_id = ?', [id]);
    console.log('Deleted user rows:', userDeleteRows);

    // If user was deleted successfully, delete associated cats
    if (userDeleteRows.affectedRows > 0) {
      const [catDeleteRows] = await connection.execute('DELETE FROM cats WHERE owner = ?', [id]);
      console.log('Deleted cat rows:', catDeleteRows);
    }

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

const findUserByUsernameAndPassword = async (username, password) => {
  try {
    // Query the database to find the user by username and password
    const [rows] = await promisePool.execute('SELECT * FROM wsk_users WHERE username = ? AND password = ?', [username, password]);
    if (rows.length === 0) {
      return null; // User not found
    }
    return rows[0]; // Return the user object
  } catch (error) {
    console.error('Error finding user by username and password:', error);
    throw error;
  }
};

const login = async (user) => {
  const sql = `SELECT *
              FROM wsk_users
              WHERE username = ?`;
  const params = [user.username];
  try {
    const [rows] = await promisePool.execute(sql, params);
    console.log('rows', rows);
    if (rows.length === 0) {
      return false;
    }
    return rows[0];
  } catch (error) {
    console.error('Error finding user by username:', error);
    throw error;
  } finally {
    promisePool.end();
  }
}


export {login, findUserByUsernameAndPassword, listAllUsers, findUserById, addUser, modifyUser, removeUser};
