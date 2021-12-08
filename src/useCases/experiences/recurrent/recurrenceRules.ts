import { Schedule } from "./rschedule";
import moment from "moment";
import { eachDayOfInterval } from "date-fns";
import { IRuleOptions } from "@rschedule/core";
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

  const schedule = new Schedule({
    rrules: [...oneRulePerDay],
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