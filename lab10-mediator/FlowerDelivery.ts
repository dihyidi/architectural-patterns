enum FormEvents {
    DateChanged,
    ReceiverChanged,
    PickupChanged,
}

interface FormComponent {
    setMediator(mediator: Mediator): void;
    toggleState?(isEnabled: boolean): void;
}

interface Mediator {
    notify(sender: FormComponent, event: FormEvents): void;
}

class OrderFormMediator implements Mediator {
    constructor(
        private deliveryDatePicker: DeliveryDatePicker,
        private timeSlotPicker: TimeSlotPicker,
        private receiverInfo: ReceiverInfo,
        private selfPickupOption: SelfPickupOption
    ) {}

    notify(sender: FormComponent, event: FormEvents): void {
        switch (event) {
            case FormEvents.DateChanged:
                console.log("Mediator notified: Date changed.");
                this.timeSlotPicker.updateAvailableSlots(this.deliveryDatePicker.getDate());
                break;
            case FormEvents.ReceiverChanged:
                console.log("Mediator notified: Receiver changed.");
                this.receiverInfo.toggleReceiverFields(this.receiverInfo.isReceiverAnotherPerson());
                break;
            case FormEvents.PickupChanged:
                console.log("Mediator notified: Pickup option changed.");
                const isSelfPickup = this.selfPickupOption.isSelfPickup();
                this.toggleDeliveryFields(!isSelfPickup);
                break;
        }
    }

    private toggleDeliveryFields(isEnabled: boolean): void {
        console.log(`Mediator: Toggling delivery fields. Enabled: ${isEnabled}`);
        this.deliveryDatePicker.toggleState?.(isEnabled);
        this.timeSlotPicker.toggleState?.(isEnabled);
        this.receiverInfo.toggleState?.(isEnabled);
        if (!isEnabled) {
            this.receiverInfo.clearReceiverInfo();
        }
    }
}

class DeliveryDatePicker implements FormComponent {
    private enabled: boolean = true;
    private date?: string;
    private mediator?: Mediator;

    setMediator(mediator: Mediator): void {
        this.mediator = mediator;
    }

    setDate(date: string): void {
        this.date = date;
        console.log(`DeliveryDatePicker: Date set to ${date}`);
        this.mediator?.notify(this, FormEvents.DateChanged);
    }

    getDate(): string | undefined {
        return this.date;
    }

    toggleState(isEnabled: boolean): void {
        this.enabled = isEnabled;
        console.log(`DeliveryDatePicker: State toggled to ${isEnabled}`);
    }
}

class TimeSlotPicker implements FormComponent {
    private enabled: boolean = true;
    private availableSlots: string[] = [];
    private mediator?: Mediator;

    setMediator(mediator: Mediator): void {
        this.mediator = mediator;
    }

    updateAvailableSlots(date?: string): void {
        this.availableSlots = !!date ? ["10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00"] : [];
        console.log(`TimeSlotPicker: Available slots updated for date ${date}:`, this.availableSlots);
    }

    toggleState(isEnabled: boolean): void {
        this.enabled = isEnabled;
        console.log(`TimeSlotPicker: State toggled to ${isEnabled}`);
    }
}

class ReceiverInfo implements FormComponent {
    private enabled: boolean = false;
    private receiverAnotherPerson: boolean = false;
    private name: string = "";
    private phone: string = "";
    private mediator?: Mediator;

    setMediator(mediator: Mediator): void {
        this.mediator = mediator;
    }

    setReceiverAnotherPerson(isAnotherPerson: boolean): void {
        this.receiverAnotherPerson = isAnotherPerson;
        console.log(`ReceiverInfo: Receiver another person set to ${isAnotherPerson}`);
        this.mediator?.notify(this, FormEvents.ReceiverChanged);
    }

    isReceiverAnotherPerson(): boolean {
        return this.receiverAnotherPerson;
    }

    toggleReceiverFields(isRequired: boolean): void {
        console.log(`ReceiverInfo: Toggling receiver fields. Required: ${isRequired}`);
        if (isRequired) {
            this.name = "required";
            this.phone = "required";
        }
    }

    clearReceiverInfo(): void {
        this.name = "";
        this.phone = "";
        console.log("ReceiverInfo: Receiver info cleared.");
    }

    toggleState(isEnabled: boolean): void {
        this.enabled = isEnabled;
        console.log(`ReceiverInfo: State toggled to ${isEnabled}`);
    }
}

class SelfPickupOption implements FormComponent {
    private selfPickup: boolean = false;
    private mediator?: Mediator;

    setMediator(mediator: Mediator): void {
        this.mediator = mediator;
    }

    setSelfPickup(isSelfPickup: boolean): void {
        this.selfPickup = isSelfPickup;
        console.log(`SelfPickupOption: Self-pickup set to ${isSelfPickup}`);
        this.mediator?.notify(this, FormEvents.PickupChanged);
    }

    isSelfPickup(): boolean {
        return this.selfPickup;
    }
}

// example
const deliveryDatePicker = new DeliveryDatePicker();
const timeSlotPicker = new TimeSlotPicker();
const receiverInfo = new ReceiverInfo();
const selfPickupOption = new SelfPickupOption();

const mediator = new OrderFormMediator(deliveryDatePicker, timeSlotPicker, receiverInfo, selfPickupOption);

deliveryDatePicker.setMediator(mediator);
timeSlotPicker.setMediator(mediator);
receiverInfo.setMediator(mediator);
selfPickupOption.setMediator(mediator);

deliveryDatePicker.setDate("2024-11-10");  // Change date and update available time slots
/*
[LOG]: "DeliveryDatePicker: Date set to 2024-11-10" 
[LOG]: "Mediator notified: Date changed." 
[LOG]: "TimeSlotPicker: Available slots updated for date 2024-11-10:",  ["10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00"] 
*/
receiverInfo.setReceiverAnotherPerson(true);  // Enable receiver fields for another person
/*
[LOG]: "ReceiverInfo: Receiver another person set to true" 
[LOG]: "Mediator notified: Receiver changed." 
[LOG]: "ReceiverInfo: Toggling receiver fields. Required: true"
 */
selfPickupOption.setSelfPickup(true);  // Enable self-pickup and disable delivery fields
/*
[LOG]: "SelfPickupOption: Self-pickup set to true" 
[LOG]: "Mediator notified: Pickup option changed." 
[LOG]: "Mediator: Toggling delivery fields. Enabled: false" 
[LOG]: "DeliveryDatePicker: State toggled to false" 
[LOG]: "TimeSlotPicker: State toggled to false" 
[LOG]: "ReceiverInfo: State toggled to false" 
[LOG]: "ReceiverInfo: Receiver info cleared." 
 */