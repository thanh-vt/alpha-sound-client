import { Artist } from '../model/artist';

export function artistModelToTextMapper(value: Artist): string {
  return value?.name ?? '';
}

export function artistModelToImgSrcMapper(value: Artist): string {
  return value?.avatarUrl ?? '';
}
