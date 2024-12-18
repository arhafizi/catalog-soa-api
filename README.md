# NestJS Service-Oriented Architecture Project

This project is a service-oriented architecture application built using NestJS, Fastify, MongoDB, Mongoose, Redis, and NATS as an event bus. It consists of two main services: **Catalog Service** and **Cart Service**. The Catalog Service manages items, while the Cart Service handles shopping cart functionalities. The project follows the CQRS (Command Query Responsibility Segregation) pattern in the Cart Service.

<p align="center">
  <img src="schema.svg" alt="Architecture Diagram" />
</p>

## Table of Contents

- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Docker Compose Setup](#docker-compose-setup)
- [Catalog Service](#catalog-service)
- [Cart Service](#cart-service)
- [Event Bus](#event-bus)
- [CQRS Pattern](#cqrs-pattern)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [License](#license)

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **Fastify**: A fast and low-overhead web framework for Node.js.
- **MongoDB**: A NoSQL database for storing data in a flexible, JSON-like format.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Redis**: An in-memory data structure store used as a database, cache, and message broker.
- **NATS**: A lightweight, high-performance messaging system for service communication.
- **CQRS**: A pattern that separates read and write operations for better scalability and performance.

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm i
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   MONGO_URI=<mongodb-uri>
   NATS_URL=<nats-server-url>
   REDIS_HOST=<redis-host>
   REDIS_PORT=<redis-port>
   ```

4. **Run the services**:
   You can run each service separately. For example, to run the Catalog Service:
   ```bash
   npm run start -- catalog
   ```
   And for the Cart Service:
   ```bash
   npm run start -- cart
   ```

## Docker Compose Setup

To run the application using Docker, you can use the provided `docker-compose.yml` file. This file sets up the necessary services, including MongoDB, Redis, and NATS.

### Steps to Run with Docker Compose

1. **Ensure Docker and Docker Compose are installed** on your machine.

2. **Navigate to the project directory** where the `docker-compose.yml` file is located.

3. **Run the following command** to start all services:
   ```bash
   docker-compose up --build
   ```

4. **Access the services**:
   - Catalog Service: [http://localhost:3000](http://localhost:3000)
   - Cart Service: [http://localhost:3001](http://localhost:3001)

### Docker Compose Configuration

Here’s a brief overview of the services defined in the `docker-compose.yml` file:

- **catalog**: The Catalog Service, which manages items.
- **cart**: The Cart Service, which handles shopping cart functionalities.
- **db**: MongoDB instance for storing item data.
- **cartsdb**: Redis instance for managing cart sessions.
- **catalog_esb**: NATS server for event-driven communication between services.

## Catalog Service

The Catalog Service is responsible for managing items. It provides endpoints to create, read, update, and delete items. It also emits events when an item is sold out.

### Key Features

- **CRUD Operations**: Create, read, update, and delete items.
- **Event Emission**: Emits an event when an item is sold out.

### API Endpoints

- `GET /api/items`: Retrieve all active items.
- `GET /api/items/:id`: Retrieve a specific item by ID.
- `POST /api/items`: Create a new item.
- `PATCH /api/items/:id`: Update an existing item.
- `DELETE /api/items/:id`: Soft delete an item (mark as inactive).
- `DELETE /api/items/prune`: Delete all items.
- `POST /api/items/validate`: Validate multiple items by their IDs.

## Cart Service

The Cart Service manages shopping cart functionalities. It allows users to create carts, add or remove items, and handle item sold-out events.

### Key Features

- **CQRS Implementation**: Uses the CQRS pattern for better separation of concerns.
- **Event Handling**: Listens for item sold-out events and updates carts accordingly.

### API Endpoints

- `GET /api/carts/:id`: Retrieve a specific cart by ID.
- `POST /api/carts`: Create a new cart.
- `PATCH /api/carts/:cartId/items/:id`: Add an item to the cart.
- `DELETE /api/carts/:cartId/items/:id`: Remove an item from the cart.

### Providers

- **CatalogClientService**: Communicates with the Catalog Service to enrich cart items and validate item IDs.
- **CartRepository**: Manages cart sessions in Redis.
- **Command Handlers**: Handles commands for creating carts, retrieving carts, and updating item quantities.

## Event Bus

Both services communicate through NATS as an event bus. When an item is deleted in the Catalog Service, it emits an `item.sold_out` event, which the Cart Service listens for to remove the item from all active carts.

## CQRS Pattern

The Cart Service implements the CQRS pattern, separating the command (write) and query (read) operations. This allows for better scalability and maintainability of the service.

### Commands and Queries

- **Commands**:
  - `CreateCartCommand`: Command to create a new cart with specified item IDs and user email.
  - `UpdateCartItemQuantityCommand`: Command to update the quantity of an item in the cart.
  
- **Queries**:
  - `GetCartQuery`: Query to retrieve a specific cart by its ID.

### Command Handlers

- **CreateCartHandler**: Handles the creation of a new cart, ensuring that the user does not already have an existing cart and validating item IDs.
- **GetCartHandler**: Handles the retrieval of a cart, enriching the cart items with additional data from the Catalog Service.
- **UpdateCartItemQuantityHandler**: Handles the updating of item quantities in the cart, ensuring that item IDs are valid and managing the addition or removal of items.

## Environment Variables

Make sure to set the following environment variables in your `.env` file:

- `MONGO_URI`: MongoDB connection string.
- `NATS_URL`: NATS server URL.
- `REDIS_HOST`: Redis server host.
- `REDIS_PORT`: Redis server port.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
