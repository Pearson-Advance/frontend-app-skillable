/**
 * Helper to parse a UNIX formatted Datetime into a String with format MM/dd/yyyy HH:mm AM/PM
 *
 * @param {string} timeStamp - Datetime in UNIX format
 * @returns {string} - String with Datetime in human readable format
 */
const formatUnixTimestamp = (timeStamp) => {
  if (!timeStamp || Number.isNaN(Number(timeStamp))) {
    return 'N/A';
  }

  const date = new Date(timeStamp * 1000);
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const year = date.getUTCFullYear();
  let hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const amPm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return `${month}/${day}/${year} ${hours}:${minutes} ${amPm}`;
};

/**
 * Manages any type of event passed as function and applies a callback and tiemo-uts during its executing time.
 * @param {func} callback
 * @returns async promise
 */
const eventManager = (callback) => {
  let isExecuting = false;
  return async (event) => {
    if (event) {
      event.preventDefault(); // Prevent the default behavior
    }
    if (!isExecuting) {
      isExecuting = true;
      await callback(event);
      setTimeout(() => {
        isExecuting = false;
      }, 2000); // 2 second delay
    }
  };
};

/**
 * Formats a timestamp string to 'MM/dd/yyyy - hh:mm a' format.
 * If the input is null or invalid, returns 'N/A'.
 *
 * @param {string} time - The timestamp string to be formatted.
 * @returns {string} - The formatted date string or 'N/A' if the input is invalid.
 */
const formatTime = (time) => {
  if (!time || typeof time !== 'string') {
    return 'N/A';
  }
  const match = time.match(/\d+/);
  if (!match) {
    return 'N/A';
  }
  return new Date(parseInt(time.match(/\d+/)[0], 10))
    .toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .replace(',', ' -');
};

export { eventManager, formatUnixTimestamp, formatTime };
