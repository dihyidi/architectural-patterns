enum SocialNetworks {
    Facebook,
    LinkedIn
}

interface ISocialNetwork {
    login(username: string, password: string): void;
    postMessage(message: string): void;
}

class Facebook implements ISocialNetwork {
    login(username: string, password: string): void {
        console.log(`Logged in to Facebook with username: ${username}`);
    }

    postMessage(message: string): void {
        console.log(`Posting message on Facebook: ${message}`);
    }
}

class LinkedIn implements ISocialNetwork {
    login(email: string, password: string): void {
        console.log(`Logged in to LinkedIn with email: ${email}`);
    }

    postMessage(message: string): void {
        console.log(`Posting message on LinkedIn: ${message}`);
    }
}

class SocialNetworkFactory {
    public static createSocialNetwork(network: SocialNetworks): ISocialNetwork {
        switch (network) {
            case SocialNetworks.Facebook:
                return new Facebook();
            case SocialNetworks.LinkedIn:
                return new LinkedIn();
            default:
                throw new Error(`Unknown social network: ${network}`);
        }
    }
}

// example
const facebook = SocialNetworkFactory.createSocialNetwork(SocialNetworks.Facebook);
facebook.login('fb_user', 'password123');
facebook.postMessage('Hello Facebook!');

const linkedIn = SocialNetworkFactory.createSocialNetwork(SocialNetworks.LinkedIn);
linkedIn.login('email@example.com', 'password123');
linkedIn.postMessage('Hello LinkedIn!');
