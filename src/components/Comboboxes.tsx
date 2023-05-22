import { h } from "preact";
import clsx from "clsx";
import {
  Combobox as Combox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "./Combobox.tsx";

export const Combobox = ({
  className,
  value,
  onChange,
  onInputChange,
  options,
  nullable,
  freeSolo,
  displayValue,
}) => {
  return (
    <Combox
      className={clsx(className, "group relative")}
      value={value}
      onChange={onChange}
      nullable={nullable}
      freeSolo={freeSolo}
    >
      <div className="flex px-1 align-center w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6">
        <ComboboxInput
          className="w-full border-none pl-2 text-sm leading-5 text-gray-900 focus:ring-0 outline-0"
          onChange={onInputChange}
          displayValue={displayValue}
        />
        <div tabIndex={0}>
          <svg
            viewBox="0 0 10 10"
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-black stroke-1 w-5 h-5 fill-none pr-2"
          >
            <path d="M1 3 L5 7 L9 3" />
          </svg>
        </div>
      </div>
      <ComboboxOptions className="hidden group-focus-within:(absolute min-w-max z-10 flex flex-col mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm)">
        {(options.props ? options.value : options)?.map((item) => (
          <ComboboxOption
            className="relative flex items-start cursor-default select-none py-2 pl-6 pr-4 text-gray-900 cursor-pointer hover:(bg-slate-900 text-white)"
            key={item}
            value={item}
          >
            {displayValue?.(item) ?? item}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combox>
  );
};
