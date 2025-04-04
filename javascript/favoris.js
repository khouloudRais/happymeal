// Fonction pour charger et afficher les éléments des favoris
function afficherFavori() {
    const favoris = JSON.parse(localStorage.getItem('favoris')) || [];
    const favorisList = document.getElementById('favoris-list');
    const favorisVide = document.getElementById('favoris-vide');

    favorisList.innerHTML = ''; // Réinitialiser la liste avant d'ajouter les nouveaux éléments

    if (favoris.length === 0) {
        favorisVide.style.display = 'block'; // Afficher le message "favoris vide"
    } else {
        favorisVide.style.display = 'none'; // Cacher le message "favoris vide"
        
        // Parcours chaque ID de recette dans le tableau des favoris
        favoris.forEach((favoriId, index) => {
            // Trouver la recette complète à partir de l'ID du favori
            const recetteFavori = recettes.find(recette => recette.id === favoriId);

            if (recetteFavori) {
                const li = document.createElement('li');
                li.textContent = `${recetteFavori.nom}: ${recetteFavori.image}`;

                const btnSupprimer = document.createElement('button');
                btnSupprimer.textContent = "Supprimer";
                btnSupprimer.classList.add('btn', 'btn-danger', 'ms-2');
                btnSupprimer.onclick = () => supprimerDuFavoris(index); // Supprimer l'élément

                li.appendChild(btnSupprimer);
                favorisList.appendChild(li);
            }
        });
    }
}

// Fonction pour supprimer un ingrédient des favoris
function supprimerDuFavoris(index) {
    // Récupérer les favoris depuis le localStorage
    let favoris = JSON.parse(localStorage.getItem('favoris')) || [];

    // Supprimer l'élément des favoris
    favoris.splice(index, 1);

    // Sauvegarder les favoris mis à jour dans le localStorage
    localStorage.setItem('favoris', JSON.stringify(favoris));

    // Mettre à jour l'affichage des favoris
    afficherFavori();
}

// Charger les favoris lorsque la page est chargée
window.onload = afficherFavori;
