function formatDate(date) {
  return `${date.getFullYear()}-${doubleDigit(
    date.getMonth() + 1
  )}-${doubleDigit(date.getDate())} ${doubleDigit(
    date.getHours()
  )}:${doubleDigit(date.getMinutes())}:${doubleDigit(date.getSeconds())}`;
}

function doubleDigit(num) {
  if (num < 10) {
    return `0${num}`;
  }
  return num.toString();
}

export { formatDate };
