function num2buf(num: number) {
  const b = new ArrayBuffer(2);
  new DataView(b).setUint16(0, num);
  return Buffer.from(b);
}

function buf2num(buf: any) {
  return parseInt(buf.toString("hex"), 16);
}

export { num2buf, buf2num };
