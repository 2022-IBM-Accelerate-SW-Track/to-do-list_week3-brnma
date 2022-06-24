import { render, screen, fireEvent } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("test that App component doesn't render dupicate Task", () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByRole('textbox', { name: /Due Date/i });
  const button = screen.getByRole('button', { name: /Add/i });
  const dueDate = '12/12/2012';
  for (let i = 0; i < 2; i++) {
    fireEvent.change(inputTask, { target: { value: 'abc123' } });
    fireEvent.change(inputDate, { target: { value: dueDate } });
    fireEvent.click(button);
  }
  //  will throw an error if there is a duplicate
  const check = screen.getByTestId(/abc123-card/i);
  expect(check).toBeInTheDocument();
});

test("test that App component doesn't add a task without task name", () => {
  render(<App />);
  const inputDate = screen.getByRole('textbox', { name: /Due Date/i });
  const button = screen.getByRole('button', { name: /Add/i });
  const dueDate = '12/12/2012';
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(button);
  const check = screen.getByText(/You have no todo's left/i);
  expect(check).toBeInTheDocument();
});

test("test that App component doesn't add a task without due date", () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const button = screen.getByRole('button', { name: /Add/i });
  fireEvent.change(inputTask, { target: { value: 'abc123' } });
  fireEvent.click(button);
  const check = screen.getByText(/You have no todo's left/i);
  expect(check).toBeInTheDocument();
});

test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByRole('textbox', { name: /Due Date/i });
  const button = screen.getByRole('button', { name: /Add/i });
  const dueDate = '12/12/2012';
  fireEvent.change(inputTask, { target: { value: 'abc123' } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(button);
  const todo = screen.getByText(/abc123/i);
  expect(todo).toBeInTheDocument();
  const checkbox = screen.getByTestId(/abc123-checkbox/i);
  fireEvent.click(checkbox);
  const check = screen.getByText(/You have no todo's left/i);
  expect(check).toBeInTheDocument();
});

test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByRole('textbox', { name: /Due Date/i });
  const button = screen.getByRole('button', { name: /Add/i });
  const dueDate = '12/12/2012';
  fireEvent.change(inputTask, { target: { value: 'abc123' } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(button);
  const color = screen.getByTestId(/abc123-card/i).style.background;
  expect(color).toEqual('rgb(255, 204, 203)');
});
