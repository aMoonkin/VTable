import type { PivotHeaderLayoutMap } from '../layout/pivot-header-layout';
import type { CellAddress } from '../ts-types';
import type { LayoutObjectId } from '../ts-types/base-table';

export function diffCellAddress(
  col: number,
  row: number,
  oldCellIds: number[],
  newCellIds: number[],
  oldRowHeaderCellPositons: CellAddress[],
  layout: PivotHeaderLayoutMap
) {
  const columnHeaderStart = layout.columnHeaderLevelCount;
  // const oldCellIds = oldCellIdsArr.map(oldCellId => oldCellId[0]);
  // const newCellIds = newCellIdsArr.map(oldCellId => oldCellId[0]);
  const addCellPositions = [];
  const removeCellPositions = [];
  // const updateCellIds: Set<LayoutObjectId> = new Set();
  // diff two array elements
  for (let i = 0; i < oldCellIds.length; i++) {
    if (!newCellIds.includes(oldCellIds[i])) {
      // updateCellIds.add(layout.getParentCellId(oldRowHeaderCellPositons[i].col, oldRowHeaderCellPositons[i].row));
      removeCellPositions.push(oldRowHeaderCellPositons[i]);
    }
  }
  for (let i = 0; i < newCellIds.length; i++) {
    if (!oldCellIds.includes(newCellIds[i])) {
      const newCellAddr = { col, row: columnHeaderStart + i }; // layout.getHeaderCellAdressById(newCellIds[i]);
      // updateCellIds.add(layout.getParentCellId(newCellAddr.col, newCellAddr.row));
      addCellPositions.push(newCellAddr);
    }
  }
  let parentId = layout.getParentCellId(col, row);
  let parentCellAddress = layout.getRowHeaderCellAddressByCellId(parentId);
  const updateCellPositions = [];
  updateCellPositions.push(parentCellAddress);
  while (parentId) {
    parentId = layout.getParentCellId(parentCellAddress.col, parentCellAddress.row);
    if (parentId) {
      parentCellAddress = layout.getRowHeaderCellAddressByCellId(parentId);
      updateCellPositions.push(parentCellAddress);
    }
  }
  return {
    addCellPositions,
    removeCellPositions,
    updateCellPositions
  };
}

// find diff between two arrays
export function diffCellIndices(oldIndexedData: (number | number[])[], currentIndexedData: (number | number[])[]) {
  const add = [];
  const remove = [];
  // find removed indices
  for (let i = 0; i < oldIndexedData.length; i++) {
    let removed = true;
    for (let j = 0; j < currentIndexedData.length; j++) {
      if (checkIndex(oldIndexedData[i], currentIndexedData[j])) {
        removed = false;
        break;
      }
    }
    if (removed) {
      remove.push(i);
    }
  }

  // find added indices
  for (let i = 0; i < currentIndexedData.length; i++) {
    let added = true;
    for (let j = 0; j < oldIndexedData.length; j++) {
      if (checkIndex(oldIndexedData[j], currentIndexedData[i])) {
        added = false;
        break;
      }
    }
    if (added) {
      add.push(i);
    }
  }
  return { add, remove };
}

function checkIndex(oldIndex: number | number[], newIndex: number | number[]): boolean {
  if (typeof oldIndex !== typeof newIndex) {
    return false;
  }
  if (typeof oldIndex === 'number' && typeof newIndex === 'number' && oldIndex !== newIndex) {
    return false;
  }
  if ((oldIndex as number[]).length !== (newIndex as number[]).length) {
    return false;
  }
  for (let i = 0; i < (oldIndex as number[]).length; i++) {
    if (oldIndex[i] !== newIndex[i]) {
      return false;
    }
  }
  return true;
}
