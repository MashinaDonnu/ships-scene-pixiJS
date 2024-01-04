export type ConfigMode = 'development' | 'production'

export interface ConfigPaths {
    entry: string;
    build: string;
    html: string;
    src: string;
}

export interface ConfigEnv {
    port: number;
    mode: ConfigMode;
}

export interface ConfigOptions {
    mode: ConfigMode;
    paths: ConfigPaths;
    isDev: boolean;
    port: number;
}
