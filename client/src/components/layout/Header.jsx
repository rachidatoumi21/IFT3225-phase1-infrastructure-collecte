import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="app-header">
      <div>
        <h1>Ambiance API</h1>
        <p>Consommation et visualisation des données d’ambiance</p>
      </div>

      <nav className="app-nav">
        <NavLink to="/">Accueil</NavLink>
      </nav>
    </header>
  );
}

export default Header;