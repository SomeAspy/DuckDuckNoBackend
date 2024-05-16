// The google CSE response is significantly more complex than this but we will only type the stuff we actually want to use

export interface ApiResponse {
    error?: { code: number; message: string };
    items: Result[];
}

export interface Result {
    kind: string;
    title: string;
    htmlTitle: string;
    link: string;
    displayLink: string;
    snippet: string;
    htmlSnippet: string;
    formattedUrl: string;
    htmlFormattedUrl: string;
}

export interface DDNResult {
    code: number;
    results: Result[];
}
