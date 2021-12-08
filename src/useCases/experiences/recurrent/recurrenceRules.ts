import { Schedule, IRuleOptions } from "./rschedule";
import moment from "moment";
import { eachDayOfInterval } from "date-fns";
import {
  CreateRecurrentDatesInputs,
  RecurrenceResponse,
} from "../../../resolvers/ExperienceResolvers";

//type WeekdayStr = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";
//type TypeOfEvent = "One Time" | "Periodic" | "All day";
// TODO write wrapper function to always use UTC

export const generateRecurrence = ({
  startDate,
  endDate,
  durationInMinutes,
  customDates,
}: CreateRecurrentDatesInputs): RecurrenceResponse => {
  const allTheDays: Date[] = eachDayOfInterval({
    start: moment(startDate).toDate(),
    end: moment(endDate).toDate(),
  });

  const oneRulePerDay: IRuleOptions[] = allTheDays.map((date) => {
    return {
      frequency: "MINUTELY",
      start: moment(date)
        .hours(moment(startDate).hours())
        .minutes(moment(startDate).minutes())
        .seconds(0)
        .milliseconds(0),
      end: moment(date)
        .hours(moment(endDate).hours())
        .minutes(moment(endDate).minutes())
        .seconds(0)
        .milliseconds(0)
        .add(durationInMinutes, "minutes"),
      interval: durationInMinutes,
    };
  });

  const customDatesMoments =
    customDates && customDates.length > 0
      ? customDates.map((date) => moment(date))
      : [];

  let schedule = new Schedule<IRuleOptions>({
    rrules: [...oneRulePerDay],
    rdates: [...customDatesMoments],
  });

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
