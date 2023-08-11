import React, { useState } from 'react';
import { Line, StringLine } from './Line';
import { IValue } from 'nbtrock';
import { TArray } from './NBT';

export function DeserializeArrayVal(type: TArray, nodes: NodeListOf<ChildNode>) {
  const arr: number[] = [];
  const value = {};
  nodes.forEach((v) => {
    arr.push(Number((v.lastChild! as HTMLInputElement).value));
  });
  Reflect.set(value, type, arr);
  return value as IValue;
}

export function DeserializeArray(array: HTMLDetailsElement): [string, IValue] {
  const summary = array.firstChild!;
  const type = array.className as TArray;
  const key = (summary.firstChild! as HTMLInputElement).value;
  return [key, DeserializeArrayVal(type, summary.childNodes[3].childNodes)];
}

export function ArrayVal(props: { value: number[]; setValue: React.Dispatch<React.SetStateAction<number[]>> }) {
  const array = props.value.map((v, i) => {
    const ele = (
      <Line
        text={v}
        onChange={(e) => {
          const input = e.currentTarget;
          if (input.validity.valid) {
            input.style.width = `${(input.value.length + 1) * 7}px`;
            !input.value.length ? props.value.splice(i, 1) : (props.value[i] = Number(input.value));
          }
          props.setValue([...props.value]);
        }}
        type={'number'}
        pattern="^\d+$"
      />
    );
    if (i > 0) {
      return (
        <div key={i} className="array-item">
          <span className="comma">,{'  '}</span>
          {ele}
        </div>
      );
    } else {
      return (
        <div className="array-item" key={i}>
          {ele}
        </div>
      );
    }
  });
  return <div className="array">{array}</div>;
}

export function Array(props: { type: TArray; id: string; value: number[]; onChange?: React.FormEventHandler<HTMLElement> }) {
  const [value, setValue] = useState(props.value);

  return (
    <details onChange={props.onChange} className={props.type}>
      <summary className={props.type}>
        <StringLine text={props.id} />
        <span className="colon">:</span>
        <span className="left">[</span>
        <ArrayVal value={value} setValue={setValue} />
        <span className="right">]</span>
      </summary>
    </details>
  );
}
