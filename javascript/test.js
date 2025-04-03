let recettes = []; // Pour stocker toutes les recettes
let currentPage = 1; // Page actuelle
let recipesPerPage = 6; // Nombre de recettes par page

// Charger les recettes depuis le fichier JSON
fetch('data/data.json')
    .then(response => response.json())
    .then(data => {
        recettes = data.recettes;
        afficherRecettes(recettes, currentPage); // Afficher les recettes dès le chargement
        afficherPagination(recettes, currentPage);
    })
    .catch(error => console.error("Erreur de chargement du JSON :", error));

// Fonction pour afficher les recettes de manière aléatoire
function afficherRecettes(recettes, page) {
    const container = document.getElementById("recettes-container");
    container.innerHTML = ''; // Réinitialiser le conteneur avant d'ajouter de nouvelles recettes

    // Mélanger les recettes
    const recettesMelangees = melangerRecettes(recettes);

    // Calculer l'index de départ et de fin des recettes à afficher
    const startIndex = (page - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;

    // Limiter les recettes à afficher
    const recettesAffichees = recettesMelangees.slice(startIndex, endIndex);

    // Ajouter les recettes au conteneur
    recettesAffichees.forEach(recette => {
        const recetteElement = document.createElement("div");
        recetteElement.classList.add("col-md-4", "mb-4");

        recetteElement.innerHTML = `
            <div class="card">
                <img src="${recette.image}" class="card-img-top" alt="${recette.nom}">
                <div class="card-body">
                    <h5 class="card-title">${recette.nom}</h5>
                    <button class="btn btn-primary" onclick="afficherDetailsRecette('${recette.nom}')">
                        Voir les détails
                    </button>
                </div>
            </div>
        `;
        container.appendChild(recetteElement);
    });
}

// Fonction pour mélanger les recettes de manière aléatoire
function melangerRecettes(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Échanger les éléments
    }
    return array;
}

// Fonction pour afficher les détails d'une recette dans une modale
function afficherDetailsRecette(nomRecette) {
    const recette = recettes.find(r => r.nom === nomRecette);
    if (recette) {
        const modalTitle = document.getElementById("modalTitle");
        const modalImage = document.getElementById("modalImage");
        const modalDescription = document.getElementById("modalDescription");
        const modalCategorie = document.getElementById("modalCategorie");

        modalTitle.textContent = recette.nom;
        modalImage.src = recette.image;
        modalDescription.textContent = recette.etapes;
        modalCategorie.textContent = "Catégorie: " + recette.categorie;

        // Ouvrir la modale
        const modal = new bootstrap.Modal(document.getElementById('recetteModal'));
        modal.show(); // Afficher la modale
    }
}

// Fonction pour afficher la pagination
function afficherPagination(recettes, currentPage) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ''; // Réinitialiser la pagination

    const totalPages = Math.ceil(recettes.length / recipesPerPage); // Calculer le nombre total de pages

    // Créer les boutons de pagination
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.classList.add("btn", "btn-secondary", "mx-1");
        if (i === currentPage) {
            pageButton.classList.add("active"); // Ajouter une classe active à la page courante
        }
        pageButton.onclick = () => {
            currentPage = i;
            afficherRecettes(recettes, currentPage);
            afficherPagination(recettes, currentPage);
        };
        paginationContainer.appendChild(pageButton);
    }
}

// Fonction d'autocomplétion pour la barre de recherche
function searchRecipe() {
    let query = document.getElementById("searchBar").value.toLowerCase().trim();
    let suggestionsList = document.getElementById("suggestionsList");
    suggestionsList.innerHTML = ""; // Réinitialiser la liste

    if (query.length === 0) return; // Ne rien afficher si la recherche est vide

    let suggestions = new Set();

    // Recherche dans les recettes
    recettes.forEach(recipe => {
        if (recipe.nom.toLowerCase().includes(query)) {
            suggestions.add(recipe.nom);
        }
    });

    if (suggestions.size === 0) {
        let li = document.createElement("li");
        li.textContent = "Aucune suggestion";
        suggestionsList.appendChild(li);
    }

    suggestions.forEach(suggestion => {
        let li = document.createElement("li");
        li.textContent = suggestion;
        li.classList.add("suggestion-item");
        li.onclick = function () {
            document.getElementById("searchBar").value = suggestion;
            suggestionsList.innerHTML = "";
            afficherDetailsRecette(suggestion); // Afficher les détails après clic
        };
        suggestionsList.appendChild(li);
    });
}

// Déclencher la recherche à chaque frappe dans la barre de recherche
document.getElementById("searchBar").addEventListener("keyup", searchRecipe);

// Fermer la modale lorsque tu veux le faire via JavaScript
function closeModal() {
    var myModal = new bootstrap.Modal(document.getElementById('recetteModal'));
    myModal.hide(); // Fermer la modale
}

// Ajouter un écouteur d'événement pour un bouton de fermeture personnalisé
document.getElementById("closeModalBtn").addEventListener("click", closeModal);
