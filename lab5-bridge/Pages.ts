class Product {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public image: string
    ) { }
}


interface Renderer {
    renderSimplePage(title: string, content: string): string;
    renderProductPage(product: Product): string;
}

class HTMLRenderer implements Renderer {
    renderSimplePage(title: string, content: string): string {
        return `<html>
                    <head>
                        <title>${title}</title>
                    </head>
                    <body>${content}</body>
                </html>`;
    }

    renderProductPage(product: Product): string {
        return `<html>
                    <head>
                        <title>${product.name}</title>
                    </head>
                    <body>
                        <h1>${product.name}</h1>
                        <p>${product.description}</p>
                        <img src="${product.image}" />
                        <p>ID: ${product.id}</p>
                    </body>
                </html>`;
    }
}

class JsonRenderer implements Renderer {
    renderSimplePage(title: string, content: string): string {
        return JSON.stringify({ title, content });
    }

    renderProductPage(product: Product): string {
        return JSON.stringify(product);
    }
}

class XmlRenderer implements Renderer {
    renderSimplePage(title: string, content: string): string {
        return `<page>
                    <title>${title}</title>
                    <content>${content}</content>
                </page>`;
    }

    renderProductPage(product: Product): string {
        return `<product>
                    <name>${product.name}</name>
                    <description>${product.description}</description>
                    <image>${product.image}</image>
                    <id>${product.id}</id>
                </product>`;
    }
}


abstract class Page {
    protected renderer: Renderer;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    abstract render(): string;
}

class SimplePage extends Page {
    private title: string;
    private content: string;

    constructor(renderer: Renderer, title: string, content: string) {
        super(renderer);
        this.title = title;
        this.content = content;
    }

    render(): string {
        return this.renderer.renderSimplePage(this.title, this.content);
    }
}

class ProductPage extends Page {
    private product: Product;

    constructor(renderer: Renderer, product: Product) {
        super(renderer);
        this.product = product;
    }

    render(): string {
        return this.renderer.renderProductPage(this.product);
    }
}

// example
const product = new Product('123', 'iPhone', 'Latest iPhone model', 'iphone.png');

// html
const htmlRenderer = new HTMLRenderer();
const simplePageHTML = new SimplePage(htmlRenderer, 'About Us', 'Welcome to our company!');
const productPageHTML = new ProductPage(htmlRenderer, product);
console.log('HTML Simple Page:', simplePageHTML.render());
console.log('HTML Product Page:', productPageHTML.render());

// json
const jsonRenderer = new JsonRenderer();
const simplePageJSON = new SimplePage(jsonRenderer, 'About Us', 'Welcome to our company!');
const productPageJSON = new ProductPage(jsonRenderer, product);
console.log('JSON Simple Page:', simplePageJSON.render());
console.log('JSON Product Page:', productPageJSON.render());

//xml
const xmlRenderer = new XmlRenderer();
const simplePageXML = new SimplePage(xmlRenderer, 'About Us', 'Welcome to our company!');
const productPageXML = new ProductPage(xmlRenderer, product);
console.log('XML Simple Page:', simplePageXML.render());
console.log('XML Product Page:', productPageXML.render());
