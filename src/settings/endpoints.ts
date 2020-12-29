let BASE_URL = '';

/* yarn build */
if (process.env.NODE_ENV === 'production') {
  BASE_URL = '';
}

/* yarn start */
if (process.env.NODE_ENV === 'development') {
  BASE_URL = '';
}

export const URL = `${BASE_URL}`;

export default URL;
