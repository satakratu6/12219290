import axios from 'axios';

const LOGGING_URL = '/api/log';

export const logEvent = async (stack, level, pkg, message, token) => {
  try {
    const response = await axios.post(
      LOGGING_URL,
      {
        stack,
        level,
        package: pkg,
        message,
        token,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Log sent:', response.data);
  } catch (error) {
    console.error('Logging failed:', error);
  }
};