import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import Dashboard from '../pages/desk/Dashboard';

// Mock Auth
vi.mock('../auth/AuthContext', () => ({
    useAuth: () => ({
        user: { name: 'Desk Manager', role: 'desk_admin' },
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

describe('Desk Admin Dashboard', () => {
    it('renders desk stats', () => {
        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        expect(screen.getByText(/Desk Admin Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Total Desks/i)).toBeInTheDocument();
    });
});
