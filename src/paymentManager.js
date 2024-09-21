// const pool = require("./db");

// // Fonction pour valider une date au format YYYY-MM-DD
// function isValidDate(date) {
//   const regex = /^\d{4}-\d{2}-\d{2}$/;
//   return regex.test(date) && !isNaN(new Date(date).getTime());
// }

// // Fonction pour valider un montant
// function isValidAmount(amount) {
//   return typeof amount === 'number' && amount >= 0;
// }

// // Fonction pour obtenir tous les paiements
// async function getPayments() {
//   const connection = await pool.getConnection();
//   try {
//     const [rows] = await connection.execute("SELECT * FROM payments");
//     return rows;
//   } catch (error) {
//     console.error("Erreur lors de la récupération des paiements:", error.message);
//     throw new Error("Erreur lors de la récupération des paiements.");
//   } finally {
//     connection.release();
//   }
// }

// // Fonction pour ajouter un paiement
// async function addPayment(orderId, date, amount, paymentMethod, status) {
//   // Validation des champs obligatoires
//   if (!orderId || !date || !amount || !paymentMethod) {
//     throw new Error("Tous les champs (orderId, date, amount, paymentMethod) sont obligatoires.");
//   }

  
//   if (isNaN(Date.parse(date))) {
//     throw new Error("La date fournie n'est pas valide.");
//   }

//   // // Validation du montant
//   // if (!isValidAmount(amount)) {
//   //   throw new Error("Erreur : le montant doit être un nombre positif.");
//   // }

//   try {
//   const connection = await pool.getConnection();

//     // Vérifier si la commande existe
//     if (!(await orderExists(orderId))) {
//       throw new Error(`Erreur : l'ID de la commande ${orderId} n'existe pas.`);
//     }

//     const [result] = await connection.execute(
//       "INSERT INTO payments (order_id, date, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)",
//       [orderId, date, amount, paymentMethod, status || null]
//     );
//     return result.insertId;
//   } catch (error) {
//     if (error.code === "ER_NO_REFERENCED_ROW_2") {
//       throw new Error(`Erreur : la commande avec l'ID ${orderId} n'existe pas.`);
//     }
//     console.error("Erreur lors de l'ajout du paiement:", error.message);
//     throw new Error("Erreur lors de l'ajout du paiement.");
//   } finally {
//     connection.release();
//   }
// }

// // Fonction pour mettre à jour un paiement
// async function updatePayment(id, orderId, date, amount, paymentMethod, status) {
//   // Validation des champs obligatoires
//   if (!orderId || !date || !amount || !paymentMethod) {
//     throw new Error("Tous les champs (orderId, date, amount, paymentMethod) sont obligatoires.");
//   }
//   if (isNaN(Date.parse(date))) {
//     throw new Error("La date fournie n'est pas valide.");
//   }
//   if (!isValidAmount(amount)) {
//     throw new Error("Erreur : le montant doit être un nombre positif.");
//   }

//   // Vérifier si le paiement existe
//   if (!(await paymentExists(id))) {
//     throw new Error(`Erreur : l'ID du paiement ${id} n'existe pas.`);
//   }

//   // Vérifier si la commande existe
//   if (!(await orderExists(orderId))) {
//     throw new Error(`Erreur : l'ID de la commande ${orderId} n'existe pas.`);
//   }

//   const connection = await pool.getConnection();
//   try {
//     const [result] = await connection.execute(
//       "UPDATE payments SET order_id = ?, date = ?, amount = ?, payment_method = ?, status = ? WHERE id = ?",
//       [orderId, date, amount, paymentMethod, status || null, id]
//     );
//     if (result.affectedRows === 0) {
//       throw new Error(`Erreur : Aucun paiement trouvé avec l'ID ${id}.`);
//     }
//     return result.affectedRows;
//   } catch (error) {
//     if (error.code === "ER_NO_REFERENCED_ROW_2") {
//       throw new Error(`Erreur : la commande avec l'ID ${orderId} n'existe pas.`);
//     }
//     console.error("Erreur lors de la mise à jour du paiement:", error.message);
//     throw new Error("Erreur lors de la mise à jour du paiement.");
//   } finally {
//     connection.release();
//   }
// }

// // Fonction pour supprimer un paiement
// async function deletePayment(id) {
//   if (!id) {
//     throw new Error("ID obligatoire pour pouvoir supprimer un paiement.");
//   }

//   // Vérifier si le paiement existe
//   if (!(await paymentExists(id))) {
//     throw new Error(`Erreur : l'ID du paiement ${id} n'existe pas.`);
//   }

//   const connection = await pool.getConnection();
//   try {
//     const [result] = await connection.execute("DELETE FROM payments WHERE id = ?", [id]);
//     if (result.affectedRows === 0) {
//       throw new Error(`Erreur : Aucun paiement trouvé avec l'ID ${id}.`);
//     }
//     return result.affectedRows;
//   } catch (error) {
//     console.error("Erreur lors de la suppression du paiement:", error.message);
//     throw new Error("Erreur lors de la suppression du paiement.");
//   } finally {
//     connection.release();
//   }
// }

// // Fonction pour vérifier si un paiement existe
// async function paymentExists(id) {
//   const connection = await pool.getConnection();
//   try {
//     const [rows] = await connection.execute("SELECT 1 FROM payments WHERE id = ?", [id]);
//     return rows.length > 0;
//   } catch (error) {
//     console.error("Erreur lors de la vérification de l'existence du paiement:", error.message);
//     throw new Error("Erreur lors de la vérification de l'existence du paiement.");
//   } finally {
//     connection.release();
//   }
// }

// // Fonction pour vérifier si une commande existe
// async function orderExists(id) {
//   const connection = await pool.getConnection();
//   try {
//     const [rows] = await connection.execute("SELECT 1 FROM purchase_orders WHERE id = ?", [id]);
//     return rows.length > 0;
//   } catch (error) {
//     console.error("Erreur lors de la vérification de l'existence de la commande:", error.message);
//     throw new Error("Erreur lors de la vérification de l'existence de la commande.");
//   } finally {
//     connection.release();
//   }
// }

// module.exports = { getPayments, addPayment, updatePayment, deletePayment };
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

