import { screen } from '@testing-library/dom';
import { createHeader } from './header';
import '@testing-library/jest-dom'; //nameSpace for jest-dom matchers

describe('createHeader', () => {
    test('debería renderizar el encabezado correctamente', () => {
        document.body.innerHTML = ''; // Limpiar el DOM
        createHeader();
        const logo = screen.getByAltText('Logo de la empresa');
        expect(logo).toBeInTheDocument();

        const title = screen.getByRole('heading', { level: 1 });
        expect(title).toHaveTextContent('Productos');

        const addButton = screen.getByRole('button', { name: /add/i });
        expect(addButton).toBeInTheDocument();

        const details = screen.getByRole('button', { name: /add/i });
        expect(details).toHaveAttribute('aria-expanded', 'false');
    });

    test('debería renderizar dentro de un contenedor específico', () => {
        document.body.innerHTML = '<div id="app"></div>';
        createHeader('#app');

        const header = screen.getByRole('banner');
        expect(document.querySelector('#app')).toContainElement(header);
    });
});
