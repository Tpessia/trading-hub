import Dictionary from "../models/Dictionary";

export default abstract class ConsoleService {
    static callbacks: Dictionary<(message: any) => void> = {}

    static enableConsole() {
        // Console Print
        (console as any).print = (message: any) => {
            Object.values(this.callbacks).forEach(e => e(message))
        };

        // Load Script
        (window as any).loadScript = (path: string) => {
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = path
            document.head.appendChild(script)
        };
    }

    static disableConsole() {
        // Console Print
        delete (console as any).print

        // Load Script
        delete (window as any).loadScript
    }

    static addCallback(name: string, callback: (message: any) => void) {
        this.callbacks[name] = callback
    }

    static removeCallback(name: string) {
        delete this.callbacks[name]
    }
}