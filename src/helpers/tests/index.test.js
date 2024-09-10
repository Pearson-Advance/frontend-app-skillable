import { eventManager, formatUnixTimestamp, formatTime } from '../index';

describe('Helper Functions', () => {
  // Test 1: Check if formatUnixTimestamp correctly formats a valid timestamp
  describe('formatUnixTimestamp', () => {
    it('formats a valid UNIX timestamp correctly', () => {
      const timestamp = 1672531199; // Corresponds to 12/31/2022 11:59 PM UTC
      const formatted = formatUnixTimestamp(timestamp);

      const expectedDate = new Date(timestamp * 1000).toLocaleString('en-US', {
        timeZone: 'UTC', // Asegura que utilice la zona horaria UTC
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      expect(formatted).toBe(expectedDate.replace(',', ''));

      const timestampPM = 1672531199; // 12/31/2022 11:59 PM UTC
      const formattedPM = formatUnixTimestamp(timestampPM);
      expect(formattedPM).toBe('12/31/2022 11:59 PM');

      const timestampAM = 1672464000; // 12/31/2022 12:00 AM UTC
      const formattedAM = formatUnixTimestamp(timestampAM);

      const expectedAM = new Date(timestampAM * 1000).toLocaleString('en-US', {
        timeZone: 'UTC',
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      expect(formattedAM).toBe(expectedAM.replace(',', ''));
    });

    it('returns "N/A" for invalid input', () => {
      const formatted = formatUnixTimestamp('invalid');
      expect(formatted).toBe('N/A');
    });

    it('returns "N/A" when input is null or undefined', () => {
      expect(formatUnixTimestamp(null)).toBe('N/A');
      expect(formatUnixTimestamp(undefined)).toBe('N/A');
    });
  });

  // Test 2: Check if eventManager manages the execution correctly
  describe('eventManager', () => {
    it('executes the callback function correctly', async () => {
      const mockCallback = jest.fn();
      const managedEvent = eventManager(mockCallback);

      await managedEvent(); // Call the managed event

      expect(mockCallback).toHaveBeenCalled();
    });

    it('prevents multiple executions within a short time frame', async () => {
      jest.useFakeTimers();
      const mockCallback = jest.fn();
      const managedEvent = eventManager(mockCallback);

      await managedEvent(); // First call
      await managedEvent(); // Second call (should be ignored due to the delay)

      expect(mockCallback).toHaveBeenCalledTimes(1);

      jest.runAllTimers(); // Fast-forward the timers to complete the timeout
      await managedEvent(); // Third call (after timeout)

      expect(mockCallback).toHaveBeenCalledTimes(2); // Should be called again after the delay
    });

    it('executes the callback function correctly', async () => {
      const mockCallback = jest.fn();
      const managedEvent = eventManager(mockCallback);

      const mockEvent = { preventDefault: jest.fn() };

      await managedEvent(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  // Test 3: Check if formatTime correctly formats a valid timestamp string
  describe('formatTime', () => {
    it('formats a valid timestamp string correctly', () => {
      const timeString = '/Date(1672531199000)/'; // Corresponds to 12/31/2022 11:59 PM UTC
      const formatted = formatTime(timeString);

      // Adjust the expected output to match the local time zone
      const expectedDate = new Date(1672531199000).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).replace(',', ' -');
      expect(formatted).toBe(expectedDate);
    });

    it('returns "N/A" for invalid input', () => {
      const formatted = formatTime('invalid');
      expect(formatted).toBe('N/A');
    });

    it('returns "N/A" when input is null or undefined', () => {
      expect(formatTime(null)).toBe('N/A');
      expect(formatTime(undefined)).toBe('N/A');
    });
  });
});
