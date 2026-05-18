import viaBuilderScriptUrl from './via-builder.js?url';
import viaBuilderWasmUrl from './via-builder.wasm?url';

type JsonObject = Record<string, unknown>;

interface ViaBuilderApi {
    setPreferences(preferences: string): void;
    setSettings(settings: string): void;
    addCourse(course: string): void;
    removeCourse(courseCode: string, type: string): void;
    buildTimetable(): string | null | undefined;
    delete(): void;
}

interface ViaBuilderModule {
    ViaBuilderAPI: new () => ViaBuilderApi;
}

declare global {
    interface Window {
        createViaBuilderModule(options: { locateFile: (path: string) => string }): Promise<ViaBuilderModule>;
    }
}

let modulePromise: Promise<ViaBuilderModule> | null = null;
let managerPromise: Promise<ViaBuilderManager> | null = null;

async function ensureViaBuilderScriptLoaded(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>('script[data-via-builder="true"]');

        if (existing) {
            existing.addEventListener('load', () => resolve(), { once: true });
            existing.addEventListener('error', () => reject(new Error('Failed to load via-builder.js')), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = viaBuilderScriptUrl;
        script.async = true;
        script.dataset.viaBuilder = 'true';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load via-builder.js'));
        document.head.appendChild(script);
    });
}

async function getModule(): Promise<ViaBuilderModule> {
    if (!modulePromise) {
        modulePromise = ensureViaBuilderScriptLoaded().then(() => {
            return window.createViaBuilderModule({
                locateFile(path: string): string {
                    if (path.endsWith('.wasm')) {
                        return viaBuilderWasmUrl;
                    }

                    return path;
                }
            });
        });
    }

    return modulePromise;
}

/**
 * Check out https://github.com/Kelexer1/via-builder for documentation on how to use these methods, and JSON formatting
 */
class ViaBuilderManager {
    private readonly Module: ViaBuilderModule;
    private api: ViaBuilderApi;
    private preferences?: JsonObject;
    private settings?: JsonObject;

    constructor(Module: ViaBuilderModule) {
        this.Module = Module;
        this.api = new Module.ViaBuilderAPI();
    }

    setPreferences(preferences: JsonObject): void {
        this.preferences = preferences;
        this.api.setPreferences(JSON.stringify(preferences));
    }

    setSettings(settings: JsonObject): void {
        this.settings = settings;
        this.api.setSettings(JSON.stringify(settings))
    }

    addCourse(course: JsonObject): void {
        this.api.addCourse(JSON.stringify(course));
    }

    removeCourse(courseCode: string, type: string): void {
        this.api.removeCourse(courseCode, type);
    }

    build(): unknown {
        const raw = this.api.buildTimetable();
        return raw ? JSON.parse(raw) : {};
    }

    reset(): void {
        this.api.delete();
        this.api = new this.Module.ViaBuilderAPI();

        if (this.preferences) {
            this.api.setPreferences(JSON.stringify(this.preferences));
        }

        if (this.settings) {
            this.api.setSettings(JSON.stringify(this.settings));
        }
    }

    dispose(): void {
        this.api.delete();
    }
}

export async function getViaBuilderManager(): Promise<ViaBuilderManager> {
    if (!managerPromise) {
        managerPromise = getModule().then((Module: ViaBuilderModule) => new ViaBuilderManager(Module));
    }

    return managerPromise;
}