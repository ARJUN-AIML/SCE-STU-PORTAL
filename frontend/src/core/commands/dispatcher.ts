type CommandCallback = (args?: any) => void;

class CommandDispatcher {
  private commands = new Map<string, CommandCallback>();

  register(commandId: string, callback: CommandCallback) {
    if (this.commands.has(commandId)) {
      console.warn(`Command ${commandId} is already registered. Overwriting.`);
    }
    this.commands.set(commandId, callback);
  }

  unregister(commandId: string) {
    this.commands.delete(commandId);
  }

  dispatch(commandId: string, args?: any) {
    const callback = this.commands.get(commandId);
    if (!callback) {
      console.error(`Command ${commandId} not found.`);
      return false;
    }
    
    try {
      callback(args);
      return true;
    } catch (error) {
      console.error(`Error executing command ${commandId}:`, error);
      return false;
    }
  }

  getRegisteredCommands() {
    return Array.from(this.commands.keys());
  }
}

export const commandDispatcher = new CommandDispatcher();
