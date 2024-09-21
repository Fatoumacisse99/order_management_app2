const pool = require("./db");

async function getCustomers() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM customers");
    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error.message);
    throw new Error("Erreur lors de la récupération des clients.");
  } finally {
    connection.release();
  }
}
async function addCustomer(name, email, phone, address) {
    // Validation des champs obligatoires
    if (!name || !email || !phone || !address) {
      throw new Error("Tous les champs (nom, email, téléphone, adresse) sont obligatoires.");
    }
    // Validation de l'email
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      throw new Error("Erreur : l'adresse e-mail n'est pas valide.");
    }
  
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        "INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)",
        [name, email, phone, address]
      );
      return result.insertId;
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("Erreur : l'e-mail est déjà utilisé par un autre client.");
      }
      console.error("Erreur lors de l'ajout du client:", error.message);
      throw new Error("Erreur lors de l'ajout du client.");
    } finally {
      connection.release();
    }
  }
  async function updateCustomer(id, name, email, phone, address) {
    // Validation des champs obligatoires
    if (!name || !email || !phone || !address) {
      throw new Error("Tous les champs (nom, email, téléphone, adresse) sont obligatoires.");
    }
    // Vérifier si l'ID du client existe
    if (!(await customerExists(id))) {
      throw new Error(`Erreur : l'ID ${id} que vous tentez de mettre à jour n'existe pas.`);
    }
  
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        "UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?",
        [name, email, phone, address, id]
      );
      if (result.affectedRows === 0) {
        throw new Error(`Erreur : Aucun client trouvé avec l'ID ${id}.`);
      }
      return result.affectedRows;
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("Erreur : l'e-mail est déjà utilisé par un autre client.");
      }
      console.error("Erreur lors de la mise à jour du client:", error.message);
      throw new Error("Erreur lors de la mise à jour du client.");
    } finally {
      connection.release();
    }
  }
  async function destroyCustomer(id) {
    if (!id) {
      throw new Error("id obligatoire pour pouvoir supprimer un client");
    }
    // Vérifier si l'ID du client existe
  if (!(await customerExists(id))) {
    throw new Error(`Erreur : l'ID ${id} que vous tentez de supprimer n'existe pas.`);
  }
    
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute("DELETE FROM customers WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        throw new Error(`Erreur : Aucun client trouvé avec l'ID ${id}.`);
      }
      return result.affectedRows;
    } catch (error) {
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        throw new Error(`Erreur de suppression : le client ${id} est référencé dans d'autres enregistrements.`);
      }
      console.error("Erreur lors de la suppression du client:", error.message);
      throw new Error("Erreur lors de la suppression du client.");
    } finally {
      connection.release();
    }
  }
  async function customerExists(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute("SELECT 1 FROM customers WHERE id = ?", [id]);
      return rows.length > 0;
    } catch (error) {
      console.error("Erreur lors de la vérification de l'existence du client:", error.message);
      throw new Error("Erreur lors de la vérification de l'existence du client.");
    } finally {
      connection.release();
    }
  }
module.exports = { getCustomers, addCustomer, updateCustomer, destroyCustomer, customerExists };
