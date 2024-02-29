import * as React from "react";
import { ChevronDownIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/src/components/ui/button.tsx";
import { Checkbox } from "@/src/components/ui/checkbox.tsx";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog.tsx";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu.tsx";
import DraggableArray from "@/src/components/DraggableArray.tsx";
import { Input } from "@/src/components/ui/input.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table.tsx";
import urlcat from "outils/urlcat.ts";
import DisplayValue from "@/src/components/DisplayValue.tsx";
import getExtendedType from "@/src/lib/getExtendedType.ts";
import formatColumnName from "@/src/lib/formatColumnName.ts";
import { Fragment, useMemo } from "react";
import { toast } from "sonner";
import { Column } from "@/src/middlewares/client.ts";

const useClient = await import("@/src/lib/useClient.ts").then((v) =>
  v.default(import.meta.url)
);
export const h = useClient.h;
export const hydrate = useClient.hydrate;

interface DataTableProps<TData> {
  name: string;
  columns:
    (Partial<Omit<Column, "type">> & {
      name: Column["name"];
      type: Column["type"] | string;
    })[];
  data: TData[];
  children?: any;
  references?: { [key: string]: { [key: string]: any }[] };
}

export default <TData = Record<string, unknown>>({
  name,
  columns,
  data,
  children,
  references,
}: DataTableProps<TData>): JSX.Element => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageSize: 12,
    pageIndex: 0,
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] = React.useState<
    VisibilityState
  >({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowOrder, setRowOrder] = React.useState<[number, number][]>([]);
  const reorderedData = useMemo(
    () =>
      rowOrder.reduce(
        (data, [a, b]) =>
          data.map((current, idx) => {
            if (idx === a) return data[b];
            if (idx === b) return data[a];
            return current;
          }),
        data,
      ),
    [JSON.stringify({ rowOrder, data })],
  );

  const orderKey = columns?.find(
    (d) => formatColumnName(d.name) === "Order",
  )?.name;
  const table = useReactTable({
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      pagination,
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnOrder: [
        ...(columns ?? [])
          .filter((a) => formatColumnName(a.name) === "Order")
          .map((a) => a.name),
      ],
    },
    data: reorderedData,
    columns: [
      {
        id: "_select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value: boolean) =>
              table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Fragment>
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value: any) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </Fragment>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...(columns ?? []).map(
        (column): ColumnDef<any, any> => ({
          accessorKey: column.name,
          header: () => (
            <div className="whitespace-nowrap">
              {formatColumnName(column.name) === "Order"
                ? null
                : formatColumnName(column.name)}
            </div>
          ),
          cell: ({ row }) => {
            const value = row.getValue(column.name);
            return (
              <DisplayValue
                href={urlcat("/admin/upsert/:table_name", {
                  table_name: name,
                  pk: JSON.stringify(
                    Object.fromEntries(
                      columns
                        .filter((column) => column.pk === 1)
                        .map((column) => [
                          column.name,
                          row.original[column.name],
                        ]),
                    ),
                  ),
                })}
                value={value}
                type={getExtendedType(column.type, column.name)}
                references={column.references && column.to && references
                  ? references[column.references!]?.find(
                    (row) => row[column.to!] === value,
                  )
                  : null}
              />
            );
          },
        }),
      ),
      {
        id: "_actions",
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <DotsHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <a
                      href={urlcat("/admin/upsert/:table_name", {
                        table_name: name,
                        pk: JSON.stringify(
                          Object.fromEntries(
                            columns
                              .filter((column) => column.pk === 1)
                              .map((column) => [
                                column.name,
                                row.original[column.name],
                              ]),
                          ),
                        ),
                      })}
                    >
                      Edit
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <AlertDialogTrigger className="text-destructive w-full">
                      Delete
                    </AlertDialogTrigger>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this entry and remove associated data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form
                    className="mb-0"
                    method="POST"
                    action={urlcat("/admin/upsert/:table_name", {
                      table_name: name,
                      method: "DELETE",
                      pk: JSON.stringify(
                        Object.fromEntries(
                          columns
                            .filter((column) => column.pk === 1)
                            .map((column) => [
                              column.name,
                              row.original[column.name],
                            ]),
                        ),
                      ),
                    })}
                  >
                    <Button variant="destructive" type="submit">
                      Delete
                    </Button>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          );
        },
      },
    ],
  });

  return (
    <div className="w-full">
      <div className="flex items-center pb-4 gap-2">
        <Input
          placeholder={`Filter ${name}`}
          value={globalFilter ?? ""}
          onChange={(event: any) => setGlobalFilter(String(event.target.value))}
          className="max-w-sm mr-auto"
        />
        {children}
        <Button
          variant="outline"
          type="button"
          onClick={async () => {
            const formData = new FormData();
            formData.set(
              "order",
              JSON.stringify(
                reorderedData.map((data, index) =>
                  Object.fromEntries([
                    ...columns
                      .filter((column) => column.pk === 1)
                      .map((
                        column,
                      ) => [column.name, (data as any)[column.name]]),
                    [orderKey, index],
                  ])
                ),
              ),
            );
            await fetch(urlcat("/admin/api/reorder/:name", { name }), {
              method: "POST",
              body: formData,
            });
            toast("Row order has been updated");
          }}
        >
          Save
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: any) =>
                      column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <DraggableArray
              onMove={(prev, next, event) => {
                if (
                  (event?.target as HTMLElement)?.dataset.draggable !== "false"
                ) {
                  setRowOrder((arr) => [...arr, [prev, next]]);
                }
              }}
            >
              {table.getRowModel().rows?.length
                ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          data-draggable={formatColumnName(cell.column.id) ===
                            "Order"}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )
                : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
            </DraggableArray>
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
