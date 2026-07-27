import { createFeature, createReducer, on } from "@ngrx/store";
import { Todo } from "../models/todo.model";
import { TodosApiActions, TodosPageActions } from "./todo.actions";

export interface TodoState{
  readonly todos: ReadonlyArray<Todo>;
  readonly loading:boolean;
  readonly error:string|null;
}

export const initialTodosState: TodoState = {
  todos:[],
  loading: false,
  error:null
};

export const todosReducer = createReducer(
  initialTodosState,
  on(
    TodosPageActions.loadTodos,
    (state): TodoState => ({
      ...state,
      loading: true,
      error: null
    })
  ),
  on(
    TodosApiActions.loadTodosSuccess,
    (state, {todos}):TodoState => ({
      ...state,
      todos,
      loading: false,
      error:null
    })
  ),
  on(
    TodosApiActions.loadTodosError,
    (state,{error}):TodoState => ({
      ...state,
      loading:false,
      error
    })
  ),
  on(
    TodosPageActions.toggleTodoComplete,
    (state,{id}):TodoState => ({
      ...state,
      error: null,
      loading: false,
      todos: state.todos.map((t)=>{
        if(t.id === id){
          return {
            ...t,
            completed: !t.completed
          }
        }
        return t
      })
    })
  )
)

export const todosFeature = createFeature({
  name: 'todos',
  reducer: todosReducer
});