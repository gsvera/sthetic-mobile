export type loginData = {
    username: string;
    password: string;
}

export type selectOptionType = {
    key: number | string,
    value: string,
    checked?: boolean
}

export type fileTypes = 'image' | 'video' | null;