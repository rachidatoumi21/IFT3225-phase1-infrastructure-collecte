const {
  classifyAmbiance,
  getAmbianceScales
} = require("../../src/services/classificationService");

describe("classificationService", () => {
  it("retourne Inconnue lorsque la moyenne est absente", () => {
    const result = classifyAmbiance(null);

    expect(result.level).toBe("unknown");
    expect(result.label).toBe("Inconnue");
  });

  it("classe une valeur phyphox très basse comme Calme", () => {
    const result = classifyAmbiance(-60);

    expect(result.level).toBe("calm");
    expect(result.label).toBe("Calme");
  });

  it("classe une valeur phyphox intermédiaire comme Modéré", () => {
    const result = classifyAmbiance(-45);

    expect(result.level).toBe("moderate");
    expect(result.label).toBe("Modéré");
  });

  it("classe une valeur phyphox élevée comme Animé", () => {
    const result = classifyAmbiance(-20);

    expect(result.level).toBe("active");
    expect(result.label).toBe("Animé");
  });

  it("classe correctement les valeurs positives classiques", () => {
    expect(classifyAmbiance(40).level).toBe("calm");
    expect(classifyAmbiance(55).level).toBe("moderate");
    expect(classifyAmbiance(70).level).toBe("active");
  });

  it("expose les échelles de classification", () => {
    const scales = getAmbianceScales();

    expect(scales.negativeScale.calm).toBe("<= -55 dB");
    expect(scales.positiveScale.active).toBe("> 65 dB");
  });
});