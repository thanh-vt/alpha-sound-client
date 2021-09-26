import { PagingInfo } from '../model/paging-info';

export class DataUtil {
  public static initPagingInfo(pageSize = 10): PagingInfo<any> {
    return {
      content: [],
      pageable: {
        pageNumber: 0,
        pageSize: pageSize
      },
      totalPages: 0
    };
  }

  public static scrollToTop(): void {
    document.getElementById('main-page').scrollTop = 0;
  }
}
