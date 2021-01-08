export interface GraphQlGetInfo {
  fieldName: string;
  parentType: string;
}

export type GetPaginationArgs = {
  page?: number;
  limit?: number;
};
