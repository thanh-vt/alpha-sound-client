import {Privilege} from './privilege';

export interface Role {
  id?: number;
  name?: string;
  privilege?: Privilege[];
}
