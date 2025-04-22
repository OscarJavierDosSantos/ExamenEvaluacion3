import { vi } from 'vitest';
import { ApiRepo } from './api.repo';

describe('ApiRepo', () => {
    const apiRepo = new ApiRepo();
    const mockFetch = vi.fn();
    beforeEach(() => {
        global.fetch = mockFetch;
    });
    afterEach(() => {
        vi.clearAllMocks();
    });
    describe('getProducts', () => {
        test('Debe obtener y devolver la lista de productos', async () => {
            const mockProducts = [
                { id: 1, name: 'Product 1' },
                { id: 2, name: 'Product 2' },
            ];
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockProducts,
            });
            const result = await apiRepo.getProducts();
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:3000/products',
            );
            expect(result).toEqual(mockProducts);
        });
        test('Debería generar un error si la solicitud falla', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
            });
            await expect(apiRepo.getProducts()).rejects.toThrow(
                '500 Internal Server Error',
            );
        });
    });
    describe('createProduct', () => {
        test('Debería crear un nuevo producto y devolverlo', async () => {
            const newProduct = { name: 'New Product' };
            const createdProduct = { id: 1, ...newProduct };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => createdProduct,
            });
            const result = await apiRepo.createProduct(newProduct);
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:3000/products',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newProduct),
                },
            );
            expect(result).toEqual(createdProduct);
        });

        test('Debería generar un error si falla la creación.', async () => {
            const newProduct = { name: 'Invalid Product' };
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                statusText: 'Bad Request',
            });

            await expect(apiRepo.createProduct(newProduct)).rejects.toThrow(
                '400 Bad Request',
            );
        });
    });

    describe('updateProduct', () => {
        test('Debería actualizar un producto y devolverlo', async () => {
            const updatedProduct = { name: 'Updated Product' };
            const productId = 1;
            const responseProduct = { id: productId, ...updatedProduct };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => responseProduct,
            });

            const result = await apiRepo.updateProduct(
                productId,
                updatedProduct,
            );

            expect(mockFetch).toHaveBeenCalledWith(
                `http://localhost:3000/products/${productId}`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedProduct),
                },
            );
            expect(result).toEqual(responseProduct);
        });

        test('Debería generar un error si falla la actualización', async () => {
            const updatedProduct = { name: 'Invalid Product' };
            const productId = 1;
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: 'Not Found',
            });

            await expect(
                apiRepo.updateProduct(productId, updatedProduct),
            ).rejects.toThrow('404 Not Found');
        });
    });

    describe('deleteProduct', () => {
        test('Debería eliminar un producto y devolver los productos restantes.', async () => {
            const productId = 1;
            const remainingProducts = [{ id: 2, name: 'Product 2' }];
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => remainingProducts,
            });

            const result = await apiRepo.deleteProduct(productId);

            expect(mockFetch).toHaveBeenCalledWith(
                `http://localhost:3000/products/${productId}`,
                {
                    method: 'DELETE',
                },
            );
            expect(result).toEqual(remainingProducts);
        });

        test('Debería generar un error si falla la eliminación', async () => {
            const productId = 1;
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
            });

            await expect(apiRepo.deleteProduct(productId)).rejects.toThrow(
                '500 Internal Server Error',
            );
        });
    });

    describe('edge cases', () => {
        test('Debería manejar una lista de productos vacía', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => [],
            });

            const result = await apiRepo.getProducts();

            expect(result).toEqual([]);
        });

        test('Debería manejar una respuesta JSON no válida', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => {
                    throw new Error('Invalid JSON');
                },
            });

            await expect(apiRepo.getProducts()).rejects.toThrow('Invalid JSON');
        });
    });
});
