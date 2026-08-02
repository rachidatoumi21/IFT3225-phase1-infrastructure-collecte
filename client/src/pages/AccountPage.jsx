import { Link } from "react-router-dom";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import { useAuth } from "../context/AuthContext";
import { useAccountData } from "../hooks/useAccountData";
import { formatDateTime } from "../utils/formatDate";

function formatProximity(proximity) {
  const labels = {
    near: "Proche",
    medium: "Moyenne",
    far: "Faible"
  };

  return labels[proximity] || proximity || "Non disponible";
}

function formatVibe(vibe) {
  const labels = {
    calm: "Calme",
    normal: "Normale",
    busy: "Occupée",
    noisy: "Bruyante"
  };

  return labels[vibe] || vibe || "Non disponible";
}

function AccountPage() {
  const { user, token, isAuthenticated } = useAuth();

  const {
    observations,
    places,
    favorites,
    loading,
    errorMessage,
    actionMessage,
    removeFavorite
  } = useAccountData({ isAuthenticated, token });

  if (!isAuthenticated) {
    return (
      <div className="page">
        <section className="account-card">
          <h2>Mon compte</h2>
          <p>
            Vous devez être connecté pour consulter votre espace compte, vos
            observations, vos lieux et vos favoris.
          </p>

          <Link className="primary-link" to="/connexion">
            Se connecter
          </Link>
        </section>
      </div>
    );
  }

  if (loading) {
    return <LoadingState message="Chargement de votre espace compte..." />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
  }

  return (
    <div className="page">
      <section className="account-card">
        <p className="eyebrow">Espace compte</p>
        <h2>Mon compte</h2>

        <div className="account-identity">
          <div>
            <span className="summary-label">Nom</span>
            <strong>{user?.name || "Utilisateur"}</strong>
          </div>

          <div>
            <span className="summary-label">Courriel</span>
            <strong>{user?.email || "Non disponible"}</strong>
          </div>

          <div>
            <span className="summary-label">Rôle</span>
            <strong>{user?.role || "user"}</strong>
          </div>
        </div>

        {actionMessage && <p className="success-message">{actionMessage}</p>}
      </section>

      <section className="account-section">
        <div className="section-heading">
          <h2>Mes observations</h2>
          <p>Consultez les observations soumises avec votre compte.</p>
        </div>

        {observations.length === 0 ? (
          <EmptyState message="Vous n’avez pas encore soumis d’observation." />
        ) : (
          <div className="account-list">
            {observations.map((observation) => (
              <article className="account-list-item" key={observation._id}>
                <div>
                  <h3>{observation.location}</h3>
                  <p>{observation.notes || "Aucune note ajoutée."}</p>
                </div>

                <div className="account-meta">
                  <span>
                    Proximité : {formatProximity(observation.proximity)}
                  </span>
                  <span>Ambiance : {formatVibe(observation.vibe)}</span>
                  <span>{formatDateTime(observation.timestamp)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="account-section">
        <div className="section-heading">
          <h2>Mes lieux</h2>
          <p>
            Ces lieux regroupent les endroits où vous avez déjà soumis une
            observation.
          </p>
        </div>

        {places.length === 0 ? (
          <EmptyState message="Aucun lieu n’est encore associé à vos observations." />
        ) : (
          <div className="account-grid">
            {places.map((place) => (
              <article className="account-place-card" key={place.slug}>
                <h3>{place.name}</h3>
                <p>{place.address || "Adresse non disponible"}</p>
                <p>
                  {place.observationsCount} observation
                  {place.observationsCount > 1 ? "s" : ""}
                </p>
                <p>
                  Dernière observation :{" "}
                  {formatDateTime(place.latestObservationAt)}
                </p>

                <Link className="primary-link" to={`/lieux/${place.slug}`}>
                  Voir le portrait
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="account-section">
        <div className="section-heading">
          <h2>Mes favoris</h2>
          <p>Retrouvez ici les lieux que vous avez ajoutés à vos favoris.</p>
        </div>

        {favorites.length === 0 ? (
          <EmptyState message="Vous n’avez pas encore ajouté de lieu favori." />
        ) : (
          <div className="account-grid">
            {favorites.map((favorite) => (
              <article className="account-place-card" key={favorite.slug}>
                <h3>{favorite.name}</h3>
                <p>{favorite.address || "Adresse non disponible"}</p>

                <div className="account-actions">
                  <Link className="primary-link" to={`/lieux/${favorite.slug}`}>
                    Voir le portrait
                  </Link>

                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => removeFavorite(favorite.slug)}
                  >
                    Retirer des favoris
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AccountPage;