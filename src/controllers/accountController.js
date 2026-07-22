const Observation = require("../models/Observation");
const Location = require("../models/Location");
const User = require("../models/User");

async function getMyObservations(req, res, next) {
  try {
    const observations = await Observation.find({
      author: req.user._id
    })
      .sort({ timestamp: -1, createdAt: -1 })
      .limit(100)
      .populate("author", "name email role");

    res.status(200).json({
      success: true,
      count: observations.length,
      data: observations
    });
  } catch (error) {
    next(error);
  }
}

async function getMyPlaces(req, res, next) {
  try {
    const groupedPlaces = await Observation.aggregate([
      {
        $match: {
          author: req.user._id
        }
      },
      {
        $group: {
          _id: "$location",
          observationsCount: { $sum: 1 },
          latestObservationAt: { $max: "$timestamp" }
        }
      },
      {
        $sort: {
          latestObservationAt: -1
        }
      }
    ]);

    const locationSlugs = groupedPlaces.map((item) => item._id);

    const locations = await Location.find({
      slug: { $in: locationSlugs }
    });

    const locationBySlug = new Map(
      locations.map((location) => [location.slug, location])
    );

    const data = groupedPlaces.map((item) => {
      const location = locationBySlug.get(item._id);

      return {
        slug: item._id,
        name: location?.name || item._id,
        description: location?.description || "",
        address: location?.address || "",
        latitude: location?.latitude || null,
        longitude: location?.longitude || null,
        type: location?.type || "unknown",
        observationsCount: item.observationsCount,
        latestObservationAt: item.latestObservationAt
      };
    });

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
}

async function getMyFavorites(req, res, next) {
  try {
    const user = await User.findById(req.user._id);

    const favoriteSlugs = user.favoriteLocations || [];

    const locations = await Location.find({
      slug: { $in: favoriteSlugs }
    });

    const locationBySlug = new Map(
      locations.map((location) => [location.slug, location])
    );

    const data = favoriteSlugs.map((slug) => {
      const location = locationBySlug.get(slug);

      return {
        slug,
        name: location?.name || slug,
        description: location?.description || "",
        address: location?.address || "",
        latitude: location?.latitude || null,
        longitude: location?.longitude || null,
        type: location?.type || "unknown"
      };
    });

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
}

async function addFavoriteLocation(req, res, next) {
  try {
    const { slug } = req.params;

    const location = await Location.findOne({ slug });

    if (!location) {
      return res.status(404).json({
        success: false,
        error: {
          code: "LOCATION_NOT_FOUND",
          message: "Lieu introuvable."
        }
      });
    }

    const user = await User.findById(req.user._id);

    if (!user.favoriteLocations.includes(slug)) {
      user.favoriteLocations.push(slug);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Lieu ajouté aux favoris.",
      data: {
        slug: location.slug,
        name: location.name,
        description: location.description,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        type: location.type
      }
    });
  } catch (error) {
    next(error);
  }
}

async function removeFavoriteLocation(req, res, next) {
  try {
    const { slug } = req.params;

    const user = await User.findById(req.user._id);

    user.favoriteLocations = user.favoriteLocations.filter(
      (favoriteSlug) => favoriteSlug !== slug
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Lieu retiré des favoris.",
      data: {
        slug
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMyObservations,
  getMyPlaces,
  getMyFavorites,
  addFavoriteLocation,
  removeFavoriteLocation
};