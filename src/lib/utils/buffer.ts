export function typedArrayToBuffer(array: Uint8Array): ArrayBuffer {
  return array.buffer.slice(
    array.byteOffset,
    array.byteLength + array.byteOffset,
  );
}

export function objectToBuffer(obj: any) {
  let sd_data_json = JSON.stringify(obj);
  /* Needs headers adding
    let shared = new SharedArrayBuffer(obj.length * 2);
    let sharedView = new Uint16Array(shared);
    for (let i = 0; strLen=sd_data_json.length && i < strLen; i++) {
        sharedView[i] = sd_data_json.charCodeAt(i);
    }
    return shared;
    */
  let buf = new TextEncoder().encode(sd_data_json);
  return typedArrayToBuffer(buf);
}

export function bufferToObject(buf: any) {
  let uint = new Uint8Array(buf);
  let str = new TextDecoder("utf-8").decode(uint);
  return JSON.parse(str);
}
