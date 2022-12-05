import { render, screen } from '@testing-library/react';
import App from './App';
import HomeScreen from './screens/HomeScreen'



test('render App', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

/*
test('title', () => {
  render(<HomeScreen />)
  const titleText = screen.getByText('UpSeeBuy')
  expect(titleText).toBeInTheDocument();
})*/

/*
test('h1', () => {
  render(<HomeScreen />)
  const products = screen.getByText('Productos Destacados')
  expect(products).toBeInTheDocument();
})*/