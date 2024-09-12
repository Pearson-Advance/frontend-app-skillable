import React from 'react';
import { render, screen } from '@testing-library/react';
import JsonViewer from '../index';
import '@testing-library/jest-dom';

describe('JsonViewer Component', () => {
  const mockLabName = 'Test Lab';
  const mockLabData = {
    key1: 'value1',
    key2: 2,
    key3: true,
  };

  it('renders the component correctly', () => {
    render(<JsonViewer labName={mockLabName} labData={mockLabData} />);

    expect(screen.getByText('Test Lab')).toBeInTheDocument();
  });

  it('initializes JSONEditor with correct options and data', () => {
    render(<JsonViewer labName={mockLabName} labData={mockLabData} />);

    const editorContainer = document.querySelector('.jsoneditor');
    expect(editorContainer).toBeInTheDocument();
  });

  it('destroys JSONEditor instance on component unmount', () => {
    const { unmount } = render(<JsonViewer labName={mockLabName} labData={mockLabData} />);

    unmount();

    const editorContainer = document.querySelector('.jsoneditor');
    expect(editorContainer).not.toBeInTheDocument();
  });
});
