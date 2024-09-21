const pool = require("./db");

// Fonction pour vérifier si une commande existe dans la base de données
async function orderExists(order_id) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT 1 FROM purchase_orders WHERE id = ?", [order_id]);
    return rows.length > 0;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'existence de la commande :", error.message);
    throw new Error("Erreur lors de la vérification de l'existence de la commande.");
  } finally {
    connection.release();
  }
}

// Fonction pour ajouter un paiement avec validation de la commande
async function addPayment(order_id, date, amount, payment_method, status) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "INSERT INTO payments (order_id, date, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)",
      [order_id, date, amount, payment_method, status]
    );
    return result.insertId;
  } catch (error) {
    console.error("Erreur lors de l'ajout du paiement :", error.message);
    throw new Error("Erreur lors de l'ajout du paiement.");
  } finally {
    connection.release();
  }
}
// Fonction pour récupérer tous les paiements
async function getPayments() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM payments");
    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements :", error.message);
    throw new Error("Erreur lors de la récupération des paiements.");
  } finally {
    connection.release();
  }
}

// Fonction pour mettre à jour un paiement
async function updatePayment(id, order_id, date, amount, payment_method, status) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "UPDATE payments SET order_id = ?, date = ?, amount = ?, payment_method = ?, status = ? WHERE id = ?",
      [order_id, date, amount, payment_method, status, id]
    );
    if (result.affectedRows === 0) {
      throw new Error(`Aucun paiement trouvé avec l'ID ${id}.`);
    }
    return result.affectedRows;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du paiement :", error.message);
    throw new Error("Erreur lors de la mise à jour du paiement.");
  } finally {
    connection.release();
  }
}

// Fonction pour supprimer un paiement
async function destroyPayment(id) {
  if (!id) {
    throw new Error("ID obligatoire pour supprimer un paiement.");
  }

  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute("DELETE FROM payments WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      throw new Error(`Aucun paiement trouvé avec l'ID ${id}.`);
    }
    return result.affectedRows;
  } catch (error) {
    if (error.code && error.code === "ER_ROW_IS_REFERENCED_2") {
      throw new Error(
        `Erreur de suppression : le paiement ${id} est référencé dans d'autres enregistrements.`
      );
    }
    console.error("Erreur lors de la suppression du paiement :", error.message);
    throw new Error("Erreur lors de la suppression du paiement.");
  } finally {
    connection.release();
  }
}
async function paymentExists(id) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT 1 FROM payments WHERE id = ?", [id]);
    return rows.length > 0;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'existence du paiement:", error.message);
    throw new Error("Erreur lors de la vérification de l'existence du paiement.");
  } finally {
    connection.release();
  }
}

module.exports = { getPayments, addPayment, updatePayment, destroyPayment, paymentExists ,};

