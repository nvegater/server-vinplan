import { generateUTCStrings } from "../../src/useCases/experiences/recurrent/recurrenceRules";
import { CreateRecurrentDatesInputs } from "../../src/resolvers/ExperienceResolvers";

describe("Recurrence tests", () => {
  it("Generates recurrence only with required params", () => {
    const createRecurrenceInputs = {
      startDate: new Date("2018-03-01T20:00:00.000Z"),
      endDate: new Date("2018-03-03T22:00:00.000Z"),
      durationInMinutes: 30,
    };

    const dateStrings = generateUTCStrings({ ...createRecurrenceInputs }, true);

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

    expect(dateStrings).toEqual(expectedUTCDates);
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

    const dateStrings = generateUTCStrings({ ...createRecurrenceInputs }, true);

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

    expect(dateStrings).toEqual(expectedUTCDates);
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

    const dateStrings = generateUTCStrings({ ...createRecurrenceInputs }, true);

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

    expect(dateStrings).toEqual(expectedUTCDates);
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

    const dateStrings = generateUTCStrings({ ...createRecurrenceInputs }, true);

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

    expect(dateStrings).toEqual(expectedUTCDates);
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

    const dateStrings = generateUTCStrings({ ...createRecurrenceInputs }, true);

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

    expect(dateStrings).toEqual(expectedUTCDates);
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

    const dateStrings = generateUTCStrings({ ...createRecurrenceInputs }, true);

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

    expect(dateStrings).toEqual(expectedUTCDates);
  });
});
