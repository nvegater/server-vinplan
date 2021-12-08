import { Schedule, IRuleOptions, DateAdapter } from "./rschedule";
import moment from "moment";
import { eachDayOfInterval } from "date-fns";
import {
  CreateRecurrentDatesInputs,
  RecurrenceResponse,
} from "../../../resolvers/ExperienceResolvers";

//type TypeOfEvent = "One Time" | "Periodic" | "All day";

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

export const generateRecurrence = ({
  startDate,
  endDate,
  durationInMinutes,
  customDates,
  exceptionDays,
}: CreateRecurrentDatesInputs): RecurrenceResponse => {
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
          console.log(dayOfWeek);
          return {
            byDayOfWeek: [dayOfWeek as DateAdapter.Weekday],
            frequency: "MINUTELY",
            start: moment(startDate),
            end: moment(endDate),
            interval: durationInMinutes,
          };
        })
      : [];

  let schedule = new Schedule<IRuleOptions>({
    rrules: [...oneRulePerDay],
    rdates: [...customDatesMoments],
    exrules: [...exceptionDaysMoments],
  });

  let testSchedule = new Schedule<IRuleOptions>({
    rrules: [...exceptionDaysMoments],
  });

  const formattetTestArray = testSchedule
    .occurrences()
    .toArray()
    .map((date) => moment.utc(date.toISOString()).format());

  console.log(formattetTestArray);

  const array = schedule.occurrences().toArray();
  const formattedArray = schedule
    .occurrences()
    .toArray()
    .map((date) => moment(date.toISOString()).format());

  const formattedUTCArray = schedule
    .occurrences()
    .toArray()
    .map((date) => moment.utc(date.toISOString()).format());
  console.log(array, formattedArray);
  console.log(formattedUTCArray);

  return {
    utcDates: formattedUTCArray,
    dates: formattedArray,
  };
};
