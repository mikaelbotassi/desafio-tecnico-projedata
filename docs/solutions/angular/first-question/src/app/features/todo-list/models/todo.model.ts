export interface Todo {
  readonly id: number;
  readonly title: string;
  readonly completed: boolean;
}

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;

}