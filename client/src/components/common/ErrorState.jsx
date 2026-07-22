function ErrorState({ message = "Impossible de charger les données." }) {
  return (
    <div className="state-box error-state">
      <strong>Erreur</strong>
      <p>{message}</p>
    </div>
  );
}

export default ErrorState;