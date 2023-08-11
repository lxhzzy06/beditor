import React, { useState } from 'react';
import init, { NBT } from 'nbtrock';
import './Item/item.css';
import './file.css';
import { Compound, DeserializeCompound } from './Item/Compound';
import fileDownload from 'js-file-download';
await init();

export default function App(props: { nbt: NBT; onChange?: React.FormEventHandler<HTMLElement> }) {
  const [Root, setRoot] = useState(props.nbt);
  const [Header, setHeader] = useState(false);

  return (
    <>
      <div className="tree" id="tree">
        <Compound nbt={Root} open></Compound>
      </div>

      <div className="file">
        <div id="upload">
          <input
            type="file"
            name="上传文件"
            id="file-input"
            accept=".nbt, .mcstructure"
            onChange={async (e) => {
              const uint8 = new Uint8Array(await (e.currentTarget as HTMLInputElement).files![0].slice().arrayBuffer());
              setRoot(NBT.from(uint8));
            }}
          />
          <button
            id="generate_bin"
            className="generate"
            onClick={() => {
              const [name, data] = DeserializeCompound(document.getElementById('tree')!.firstChild! as HTMLDetailsElement);
              const _new = new NBT({ name, data });
              fileDownload(_new.bytes(Header), name === '' ? 'nbtrock' : name + '.nbt');
              setRoot(_new);
            }}
          >
            生成NBT文件
          </button>
          <button
            id="generate_text"
            className="generate"
            onClick={() => {
              (document.getElementById('string')! as HTMLTextAreaElement).value = Root.toString();
            }}
          >
            显示文本结构
          </button>
          <input
            type="checkbox"
            id="header"
            name="header"
            onChange={(e) => {
              setHeader((e.currentTarget as HTMLInputElement).checked);
            }}
          />
          <label>包含Bedrock header</label>
        </div>

        <textarea readOnly name="" id="string" cols={150} rows={50} wrap="soft" />
      </div>
    </>
  );
}
