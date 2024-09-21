const pool = require("./db");

async function getOrders() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM purchase_orders");
    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes :", error.message);
    throw new Error("Erreur lors de la récupération des commandes.");
  } finally {
    connection.release();
  }
}

async function addOrder(date, customer_id, delivery_address, track_number, status) {
  if (!date || !customer_id || !delivery_address || !track_number || !status) {
    throw new Error("Tous les champs (date, customer_id, delivery_address, track_number, status) sont obligatoires.");
  }
  if (isNaN(Date.parse(date))) {
    throw new Error("La date fournie n'est pas valide.");
  }

  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "INSERT INTO purchase_orders (date, customer_id, delivery_address, track_number, status) VALUES (?, ?, ?, ?, ?)",
      [date, customer_id, delivery_address, track_number, status]
    );
    return result.insertId;
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      console.error("Erreur : L'ID du client spécifié n'existe pas.");
    } else {
      console.error("Erreur lors de l'ajout de la commande :", error.message);
    }
    throw error; // Relancer l'erreur pour que l'appelant puisse gérer
  } finally {
    connection.release();
  }
}

async function updateOrder(id, date, customer_id, delivery_address, track_number, status) {
  if (!date || !customer_id || !delivery_address || !track_number || !status) {
    throw new Error("Tous les champs (date, customer_id, delivery_address, track_number, status) sont obligatoires.");
  }
  if (isNaN(Date.parse(date))) {
    throw new Error("La date fournie n'est pas valide.");
  }

  if (!(await orderExists(id))) {
    throw new Error(`Erreur : la commande avec l'ID ${id} n'existe pas.`);
  }

  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "UPDATE purchase_orders SET date = ?, customer_id = ?, delivery_address = ?, track_number = ?, status = ? WHERE id = ?",
      [date, customer_id, delivery_address, track_number, status, id]
    );
    if (result.affectedRows === 0) {
      throw new Error(`Aucune commande trouvée avec l'ID ${id}.`);
    }
    return result.affectedRows;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande :", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

async function deleteOrder(id) {
  if (!(await orderExists(id))) {
    throw new Error(`Erreur : la commande avec l'ID ${id} n'existe pas.`);
  }

  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute("DELETE FROM purchase_orders WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      throw new Error(`Aucune commande trouvée avec l'ID ${id}.`);
    }
    return result.affectedRows;
  } catch (error) {
    console.error("Erreur lors de la suppression de la commande :", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

async function orderExists(id) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT 1 FROM purchase_orders WHERE id = ?", [id]);
    return rows.length > 0;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'existence de la commande :", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

async function addOrderDetail(orderId, productId, quantity) {
  const connection = await pool.getConnection();
  try {
    // Vérifier si la commande existe
    const [order] = await connection.execute("SELECT * FROM purchase_orders WHERE id = ?", [orderId]);
    if (!order.length) {
      throw new Error("La commande spécifiée n'existe pas.");
    }

    // Vérifier si le produit existe
    const [product] = await connection.execute("SELECT * FROM products WHERE id = ?", [productId]);
    if (!product.length) {
      throw new Error("Le produit spécifié n'existe pas.");
    }

    // Insérer le détail de commande
    const [result] = await connection.execute(
      "INSERT INTO order_details (order_id, product_id, quantity) VALUES (?, ?, ?)",
      [orderId, productId, quantity]
    );
    console.log("Détail de commande ajouté avec succès !");
    return result.insertId;
  } catch (error) {
    console.error("Erreur lors de l'ajout du détail de commande :", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Obtenir tous les détails de commandes
async function getOrderDetails() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM order_details");
    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails de commandes :", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Obtenir un détail de commande par ID
async function getOrderDetailById(id) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM order_details WHERE id = ?", [id]);
    if (rows.length === 0) {
      throw new Error("Le détail de commande spécifié n'existe pas.");
    }
    return rows[0];
  } catch (error) {
    console.error("Erreur lors de la récupération du détail de commande :", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

async function getOrderById(id) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM purchase_orders WHERE id = ?", [id]);
    if (rows.length === 0) {
      throw new Error("La commande spécifiée n'existe pas.");
    }
    return rows[0];
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande :", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Mettre à jour un détail de commande
async function updateOrderDetail(id, quantity) {
  const connection = await pool.getConnection();
  try {
    const [detail] = await connection.execute("SELECT * FROM order_details WHERE id = ?", [id]);
    if (!detail.length) {
      throw new Error("Le détail de commande spécifié n'existe pas.");
    }

    await connection.execute("UPDATE order_details SET quantity = ? WHERE id = ?", [quantity, id]);
    console.log("Détail de commande mis à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du détail de commande :", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Supprimer un détail de commande
async function destroyOrderDetail(id) {
  const connection = await pool.getConnection();
  try {
    const [detail] = await connection.execute("SELECT * FROM order_details WHERE id = ?", [id]);
    if (!detail.length) {
      throw new Error("Le détail de commande spécifié n'existe pas.");
    }

    await connection.execute("DELETE FROM order_details WHERE id = ?", [id]);
    console.log("Détail de commande supprimé avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression du détail de commande :", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  addOrderDetail,
  getOrderById,
  getOrderDetails,
  getOrderDetailById,
  updateOrderDetail,
  destroyOrderDetail,
  orderExists,
};
