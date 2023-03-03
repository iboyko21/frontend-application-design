import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TodoListView from './TodoListView';

describe("TodoListView", () => {
    it("should display 'No List Selected' if a list is not provided", () => {
        render(<TodoListView />);
        expect(screen.getByText("No List Selected")).toBeTruthy();
    });
});

describe("TodoListView", () => {
    it("should display the list name if a list is provided", () => {
        const list = {name: "Grocery List"};
        render(<TodoListView list={list} />);
        expect(screen.getByText(list.name)).toBeTruthy();
    });
});