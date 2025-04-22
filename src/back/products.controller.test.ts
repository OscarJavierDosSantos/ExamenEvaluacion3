import { vi } from 'vitest';
import { ProductsController } from './products.controller';
import { Request, Response, NextFunction } from 'express';
import { ProductRepo } from '../repo/products.repository';

const mockProducts = [{ id: '1', name: 'Product 1' }];

describe('ProductsController', () => {
    let controller: ProductsController;
    let mockRepo: ProductRepo;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRepo = {
            read: vi.fn(),
            readById: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        } as unknown as ProductRepo;

        controller = new ProductsController(mockRepo);

        mockReq = {};
        mockRes = {
            json: vi.fn(),
            status: vi.fn().mockReturnThis(),
        };
        mockNext = vi.fn();
    });

    test('debería obtener todos los productos (getAll)', async () => {
        mockRepo.read.mockResolvedValue(mockProducts);

        await controller.getAll(
            mockReq as Request,
            mockRes as Response,
            mockNext,
        );

        expect(mockRepo.read).toHaveBeenCalled();
        expect(mockRes.json).toHaveBeenCalledWith({
            results: mockProducts,
            error: '',
        });
    });

    test('debería manejar errores llamando a next() en getAll', async () => {
        const mockError = new Error('Test error');
        mockRepo.read.mockRejectedValue(mockError);

        await controller.getAll(
            mockReq as Request,
            mockRes as Response,
            mockNext,
        );

        expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('debería obtener un producto por ID (getById)', async () => {
        mockRepo.readById.mockResolvedValue(mockProducts[0]);
        mockReq.params = { id: '1' };

        await controller.getById(
            mockReq as Request,
            mockRes as Response,
            mockNext,
        );

        expect(mockRepo.readById).toHaveBeenCalledWith('1');
        expect(mockRes.json).toHaveBeenCalledWith({
            results: [mockProducts[0]],
            error: '',
        });
    });

    test('debería manejar errores llamando a next() en getById', async () => {
        const mockError = new Error('Test error');
        mockRepo.readById.mockRejectedValue(mockError);
        mockReq.params = { id: '1' };

        await controller.getById(
            mockReq as Request,
            mockRes as Response,
            mockNext,
        );

        expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('debería crear un producto (create)', async () => {
        mockRepo.create.mockResolvedValue(mockProducts[0]);
        mockReq.body = { name: 'Product 1' };

        await controller.create(
            mockReq as Request,
            mockRes as Response,
            mockNext,
        );

        expect(mockRepo.create).toHaveBeenCalledWith({ name: 'Product 1' });
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
            results: [mockProducts[0]],
            error: '',
        });
    });

    test('debería manejar errores llamando a next() en create', async () => {
        const mockError = new Error('Test error');
        mockRepo.create.mockRejectedValue(mockError);
        mockReq.body = { name: 'Product 1' };

        await controller.create(
            mockReq as Request,
            mockRes as Response,
            mockNext,
        );

        expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('debería actualizar un producto (update)', async () => {
        mockRepo.update.mockResolvedValue(mockProducts[0]);
        mockReq.params = { id: '1' };
        mockReq.body = { name: 'Updated Product' };

        await controller.update(
            mockReq as Request,
            mockRes as Response,
            mockNext,
        );

        expect(mockRepo.update).toHaveBeenCalledWith('1', {
            name: 'Updated Product',
        });
        expect(mockRes.json).toHaveBeenCalledWith({
            results: [mockProducts[0]],
            error: '',
        });
    });

    test('debería manejar errores llamando a next() en update', async () => {
        const mockError = new Error('Test error');
        mockRepo.update.mockRejectedValue(mockError);
        mockReq.params = { id: '1' };
        mockReq.body = { name: 'Updated Product' };

        await controller.update(
            mockReq as Request,
            mockRes as Response,
            mockNext,
        );

        expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('debería eliminar un producto (delete)', async () => {
        mockRepo.delete.mockResolvedValue(mockProducts[0]);
        mockReq.params = { id: '1' };

        await controller.delete(
            mockReq as Request,
            mockRes as Response,
            mockNext,
        );

        expect(mockRepo.delete).toHaveBeenCalledWith('1');
        expect(mockRes.json).toHaveBeenCalledWith({
            results: [mockProducts[0]],
            error: '',
        });
    });

    test('debería manejar errores llamando a next() en delete', async () => {
        const mockError = new Error('Test error');
        mockRepo.delete.mockRejectedValue(mockError);
        mockReq.params = { id: '1' };

        await controller.delete(
            mockReq as Request,
            mockRes as Response,
            mockNext,
        );

        expect(mockNext).toHaveBeenCalledWith(mockError);
    });
});
