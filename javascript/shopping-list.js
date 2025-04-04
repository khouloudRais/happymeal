        // Fonction pour charger et afficher les éléments du panier
        function afficherPanier() {
            const panier = JSON.parse(localStorage.getItem('panier')) || [];
            const panierList = document.getElementById('panier-list');
            const panierVide = document.getElementById('panier-vide');

            panierList.innerHTML = ''; // Réinitialiser la liste avant d'ajouter les nouveaux éléments

            if (panier.length === 0) {
                panierVide.style.display = 'block'; // Afficher le message "Panier vide"
            } else {
                panierVide.style.display = 'none'; // Cacher le message "Panier vide"
                panier.forEach((ingredient, index) => {
                    const li = document.createElement('li');
                    li.textContent = `${ingredient.nom}: ${ingredient.quantite}`;

                    const btnSupprimer = document.createElement('button');
                    btnSupprimer.textContent = "Supprimer";
                    btnSupprimer.classList.add('btn', 'btn-danger', 'ms-2');
                    btnSupprimer.onclick = () => supprimerDuPanier(index); // Supprimer l'élément

                    li.appendChild(btnSupprimer);
                    panierList.appendChild(li);
                });
            }
        }

        // Fonction pour supprimer un ingrédient du panier
        function supprimerDuPanier(index) {
            // Récupérer le panier existant depuis le localStorage
            let panier = JSON.parse(localStorage.getItem('panier')) || [];

            // Supprimer l'élément du panier
            panier.splice(index, 1);

            // Sauvegarder à nouveau dans le localStorage
            localStorage.setItem('panier', JSON.stringify(panier));

            // Mettre à jour l'affichage du panier
            afficherPanier();
        }

        // Charger le panier lorsque la page est chargée
        window.onload = afficherPanier;

