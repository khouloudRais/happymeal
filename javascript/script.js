let recettes = []; // Pour stocker les recettes
let currentPage = 1; // Page actuelle
let recipesPerPage = 6; // Nombre de recettes par page

// Charger les recettes depuis le fichier JSON
fetch('data/data.json')
    .then(response => response.json())
    .then(data => {
        recettes = data.recettes;
        afficherRecettes(recettes, currentPage); // Afficher les recettes dès le chargement
    })
    .catch(error => console.error("Erreur de chargement du JSON :", error));

// Fonction pour afficher les recettes
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

        // Vérifier si la recette est un favori
        const isFavori = checkIfFavori(recette.id);

        recetteElement.innerHTML = `
            <div class="card">
                <img src="${recette.image}" class="card-img-top" alt="${recette.nom}">
                <div class="card-body">
                    <h5 class="card-title">${recette.nom}</h5>
                    <button class="btn btn-primary" onclick="afficherDetailsRecette('${recette.nom}')">
                        Voir les détails
                    </button>
                    <button class="favoris-btn ${isFavori ? 'favoris' : ''}" onclick="toggleFavoris(${recette.id}, this)">
                        <i class="fa fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(recetteElement);
    });
}

// Fonction pour mélanger les recettes (tirer au hasard)
function melangerRecettes(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Échanger les éléments
    }
    return array;
}

// Vérifier si la recette est dans les favoris
function checkIfFavori(id) {
    let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
    return favoris.includes(id);
}

// Ajouter une recette aux favoris
function addToFavoris(id) {
    let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
    favoris.push(id);
    localStorage.setItem("favoris", JSON.stringify(favoris));
}

// Retirer une recette des favoris
function removeFromFavoris(id) {
    let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
    favoris = favoris.filter(favoriId => favoriId !== id);
    localStorage.setItem("favoris", JSON.stringify(favoris));
}

// Gérer l'ajout et le retrait des favoris
function toggleFavoris(id, buttonElement) {
    const isFavori = checkIfFavori(id);

    if (isFavori) {
        // Retirer des favoris
        removeFromFavoris(id);
        buttonElement.classList.remove('favoris'); // Retirer la classe 'favoris' pour changer la couleur
    } else {
        // Ajouter aux favoris
        addToFavoris(id);
        buttonElement.classList.add('favoris'); // Ajouter la classe 'favoris' pour changer la couleur
    }
}

// Afficher les détails de la recette dans un modal
function afficherDetailsRecette(nom) {
    const recette = recettes.find(r => r.nom === nom);

    // Mettre à jour le contenu du modal
    document.getElementById("recette-detail-title").textContent = recette.nom;
    document.getElementById("recette-detail-image").src = recette.image;
    document.getElementById("recette-detail-description").textContent = recette.description;

    // Afficher le modal
    document.getElementById("recette-detail-modal").style.display = 'flex';
}

// Fermer le modal
function closeRecetteDetail() {
    document.getElementById("recette-detail-modal").style.display = 'none';
}

// Initialiser l'affichage des recettes au chargement de la page
window.onload = afficherRecettes;














// Fonction pour afficher les détails d'une recette dans une modale
function afficherDetailsRecette(nomRecette) {
    const recette = recettes.find(r => r.nom === nomRecette);
    if (recette) {
        const modalTitle = document.getElementById("modalTitle");
        const modalImage = document.getElementById("modalImage");
        const modalDescription = document.getElementById("modalDescription");
        const modalCategorie = document.getElementById("modalCategorie");
        const modalIngredients = document.getElementById("modalIngredients");
        const modalEtapes = document.getElementById("modalEtapes");

        modalTitle.textContent = recette.nom;
        modalImage.src = recette.image;
        modalDescription.textContent = "Temps de préparation: " + recette.temps_preparation;
        modalCategorie.textContent = "Catégorie: " + recette.categorie;
        modalEtapes.textContent = recette.etapes;

        modalIngredients.innerHTML = ''; // Réinitialiser la liste des ingrédients















        // Créer un élément pour chaque ingrédient avec un bouton "+"
        recette.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = `${ingredient.nom}: ${ingredient.quantite}`;

            const btnPlus = document.createElement('button');
            btnPlus.textContent = "+";
            btnPlus.classList.add('btn', 'btn-success', 'ms-2');
            btnPlus.onclick = () => ajouterAuPanier(ingredient); // Ajouter au panier

            li.appendChild(btnPlus);
            modalIngredients.appendChild(li);
        });

        // Ouvrir la modale
        const modal = new bootstrap.Modal(document.getElementById('recetteModal'));
        modal.show();
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





























































        // Fonction pour ajouter un ingrédient au panier
        function ajouterAuPanier(ingredient) {
            // Récupérer le panier existant depuis le localStorage
            let panier = JSON.parse(localStorage.getItem('panier')) || [];

            // Ajouter l'ingrédient au panier
            panier.push(ingredient);

            // Sauvegarder le panier dans le localStorage
            localStorage.setItem('panier', JSON.stringify(panier));

            // Mise à jour du nombre d'articles dans le panier
            document.getElementById('cart-count').textContent = panier.length;

            // Confirmation de l'ajout
            alert("Ingrédient ajouté au panier!");
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
   

