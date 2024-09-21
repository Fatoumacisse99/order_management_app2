const readlineSync = require("readline-sync");
const productModule = require("./productManager");

const customerModule = require("./customerManager");
const paymentModule = require("./paymentManager");
const orderModule = require("./orderManager"); 
const pool = require("./db");
let commande = null;
let detailsCommande = [];

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
    console.log("\nGestion des commandes");
    console.log("1 Ajouter une commande et ses détails");
    console.log("2 Modifier une commande et ses détails");
    console.log("3 Lister une commande et ses détails");
    console.log("4 Supprimer une commande et ses détails");
    console.log("0 Retour");

    choix = readlineSync.question("Votre choix : ");

    switch (choix) {
      case "1":
        await addOrderWithDetails();
        break;
      case "2":
        await updateOrderWithDetails();
        break;
      case "3":
        await listOrderWithDetails();
        break;
      case "4":
        await deleteOrderWithDetails();
        break;
      case "0":
        break;
      default:
        console.log("Cette option est invalide");
        break;
    }
  } while (choix !== "0");
}

async function addOrderWithDetails() {
  try {
    let date, customer_id, delivery_address, track_number, status;

    // Validation de la date
    while (true) {
      date = readlineSync.question("Entrez la date de la commande (YYYY-MM-DD) : ");
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        console.log("Le format de la date est invalide. Veuillez entrer la date au format YYYY-MM-DD.");
      } else if (isNaN(Date.parse(date))) {
        console.log("La date fournie n'est pas valide. Veuillez réessayer.");
      } else {
        break; 
      }
    }

    // Validation de l'ID du client
    while (true) {
      customer_id = readlineSync.question("ID du client: ");
      if (isNaN(customer_id) || customer_id <= 0) {
        console.log("L'ID du client doit être un nombre positif. Veuillez réessayer.");
      } else if (!(await customerModule.customerExists(customer_id))) {
        console.log("L'ID du client n'existe pas. Veuillez réessayer.");
      } else {
        break;
      }
    }

    // Validation de l'adresse de livraison
    while (true) {
      delivery_address = readlineSync.question("Adresse de livraison: ");
      if (!delivery_address.trim()) {
        console.log("L'adresse de livraison ne peut pas être vide. Veuillez réessayer.");
      } else {
        break; // Adresse valide
      }
    }

    // Validation du numéro de suivi
    while (true) {
      track_number = readlineSync.question("Numéro de suivi: ");
      if (!track_number.trim()) {
        console.log("Le numéro de suivi ne peut pas être vide. Veuillez réessayer.");
      } else {
        break; // Numéro de suivi valide
      }
    }

    // Validation du statut de la commande
    while (true) {
      status = readlineSync.question("Statut de la commande: ");
      if (!status.trim()) {
        console.log("Le statut de la commande ne peut pas être vide. Veuillez réessayer.");
      } else {
        break; // Statut valide
      }
    }

    // Création de la commande
    commande = {
      date,
      customer_id,
      delivery_address,
      track_number,
      status,
    };
    console.log("Commande ajoutée en mémoire !");
    
    // Gestion des détails de la commande
    await manageOrderDetails();
  } catch (error) {
    console.error("Erreur lors de l'ajout de la commande :", error.message);
  }
}



async function updateOrderWithDetails() {
  try {
    const orderId = readlineSync.question("Entrez l'ID de la commande à modifier : ");
    let date, customer_id, delivery_address, track_number, status;

    while (true) {
      customer_id = readlineSync.question("Entrez le nouvel ID du client : ");
      if (isNaN(customer_id) || customer_id <= 0) {
        console.log("L'ID du client doit être un nombre positif. Veuillez réessayer.");
      } else if (!(await customerModule.customerExists(customer_id))) {
        console.log("L'ID du client n'existe pas. Veuillez réessayer.");
      } else {
        break;
      }
    }

    delivery_address = readlineSync.question("Adresse de livraison: ");

    while (true) {
      date = readlineSync.question("Entrez la nouvelle date de la commande (YYYY-MM-DD) : ");
      if (isNaN(Date.parse(date))) {
        console.log("La date fournie n'est pas valide. Veuillez réessayer.");
      } else {
        break;
      }
    }

    track_number = readlineSync.question("Nouveau numéro de suivi: ");
    status = readlineSync.question("Nouveau statut de la commande: ");

    await orderModule.updateOrder(orderId, customer_id, delivery_address, date, track_number, status);
    console.log("Commande modifiée avec succès !");
    await manageOrderDetails(orderId);
  } catch (error) {
    console.error("Erreur lors de la modification de la commande :", error.message);
  }
}

async function listOrderWithDetails() {
  try {
    const orderId = readlineSync.question("Entrez l'ID de la commande à lister : ");
    const order = await orderModule.getOrderById(orderId);

    if (!(await customerModule.customerExists(order.customer_id))) {
      console.log("L'ID du client associé à cette commande n'existe pas.");
      return;
    }

    const orderDetails = await orderModule.getOrderDetailById(orderId);

    console.log("\nCommande:");
    console.log(order);

    console.log("\nDétails de la commande:");
    console.log(orderDetails);
  } catch (error) {
    console.error("Erreur lors de la liste de la commande :", error.message);
  }
}

async function deleteOrderWithDetails() {
  try {
    const orderId = readlineSync.question("Entrez l'ID de la commande à supprimer : ");
    const order = await orderModule.getOrderById(orderId);

    if (!(await customerModule.customerExists(order.customer_id))) {
      console.log("L'ID du client associé à cette commande n'existe pas. Suppression impossible.");
      return;
    }

    await orderModule.destroyOrderDetail(orderId);
    await orderModule.deleteOrder(orderId);

    console.log("Commande et ses détails supprimés avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression de la commande :", error.message);
  }
}
async function manageOrderDetails() {
  let choix;
  
  do {
    console.log("\nGestion des détails de la commande");
    console.log("1 Ajouter des produits");
    console.log("2 Sauvegarder");
    console.log("0 Quitter");

    choix = readlineSync.question("Votre choix : ");

    switch (choix) {
      case "1":
        const productId = readlineSync.question("Entrez l'ID du produit : ");
        const quantity = readlineSync.question("Entrez la quantité : ");
        const price = readlineSync.question("Entrez le prix : ");

        // Ajoutez les détails au tableau
        detailsCommande.push({ productId, quantity, price });
        console.log("Détail de commande ajouté en mémoire !");
        break;

      case "2":
        await sauvegarderCommandeEtDetails(); // Appel de la fonction de sauvegarde
        break;

      case "0":
        break;

      default:
        console.log("Cette option est invalide.");
        break;
    }
  } while (choix !== "0");
}




async function sauvegarderCommandeEtDetails() {
  try {
    if (!commande || detailsCommande.length === 0) {
      console.log("Aucune commande ou aucun détail à sauvegarder.");
      return;
    }

    const orderId = await orderModule.addOrder(
      commande.date,
      commande.customer_id,
      commande.delivery_address,
      commande.track_number,
      commande.status
    );

    for (const detail of detailsCommande) {
      await orderModule.addOrderDetail(orderId, detail.productId, detail.quantity, detail.price);
    }

    console.log("Commande et détails sauvegardés avec succès !");
    commande = null; // Réinitialisation de la commande
    detailsCommande = []; // Réinitialisation des détails
  } catch (error) {
    console.error("Erreur lors de la sauvegarde :", error.message);
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
    const productId = readlineSync.question("Entrez l'ID du produit à modifier : ");

    // Vérification de l'existence de l'ID du produit
    if (!(await productModule.productExists(productId))) {
      console.log("L'ID du produit n'existe pas. Veuillez réessayer.");
      return;
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

    // Vérification de l'existence de l'ID du produit
    if (!(await productModule.productExists(productId))) {
      console.log("L'ID du produit n'existe pas. Veuillez réessayer.");
      return;
    }

    await productModule.destroyProduct(productId);
    console.log("Produit supprimé avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression du produit :", error.message);
  }
}


async function addCustomer() {
  try {
    const name = readlineSync.question("Entrez le nom du client : ");
    const email = readlineSync.question("Entrez l'email du client : ");
    const phone = readlineSync.question(
      "Entrez le numéro de téléphone du client : "
    );
    const address = readlineSync.question("Entrez l'adresse du client : ");

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
    const customerId = readlineSync.question(
      "Entrez l'ID du client à modifier : "
    );
    const name = readlineSync.question(
      "Entrez le nouveau nom du client : "
    );
    const email = readlineSync.question(
      "Entrez le nouvel email du client : "
    );
    const phone = readlineSync.question(
      "Entrez le nouveau numéro de téléphone du client: "
    );
    const address = readlineSync.question(
      "Entrez la nouvelle adresse du client : "
    );

    await customerModule.updateCustomer(
      customerId,
      name,
      email,
      phone,
      address
    );
    console.log("Client modifié avec succès !");
  } catch (error) {
    console.error("Erreur lors de la modification du client :", error.message);
  }
}

async function deleteCustomer() {
  try {
    const customerId = readlineSync.question(
      "Entrez l'ID du client à supprimer : "
    );
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
        // Vérifiez si l'ID de la commande existe
        const exists = await orderModule.orderExists(order_id);
        if (!exists) {
          console.log("L'ID de la commande n'existe pas. Veuillez réessayer.");
        } else {
          break; // Sort de la boucle si l'ID est valide
        }
      }
    }

    let amount;
    while (true) {
      amount = parseFloat(readlineSync.question("Entrez le montant: "));
      if (isNaN(amount) || amount <= 0) {
        console.log("Le montant doit être un nombre supérieur à zéro. Veuillez réessayer.");
      } else {
        break; // Sort de la boucle si le montant est valide
      }
    }

    let payment_date;
    while (true) {
      payment_date = readlineSync.question("Entrez la date du paiement (YYYY-MM-DD): ");
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(payment_date)) {
        console.log("La date doit être au format YYYY-MM-DD. Veuillez réessayer.");
      } else {
        break; // Sort de la boucle si la date est valide
      }
    }

    const payment_method = readlineSync.question("Entrez le mode de paiement (ex: carte, espèces): ");
    const status = readlineSync.question("Entrez le statut du paiement (ex: payé, en attente): ");

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
        const exists = await paymentModule.paymentExists(paymentId); // Assure-toi que cette méthode existe
        if (!exists) {
          console.log("L'ID du paiement n'existe pas. Veuillez réessayer.");
        } else {
          break;  // Sort de la boucle si l'ID est valide
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
        break;  // Sort de la boucle si la date est valide
      }
    }

    let amount;
    while (true) {
      amount = parseFloat(readlineSync.question("Entrez le nouveau montant du paiement : "));
      if (isNaN(amount) || amount <= 0) {
        console.log("Le montant doit être un nombre supérieur à zéro. Veuillez réessayer.");
      } else {
        break;  // Sort de la boucle si le montant est valide
      }
    }

    const paymentMethod = readlineSync.question("Entrez le mode de paiement : ");
    const status = readlineSync.question("Entrez le statut du paiement : ");

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
