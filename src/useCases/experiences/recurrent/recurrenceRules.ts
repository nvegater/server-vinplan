import { DateAdapter, IRuleOptions, Schedule } from "./rschedule";
import moment from "moment";
import { differenceInMinutes, eachDayOfInterval } from "date-fns";
import {
  DateWithTimes,
  RecurrenceResponse,
} from "../../../resolvers/Outputs/CreateExperienceOutputs";
import { CreateRecurrentDatesInputs } from "../../../resolvers/Inputs/CreateExperienceInputs";

//type TypeOfEvent = "One Time" | "Periodic" | "All day";

const getTimesForDate = (
  onlyDate: Date,
  allCompleteDateTimes: Date[]
): Date[] => {
  return allCompleteDateTimes.filter((dateTime) => {
    const sameYear = dateTime.getFullYear() === onlyDate.getFullYear();
    const sameMonth = onlyDate.getMonth() === dateTime.getMonth();
    const sameDate = dateTime.getDate() === onlyDate.getDate();
    return sameYear && sameMonth && sameDate;
  });
};

export const generateOneSlot = (
  startDateTime: Date,
  endDateTime: Date,
  allDay: boolean = false
): DateWithTimes => {
  return {
    date: startDateTime,
    times: [startDateTime],
    durationInMinutes: allDay
      ? 24 * 60
      : differenceInMinutes(endDateTime, startDateTime),
  };
};

const generateDatesWithSlots = (
  utcDatesStrings: string[],
  durationInMinutes: number
): DateWithTimes[] => {
  const onlyDateNoTime = utcDatesStrings.map((date) =>
    new Date(date).toDateString()
  );

  // filter out duplicates
  const noDuplicateDates = new Set([...onlyDateNoTime]);

  return [...noDuplicateDates].map((noDuplicateDate) => {
    const dateIgnoreTime = new Date(noDuplicateDate);
    return {
      date: dateIgnoreTime,
      times: getTimesForDate(
        dateIgnoreTime,
        utcDatesStrings.map((d) => new Date(d))
      ),
      durationInMinutes: durationInMinutes,
    };
  });
};

function replaceTime(
  date: Date,
  dateWithNewTime: Date,
  addCustomDurationInMinutes?: number
) {
  return (
    moment(date)
      .hours(moment(dateWithNewTime).hours())
      .minutes(moment(dateWithNewTime).minutes())
      .seconds(0)
      .milliseconds(0)
      // we add the interval so we include the last date
      .add(
        addCustomDurationInMinutes ? addCustomDurationInMinutes : 0,
        "minutes"
      )
  );
}

export const generateUTCStringsRecurrentEvent = (
  {
    startDate,
    endDate,
    durationInMinutes,
    customDates,
    exceptionDays,
    exceptions,
  }: CreateRecurrentDatesInputs,
  utcFormat: boolean
): string[] => {
  const allTheDays: Date[] = eachDayOfInterval({
    start: moment(startDate).toDate(),
    end: moment(endDate).toDate(),
  });

  const oneRulePerDay: IRuleOptions[] = allTheDays.map((date) => {
    return {
      frequency: "MINUTELY",
      start: replaceTime(date, startDate),
      end: replaceTime(date, endDate, durationInMinutes),
      interval: durationInMinutes,
    };
  });

  const customDatesMoments =
    customDates && customDates.length > 0
      ? customDates.map((date) => moment(date))
      : [];

  const exceptionDaysMoments: IRuleOptions[] =
    exceptionDays && exceptionDays.length > 0
      ? exceptionDays.map((dayOfWeek) => {
          return {
            byDayOfWeek: [dayOfWeek as DateAdapter.Weekday],
            frequency: "MINUTELY",
            start: moment(startDate),
            end: moment(endDate),
            interval: durationInMinutes,
          };
        })
      : [];

  const exceptionsCustomDatesMoments =
    exceptions && exceptions.length > 0
      ? exceptions.map((date) => moment(date))
      : [];

  let schedule = new Schedule<IRuleOptions>({
    rrules: [...oneRulePerDay],
    exrules: [...exceptionDaysMoments],
    // custom Dates are unnafected by reccursions
    rdates: [...customDatesMoments],
    // but custom Dates are affected by custom exception Dates
    exdates: [...exceptionsCustomDatesMoments],
  });

  let formattedArray: string[];

  if (utcFormat) {
    formattedArray = schedule
      .occurrences()
      .toArray()
      .map((date) => moment.utc(date.toISOString()).format());
  } else {
    formattedArray = schedule
      .occurrences()
      .toArray()
      .map((date) => moment(date.toISOString()).format());
  }

  return formattedArray;
};

export const generateRecurrence = (
  createRecurrentDatesInputs: CreateRecurrentDatesInputs
): RecurrenceResponse => {
  const utcDatesStrings = generateUTCStringsRecurrentEvent(
    createRecurrentDatesInputs,
    true
  );

  const dateWithTimes = generateDatesWithSlots(
    utcDatesStrings,
    createRecurrentDatesInputs.durationInMinutes
  );

  return {
    dateWithTimes,
  };
};
