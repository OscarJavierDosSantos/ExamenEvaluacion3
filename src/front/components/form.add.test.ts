import { createFormAdd } from './form.add';
import { fireEvent, screen } from '@testing-library/dom';
import '@testing-library/jest-dom';

describe.only('createFormAdd', () => {
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = createFormAdd([], 'body', 'afterbegin');
    });

    test('Debería representar el formulario correctamente', () => {
        expect(container).toBeInTheDocument();
        expect(screen.getByLabelText('add_form')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Price')).toBeInTheDocument();
        expect(screen.getByText('Esta en promoción')).toBeInTheDocument();
        expect(screen.getByText('Category')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Crear' }),
        ).toBeInTheDocument();
    });

    test('Debería llamar a Submit al enviar el formulario', () => {
        const mockSubmitHandler = vi.fn();
        const form = screen.getByLabelText('add_form') as HTMLFormElement;

        // Espía el evento de envío
        form.addEventListener('submit', mockSubmitHandler);

        fireEvent.submit(form);

        expect(mockSubmitHandler).toHaveBeenCalled();
    });

    test('Debe registrar los datos correctos del producto al enviar', () => {
        const consoleSpy = vi
            .spyOn(console, 'log')
            .mockImplementation(() => {});
        const form = screen.getByLabelText('add_form') as HTMLFormElement;

        // Rellenar los campos del formulario
        fireEvent.input(screen.getByLabelText('Name'), {
            target: { value: 'Test Product' },
        });
        fireEvent.input(screen.getByLabelText('Description'), {
            target: { value: 'Test Description' },
        });
        fireEvent.input(screen.getByLabelText('Price'), {
            target: { value: '100' },
        });
        fireEvent.click(screen.getByLabelText('Esta en promoción'));
        fireEvent.change(screen.getByLabelText('Category'), {
            target: { value: 'mobile' },
        });

        // Enviar el formulario
        fireEvent.submit(form);

        expect(consoleSpy).toHaveBeenCalledWith('Form submitted:', {
            id: -Infinity,
            name: 'Test Product',
            description: 'Test Description',
            category: 'mobile',
            price: 100,
            hasPromo: true,
        });

        consoleSpy.mockRestore();
    });
});
