export interface CacheEntry {
  method: string;
  request: string;
  res: any;
  hits: number;
  creation_time: Date;
  last_access_time: Date;
  ttl: Date;
}
