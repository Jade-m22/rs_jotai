import { atomWithStorage } from 'jotai/utils';

export const userAtom = atomWithStorage('current-user', null);
