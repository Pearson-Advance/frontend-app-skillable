/**
 * Helper to parse a UNIX formatted Datetime into a String with format MM/dd/yyyy HH:mm AM/PM
 *
 * @param {string} timeStamp - Datetime in UNIX format
 * @returns {string} - String with Datetime in human readable format
 */
const formatUnixTimestamp = (timeStamp) => {
  if (!timeStamp && typeof typestamp !== 'string') {
    return 'N/A';
  }

  const date = new Date(timeStamp * 1000);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const amPm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 to 12

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

export { eventManager, formatUnixTimestamp };
