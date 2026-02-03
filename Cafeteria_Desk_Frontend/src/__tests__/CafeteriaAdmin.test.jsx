import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import Dashboard from '../pages/cafeteria/Dashboard';

// Mock Auth
vi.mock('../auth/AuthContext', () => ({
    useAuth: () => ({
        user: { name: 'Admin User', role: 'cafeteria_admin' },
        logout: vi.fn()
    })
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('Cafeteria Admin Dashboard', () => {
    it('renders admin options', () => {
        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        // Check for headings or ensure multiple text instances exist
        expect(screen.getAllByText(/Manage Menu/i)[0]).toBeInTheDocument();
        expect(screen.getByText(/View Orders/i)).toBeInTheDocument();
    });
});
