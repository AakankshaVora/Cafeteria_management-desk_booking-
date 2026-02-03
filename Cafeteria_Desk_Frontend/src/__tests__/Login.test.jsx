import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import Login from '../pages/login/Login';
import * as AuthContext from '../auth/AuthContext';

// Mock mocks
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

// Mock dependencies
vi.mock('../auth/AuthContext', () => ({
    useAuth: () => ({
        login: mockLogin,
        user: null
    })
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('Login Component', () => {
    it('renders login form correctly', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    it('handles user input and submission', async () => {
        // Setup mock return
        mockLogin.mockResolvedValue({ success: true, role: 'employee' });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const emailInput = screen.getByLabelText(/Email Address/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const submitBtn = screen.getByRole('button', { name: /Sign In/i });

        fireEvent.change(emailInput, { target: { value: 'emp@test.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('emp@test.com', 'password');
        });
    });
});
