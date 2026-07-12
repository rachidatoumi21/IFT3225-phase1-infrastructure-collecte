import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="app-header">
      <div>
        <h1>Ambiance API</h1>
        <p>Consommation et visualisation des données d’ambiance</p>
      </div>

      <nav className="app-nav">
        <NavLink to="/">Accueil</NavLink>

        {isAuthenticated ? (
          <>
            <NavLink to="/compte">Mon compte</NavLink>
            <span className="nav-user">{user?.name}</span>
            <button className="nav-button" type="button" onClick={logout}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Connexion</NavLink>
            <NavLink to="/register">Inscription</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;