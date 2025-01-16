export const dateTimeNow = () => {
  let localTime = new Date();

  let offset = localTime.getTimezoneOffset();
  return new Date(localTime.getTime() - offset * 60000).toISOString();
};

export const timeNow = () => {
  let localTime = new Date();

  let offset = localTime.getTimezoneOffset();
  return new Date(localTime.getTime() - offset * 60000)
    .toISOString()
    .split("T")[1]
    .slice(0, 8);
};

export const timeToISO = (time: string): Date => {
  return new Date(`1970-01-01T${time}Z`);
};