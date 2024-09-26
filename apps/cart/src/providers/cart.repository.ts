import {
    Injectable,
    Logger,
    OnApplicationBootstrap,
    OnApplicationShutdown,
} from '@nestjs/common';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { randomUUID } from 'crypto';
import { Redis } from 'ioredis';
import { CartSession } from '../entities/cart-session.entity';

@Injectable()
export class CartRepository
    implements OnApplicationBootstrap, OnApplicationShutdown
{
    private readonly logger = new Logger(CartRepository.name);
    private redisClient: Redis;

    onApplicationBootstrap() {
        this.redisClient = new Redis({
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT,
        });
    }

    onApplicationShutdown() {
        this.redisClient.quit();
    }

    async getCarts(): Promise<string[]> {
        try {
            const keys = await this.redisClient.keys('*');
            return keys;
        } catch (error) {
            this.logger.error('Error getting cart keys from Redis', error);
            throw error;
        }
    }

    async getCart(cartId: string): Promise<CartSession | null> {
        try {
            const data = await this.redisClient.get(cartId);
            if (!data) return null;

            return plainToClass(CartSession, JSON.parse(data));
        } catch (error) {
            this.logger.error(`Error retrieving cart with ID ${cartId}`, error);
            throw error;
        }
    }

    async addOrUpdate(cart: CartSession): Promise<CartSession | null> {
        try {
            const cartId = cart.id || randomUUID();
            cart.id = cartId;

            const success = await this.redisClient.set(
                cartId,
                JSON.stringify(instanceToPlain(cart)),
            );
            if (!success) {
                this.logger.error(`Failed to save cart with ID ${cartId}`);
                return null;
            }

            return await this.getCart(cartId);
        } catch (error) {
            this.logger.error('Error saving cart to Redis', error);
            throw error;
        }
    }

    async deleteCart(cartId: string): Promise<void> {
        try {
            await this.redisClient.del(cartId);
        } catch (error) {
            this.logger.error(`Error deleting cart with ID ${cartId}`, error);
            throw error;
        }
    }

    async cartExistsForUser(userEmail: string): Promise<boolean> {
        try {
            const keys = await this.redisClient.keys('*');
            for (const key of keys) {
                const cart = await this.getCart(key);
                if (cart && cart.user.email === userEmail) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            this.logger.error('Error checking for existing carts', error);
            throw error;
        }
    }
}
