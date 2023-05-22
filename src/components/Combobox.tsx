import { h } from "preact";
import { createContext, ComponentChildren } from "preact";
import { useContext, useRef } from "preact/hooks";
import { Signal, signal, useSignalEffect } from "@preact/signals";

interface ComboboxProps {
  children: ComponentChildren;
  value: Signal<string>;
  onChange: (value: string | null) => void;
  nullable?: boolean;
  freeSolo?: boolean;
}

interface ComboboxInputProps {
  onChange: (event: Event) => void;
  displayValue?: (value: string | null) => string;
}

interface ComboboxOptionsProps {
  children: ComponentChildren;
}

interface ComboboxOptionProps {
  children: ComponentChildren;
  value: string;
}

const ComboboxContext = createContext<{
  value: undefined | Signal<string>;
  onChange: (value: string | null) => void;
  nullable?: boolean;
  freeSolo?: boolean;
}>({
  value: signal(""),
  nullable: false,
  freeSolo: false,
  onChange: () => {},
});

export const Combobox = ({
  value,
  onChange,
  nullable,
  freeSolo,
  ...props
}: ComboboxProps) => {
  return (
    <ComboboxContext.Provider value={{ value, nullable, freeSolo, onChange }}>
      <div role="combobox" tabIndex={0} {...props} />
    </ComboboxContext.Provider>
  );
};

export const ComboboxButton = ({ displayValue, ...props }) => {
  const { value } = useContext(ComboboxContext);
  const safeDisplayValue = (value) =>
    (displayValue?.(value.value) ?? value.value) || "";

  return (
    <button type="button" tabIndex={0} {...props}>
      {safeDisplayValue(value)}
    </button>
  );
};

export const ComboboxInput = ({
  onChange,
  displayValue,
  ...props
}: ComboboxInputProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const { value, nullable, ...c } = useContext(ComboboxContext);
  const safeDisplayValue = (value) =>
    (displayValue?.(value.value) ?? value.value) || "";

  const onBlur = (e) => {
    if (value?.valueOf) e.target.value = safeDisplayValue(value);
  };
  const handleChange = (e) => {
    const currValue = e.target.value;
    onChange(e);
    if ((c.freeSolo || nullable) && currValue === "") c.onChange(null);
    else if (c.freeSolo) c.onChange(currValue);
  };

  useSignalEffect(() => {
    if (value?.valueOf)
      if (ref.current) ref.current.value = safeDisplayValue(value);
  });
  return (
    <input
      ref={ref}
      type="text"
      onChange={handleChange}
      onBlur={onBlur}
      autoComplete="off"
      {...props}
    />
  );
};

export const ComboboxOptions = ({ ...props }: ComboboxOptionsProps) => {
  return <ul role="listbox" tabIndex="0" {...props} />;
};

export const ComboboxOption = ({
  value,
  component: C = "button",
  ...props
}: ComboboxOptionProps) => {
  const { onChange } = useContext(ComboboxContext);
  const handleChange = (e: Event) => {
    onChange?.(value);
    e.target?.blur();
    document.activeElement.blur();
  };
  return (
    <C
      type="button"
      role="option"
      tabIndex="0"
      onClick={handleChange}
      {...props}
    />
  );
};
