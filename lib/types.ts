export interface ZohoTask {
  sNo: string;
  projectName: string;
  taskName: string;
  userOwner: string;
  createdBy: string;
  assignerEmail: string;
  createdOn: string;
  taskStartDate: string;
  assigneeEmail: string;
  individualHours: number;
  taskId: string;
  projectId: string;
  parsedStartDate?: string | null; // ISO YYYY-MM-DD for easier querying
  parsedCreatedOn?: string | null;
}

export type FilterTimeframe = 'all' | 'today' | 'yesterday' | 'this_week' | 'custom';

export interface TaskFilterOptions {
  searchQuery: string;
  timeframe: FilterTimeframe;
  customStartDate?: string;
  customEndDate?: string;
  selectedUser: string;
  selectedProject: string;
  selectedAssigner: string;
  sortBy: 'startDate' | 'createdOn' | 'hours' | 'taskName' | 'projectName';
  sortOrder: 'asc' | 'desc';
}
