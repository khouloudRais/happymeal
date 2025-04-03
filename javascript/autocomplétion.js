
        let recettes = []; // Liste des recettes
        let favoris = new Set(); // Liste des favoris
        let ingredientsAjoutes = []; // Liste des ingrédients ajoutés

        // Charger les recettes depuis un fichier JSON
        fetch('data/data.json')
            .then(response => response.json())
            .then(data => {
                recettes = data.recettes;
                afficherRecettes(recettes);
                afficherPagination(recettes, 1); // Afficher la pagination dès le début
            })
            .catch(error => console.error("Erreur de chargement du JSON :", error));

        // Affichage des recettes
        function afficherRecettes(recettes) {
            const container = document.getElementById('recettes-container');
            container.innerHTML = ''; // Réinitialiser le conteneur avant d'ajouter de nouvelles recettes

            recettes.forEach(recette => {
                const recetteElement = document.createElement("div");
                recetteElement.classList.add("col-md-4", "mb-4");
                recetteElement.innerHTML = `
                    <div class="card">
                        <img src="${recette.image}" class="card-img-top" alt="${recette.nom}">
                        <div class="card-body">
                            <h5 class="card-title">${recette.nom}</h5>
                            <button class="btn btn-primary" onclick="afficherDetailsRecette('${recette.nom}')">Voir les détails</button>
                            <button class="btn btn-outline-danger" onclick="toggleFavorite('${recette.nom}', this)">
                                <i class="bi bi-heart"></i>
                            </button>
                        </div>
                    </div>
                `;
                container.appendChild(recetteElement);
            });
        }

        // Fonction pour afficher les détails d'une recette
        function afficherDetailsRecette(nomRecette) {
            const recette = recettes.find(r => r.nom === nomRecette);
            if (recette) {
                const modalTitle = document.getElementById("modalTitle");
                const modalImage = document.getElementById("modalImage");
                const modalDescription = document.getElementById("modalDescription");
                const modalCategorie = document.getElementById("modalCategorie");
                const modalIngredientsList = document.getElementById("modalIngredientsList");
                const ingredientsList = document.getElementById("ingredientsList");

                modalTitle.textContent = recette.nom;
                modalImage.src = recette.image;
                modalDescription.textContent = recette.etapes;
                modalCategorie.textContent = "Catégorie : " + recette.categorie;

                // Afficher les ingrédients avec le bouton "+"
                modalIngredientsList.innerHTML = recette.ingredients.map(ingredients => {
                    return `
                        <li>
                            <button class="btn btn-sm btn-outline-primary" onclick="addIngredient('${ingredients}')">
                                <i class="bi bi-plus-circle"></i> ${ingredients}
                            </button>
                        </li>
                    `;
                }).join('');

                // Afficher la liste des ingrédients ajoutés
                ingredientsList.innerHTML = ingredientsAjoutes.map(ingredients => {
                    return `<li>${ingredient}</li>`;
                }).join('');

                // Ouvrir la modale
                const modal = new bootstrap.Modal(document.getElementById('recetteModal'));
                modal.show();
            }
        }

        // Ajouter un ingrédient à la liste
        function addIngredient(ingredient) {
            if (!ingredientsAjoutes.includes(ingredient)) {
                ingredientsAjoutes.push(ingredient);
                updateIngredientsList();
            }
        }

        // Mettre à jour l'affichage de la liste des ingrédients ajoutés
        function updateIngredientsList() {
            const ingredientsList = document.getElementById("ingredientsList");
            ingredientsList.innerHTML = ingredientsAjoutes.map(ingredient => {
                return `<li>${ingredient}</li>`;
            }).join('');
        }

        // Ajouter ou retirer une recette des favoris
        function toggleFavorite(nomRecette, button) {
            const icon = button.querySelector('i');
            if (favoris.has(nomRecette)) {
                favoris.delete(nomRecette); // Retirer des favoris
                icon.classList.remove('bi-heart-fill');
                icon.classList.add('bi-heart');
            } else {
                favoris.add(nomRecette); // Ajouter aux favoris
                icon.classList.remove('bi-heart');
                icon.classList.add('bi-heart-fill');
            }
        }

        // Fonction pour afficher la pagination
        function afficherPagination(recettes, currentPage) {
            const paginationContainer = document.getElementById("pagination");
            paginationContainer.innerHTML = ''; // Réinitialiser la pagination

            const totalPages = Math.ceil(recettes.length / 6); // Calculer le nombre total de pages

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
                    afficherRecettes(recettes);
                    afficherPagination(recettes, currentPage);
                };
                paginationContainer.appendChild(pageButton);
            }
        }

        // Recherche par mot-clé
        function searchRecipe() {
            let query = document.getElementById("searchBar").value.toLowerCase().trim();
            let suggestionsList = document.getElementById("suggestionsList");
            suggestionsList.innerHTML = ""; // Réinitialiser la liste

            if (query.length === 0) return;

            let suggestions = new Set();
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
                    afficherDetailsRecette(suggestion);
                };
                suggestionsList.appendChild(li);
            });
        }

        document.getElementById("searchBar").addEventListener("keyup", searchRecipe);
    
