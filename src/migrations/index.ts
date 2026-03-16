import * as migration_20260316_030920 from './20260316_030920';

export const migrations = [
  {
    up: migration_20260316_030920.up,
    down: migration_20260316_030920.down,
    name: '20260316_030920'
  },
];
