function LoadingState({ message = "Chargement des données..." }) {
  return (
    <div className="state-box loading-state">
      <p>{message}</p>
    </div>
  );
}

export default LoadingState;