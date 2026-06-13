const Device = require("../models/Device");
const generateApiKey = require("../utils/generateApiKey");

async function createDevice(req, res, next) {
  try {
    const { name, location } = req.body;

    const device = await Device.create({
      name,
      location,
      apiKey: generateApiKey()
    });

    res.status(201).json({
      success: true,
      data: {
        id: device._id,
        name: device.name,
        location: device.location,
        apiKey: device.apiKey
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getDevices(req, res, next) {
  try {
    const devices = await Device.find()
      .select("-apiKey")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: devices.length,
      data: devices
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createDevice,
  getDevices
};