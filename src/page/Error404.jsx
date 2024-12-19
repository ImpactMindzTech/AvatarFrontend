import { Button } from "@mui/material";

const Error404 = () => {
  return (
    <div className="h-svh flex flex-col align-middle text-center justify-center">
      <h1 className="text-8xl sm:text-4xl">404</h1>
      <p className="text-2xl mt-4 text-gray-600 sm:text-sm sm:mt-2">
        Oops. Looks like this page does not exist.
      </p>
    </div>
  );
};

export default Error404;
