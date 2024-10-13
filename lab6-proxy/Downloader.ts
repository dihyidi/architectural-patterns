interface Downloader {
    download(url: string): string;
}

class SimpleDownloader implements Downloader {
    download(url: string): string {
        console.log(`Downloading data from ${url}`);
        return `Data from ${url}`;
    }
}

class ProxyDownloader implements Downloader {
    private downloader: SimpleDownloader;
    private cache: Map<string, string>;

    constructor(downloader: SimpleDownloader) {
        this.downloader = downloader;
        this.cache = new Map();
    }

    download(url: string): string {
        if (this.cache.has(url)) {
            console.log(`Getting cached data from ${url}`);
            return this.cache.get(url)!;
        }

        console.log(`Downloading data via proxy from ${url}`);
        const data = this.downloader.download(url);
        this.cache.set(url, data);
        return data;
    }
}

const simpleDownloader = new SimpleDownloader();
const proxyDownloader = new ProxyDownloader(simpleDownloader);

// first download
console.log(proxyDownloader.download("http://example.com/file1"));

// cache
console.log(proxyDownloader.download("http://example.com/file1"));

// another download
console.log(proxyDownloader.download("http://example.com/file2"));
