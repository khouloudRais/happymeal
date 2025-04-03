// Fonction pour charger et afficher les éléments du panier
function afficherFavoris() {
    const favoris = JSON.parse(localStorage.getItem('favoris')) || [];
    const favorisList = document.getElementById('favoritesList');
    const favorisVide = document.getElementById('favoris-vide'); // Vérifier l'élément

    favorisList.innerHTML = ''; // Réinitialiser la liste avant d'ajouter les nouveaux éléments

    if (favorisVide) { // Vérifier si l'élément 'favoris-vide' existe
        if (favoris.length === 0) {
            favorisVide.style.display = 'block'; // Afficher le message "Favoris vide"
        } else {
            favorisVide.style.display = 'none'; // Cacher le message "Favoris vide"
        }
    }

    if (favoris.length > 0) {
        favoris.forEach((recette, index) => { // Assure-toi d'afficher les recettes
            const li = document.createElement('li');
            li.textContent = `${recette.nom}`; // Afficher le nom de la recette

            const btnSupprimer = document.createElement('button');
            btnSupprimer.textContent = "Supprimer";
            btnSupprimer.classList.add('btn', 'btn-danger', 'ms-2');
            btnSupprimer.onclick = () => supprimerDuFavoris(index); // Supprimer l'élément

            li.appendChild(btnSupprimer);
            favorisList.appendChild(li);
        });
    }
}

// Fonction pour supprimer un ingrédient des favoris
function supprimerDuFavoris(index) {
    // Récupérer les favoris existants depuis le localStorage
    let favoris = JSON.parse(localStorage.getItem('favoris')) || [];

    // Supprimer l'élément des favoris
    favoris.splice(index, 1);

    // Sauvegarder à nouveau dans le localStorage
    localStorage.setItem('favoris', JSON.stringify(favoris));

    // Mettre à jour l'affichage des favoris
    afficherFavoris(); // Utilise bien le bon nom de la fonction
}

// Charger les favoris lorsque la page est chargée
window.onload = afficherFavoris;
