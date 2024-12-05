const readlineSync = require("readline-sync");
const productModule = require("./productManager");
const customerModule = require("./customerManager");
const paymentModule = require("./paymentManager");
const orderModule = require("./orderManager");
const pool = require("./db");
async function main() {
  let choix;
  do {
    console.log("\nChoisissez une option");
    console.log("1 Gestion des produits");
    console.log("2 Gestion des clients");
    console.log("3 Gestion des paiements");
    console.log("4 Gestion des commandes");
    console.log("0 Quitter");

    choix = readlineSync.question("Votre choix : ");

    switch (choix) {
      case "1":
        await productMenu();
        break;
      case "2":
        await customerMenu();
        break;
      case "3":
        await paymentMenu();
        break;
      case "4":
        await orderMenu();
        break;
      case "0":
        console.log("Sortie du programme...");
        break;
      default:
        console.log("Cette option est invalide");
        break;
    }
  } while (choix !== "0");
}
async function productMenu() {
  let choix;
  do {
    console.log("\nGestion des produits");
    console.log("1 Ajouter un produit");
    console.log("2 Lister tous les produits");
    console.log("3 Mettre à jour les infos d'un produit");
    console.log("4 Supprimer un produit");
    console.log("0 Retour");

    choix = readlineSync.question("Votre choix : ");

    switch (choix) {
      case "1":
        await addProduct();
        break;
      case "2":
        await listProducts();
        break;
      case "3":
        await updateProduct();
        break;
      case "4":
        await deleteProduct();
        break;
      case "0":
        break;
      default:
        console.log("Cette option est invalide");
        break;
    }
  } while (choix !== "0");
}

async function customerMenu() {
  let choix;
  do {
    console.log("\nGestion des clients");
    console.log("1 Ajouter un client");
    console.log("2 Lister tous les clients");
    console.log("3 Mettre à jour les infos d'un client");
    console.log("4 Supprimer un client");
    console.log("0 Retour");

    choix = readlineSync.question("Votre choix : ");

    switch (choix) {
      case "1":
        await addCustomer();
        break;
      case "2":
        await listCustomers();
        break;
      case "3":
        await updateCustomer();
        break;
      case "4":
        await deleteCustomer();
        break;
      case "0":
        break;
      default:
        console.log("Cette option est invalide");
        break;
    }
  } while (choix !== "0");
}

async function paymentMenu() {
  let choix;
  do {
    console.log("\nGestion des paiements");
    console.log("1 Ajouter un paiement");
    console.log("2 Lister tous les paiements");
    console.log("3 Mettre à jour un paiement");
    console.log("4 Supprimer un paiement");
    console.log("0 Retour");

    choix = readlineSync.question("Votre choix : ");

    switch (choix) {
      case "1":
        await addPayment();
        break;
      case "2":
        await listPayments();
        break;
      case "3":
        await updatePayment();
        break;
      case "4":
        await deletePayment();
        break;
      case "0":
        break;
      default:
        console.log("Cette option est invalide");
        break;
    }
  } while (choix !== "0");
}
async function orderMenu() {
  let choix;
  do {
    console.log("\n--- Gestion des commandes ---");
    console.log("1. Ajouter une commande et ses détails");
    console.log("2. Modifier une commande et ses détails");
    console.log("3. Lister une commande et ses détails");
    console.log("4. Supprimer une commande et ses détails");
    console.log("5. Lister toutes les commandes et leurs détails");
    console.log("0. Quitter");
    choix = readlineSync.questionInt("\nVotre choix : ");

    switch (choix) {
      case 1:
        await addOrderWithDetails();
        break;
      case 2:
        await modifyOrder();
        break;
      case 3:
        await listOrder();
        break;
      case 4:
        await deleteOrder();
        break;
      case 5:
        await listAllOrders();
        break;
      case 0:
        console.log("Au revoir !");
        break;
      default:
        console.log("Choix invalide, veuillez réessayer.");
    }
  } while (choix !== 0);
}
async function addOrderWithDetails() {
  let order = {};
  let details = [];
  let totalPrice = 0; 

  try {
    order.date = readlineSync.question("Entrez la date de la commande (YYYY-MM-DD) : ");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(order.date)) {
      console.log("Date invalide.");
      return;
    }

    order.customer_id = readlineSync.questionInt("Entrez l'ID du client : ");
    
    const [rows] = await pool.execute("SELECT * FROM customers WHERE id = ?", [order.customer_id]);
    if (rows.length === 0) {
      console.log("Client non trouvé.");
      return;
    }

    let addProduct = true;
    while (addProduct) {
      let detail = {};
      detail.product_id = readlineSync.questionInt("Entrez l'ID du produit : ");
      detail.quantity = readlineSync.questionInt("Entrez la quantité : ");

      const [productRows] = await pool.execute("SELECT * FROM products WHERE id = ?", [detail.product_id]);
      if (productRows.length === 0) {
        console.log("Produit non trouvé.");
        return;
      }

      const product = productRows[0];
      const productTotal = product.price * detail.quantity;
      totalPrice += productTotal;  

      console.log(`Produit ajouté : ${product.name} - Total partiel = ${productTotal.toFixed(2)} €`);

      details.push({ product_id: detail.product_id, quantity: detail.quantity });

      addProduct = readlineSync.keyInYNStrict("Ajouter un autre produit ? (y/n)");
    }

    console.log(`Total de la commande = ${totalPrice.toFixed(2)} €`);

    const confirm = readlineSync.keyInYNStrict("Confirmer la commande ? (y/n)");
    if (!confirm) {
      console.log("Commande annulée.");
      return;
    }

    const [result] = await pool.execute("INSERT INTO purchase_orders (date, customer_id) VALUES (?, ?)", [order.date, order.customer_id]);
    const orderId = result.insertId;

    for (let detail of details) {
      await pool.execute("INSERT INTO order_details (order_id, product_id, quantity) VALUES (?, ?, ?)", [orderId, detail.product_id, detail.quantity]);
    }

    console.log("Commande ajoutée avec succès !");

  } catch (error) {
    console.error("Erreur lors de l'ajout de la commande :", error.message);
  }
}
async function modifyOrder() {
  const connection = await pool.getConnection();
  try {
    const orderId = readlineSync.questionInt("Entrez l'ID de la commande à modifier : ");
    if (orderId <= 0) {
      console.log("L'ID doit être un entier positif.");
      return;
    }
    const [orderRows] = await connection.execute("SELECT * FROM purchase_orders WHERE id = ?", [orderId]);
    if (orderRows.length === 0) {
      console.log("La commande avec cet ID n'existe pas.");
      return;
    }
    const [orderDetails] = await connection.execute(
      "SELECT od.id, od.product_id, od.quantity, p.price FROM order_details od INNER JOIN products p ON od.product_id = p.id WHERE od.order_id = ?",
      [orderId]
    );
    
    console.log("Détails actuels de la commande :", orderDetails);
    let choix;
    do {
      console.log("\n1. Modifier un produit");
      console.log("2. Ajouter un produit");
      console.log("3. Supprimer un produit");
      console.log("0. Terminer la modification des détails");
      choix = readlineSync.questionInt("Votre choix : ");

      switch (choix) {
        case 1: 
          const productIdToModify = readlineSync.questionInt("Entrez l'ID du produit à modifier : ");
          const [productDetails] = await connection.execute(
            "SELECT * FROM products WHERE id = ?",
            [productIdToModify]
          );
          
          if (productDetails.length === 0) {
            console.log("Produit non trouvé.");
            break;
          }
          const newQuantity = readlineSync.questionInt("Entrez la nouvelle quantité : ");
          const newPrice = productDetails[0].price;
          const totalPrice = newQuantity * newPrice;
          await connection.execute(
            "UPDATE order_details SET quantity = ?, price = ? WHERE order_id = ? AND product_id = ?",
            [newQuantity, totalPrice, orderId, productIdToModify]
          );
          
          console.log(`Produit modifié : Nouveau total produit = ${totalPrice} €`);
          break;

        case 2: 
          const productIdToAdd = readlineSync.questionInt("Entrez l'ID du produit à ajouter : ");
          const [productToAdd] = await connection.execute(
            "SELECT * FROM products WHERE id = ?",
            [productIdToAdd]
          );

          if (productToAdd.length === 0) {
            console.log("Produit non trouvé.");
            break;
          }
          const quantityToAdd = readlineSync.questionInt("Entrez la quantité à ajouter : ");
          const priceToAdd = productToAdd[0].price;
          const totalAddPrice = quantityToAdd * priceToAdd;
          await connection.execute(
            "INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
            [orderId, productIdToAdd, quantityToAdd, totalAddPrice]
          );

          console.log(`Produit ajouté : Total produit ajouté = ${totalAddPrice} €`);
          break;

        case 3: 
          const productIdToRemove = readlineSync.questionInt("Entrez l'ID du produit à supprimer : ");
          
          const [productToRemove] = await connection.execute(
            "SELECT * FROM order_details WHERE order_id = ? AND product_id = ?",
            [orderId, productIdToRemove]
          );

          if (productToRemove.length === 0) {
            console.log("Produit non trouvé dans les détails de la commande.");
            break;
          }
          await connection.execute(
            "DELETE FROM order_details WHERE order_id = ? AND product_id = ?",
            [orderId, productIdToRemove]
          );

          console.log("Produit supprimé.");
          break;

        case 0:
          console.log("Modification des détails terminée.");
          break;

        default:
          console.log("Choix invalide.");
      }
    } while (choix !== 0);
  } catch (error) {
    console.error("Erreur lors de la modification de la commande :", error.message);
  } finally {
    connection.release();
  }
}


async function listOrder() {
  try {
    const orderId = readlineSync.questionInt("Entrez l'ID de la commande à afficher : ");
    const connection = await pool.getConnection();

    const [orderDetails] = await connection.execute(
      "SELECT od.product_id, od.quantity, p.price FROM order_details od INNER JOIN products p ON od.product_id = p.id WHERE od.order_id = ?",
      [orderId]
    );

    if (orderDetails.length === 0) {
      console.log("Aucun détail de commande trouvé pour cette commande.");
      return;
    }

    let totalPrice = 0;
    console.log(`Détails pour la commande ${orderId} :`);
    for (let detail of orderDetails) {
      const productTotal = detail.quantity * detail.price;
      totalPrice += productTotal;
      console.log(`Produit ID: ${detail.product_id}, Quantité: ${detail.quantity}, Prix unitaire: ${detail.price}€, Total produit: ${productTotal}€`);
    }

    console.log(`Prix total de la commande ${orderId}: ${totalPrice}€`);
  } catch (error) {
    console.error("Erreur lors de la récupération des détails de la commande :", error.message);
  }
}




async function deleteOrder() {
  let connection;
  try {
    const orderId = readlineSync.questionInt("Entrez l'ID de la commande à supprimer : ");
    connection = await pool.getConnection();
    
    const [orderRows] = await connection.execute("SELECT * FROM purchase_orders WHERE id = ?", [orderId]);
    if (orderRows.length === 0) {
      console.log("La commande avec l'ID spécifié n'existe pas.");
      return;
    }
    await connection.execute("DELETE FROM order_details WHERE order_id = ?", [orderId]);
    await connection.execute("DELETE FROM purchase_orders WHERE id = ?", [orderId]);
    console.log("Commande et ses détails supprimés avec succès.");
  } catch (error) {
    console.error("Erreur lors de la suppression de la commande :", error.message);
  } finally {
    if (connection) {
      connection.release(); 
    }
  }
}
async function listAllOrders() {
  try {
    const connection = await pool.getConnection();
    try {
      const [orders] = await connection.execute("SELECT * FROM purchase_orders");
      console.log("Commandes :");
      for (let order of orders) {
        console.log(`Détails pour la commande ${order.id} :`);
        const [details] = await connection.execute(
          "SELECT * FROM order_details WHERE order_id = ?",
          [order.id]
        );

        let totalOrderPrice = 0;
        for (let detail of details) {
          const [product] = await connection.execute(
            "SELECT price FROM products WHERE id = ?",
            [detail.product_id]
          );

          if (product.length > 0) {
            const price = parseFloat(product[0].price);
            const totalPrice = price * detail.quantity;
            console.log(`Produit ID: ${detail.product_id}, Quantité: ${detail.quantity}, Prix unitaire: ${price.toFixed(2)}€, Total produit: ${totalPrice.toFixed(2)}€`);
            totalOrderPrice += totalPrice;
          } else {
            console.log(`Produit ID: ${detail.product_id} introuvable`);
          }
        }
        console.log(`Prix total de la commande ${order.id}: ${totalOrderPrice.toFixed(2)}€`);
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes :", error.message);
  }
}
async function addProduct() {
  try {

    let name;
    while (true) {
      name = (readlineSync.question("Entrez le nom du produit : "));
      if (!name.trim()) {
        console.log("le nom ne peut pas être vide. Veuillez réessayer");
      } else {
        break;
      }
    }
    let description;
    while (true) {
      description = (readlineSync.question("Entrez la description du produi : "));
      if (!description.trim()) {
        console.log("La description ne peut pas être vide. Veuillez réessayer");
      } else {
        break;
      }
    }
    let price;
    while (true) {
      price = parseFloat(readlineSync.question("Entrez le prix du produit : "));
      
      if (isNaN(price) || price <= 0) {
        console.log("Le prix doit être un nombre positif. Veuillez réessayer.");
        return parseFloat(rows[0].price);
      } else {
        break;
      }
    }

    let stock;
    while (true) {
      stock = parseInt(readlineSync.question("Entrez la quantité en stock : "), 10);
      if (isNaN(stock) || stock < 0) {
        console.log("La quantité en stock doit être un nombre positif ou zéro. Veuillez réessayer.");
      } else {
        break;
      }
    }

    let category;
    while (true) {
      category = readlineSync.question("Entrez la catégorie du produit : ");
      if (!category.trim()) {
        console.log("La catégorie ne peut pas être vide. Veuillez réessayer.");
      } else {
        break;
      }
    }

    let barcode;
    while (true) {
      barcode = readlineSync.question("Entrez le code-barres du produit : ");
      if (!barcode.trim()) {
        console.log("Le code-barres ne peut pas être vide. Veuillez réessayer.");
      } else {
        break;
      }
    }

    let status;
    while (true) {
      status = readlineSync.question("Entrez le statut du produit (disponible / non disponible) : ");
      if (!status.trim()) {
        console.log("Le statut ne peut pas être vide. Veuillez réessayer.");
      } else {
        break;
      }
    }

    await productModule.addProduct(name, description, price, stock, category, barcode, status);
    console.log("Produit ajouté avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error.message);
  }
}
async function listProducts() {
  try {
    const products = await productModule.getProducts();
    if (products.length === 0) {
      console.log("Aucun produit trouvé.");
      return parseFloat(rows[0].price);
    } else {
      console.log("\nListe des produits :");
      products.forEach((product) => {
        console.log(product);
      });
    }
  } catch (error) {
    console.error("Erreur lors de la liste des produits :", error.message);
  }
}
async function updateProduct() {
  try {
    let productId
    while (true) {
      productId = readlineSync.question("Entrez l'ID du produit à modifier : ");
      if (!(await productModule.productExists(productId))) {
        console.log("L'ID du produit n'existe pas. Veuillez réessayer.");
      } else if (!(await productModule.productExists(productId))) {
        console.log("L'ID du produit n'existe pas. Veuillez réessayer.");
      } else {
        break;
      }
    }
    let name;
    while (true) {
      name = (readlineSync.question("Entrez le nouveau nom du produit : "));
      if (!name.trim()) {
        console.log("le nom ne peut pas être vide. Veuillez réessayer");
      } else {
        break;
      }
    }
    let description;
    while (true) {
      description = (readlineSync.question("Entrez la nouvelle description du produit : "));
      if (!description.trim()) {
        console.log("La description ne peut pas être vide. Veuillez réessayer");
      } else {
        break;
      }
    }

    let price;
    while (true) {
      price = parseFloat(readlineSync.question("Entrez le nouveau prix du produit : "));
      if (isNaN(price) || price <= 0) {
        console.log("Le prix doit être un nombre positif. Veuillez réessayer.");
      } else {
        break;
      }
    }
    let stock;
    while (true) {
      stock = parseInt(readlineSync.question("Entrez la nouvelle quantité en stock du produit : "), 10);
      if (isNaN(stock) || stock < 0) {
        console.log("La quantité en stock doit être un nombre positif ou zéro. Veuillez réessayer.");
      } else {
        break;
      }
    }
    let category;
    while (true) {
      category = readlineSync.question("Entrez la nouvelle catégorie du produit : ");
      if (!category.trim()) {
        console.log("La catégorie ne peut pas être vide. Veuillez réessayer.");
      } else {
        break;
      }
    }
    let barcode;
    while (true) {
      barcode = readlineSync.question("Entrez le nouveau code-barres du produit : ");
      if (!barcode.trim()) {
        console.log("Le code-barres ne peut pas être vide. Veuillez réessayer.");
      } else {
        break;
      }
    }
    let status;
    while (true) {
      status = readlineSync.question("Entrez le nouveau statut du produit : ");
      if (!status.trim()) {
        console.log("Le statut ne peut pas être vide. Veuillez réessayer.");
      } else {
        break;
      }
    }
    await productModule.updateProduct(productId, name, description, price, stock, category, barcode, status);
    console.log("Produit modifié avec succès !");
  } catch (error) {
    console.error("Erreur lors de la modification du produit :", error.message);
  }
}
async function deleteProduct() {
  try {
    const productId = readlineSync.question("Entrez l'ID du produit à supprimer : ");

    if (!(await productModule.productExists(productId))) {
      console.log("L'ID du produit que vous tentz supprimer n'existe pas.");
      return;
    }

    await productModule.destroyProduct(productId);
    console.log("Produit supprimé avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression du produit :", error.message);
  }
}
async function addCustomer()  {
  try {
    let name, email, phone, address;
    while (true) {
      name = readlineSync.question("Entrez le nom du client : ");
      if (!name.trim()) {
        console.log("Le nom ne peut pas être vide. Veuillez réessayer.");
      } else {
        break;
      }
    }
    while (true) {
      email = readlineSync.question("Entrez l'email du client : ");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log("L'email est invalide. Veuillez entrer un email valide.");
      } else {
        break;
      }
    }
    while (true) {
      phone = readlineSync.question("Entrez le numéro de téléphone du client : ");
      const phoneRegex = /^\d+$/;
      if (!phoneRegex.test(phone)) {
        console.log("Le numéro de téléphone est invalide. Veuillez entrer un numéro valide.");
      } else {
        break;
      }
    }
    while (true) {
      address = readlineSync.question("Entrez l'adresse du client : ");
      if (!address.trim()) {
        console.log("L'adresse ne peut pas être vide. Veuillez réessayer.");
      } else {
        break;
      }
    }
    await customerModule.addCustomer(name, email, phone, address);
    console.log("Client ajouté avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout du client :", error.message);
  }
}
async function listCustomers() {
  try {
    const customers = await customerModule.getCustomers();
    console.log("\nListe des clients :");
    customers.forEach((customer) => {
      console.log(customer);
    });
  } catch (error) {
    console.error("Erreur lors de la liste des clients :", error.message);
  }
}
async function updateCustomer() {
  try {
    let name, email, phone, address, customerId;
    while (true) {
      customerId = readlineSync.question("ID du client a mettre a jour : ");
      if (isNaN(customerId) || customerId <= 0) {
        console.log("L'ID du client doit être un nombre positif. Veuillez réessayer.");
      } else if (!(await customerModule.customerExists(customerId))) {
        console.log("L'ID du client n'existe pas. Veuillez réessayer.");
      } else {
        break;
      }
    }
    while (true) {
      name = readlineSync.question("Entrez le nouveau nom du client : ");
      if (!name.trim()) {
        console.log("Le nom ne peut pas être vide. Veuillez réessayer.");
      } else {
        break;
      }
    }
    while (true) {
      email = readlineSync.question("Entrez le nouvel email du client : ");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log("L'email est invalide. Veuillez entrer un email valide.");
      } else {
        break;
      }
    }
    while (true) {
      phone = readlineSync.question("Entrez le nouveau numéro de téléphone du client : ");
      const phoneRegex = /^\d+$/;
      if (!phoneRegex.test(phone)) {
        console.log("Le numéro de téléphone est invalide. Veuillez entrer un numéro valide.");
      } else {
        break;
      }
    }
    while (true) {
      address = readlineSync.question("Entrez la nouvelle adresse du client : ");
      if (!address.trim()) {
        console.log("L'adresse ne peut pas être vide. Veuillez réessayer.");
      } else {
        break;
      }
    }

    await customerModule.updateCustomer(customerId, name, email, phone, address);
    console.log("Client modifié avec succès !");
  } catch (error) {
    console.error("Erreur lors de la modification du client :", error.message);
  }
}
async function deleteCustomer() {
  try {
    const customerId = readlineSync.question("Entrez l'ID du client à supprimer : ");
    await customerModule.destroyCustomer(customerId);
    console.log("Client supprimé avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression du client :", error.message);
  }
}
async function addPayment() {
  try {
    let order_id;
    while (true) {
      order_id = readlineSync.question("Entrez l'ID de la commande: ");
      if (isNaN(order_id) || order_id <= 0) {
        console.log("L'ID de la commande doit être un nombre positif. Veuillez réessayer.");
      } else {
        const exists = await orderModule.orderExists(order_id);
        if (!exists) {
          console.log("L'ID de la commande n'existe pas. Veuillez réessayer.");
        } else {
          break;
        }
      }
    }
    let amount;
    while (true) {
      amount = parseFloat(readlineSync.question("Entrez le montant: "));
      if (isNaN(amount) || amount <= 0) {
        console.log("Le montant doit être un nombre supérieur à zéro. Veuillez réessayer.");
      } else {
        break;
      }
    }
    let payment_date;
    while (true) {
      payment_date = readlineSync.question("Entrez la date du paiement (YYYY-MM-DD): ");
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(payment_date)) {
        console.log("La date doit être au format YYYY-MM-DD. Veuillez réessayer.");
      } else {
        break;
      }
    }
    let payment_method
    while (true) {
      payment_method = readlineSync.question("Entrez le mode de paiement (ex: carte, espèces): ");
      if (!payment_method.trim()) {
        console.log("Le payment_method ne peut pas être vide. Veuillez réessayer.");
      } else {
        break;
      }
    }
    let status
    while (true) {
      status = readlineSync.question("Entrez le statut du paiement (ex: payé, en attente): ");
      if (!status.trim()) {
        console.log("Le status ne peut pas être vide. Veuillez réessayer.");
      } else {
        break;
      }
    }
    await paymentModule.addPayment(order_id, amount, payment_date, payment_method, status);
    console.log("Paiement ajouté avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout du paiement :", error.message);
  }
}
async function updatePayment() {
  try {
    let paymentId;

    while (true) {
      paymentId = readlineSync.question("Entrez l'ID du paiement à modifier : ");
      if (isNaN(paymentId) || paymentId <= 0) {
        console.log("L'ID du paiement doit être un nombre positif. Veuillez réessayer.");
      }
      else {
        const exists = await paymentModule.paymentExists(paymentId);
        if (!exists) {
          console.log("L'ID du paiement n'existe pas. Veuillez réessayer.");
        } else {
          break;
        }
      }
    }

    let orderId;
    while (true) {
      orderId = readlineSync.question("Entrez l'ID de la commande : ");
      if (isNaN(orderId) || orderId <= 0) {
        console.log("L'ID de la commande doit être un nombre positif. Veuillez réessayer.");
      } else {
        // Vérifiez si l'ID de la commande existe
        const exists = await orderModule.orderExists(orderId);
        if (!exists) {
          console.log("L'ID de la commande n'existe pas. Veuillez réessayer.");
        } else {
          break;
        }
      }
    }

    let date;
    while (true) {
      date = readlineSync.question("Entrez la date du paiement (YYYY-MM-DD) : ");
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        console.log("La date doit être au format YYYY-MM-DD. Veuillez réessayer.");
      } else {
        break;
      }
    }

    let amount;
    while (true) {
      amount = parseFloat(readlineSync.question("Entrez le nouveau montant du paiement : "));
      if (isNaN(amount) || amount <= 0) {
        console.log("Le montant doit être un nombre supérieur à zéro. Veuillez réessayer.");
      } else {
        break;
      }
    }
    let paymentMethod
    while (true) {
      paymentMethod = readlineSync.question("Entrez le nouveau mode de paiement (ex: carte, espèces): ");
      if (!paymentMethod.trim()) {
        console.log("Le payment_method ne peut pas être vide. Veuillez réessayer.");
      } else {
        break;
      }
    }
    let status
    while (true) {
      status = readlineSync.question("Entrez le nouveau statut du paiement (ex: payé, en attente): ");
      if (!status.trim()) {
        console.log("Le status ne peut pas être vide. Veuillez réessayer.");
      } else {
        break;
      }
    }
    await paymentModule.updatePayment(paymentId, orderId, amount, date, paymentMethod, status);
    console.log("Paiement modifié avec succès !");
  } catch (error) {
    console.error("Erreur lors de la modification du paiement :", error.message);
  }
}
async function listPayments() {
  try {
    const payments = await paymentModule.getPayments();
    if (payments.length === 0) {
      console.log("Aucun paiement trouvé.");
      return;
    }

    console.log("\nListe des paiements :");
    payments.forEach(payment => {
      console.log(`ID: ${payment.id}, Commande ID: ${payment.order_id}, Montant: ${payment.amount}, Date: ${payment.date}, Mode de paiement: ${payment.payment_method}, Statut: ${payment.status}`);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements :", error.message);
  }
}
async function deletePayment() {
  try {
    let paymentId;
    while (true) {
      paymentId = readlineSync.question("Entrez l'ID du paiement à supprimer : ");
      if (isNaN(paymentId) || paymentId <= 0) {
        console.log("L'ID du paiement doit être un nombre positif. Veuillez réessayer.");
      } else {
        const exists = await paymentModule.paymentExists(paymentId);
        if (!exists) {
          console.log("L'ID du paiement n'existe pas. Veuillez réessayer.");
        } else {
          break;
        }
      }
    }

    await paymentModule.destroyPayment(paymentId);
    console.log("Paiement supprimé avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression du paiement :", error.message);
  }
}
main();
