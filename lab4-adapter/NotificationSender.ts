// Existing code
interface CustomNotification {
    send(title: string, message: string): void;
}

class EmailNotification implements CustomNotification {
    private adminEmail: string;

    constructor(adminEmail: string) {
        this.adminEmail = adminEmail;
    }

    send(title: string, message: string): void {
        console.log(`Sent email with title '${title}' to '${this.adminEmail}' that says '${message}'.`);
    }
}

// Slack
class SlackService {
    private login: string;
    private apiKey: string;
    private chatId: string;

    constructor(login: string, apiKey: string, chatId: string) {
        this.login = login;
        this.apiKey = apiKey;
        this.chatId = chatId;
    }

    sendSlackMessage(title: string, message: string): void {
        console.log(`Sent Slack message to chat '${this.chatId}' with title '${title}' and message '${message}'.`);
    }
}

class SlackNotificationAdapter implements CustomNotification {
    private slackService: SlackService;

    constructor(slackService: SlackService) {
        this.slackService = slackService;
    }

    send(title: string, message: string): void {
        this.slackService.sendSlackMessage(title, message);
    }
}

// SMS 
class SMSService {
    private phone: string;
    private sender: string;

    constructor(phone: string, sender: string) {
        this.phone = phone;
        this.sender = sender;
    }

    sendSMS(title: string, message: string): void {
        console.log(`Sent SMS from '${this.sender}' to '${this.phone}' with title '${title}' and message '${message}'.`);
    }
}

class SMSNotificationAdapter implements CustomNotification {
    private smsService: SMSService;

    constructor(smsService: SMSService) {
        this.smsService = smsService;
    }

    send(title: string, message: string): void {
        this.smsService.sendSMS(title, message);
    }
}

// example
// Email Notification
const emailNotification = new EmailNotification("admin@example.com");
emailNotification.send("Email Title", "This is the email message."); // "Sent email with title 'Email Title' to 'admin@example.com' that says 'This is the email message.'." 

// Slack Notification
const slackService = new SlackService("user_login", "api_key", "chat123");
const slackNotification = new SlackNotificationAdapter(slackService);
slackNotification.send("Slack Title", "This is the Slack message."); // "Sent Slack message to chat 'chat123' with title 'Slack Title' and message 'This is the Slack message.'." 

// SMS Notification
const smsService = new SMSService("+123456789", "MyCompany");
const smsNotification = new SMSNotificationAdapter(smsService);
smsNotification.send("SMS Title", "This is the SMS message."); // "Sent SMS from 'MyCompany' to '+123456789' with title 'SMS Title' and message 'This is the SMS message.'." 
