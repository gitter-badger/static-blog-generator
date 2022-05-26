/** @template T */
export class ArrayWrapper<T> extends Array<T> {
  each(callbackfn: (value: any, index: number, array: any[]) => void) {
    return this.forEach(callbackfn);
  }
  /**
   * Remove an item from the list and return the removed item
   * @param item
   * @return
   */
  remove(item: any) {
    const index = this.indexOf(item);
    if (index === -1) {
      throw new Error(`${item} not in list`);
    }
    this.splice(index, 1);
    return item;
  }
}
export function array_wrap<T extends any[]>(arr: T) {
  //arr['each'] = arr.forEach;
  //return arr;
  const init = new ArrayWrapper<T[number]>(...arr);
  return init;
}
