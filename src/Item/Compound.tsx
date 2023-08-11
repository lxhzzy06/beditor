import React, { ReactNode } from 'react';
import { NBT, IValue, ICompound } from 'nbtrock';
import { StringLine, EditLine, DeserializeLine } from './Line';
import { Array, DeserializeArray } from './Array';
import { NBTTYPE } from './NBT';
import { DeserializeList, List } from './List';
export function DeserializeCompoundVal(nodes: NodeListOf<ChildNode>) {
  const map: Map<string, IValue> = new Map();
  for (const v of nodes) {
    if (v.nodeName === 'DETAILS') {
      const details = v as HTMLDetailsElement;
      const type = details.className.split(' ')[0] as NBTTYPE;
      switch (type) {
        case 'Compound':
          map.set(...DeserializeCompound(details));
          break;

        case 'List':
          map.set(...DeserializeList(details));
          break;

        case 'ByteArray':
        case 'IntArray':
        case 'LongArray':
          map.set(...DeserializeArray(details));
          break;

        default:
          map.set(...DeserializeLine(details));
          break;
      }
    }
  }

  return { Compound: map };
}

export function DeserializeCompound(compound: HTMLDetailsElement): [string, ICompound] {
  const name = (compound.firstChild!.firstChild! as HTMLInputElement).value;
  return [name, DeserializeCompoundVal(compound.childNodes[1].childNodes)];
}

export function CompoundVal(props: { value: ICompound; style?: React.CSSProperties }) {
  const child: ReactNode[] = [];

  let key = 0;
  for (const [id, values] of props.value.Compound) {
    const type = Object.keys(values)[0] as NBTTYPE;
    const value = values[type as keyof IValue];
    switch (type) {
      case 'ByteArray':
      case 'IntArray':
      case 'LongArray':
        child.push(<Array type={type} id={id} value={value} key={key} />);
        break;

      case 'List':
        child.push(<List key={key} id={id} value={{ List: value }} />);
        break;

      case 'Compound':
        child.push(<Compound nbt={new NBT({ name: id, data: { Compound: value } })} key={key} />);
        break;

      default:
        child.push(<EditLine type={type} id={id} value={value} key={key} />);
        break;
    }
    key++;
  }
  return (
    <div>
      <span className="border">{'{'}</span>
      {child}
      <span className="border">{'}'}</span>
    </div>
  );
}

function Close(props: object) {
  return (
    <div className="close" {...props}>
      <span style={{ fontWeight: 'bold' }}>{'{ ... }'}</span>
    </div>
  );
}

export function Compound(props: { nbt: NBT; open?: boolean; onChange?: React.FormEventHandler<HTMLElement>; onClick?: React.MouseEventHandler<HTMLDetailsElement> }) {
  const value = props.nbt.value;
  return (
    <details open={props.open} onChange={props.onChange} className="Compound">
      <summary className="Compound">
        <StringLine text={value.name} />
        <span className="colon">:</span>
        <Close />
      </summary>
      <CompoundVal value={value.data} />
    </details>
  );
}
