import { WatchedList } from './watched-list';

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b;
  }
}

describe('WatchedList', () => {
  it('should be able to create a watched list with initial numbers', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    expect(list.currentItems).toHaveLength(3);
  });

  it('should be able to add new numbers', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.add(4);

    expect(list.currentItems).toHaveLength(4);
    expect(list.getNewItems()).toEqual([4]);
  });

  it('should be able to remove numbers', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.remove(2);

    expect(list.currentItems).toHaveLength(2);
    expect(list.getRemovedItems()).toEqual([2]);
  });

  it('should be possible to add a number even if it was removed before', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.remove(2);
    list.add(2);

    expect(list.currentItems).toHaveLength(3);
    expect(list.getRemovedItems()).toEqual([]);
    expect(list.getNewItems()).toEqual([]);
  });

  it('should be able to remove a number even if it was added before', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.add(4);
    list.remove(4);

    expect(list.currentItems).toHaveLength(3);
    expect(list.getRemovedItems()).toEqual([]);
    expect(list.getNewItems()).toEqual([]);
  });

  it('should be able to update watched list items', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.update([1, 3, 4]);

    expect(list.currentItems).toHaveLength(3);
    expect(list.getRemovedItems()).toEqual([2]);
    expect(list.getNewItems()).toEqual([4]);
  });
});
