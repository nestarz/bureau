import { h, hydrate } from "preact";
import InputFileField from "generic/InputFileField.tsx";
import clsx from "clsx";
import { useRouter } from "wouter";
export { h, hydrate };

export default ({ className }) => {
  const fn = "database.sqlite";
  const router = useRouter();

  return (
    <div
      className={clsx(
        className,
        "flex gap-2 items-center justify-center align-center"
      )}
    >
      <a
        role="listitem"
        href={router.base + `/api/medias?object_name=${fn}`}
        className="hover:bg-gray-300 bg-gray-100 self-start font-bold py-2 px-4 rounded focus:outline-none"
      >
        Download
      </a>
      <InputFileField
        component="form"
        role="listitem"
        className="m-0"
        onSubmit={async (e) => {
          e.preventDefault();
          await fetch(
            await fetch(router.base + `/api/medias?object_name=${fn}`, {
              method: "PUT",
            }).then((r) => r.text()),
            {
              method: "PUT",
              body: new FormData(e.target).get("database"),
              headers: { "Content-Type": "application/vnd.sqlite3" },
            }
          ).then((r) => r.text());
          alert("Done.");
        }}
        InputProps={{
          name: "database",
          onChange: (e) => e.target.form.requestSubmit(),
        }}
      >
        Upload
      </InputFileField>
    </div>
  );
};
