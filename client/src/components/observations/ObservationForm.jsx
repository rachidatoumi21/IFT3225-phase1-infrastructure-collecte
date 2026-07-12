import { useState } from "react";
import { createObservation } from "../../api/observationsApi";
import { useAuth } from "../../context/AuthContext";

function ObservationForm({ locationSlug, onObservationCreated }) {
  const { token, isAuthenticated } = useAuth();

  const [proximity, setProximity] = useState("medium");
  const [vibe, setVibe] = useState("normal");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isAuthenticated || !token) {
      setErrorMessage("Vous devez être connecté pour soumettre une observation.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      await createObservation(
        {
          location: locationSlug,
          proximity,
          vibe,
          notes
        },
        token
      );

      setNotes("");
      setProximity("medium");
      setVibe("normal");
      setSuccessMessage("Votre observation a été soumise avec succès.");

      if (onObservationCreated) {
        onObservationCreated();
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <section className="observation-card">
        <h3>Soumettre une observation</h3>
        <p>
          Connectez-vous pour partager une observation sur ce lieu. Cette action
          est protégée et sera associée à votre compte.
        </p>
      </section>
    );
  }

  return (
    <section className="observation-card">
      <h3>Soumettre une observation</h3>

      <p>
        Cette observation sera associée à votre compte et apparaîtra dans votre
        espace personnel.
      </p>

      <form className="observation-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="proximity">Proximité humaine</label>
            <select
              id="proximity"
              value={proximity}
              onChange={(event) => setProximity(event.target.value)}
            >
              <option value="near">Proche</option>
              <option value="medium">Moyenne</option>
              <option value="far">Faible</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="vibe">Ambiance observée</label>
            <select
              id="vibe"
              value={vibe}
              onChange={(event) => setVibe(event.target.value)}
            >
              <option value="calm">Calme</option>
              <option value="normal">Normale</option>
              <option value="busy">Occupée</option>
              <option value="noisy">Bruyante</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            rows="4"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Exemple : lieu calme, peu de personnes, ambiance agréable..."
          />
        </div>

        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? "Envoi en cours..." : "Soumettre l’observation"}
        </button>
      </form>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="auth-error">{errorMessage}</p>}
    </section>
  );
}

export default ObservationForm;