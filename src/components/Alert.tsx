import { h, hydrate } from "preact";
export { h, hydrate };

const LoadingCircleProgress = () => {
  return (
    <div className="relative w-6 h-6 py-2 px-4">
      <svg
        className="w-6 h-6"
        viewBox="0 0 38 38"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#fff"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)" strokeWidth="2">
            <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
            <path d="M36 18c0-9.94-8.06-18-18-18" stroke="#000" strokeWidth={2}>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </g>
      </svg>
    </div>
  );
};

export interface AlertState {
  loading?: boolean;
  error?: Record<string, any>;
  data?: Record<string, any>;
}

export default ({ loading, error, data }: AlertState) =>
  loading ? (
    <LoadingCircleProgress />
  ) : error ? (
    <div
      className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
      title={JSON.stringify(error)}
    >
      <span className="font-medium">
        There were an error with your submission!
      </span>{" "}
      Make sure you provided the required fields, either way contact your admin.
    </div>
  ) : data ? (
    <div
      className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
      title={JSON.stringify(data)}
    >
      <span className="font-medium">Successfully updated!</span>
    </div>
  ) : null;
