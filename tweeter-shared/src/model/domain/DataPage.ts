/**
 * A page of data returned by the database.
 *
 * @param <T> type of data objects being returned.
 */
export class DataPage<T> {
  values: T[];
  hasMorePages: boolean;

  constructor(values: T[], hasMorePages: boolean) {
    this.values = values;
    this.hasMorePages = hasMorePages;
  }
}
