function EmptyState({ message = "Aucune donnée disponible." }) {
  return (
    <div className="state-box empty-state">
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;