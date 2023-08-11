import React, { useEffect, useState } from 'react';
import { IValue } from 'nbtrock';
import { Base } from './NBT';

export function Line(props: {
  className?: string;
  text: string | number;
  pattern?: string;
  onChange?: React.FormEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  type: 'text' | 'number';
}) {
  return (
    <input
      type={props.type}
      className={props.className ?? 'text'}
      onChange={props.onChange}
      onFocus={props.onFocus}
      onKeyDown={props.onKeyDown}
      value={props.text}
      pattern={props.pattern}
    />
  );
}
export function StringLine(props: {
  className?: string;
  text: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
}) {
  const [value, setValue] = useState(props.text);
  useEffect(() => {
    setValue(props.text);
  }, [props.text]);

  return (
    <Line
      className={props.className}
      text={value}
      type={'text'}
      pattern="^[\x20-\x7E]+$"
      onFocus={props.onFocus}
      onKeyDown={props.onKeyDown}
      onChange={(e) => {
        const input = e.currentTarget;
        if (input.validity.valid) {
          input.style.width = `${(input.value.length + 1) * 8}px`;
          setValue(input.value);
        }
      }}
    />
  );
}
function IntLine(props: { className?: string; text: number; onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>; onFocus?: React.FocusEventHandler<HTMLInputElement> }) {
  const [value, setValue] = useState(props.text);
  useEffect(() => {
    setValue(props.text);
  }, [props.text]);
  return (
    <Line
      className={props.className}
      text={value}
      type={'number'}
      pattern="^\d+$"
      onFocus={props.onFocus}
      onKeyDown={props.onKeyDown}
      onChange={(e) => {
        const input = e.currentTarget;
        if (input.validity.valid) {
          input.style.width = `${(input.value.length + 1) * 8}px`;
          setValue(Number(input.value));
        }
      }}
    />
  );
}
function FloatLine(props: { className?: string; text: number; onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>; onFocus?: React.FocusEventHandler<HTMLInputElement> }) {
  const [value, setValue] = useState(props.text);
  useEffect(() => {
    setValue(props.text);
  }, [props.text]);
  return (
    <Line
      className={props.className}
      text={value}
      type={'number'}
      pattern="^\d+.\d+$"
      onFocus={props.onFocus}
      onKeyDown={props.onKeyDown}
      onChange={(e) => {
        const input = e.currentTarget;
        if (input.validity.valid) {
          input.style.width = `${(input.value.length + 1) * 8}px`;
          setValue(Number(input.value));
        }
      }}
    />
  );
}
export function EditLineVal(props: { className?: string; text: string | number; type: Base }) {
  switch (props.type) {
    case 'String':
      return <StringLine text={props.text as string} className={props.className} />;

    case 'Float':
    case 'Double':
      return <FloatLine text={props.text as number} className={props.className} />;

    default:
      return <IntLine text={props.text as number} className={props.className} />;
  }
}

export function DeserializeLineVal(type: Base, input: HTMLInputElement) {
  const value = {};
  Reflect.set(value, type, input.type === 'text' ? input.value : Number(input.value));
  return value as IValue;
}

export function DeserializeLine(line: HTMLDetailsElement): [string, IValue] {
  const type = line.className as Base;
  const summary = line.firstChild!;
  const key = (summary.firstChild! as HTMLInputElement).value;
  return [key, DeserializeLineVal(type, summary.childNodes[2] as HTMLInputElement)];
}

export function EditLine(props: { type: Base; id: string; value: string | number; onChange?: React.FormEventHandler<HTMLElement> }) {
  switch (props.type) {
    default:
      return (
        <details onChange={props.onChange} className={props.type}>
          <summary className={props.type}>
            <StringLine text={props.id} />
            <span className="colon">:</span>
            <EditLineVal text={props.value} type={props.type} />
          </summary>
        </details>
      );
  }
}
