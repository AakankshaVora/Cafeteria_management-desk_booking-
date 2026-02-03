import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import Dashboard from '../pages/employee/Dashboard';

// Mock Auth
vi.mock('../auth/AuthContext', () => ({
    useAuth: () => ({
        user: { name: 'Test User', role: 'employee' },
        logout: vi.fn()
    })
}));

// Mock Link to avoid router issues if not wrapped (though we wrap it)
// But Dashboard might use useNavigate.
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('Employee Dashboard', () => {
    it('renders welcome message', () => {
        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        expect(screen.getByText(/Test User/i)).toBeInTheDocument();
        expect(screen.getByText(/What would you like to do today?/i)).toBeInTheDocument();
    });

    it('renders primary actions', () => {
        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        expect(screen.getByText(/Order Food/i)).toBeInTheDocument();
        expect(screen.getByText(/Book Desk/i)).toBeInTheDocument();
    });
});
