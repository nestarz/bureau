import { h, hydrate, FunctionComponent } from "preact";
import { Link, useRoute, Route, useLocation, Switch } from "wouter";
import UpsertRow from "./UpsertRow.tsx";
import BrowseRows from "./BrowseRows.tsx";
import { clsx } from "clsx";
import Modal from "./Modal.tsx";
export { h, hydrate };

const TableNav = () => {
  const [tableName, mode] = (useRoute("/table/:rest*")[1] ?? {})?.rest.split(
    "/"
  );

  return (
    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-slate-900 py-5 sticky top-0 bg-white">
      {[
        {
          label: "Browse",
          href: `/table/${tableName}`,
          active: (mode || null) === null,
        },
        {
          label: "Insert",
          href: `/table/${tableName}/insert`,
          active: mode === "insert",
        },
      ].map(({ label, href, active }) => (
        <Link
          href={href}
          className={clsx(
            "inline-flex px-4 py-2 rounded hover:text-gray-600 group",
            active && "bg-slate-100"
          )}
        >
          {label}
        </Link>
      ))}
    </ul>
  );
};

interface WithDialogProps {
  showDialog: boolean;
  onClose: () => void;
}

export function withDialog<P extends WithDialogProps>(
  WrappedComponent: FunctionComponent<P>,
  onClose: () => void
) {
  return function WithDialogComponent(props: Omit<P, keyof WithDialogProps>) {
    return (
      <Modal
        initialOpen
        className="h-full ml-auto m-0 p-0 max-h-screen bg-transparent w-full max-w-3xl outline-none"
        onClose={onClose}
      >
        <div className="h-auto min-h-full w-full bg-white py-4 border-solid border-l border-[#e8eaee] outline-none">
          <WrappedComponent {...(props as P)} />
        </div>
      </Modal>
    );
  };
}

const TableChildRoutes = (props) => {
  const [, navigate] = useLocation();
  const createOnClose = (tableName: string) => () =>
    navigate("/table/".concat(tableName));

  return (
    <Switch>
      <Route
        path="/table/:tableName/update/:pk"
        component={withDialog(UpsertRow, createOnClose(props.params.tableName))}
      />
      <Route
        path="/table/:tableName/insert"
        component={withDialog(UpsertRow, createOnClose(props.params.tableName))}
      />
    </Switch>
  );
};

export default ({ className }: { className: string }) => {
  return (
    <div className={clsx(className, "flex flex-col px-5 w-full gap-1")}>
      <TableNav />
      <Route path="/table/:tableName/:rest*" component={TableChildRoutes} />
      <Route path="/table/:tableName/:rest*" component={BrowseRows} />
    </div>
  );
};
