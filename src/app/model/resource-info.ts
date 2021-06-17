import {StorageType} from '../constant/storage-type';
import {MediaType} from '../constant/media-type';
import {Status} from '../constant/status';

export interface ResourceInfo {
  id: number;
  hostId: number;
  uri: string;
  storageType: StorageType;
  storagePath: string;
  folder: string;
  fileName: string;
  extension: string;
  mediaType: MediaType;
  status: Status;
}
