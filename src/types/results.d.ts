// The google CSE response is significantly more complex than this but we will only type the stuff we actually want to use

export type ApiResponse = {
    error?: { code: number; message: string };
    items: Result[];
};

export type Result = {
    kind: string;
    title: string;
    htmlTitle: string;
    link: string;
    displayLink: string;
    snippet: string;
    htmlSnippet: string;
    formattedUrl: string;
    htmlFormattedUrl: string;
};

export type DDNResult = {
    code: number;
    results: Result[];
};
