import promisePool from '../../utils/database.js';

const listAllItems = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM menuitem');
    console.log('rows', rows);
    return rows;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

const removeItem = async (name) => {
  try {
    // Find the menuitem_id associated with the given name
    const [id_rows] = await promisePool.execute('SELECT menuitem_id FROM menuitem WHERE name = ?', [name]);

    // If no menuitem_id is found, return
    if (id_rows.length === 0) {
      console.log('Menu item not found');
      return false;
    }

    const menuitem_id = id_rows[0].menuitem_id;

    // Delete the associated orderitems
    const [orderitemrows] = await promisePool.execute('DELETE FROM orderitem WHERE menuitem_id = ?', [menuitem_id]);
    console.log('Deleted order items:', orderitemrows.affectedRows);

    // Delete the menuitem
    const [rows] = await promisePool.execute('DELETE FROM menuitem WHERE menuitem_id = ?', [menuitem_id]);
    console.log('Deleted menu item:', rows.affectedRows);

    if (rows.affectedRows === 0) {
      console.log('Menu item not found');
      return false;
    }

    return { message: 'success' };

  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};


export {
  listAllItems,
  removeItem
};
