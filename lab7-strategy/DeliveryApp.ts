interface IDeliveryStrategy {
    calculateCost(): number;
}

class PickupDeliveryStrategy implements IDeliveryStrategy {
    calculateCost(): number {
        console.log('Calculating cost for pickup');        
        return 10
    }    
}

class ExternalDeliveryServiceStrategy implements IDeliveryStrategy {
    private baseCost: number
    private importanceCoefficient: number

    constructor(importanceCoefficient: number, baseCost: number = 50){
        this.importanceCoefficient = importanceCoefficient
        this.baseCost = baseCost
    }

    calculateCost(): number {
        console.log('Calculating cost for external delivery service');        
        return this.baseCost * this.importanceCoefficient
    }    
}

class OwnDeliveryServiceStrategy implements IDeliveryStrategy {
    private distance: number
    private pricePerKm: number

    constructor(distance: number, pricePerKm: number = 10){
        this.distance = distance
        this.pricePerKm = pricePerKm
    }

    calculateCost(): number {
        console.log('Calculating cost for own delivery service');        
        return this.distance * this.pricePerKm
    }    
}

class DeliveryCostCalculator {
    private deliveryStrategy: IDeliveryStrategy

    constructor(deliveryStrategy: IDeliveryStrategy){
        this.deliveryStrategy = deliveryStrategy
    }

    setDeliveryStrategy (deliveryStrategy: IDeliveryStrategy): void {
        this.deliveryStrategy = deliveryStrategy
    }

    calculateDeliveryCost = (): number => this.deliveryStrategy.calculateCost()
}

// example
const pickupStrategy = new PickupDeliveryStrategy()
const deliveryCostCalculator = new DeliveryCostCalculator(pickupStrategy);
console.log(deliveryCostCalculator.calculateDeliveryCost()) // [LOG]: "Calculating cost for pickup" [LOG]: 10 

const externalDeliveryServiceStrategy = new ExternalDeliveryServiceStrategy(2, 50)
deliveryCostCalculator.setDeliveryStrategy(externalDeliveryServiceStrategy)
console.log(deliveryCostCalculator.calculateDeliveryCost()); // [LOG]: "Calculating cost for external delivery service" [LOG]: 100 

const ownDeliveryServiceStrategy = new OwnDeliveryServiceStrategy(5, 10)
deliveryCostCalculator.setDeliveryStrategy(ownDeliveryServiceStrategy)
console.log(deliveryCostCalculator.calculateDeliveryCost()); // [LOG]: "Calculating cost for own delivery service"  [LOG]: 50 