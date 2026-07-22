import { MapContainer, TileLayer } from "react-leaflet";
import EmptyState from "../common/EmptyState";
import LocationMarker from "./LocationMarker";

function getValidLocations(locations) {
  return locations.filter(
    (location) =>
      typeof location.latitude === "number" &&
      typeof location.longitude === "number"
  );
}

function getMapCenter(locations) {
  const validLocations = getValidLocations(locations);

  if (validLocations.length === 0) {
    return [45.55, -73.65];
  }

  const latitude =
    validLocations.reduce((sum, location) => sum + location.latitude, 0) /
    validLocations.length;

  const longitude =
    validLocations.reduce((sum, location) => sum + location.longitude, 0) /
    validLocations.length;

  return [latitude, longitude];
}

function AmbianceMap({ locations }) {
  const validLocations = getValidLocations(locations);

  if (validLocations.length === 0) {
    return (
      <EmptyState message="Aucun lieu avec coordonnées valides n’est disponible pour afficher la carte." />
    );
  }

  const center = getMapCenter(validLocations);

  return (
    <section className="map-section">
      <div className="section-heading">
        <h2>Carte des lieux</h2>
        <p>
          Les marqueurs utilisent les coordonnées des lieux et affichent la
          classification d’ambiance fournie par l’API.
        </p>
      </div>

      <MapContainer
        center={center}
        zoom={10}
        scrollWheelZoom
        className="ambiance-map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validLocations.map((location) => (
          <LocationMarker key={location.slug} location={location} />
        ))}
      </MapContainer>

      <p className="map-note">
        Seuil de fraîcheur retenu : 30 minutes. Lorsqu’un lieu n’a pas de
        mesure récente, il reste visible sur la carte avec l’état « données
        anciennes ».
      </p>
    </section>
  );
}

export default AmbianceMap;