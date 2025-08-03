// Express CORS config
export const corsOptions = {
  origin: (origin: any, callback: any) => {
    callback(null, origin); // Dynamically allow any origin @TODO will be fixed when in production with a allow list
  },
  credentials: true,
};
