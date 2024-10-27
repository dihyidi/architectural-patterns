type Product = { id: number; name: string; price: number };
type User = { id: number; username: string; email: string };
type Order = { id: number; items: { productId: number; quantity: number }[] };

abstract class EntityUpdater<T> {
    public async update(entity: T): Promise<{ code: number; status: string; data?: T }> {
        const validEntity = await this.fetchEntity(entity);

        if (!this.validateEntity(validEntity)) {
            await this.onValidationFailure(validEntity);
            return { code: 400, status: "Validation Failed" };
        }

        await this.saveEntity(validEntity);
        await this.onEntitySaved(validEntity);

        return this.createResponse(validEntity);
    }

    // required methods
    protected abstract fetchEntity(entity: T): Promise<T>;
    protected abstract validateEntity(entity: T): boolean;
    protected abstract saveEntity(entity: T): Promise<void>;

    // hooks
    protected async onValidationFailure(entity: T): Promise<void> {}
    protected async onEntitySaved(entity: T): Promise<void> {}

    // optional to change
    protected createResponse = (entity: T): { code: number; status: string; data?: T } => ({ code: 200, status: "Success" })
}

class ProductUpdater extends EntityUpdater<Product> {
    protected async fetchEntity(product: Product): Promise<Product> {
        return { ...product };
    }

    protected validateEntity = (product: Product): boolean => !!product.name && product.price > 0;

    protected async saveEntity(product: Product): Promise<void> {
        console.log("Saving Product:", product);
    }

    protected async onValidationFailure(product: Product): Promise<void> {
        console.log("Message about validation failure");
    }
}

class UserUpdater extends EntityUpdater<User> {
    private getUser(id: number): User {
        return { id: id, username: 'User1', email: 'email@email.com' }
    }

    protected async fetchEntity(user: User): Promise<User> {
        const dbUser = this.getUser(user.id)
        return { ...user, email: dbUser.email };
    }

    protected validateEntity = (user: User): boolean => !!user.username 

    protected async saveEntity(user: User): Promise<void> {
        console.log("Saving User:", user);
    }
}

class OrderUpdater extends EntityUpdater<Order> {
    protected async fetchEntity(order: Order): Promise<Order> {
        return { ...order };
    }

    protected validateEntity = (order: Order): boolean => order.items.length > 0

    protected async saveEntity(order: Order): Promise<void> {
        console.log("Saving Order:", order);
    }

    protected createResponse = (order: Order): { code: number; status: string; data?: Order } => ({ code: 200, status: "Success", data: order })
}

// example
(async () => {
    const productUpdater = new ProductUpdater();
    console.log(await productUpdater.update({ id: 1, name: "Burger", price: 100 })); // valid
    /*
    [LOG]: "Saving Product:",  {
        "id": 1,
        "name": "Burger",
        "price": 100
        } 
    [LOG]: {
        "code": 200,
        "status": "Success"
        } 
     */
    console.log(await productUpdater.update({ id: 1, name: "Burger", price: 0 })); // invalid
    /* 
    [LOG]: "Message about validation failure" 
    [LOG]: {
        "code": 400,
        "status": "Validation Failed"
        }
    */
    console.log(await productUpdater.update({ id: 1, name: "", price: 100 })); // invalid 2
    /* 
    [LOG]: "Message about validation failure" 
    [LOG]: {
        "code": 400,
        "status": "Validation Failed"
        }
    */

    const userUpdater = new UserUpdater();
    console.log(await userUpdater.update({ id: 1, username: "User123", email: "user@example.com" })); // vaild
    /*
    [LOG]: "Saving User:",  {
        "id": 1,
        "username": "User123",
        "email": "email@email.com"
        } 
    [LOG]: {
        "code": 200,
        "status": "Success"
        } 
    */
    console.log(await userUpdater.update({ id: 1, username: "", email: "user@example.com" })); // invaild
    /*
    [LOG]: {
        "code": 400,
        "status": "Validation Failed"
        } 
    */

    const orderUpdater = new OrderUpdater();
    console.log(await orderUpdater.update({ id: 1, items: [{ productId: 1, quantity: 2 }] })); // valid
    /*
    [LOG]: "Saving Order:",  {
        "id": 1,
        "items": [
            {
            "productId": 1,
            "quantity": 2
            }
        ]
    } 
    [LOG]: {
        "code": 200,
        "status": "Success",
        "data": {
            "id": 1,
            "items": [
            {
                "productId": 1,
                "quantity": 2
            }
            ]
        }
    } 
    */
    console.log(await orderUpdater.update({ id: 1, items: [] })); // invalid
    /**
     [LOG]: {
        "code": 400,
        "status": "Validation Failed"
        } 
     */
})();
