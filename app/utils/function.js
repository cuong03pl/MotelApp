export function getDayOfWeek(datetime) {
  if (datetime) {
    const dateArray = datetime?.slice(0, datetime?.indexOf("T")).split("-");
    const date = new Date(`${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`);
    var dayOfWeek = date.getDay();
    if (dayOfWeek == 0) return "CN";
    else return `Thứ ${dayOfWeek + 1}`;
  } else return datetime;
}

export function isCurrentDay(datetime) {
  const dateArray = datetime?.slice(0, datetime?.indexOf("T")).split("-");
  const date = new Date(`${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`);
  if (
    date.getDate() == new Date("2024-06-24").getDate() &&
    date.getMonth() == new Date("2024-06-24").getMonth() &&
    date.getFullYear() == new Date("2024-06-24").getFullYear()
  ) {
    return true;
  } else return false;
}

export function convertTimeSpan(timespan) {
  if (timespan) {
    const date = timespan?.split(":");
    return `${date[0]}:${date[1]}`;
  } else return timespan;
}

export function convertVND(value) {
  return value?.toLocaleString("vi-VN");
}
