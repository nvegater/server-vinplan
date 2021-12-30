import { DeleteResult, InsertResult, UpdateResult } from "typeorm";

export const typeReturn = async <T>(
  mutation: Promise<UpdateResult | DeleteResult | InsertResult>
): Promise<T> => {
  return await mutation.then((res) => res.raw[0]);
};

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  if (value === null || value === undefined) return false;
  const dummy: TValue = value;
  return Boolean(dummy);
}
