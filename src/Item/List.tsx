import React, { ReactNode, useState } from 'react';
import { IValue, IList } from 'nbtrock';
import { StringLine, EditLineVal, DeserializeLineVal } from './Line';
import { NBTTYPE } from './NBT';
import { CompoundVal, DeserializeCompoundVal } from './Compound';
import { ArrayVal, DeserializeArrayVal } from './Array';

export function DeserializeListVal(type: NBTTYPE | '', nodes: NodeListOf<ChildNode>): IList {
  const array: IValue[] = [];
  if (type !== '') {
    for (const v of nodes) {
      switch (type) {
        case 'ByteArray':
        case 'IntArray':
        case 'LongArray':
          array.push(DeserializeArrayVal(type, v.firstChild!.childNodes));
          break;

        case 'List':
          array.push(DeserializeListVal(type, v.firstChild!.childNodes));
          break;

        case 'Compound':
          array.push(DeserializeCompoundVal(v.firstChild!.childNodes));
          break;

        default:
          array.push(DeserializeLineVal(type, v.firstChild! as HTMLInputElement));
          break;
      }
    }
  }
  return { List: array };
}

export function DeserializeList(list: HTMLDetailsElement): [string, IList] {
  const summary = list.firstChild!;
  const entities = list.childNodes[2] as HTMLDivElement;
  const type = entities.className.split(' ')[0] as NBTTYPE | '';
  const key = (summary.firstChild! as HTMLInputElement).value;
  return [key, DeserializeListVal(type, entities.childNodes)];
}

function Comma() {
  return <span className="comma">,{'  '}</span>;
}

function Item(props: { className?: string; comma: boolean; inner: ReactNode }) {
  if (props.comma) {
    return (
      <div className={props.className ?? 'item'}>
        {props.inner}
        <Comma />
      </div>
    );
  } else {
    return <div className={props.className ?? 'item'}>{props.inner}</div>;
  }
}

export function ListVal(props: { value: IList }) {
  let key = 0;
  let type: NBTTYPE | '' = '';
  const child = [];
  const list = props.value.List;
  const len = list.length - 1;
  for (const val of list) {
    type = Object.keys(val)[0] as NBTTYPE;
    const value = val[type as keyof IValue];
    switch (type) {
      case 'ByteArray':
      case 'IntArray':
      case 'LongArray':
        {
          const [val, setVal] = useState(value as number[]);
          child.push(<Item inner={<ArrayVal value={val} setValue={setVal} />} comma={key < len} key={key} />);
        }
        break;

      case 'List':
        child.push(<Item inner={<ListVal value={{ List: value }} />} comma={key < len} key={key} />);
        break;

      case 'Compound':
        child.push(<Item inner={<CompoundVal value={{ Compound: value }} />} comma={key < len} key={key} />);
        break;

      default:
        child.push(<Item className="item div-item" inner={<EditLineVal className="text line-item" type={type} text={value} />} comma={key < len} key={key} />);
        break;
    }
    key++;
  }
  return (
    <div className={type} id="list">
      {child}
    </div>
  );
}

function Close(props: object) {
  return (
    <div className="close" {...props}>
      <span style={{ fontWeight: 'bold' }}>{'[ ... ]'}</span>
    </div>
  );
}

export function List(props: { id: string; value: IList; onChange?: React.FormEventHandler<HTMLElement>; open?: boolean }) {
  return (
    <details onChange={props.onChange} open={props.open} className="List">
      <summary className="List">
        <StringLine text={props.id} />
        <span className="colon">:</span>
        <Close />
      </summary>
      <span className="left border">[</span>
      <ListVal value={props.value} />
      <span className="right border">]</span>
    </details>
  );
}
