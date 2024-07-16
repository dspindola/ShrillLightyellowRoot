export const Route = () => (
  <div>
    <button
      onClick={() => {
        console.log(process.env);
      }}
    >
      Build
    </button>
  </div>
);

export const path = "/";

export const ssr = false;
