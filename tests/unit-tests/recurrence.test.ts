import { generateRecurrence } from "../../src/useCases/experiences/recurrent/recurrenceRules";
import { CreateRecurrentDatesInputs } from "../../src/resolvers/ExperienceResolvers";

describe("Recurrence tests", () => {
  it("Generates recurrence only with required params", () => {
    const createRecurrenceInputs = {
      startDate: new Date("2018-03-01T20:00:00.000Z"),
      endDate: new Date("2018-03-03T22:00:00.000Z"),
      durationInMinutes: 30,
    };

    const recurrence = generateRecurrence({ ...createRecurrenceInputs });

    const expectedUTCDates = [
      // First of March
      "2018-03-01T20:00:00Z",
      "2018-03-01T20:30:00Z",
      "2018-03-01T21:00:00Z",
      "2018-03-01T21:30:00Z",
      "2018-03-01T22:00:00Z",
      "2018-03-01T22:30:00Z",
      // Second
      "2018-03-02T20:00:00Z",
      "2018-03-02T20:30:00Z",
      "2018-03-02T21:00:00Z",
      "2018-03-02T21:30:00Z",
      "2018-03-02T22:00:00Z",
      "2018-03-02T22:30:00Z",
      // Third
      "2018-03-03T20:00:00Z",
      "2018-03-03T20:30:00Z",
      "2018-03-03T21:00:00Z",
      "2018-03-03T21:30:00Z",
      "2018-03-03T22:00:00Z",
      "2018-03-03T22:30:00Z",
    ];

    const expectedDates = [
      // First of March
      "2018-03-01T21:00:00+01:00",
      "2018-03-01T21:30:00+01:00",
      "2018-03-01T22:00:00+01:00",
      "2018-03-01T22:30:00+01:00",
      "2018-03-01T23:00:00+01:00",
      "2018-03-01T23:30:00+01:00",
      // Second
      "2018-03-02T21:00:00+01:00",
      "2018-03-02T21:30:00+01:00",
      "2018-03-02T22:00:00+01:00",
      "2018-03-02T22:30:00+01:00",
      "2018-03-02T23:00:00+01:00",
      "2018-03-02T23:30:00+01:00",
      // Third
      "2018-03-03T21:00:00+01:00",
      "2018-03-03T21:30:00+01:00",
      "2018-03-03T22:00:00+01:00",
      "2018-03-03T22:30:00+01:00",
      "2018-03-03T23:00:00+01:00",
      "2018-03-03T23:30:00+01:00",
    ];

    expect(recurrence.utcDates).toEqual(expectedUTCDates);
    expect(recurrence.dates).toEqual(expectedDates);
  });

  it("Generates recurrence with Custom Dates", () => {
    const createRecurrenceInputs: CreateRecurrentDatesInputs = {
      startDate: new Date("2018-03-01T20:00:00.000Z"),
      endDate: new Date("2018-03-03T22:00:00.000Z"),
      durationInMinutes: 30,
      customDates: [
        new Date("2018-03-05T22:00:00.000Z"),
        new Date("2018-03-06T22:00:00.000Z"),
      ],
    };

    const recurrence = generateRecurrence({ ...createRecurrenceInputs });

    const expectedUTCDates = [
      // First of March
      "2018-03-01T20:00:00Z",
      "2018-03-01T20:30:00Z",
      "2018-03-01T21:00:00Z",
      "2018-03-01T21:30:00Z",
      "2018-03-01T22:00:00Z",
      "2018-03-01T22:30:00Z",
      // Second
      "2018-03-02T20:00:00Z",
      "2018-03-02T20:30:00Z",
      "2018-03-02T21:00:00Z",
      "2018-03-02T21:30:00Z",
      "2018-03-02T22:00:00Z",
      "2018-03-02T22:30:00Z",
      // Third
      "2018-03-03T20:00:00Z",
      "2018-03-03T20:30:00Z",
      "2018-03-03T21:00:00Z",
      "2018-03-03T21:30:00Z",
      "2018-03-03T22:00:00Z",
      "2018-03-03T22:30:00Z",

      // Extra
      "2018-03-05T22:00:00Z",
      "2018-03-06T22:00:00Z",
    ];

    const expectedDates = [
      // First of March
      "2018-03-01T21:00:00+01:00",
      "2018-03-01T21:30:00+01:00",
      "2018-03-01T22:00:00+01:00",
      "2018-03-01T22:30:00+01:00",
      "2018-03-01T23:00:00+01:00",
      "2018-03-01T23:30:00+01:00",
      // Second
      "2018-03-02T21:00:00+01:00",
      "2018-03-02T21:30:00+01:00",
      "2018-03-02T22:00:00+01:00",
      "2018-03-02T22:30:00+01:00",
      "2018-03-02T23:00:00+01:00",
      "2018-03-02T23:30:00+01:00",
      // Third
      "2018-03-03T21:00:00+01:00",
      "2018-03-03T21:30:00+01:00",
      "2018-03-03T22:00:00+01:00",
      "2018-03-03T22:30:00+01:00",
      "2018-03-03T23:00:00+01:00",
      "2018-03-03T23:30:00+01:00",

      // Extra
      "2018-03-05T23:00:00+01:00",
      "2018-03-06T23:00:00+01:00",
    ];

    expect(recurrence.utcDates).toEqual(expectedUTCDates);
    expect(recurrence.dates).toEqual(expectedDates);
  });

  it("Excludes one day of the week", () => {
    const createRecurrenceInputs: CreateRecurrentDatesInputs = {
      startDate: new Date("2018-03-01T20:00:00.000Z"),
      endDate: new Date("2018-03-03T22:00:00.000Z"),
      durationInMinutes: 30,
      customDates: [
        new Date("2018-03-05T22:00:00.000Z"),
        new Date("2018-03-06T22:00:00.000Z"),
      ],
      exceptionDays: ["TH"],
    };

    const recurrence = generateRecurrence({ ...createRecurrenceInputs });

    const expectedUTCDates = [
      // First of March
      // REMOVED because its Thursday
      // Second
      "2018-03-02T20:00:00Z",
      "2018-03-02T20:30:00Z",
      "2018-03-02T21:00:00Z",
      "2018-03-02T21:30:00Z",
      "2018-03-02T22:00:00Z",
      "2018-03-02T22:30:00Z",
      // Third
      "2018-03-03T20:00:00Z",
      "2018-03-03T20:30:00Z",
      "2018-03-03T21:00:00Z",
      "2018-03-03T21:30:00Z",
      "2018-03-03T22:00:00Z",
      "2018-03-03T22:30:00Z",

      // Extra
      "2018-03-05T22:00:00Z",
      "2018-03-06T22:00:00Z",
    ];

    const expectedDates = [
      // First of March
      // REMOVED because its Thursday

      // Second
      "2018-03-02T21:00:00+01:00",
      "2018-03-02T21:30:00+01:00",
      "2018-03-02T22:00:00+01:00",
      "2018-03-02T22:30:00+01:00",
      "2018-03-02T23:00:00+01:00",
      "2018-03-02T23:30:00+01:00",
      // Third
      "2018-03-03T21:00:00+01:00",
      "2018-03-03T21:30:00+01:00",
      "2018-03-03T22:00:00+01:00",
      "2018-03-03T22:30:00+01:00",
      "2018-03-03T23:00:00+01:00",
      "2018-03-03T23:30:00+01:00",

      // Extra
      "2018-03-05T23:00:00+01:00",
      "2018-03-06T23:00:00+01:00",
    ];

    expect(recurrence.utcDates).toEqual(expectedUTCDates);
    expect(recurrence.dates).toEqual(expectedDates);
  });

  it("Excludes TWO days of the week", () => {
    const createRecurrenceInputs: CreateRecurrentDatesInputs = {
      startDate: new Date("2018-03-01T20:00:00.000Z"),
      endDate: new Date("2018-03-03T22:00:00.000Z"),
      durationInMinutes: 30,
      customDates: [
        new Date("2018-03-05T22:00:00.000Z"),
        new Date("2018-03-06T22:00:00.000Z"),
      ],
      exceptionDays: ["TH", "FR"],
    };

    const recurrence = generateRecurrence({ ...createRecurrenceInputs });

    const expectedUTCDates = [
      // First of March
      // REMOVED because its Thursday
      // Second
      // REMOVED because its Friday
      // Third
      "2018-03-03T20:00:00Z",
      "2018-03-03T20:30:00Z",
      "2018-03-03T21:00:00Z",
      "2018-03-03T21:30:00Z",
      "2018-03-03T22:00:00Z",
      "2018-03-03T22:30:00Z",

      // Extra
      "2018-03-05T22:00:00Z",
      "2018-03-06T22:00:00Z",
    ];

    const expectedDates = [
      // First of March
      // REMOVED because its Thursday
      // Second
      // REMOVED because its Friday
      // Third
      "2018-03-03T21:00:00+01:00",
      "2018-03-03T21:30:00+01:00",
      "2018-03-03T22:00:00+01:00",
      "2018-03-03T22:30:00+01:00",
      "2018-03-03T23:00:00+01:00",
      "2018-03-03T23:30:00+01:00",

      // Extra
      "2018-03-05T23:00:00+01:00",
      "2018-03-06T23:00:00+01:00",
    ];

    expect(recurrence.utcDates).toEqual(expectedUTCDates);
    expect(recurrence.dates).toEqual(expectedDates);
  });

  it("Excludes Custom Dates - Custom Date same as exception", () => {
    const createRecurrenceInputs: CreateRecurrentDatesInputs = {
      startDate: new Date("2018-03-01T20:00:00.000Z"),
      endDate: new Date("2018-03-03T22:00:00.000Z"),
      durationInMinutes: 30,
      customDates: [
        new Date("2018-03-05T22:00:00.000Z"),
        new Date("2018-03-06T22:00:00.000Z"),
      ],
      exceptions: [
        new Date("2018-03-03T22:00:00.000Z"),
        new Date("2018-03-06T22:00:00.000Z"),
      ],
      exceptionDays: ["TH", "FR"],
    };

    const recurrence = generateRecurrence({ ...createRecurrenceInputs });

    const expectedUTCDates = [
      // First of March
      // REMOVED because its Thursday
      // Second
      // REMOVED because its Friday
      // Third
      "2018-03-03T20:00:00Z",
      "2018-03-03T20:30:00Z",
      "2018-03-03T21:00:00Z",
      "2018-03-03T21:30:00Z",
      //"2018-03-03T22:00:00Z", // REMOVED because is the custom exclusion on the 3th of Match at 22
      "2018-03-03T22:30:00Z",

      // Extra
      "2018-03-05T22:00:00Z",
      // "2018-03-06T22:00:00Z", // REMOVED because is the custom exclusion on the 6th of Match at 22
    ];

    const expectedDates = [
      // First of March
      // REMOVED because its Thursday
      // Second
      // REMOVED because its Friday
      // Third
      "2018-03-03T21:00:00+01:00",
      "2018-03-03T21:30:00+01:00",
      "2018-03-03T22:00:00+01:00",
      "2018-03-03T22:30:00+01:00",
      // "2018-03-03T23:00:00+01:00", // REMOVED because is the custom exclusion on the 3th of Match at 22
      "2018-03-03T23:30:00+01:00",
      // Extra
      "2018-03-05T23:00:00+01:00",
      // "2018-03-06T23:00:00+01:00",  // REMOVED because is the custom exclusion on the 6th of Match at 22
    ];

    expect(recurrence.utcDates).toEqual(expectedUTCDates);
    expect(recurrence.dates).toEqual(expectedDates);
  });

  it("Excludes Custom Dates - Custom Date Different than exception", () => {
    const createRecurrenceInputs: CreateRecurrentDatesInputs = {
      startDate: new Date("2018-03-01T20:00:00.000Z"),
      endDate: new Date("2018-03-03T22:00:00.000Z"),
      durationInMinutes: 30,
      customDates: [
        new Date("2018-03-05T22:00:00.000Z"),
        new Date("2018-03-06T22:00:00.000Z"),
      ],
      exceptions: [
        new Date("2018-03-02T20:00:00.000Z"),
        new Date("2018-03-03T22:00:00.000Z"),
      ],
      exceptionDays: ["TH"],
    };

    const recurrence = generateRecurrence({ ...createRecurrenceInputs });

    const expectedUTCDates = [
      // First of March
      // REMOVED because its Thursday
      // Second
      //"2018-03-02T20:00:00Z", // REMOVED because of exception
      "2018-03-02T20:30:00Z",
      "2018-03-02T21:00:00Z",
      "2018-03-02T21:30:00Z",
      "2018-03-02T22:00:00Z",
      "2018-03-02T22:30:00Z",
      // Third
      "2018-03-03T20:00:00Z",
      "2018-03-03T20:30:00Z",
      "2018-03-03T21:00:00Z",
      "2018-03-03T21:30:00Z",
      //"2018-03-03T22:00:00Z", // REMOVED because is the custom exclusion on the 3th of Match at 22
      "2018-03-03T22:30:00Z",

      // Extra
      "2018-03-05T22:00:00Z",
      "2018-03-06T22:00:00Z",
    ];

    const expectedDates = [
      // First of March
      // REMOVED because its Thursday
      // Second
      //"2018-03-02T21:00:00+01:00", // removed because of exception
      "2018-03-02T21:30:00+01:00",
      "2018-03-02T22:00:00+01:00",
      "2018-03-02T22:30:00+01:00",
      "2018-03-02T23:00:00+01:00",
      "2018-03-02T23:30:00+01:00",
      // Third
      "2018-03-03T21:00:00+01:00",
      "2018-03-03T21:30:00+01:00",
      "2018-03-03T22:00:00+01:00",
      "2018-03-03T22:30:00+01:00",
      // "2018-03-03T23:00:00+01:00", // REMOVED because is the custom exclusion on the 3th of Match at 22
      "2018-03-03T23:30:00+01:00",
      // Extra
      "2018-03-05T23:00:00+01:00",
      "2018-03-06T23:00:00+01:00",
    ];

    expect(recurrence.utcDates).toEqual(expectedUTCDates);
    expect(recurrence.dates).toEqual(expectedDates);
  });
});
