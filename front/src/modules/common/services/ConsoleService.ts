import Dictionary from "../models/Dictionary"

export default abstract class ConsoleService {
    static readonly initConsole = window.console.log
    static console = window.console.log
    static callbacks: Dictionary<((message: any) => void)> = {}

    static enableConsole() {
        ConsoleService.console = ConsoleService.initConsole
    }

    static disableConsole() {
        ConsoleService.console = () => {}
    }

    static addCallback(name: string, callback: (message: any) => void) {
        this.callbacks[name] = callback
        const callbacks = this.callbacks
        console.log = function (message: any) {
            Object.values(callbacks).forEach(e => e(message))
            ConsoleService.console.apply(console, arguments as any);
        }
    }

    static removeCallback(name: string) {
        delete ConsoleService.callbacks[name]
    }

    static resetConsole() {
        console.log = this.initConsole
    }
}