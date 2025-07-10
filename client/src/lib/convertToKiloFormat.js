function convertToKiloFormat(number) {
  if (number >= 1000) {
    const kiloValue = (number / 1000).toFixed(1);
    return `${kiloValue}k`;
  } else {
    return number.toString();
  }
}


export default convertToKiloFormat
