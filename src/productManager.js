const pool = require("./db");

async function getProducts() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM products");
    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error.message);
    throw new Error("Erreur lors de la récupération des produits.");
  } finally {
    connection.release();
  }
}

async function addProduct(name, description, price, stock, category, barcode, status) {
  if (!name || price === undefined || stock === undefined) {
    throw new Error("Les champs nom, prix et stock sont obligatoires.");
  }
  if (isNaN(price) || isNaN(stock)) {
    throw new Error("Le prix et la quantité en stock doivent être des nombres.");
  }
  if (price <= 0 || stock < 0) {
    throw new Error("Le prix doit être supérieur à zéro et le stock ne peut pas être négatif.");
  }

  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "INSERT INTO products (name, description, price, stock, category, barcode, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, description, price, stock, category, barcode, status]
    );
    return result.insertId;
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error.message);
    throw new Error("Erreur lors de l'ajout du produit.");
  } finally {
    connection.release();
  }
}

async function updateProduct(id, name, description, price, stock, category, barcode, status) {
  // Vérifier si le produit existe avant de le mettre à jour
  if (!(await productExists(id))) {
    throw new Error(`Aucun produit trouvé avec l'ID ${id}.`);
  }

  // Validation des données
  if (!name || price === undefined || stock === undefined) {
    throw new Error("Les champs nom, prix et stock sont obligatoires.");
  }
  if (isNaN(price) || isNaN(stock)) {
    throw new Error("Le prix et la quantité en stock doivent être des nombres.");
  }
  if (price <= 0 || stock < 0) {
    throw new Error("Le prix doit être supérieur à zéro et le stock ne peut pas être négatif.");
  }

  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ?, barcode = ?, status = ? WHERE id = ?",
      [name, description, price, stock, category, barcode, status, id]
    );
    if (result.affectedRows === 0) {
      throw new Error(`Aucun produit trouvé avec l'ID ${id}.`);
    }
    return result.affectedRows;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit :", error.message);
    throw new Error("Erreur lors de la mise à jour du produit.");
  } finally {
    connection.release();
  }
}

async function destroyProduct(id) {
  // Vérifier si le produit existe avant de le supprimer
  if (!(await productExists(id))) {
    throw new Error(`Aucun produit trouvé avec l'ID ${id}.`);
  }

  if (!id) {
    throw new Error("ID obligatoire pour supprimer un produit.");
  }

  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute("DELETE FROM products WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      throw new Error(`Aucun produit trouvé avec l'ID ${id}.`);
    }
    return result.affectedRows;
  } catch (error) {
    if (error.code && error.code === "ER_ROW_IS_REFERENCED_2") {
      throw new Error(`Erreur de suppression : le produit ${id} est référencé dans d'autres enregistrements.`);
    }
    console.error("Erreur lors de la suppression du produit :", error.message);
    throw new Error("Erreur lors de la suppression du produit.");
  } finally {
    connection.release();
  }
}

async function productExists(id) {
  if (!id) {
    throw new Error("ID obligatoire pour vérifier l'existence du produit.");
  }

  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT COUNT(*) as count FROM products WHERE id = ?", [id]);
    return rows[0].count > 0; // Renvoie vrai si le produit existe
  } catch (error) {
    console.error("Erreur lors de la vérification de l'existence du produit :", error.message);
    throw new Error("Erreur lors de la vérification de l'existence du produit.");
  } finally {
    connection.release();
  }
}

module.exports = { getProducts, addProduct, updateProduct, destroyProduct, productExists };
